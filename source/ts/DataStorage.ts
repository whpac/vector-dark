namespace Msz2001.VectorDark {
    /**
     * Klasa odpowiedzialna za zapisywanie i odczytywanie ustawień
     */
    export class DataStorage {
        protected CorsImage: HTMLImageElement;

        public constructor() {
            this.CorsImage = document.createElement('img');
            this.CorsImage.style.width = this.CorsImage.style.height = '0px';
            this.CorsImage.style.display = 'none';
            document.body.appendChild(this.CorsImage);
        }

        /** Zwraca aktualnie ustawiony tryb */
        public GetMode(): Mode {
            let cookie_index = document.cookie.indexOf('disable_vectorDark_Msz2001=1');
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
            let cookie_value = (mode == Mode.Light) ? 1 : 0;
            document.cookie = 'disable_vectorDark_Msz2001=' + cookie_value + '; path=/';
            this.PingForCookie(mode);
        }

        /**
         * Pinguje serwer ToolForge w celu ustawienia ciasteczka
         * @param mode Tryb do ustawienia
         */
        protected PingForCookie(mode: Mode) {
            if(!window.Msz2001_vectorDark_pingujCookie) return;

            let is_on = (mode == Mode.Light) ? 'false' : 'true';

            /* Wysyła żądanie do serwera z plikami CSS, by ustawił cookie dla siebie */
            this.CorsImage.src = 'https://vector-dark.toolforge.org/setcookie.php?is_on=' + is_on;
        }

        /**
         * Zapisuje ustawienia użytkownika (poza wybranym trybem)
         * @param settings Ustawienia do zapisania
         */
        public SaveSettings(settings: Settings) {
            let descriptors = this.PrepareSettingsDescriptors(settings);

            let params = {
                action: 'options',
                change: `userjs-vectorDark-settings=${descriptors.Settings}|userjs-vectorDark-gadgets=${descriptors.Gadgets}`,
                format: 'json'
            };
            let api = new mw.Api();

            api.postWithToken('csrf', params).done(function (data) {
                console.log(data);
            });
        }

        /**
         * Odczytuje bieżące ustawienia
         * @returns Obiekt, zawierający bieżące ustawienia
         */
        public ReadSettings() {
            let settings_desc_raw = mw.user.options.get('userjs-vectorDark-settings');
            let gadgets_desc_raw = mw.user.options.get('userjs-vectorDark-gadgets');

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
    }
}