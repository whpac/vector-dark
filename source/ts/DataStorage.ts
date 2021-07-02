namespace Msz2001.VectorDark {

    /** Nazwy używanych ciasteczek */
    enum Cookie {
        DisableTheme = 'disable_vectorDark_Msz2001',
        GadgetsUpdateTime = 'gadget-update_vectorDark_Msz2001'
    }

    /** Opisuje powody, dla których pingowany jest zewnętrzny serwer */
    enum PingReason {
        ThemeChange,
        GadgetsChange,
        Unknown
    }

    /**
     * Klasa odpowiedzialna za zapisywanie i odczytywanie ustawień
     */
    export class DataStorage {
        protected CorsImage: HTMLImageElement;
        protected CurrentSettings: Settings;
        protected LastGadgetsChange!: number;

        public constructor() {
            this.CurrentSettings = this.ReadSettings();

            this.CorsImage = document.createElement('img');
            this.CorsImage.style.width = this.CorsImage.style.height = '0px';
            this.CorsImage.style.display = 'none';
            document.body.appendChild(this.CorsImage);

            this.UpdateGadgetsCookie();
        }

        /** Zwraca aktualnie ustawiony tryb */
        public GetMode(): Mode {
            let cookie_index = document.cookie.indexOf(`${Cookie.DisableTheme}=1`);
            if(cookie_index < 0) {
                return Mode.Dark;
            } else {
                return Mode.Light;
            }
        }

        /**
         * Zapisuje tryb
         * @param mode Tryb do zapisania
         */
        public SaveMode(mode: Mode) {
            // Zapisuje ciastko widoczne tylko po stronie klienckiej (nie trafia do ToolForge)
            let cookie_value = (mode == Mode.Light) ? '1' : '0';
            this.SetCookie(Cookie.DisableTheme, cookie_value);

            this.PingCompanionServer('is_on', (mode == Mode.Light) ? 'false' : 'true', PingReason.ThemeChange);
        }

        /**
         * Zapisuje ustawienia użytkownika (poza wybranym trybem)
         * @param settings Ustawienia do zapisania
         */
        public SaveSettings(settings: Settings) {
            let descriptors = this.PrepareSettingsDescriptors(settings);
            let curr_desc = this.PrepareSettingsDescriptors(this.CurrentSettings);
            this.CurrentSettings = settings;

            let params = {
                action: 'options',
                change: `userjs-vectorDark-settings=${descriptors.Settings}|userjs-vectorDark-gadgets=${descriptors.Gadgets}`,
                format: 'json'
            };
            let api = new mw.Api();

            if(curr_desc.Gadgets != descriptors.Gadgets) {
                params.change += `|userjs-vectorDark-gadgetsChange=${Date.now()}`;
                this.LastGadgetsChange = Date.now();
            }

            api.postWithToken('csrf', params).done(function (data) {
                console.log(data);
            });

            this.UpdateGadgetsCookie();
        }

        /**
         * Zwraca bieżące ustawienia
         * @returns Obiekt, zawierający bieżące ustawienia
         */
        public GetSettings(): Readonly<Settings> {
            return this.CurrentSettings;
        }

        /**
         * Odczytuje ustawienia (w stanie z momentu załadowania strony)
         * @returns Obiekt, zawierający ustawienia
         */
        protected ReadSettings() {
            let settings_desc_raw = mw.user.options.get('userjs-vectorDark-settings');
            let gadgets_desc_raw = mw.user.options.get('userjs-vectorDark-gadgets');
            this.LastGadgetsChange = parseInt(mw.user.options.get('userjs-vectorDark-gadgetsChange') ?? '0');

            let settings_desc = Number(settings_desc_raw ?? undefined);
            if(isNaN(settings_desc)) settings_desc = 0;

            let gadgets_desc = Number(gadgets_desc_raw ?? undefined);
            if(isNaN(gadgets_desc)) gadgets_desc = GadgetValues.Popups + GadgetValues.Sandbox;

            let settings: Settings = {
                AutoHideSwitcher: !!(settings_desc & SettingValues.AutoHideSwitcher),
                PingServer: !!(settings_desc & SettingValues.PingServer),
                Gadgets: {
                    Popups: !!(gadgets_desc & GadgetValues.Popups),
                    UserColors: !!(gadgets_desc & GadgetValues.UserColors),
                    TalkColors: !!(gadgets_desc & GadgetValues.TalkColors),
                    Sandbox: !!(gadgets_desc & GadgetValues.Sandbox)
                }
            };
            return settings;
        }

        /**
         * Tłumaczy ustawienia na parę deskryptorów, używanych w żądaniach
         * @param settings Obiekt, przechowujący ustawienia
         * @returns Parę deskryptorów ustawień
         */
        protected PrepareSettingsDescriptors(settings: Settings) {
            let settings_desc = 0;
            let gadgets_desc = 0;

            for(let setting in settings) {
                // Gadżety są osobno zapisywane
                if(setting == 'Gadgets') continue;

                if(!(setting in SettingValues)) {
                    console.error(`Ustawienie ${setting} nie ma przypisanej wartości`);
                    continue;
                }

                settings_desc |= (+settings[setting as keyof Settings] * SettingValues[setting as keyof SettingValues]);
            }

            for(let gadget in settings.Gadgets) {
                if(!(gadget in GadgetValues)) {
                    console.error(`Gadżet ${gadget} nie ma przypisanej wartości`);
                    continue;
                }

                gadgets_desc |= (+settings.Gadgets[gadget as keyof Gadgets] * GadgetValues[gadget as keyof GadgetValues]);
            }

            return {
                Settings: settings_desc,
                Gadgets: gadgets_desc
            };
        }

        /**
         * Jeśli na innym urządzeniu zmieniono preferencje dot. gadżetów,
         * zaktualizuj odpowiednie ciasteczko
         */
        protected UpdateGadgetsCookie() {
            let local_gadget_update = this.GetCookie(Cookie.GadgetsUpdateTime);
            local_gadget_update ??= '0';
            let lgu_timestamp = parseInt(local_gadget_update);

            // Jeśli lokalne ustawienia zostały zmienione później niż globalne, nie rób nic
            if(lgu_timestamp >= this.LastGadgetsChange) return;
            if(!this.IsPingEnabled(PingReason.GadgetsChange)) return;

            // Zaktualizuj ciasteczko
            let gadgets_desc = this.PrepareSettingsDescriptors(this.CurrentSettings).Gadgets;
            this.PingCompanionServer('gadgets', gadgets_desc.toString(), PingReason.GadgetsChange);
            this.SetCookie(Cookie.GadgetsUpdateTime, Date.now());
            mw.notify("Zaktualizowano dodatki do ciemnej skórki. Zostaną zastosowane po odświeżeniu strony.", { autoHide: true });
        }

        /**
         * Zwraca wartość ciasteczka o podanej nazwie
         * @param name Nazwa ciasteczka do odnalezienia
         */
        protected GetCookie(name: Cookie) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if(parts.length === 2) return parts.pop()?.split(';').shift();
            else return undefined;
        }

        /**
         * Zapisuje ciasteczko
         * @param name Nazwa ciasteczka
         * @param value Wartość do zapisania
         */
        protected SetCookie(name: Cookie, value: string | number) {
            value = value.toString();
            document.cookie = `${name}=${value}; path=/`;
        }

        /**
         * Pinguje zewnętrzny serwer w celu zapisania ustawienia
         * @param option Nazwa ustawienia do zapisania
         * @param value Wartość ustawienia
         */
        protected PingCompanionServer(option: 'is_on' | 'gadgets', value: string, reason: PingReason = PingReason.Unknown) {
            if(!this.IsPingEnabled(reason)) return;

            /* Wysyła żądanie do serwera z plikami CSS, by ustawił cookie dla siebie */
            this.CorsImage.src = `https://vector-dark.toolforge.org/setcookie.php?${option}=${value}`;
        }

        /**
         * Sprawdza, czy pingowanie serwera jest dozwolone przez użytkownika
         * @param reason Powód pingowania
         */
        protected IsPingEnabled(reason: PingReason) {
            switch(reason) {
                case PingReason.GadgetsChange: return true;
                case PingReason.ThemeChange: return window.Msz2001_vectorDark_pingujCookie;
            }

            // Jeśli reason jest spoza zbioru dopuszczalnych wartości, zgłoś błąd
            // Natomiast kiedy przekazano PingReason.Unknown, tylko ostrzeżenie
            let log = console.error;
            if(reason == PingReason.Unknown) log = console.warn;

            log(`Natrafiono na nieznany powód pingowania serwera pomocniczego: ${reason}`);
            return false;
        }
    }
}