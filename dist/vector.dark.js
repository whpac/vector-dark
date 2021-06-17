"use strict";
var Msz2001;
(function (Msz2001) {
    var VectorDark;
    (function (VectorDark) {
        var Controller = /** @class */ (function () {
            function Controller() {
                this.ModeChangeListeners = [];
                // Przygotuj interfejs do magazynu
                this.Storage = new VectorDark.DataStorage();
                // Przygotuj warstwę interakcji z użytkownikiem
                this.ThemeAdapter = new VectorDark.ThemeAdapter();
                // Przełączników może być więcej niż jeden
                this.Switchers = [
                    new VectorDark.InMenuSwitcher(this),
                    new VectorDark.FloatingSwitcher(this, new VectorDark.SettingsDialog(this))
                ];
                this.CurrentMode = this.Storage.GetMode();
                var current_settings = this.Storage.GetSettings();
                // Zastosuj bieżący tryb do przełączników i całej strony
                for (var _i = 0, _a = this.Switchers; _i < _a.length; _i++) {
                    var switcher = _a[_i];
                    switcher.AdjustToCurrentMode();
                    switcher.SetAutoHide(current_settings.AutoHideSwitcher);
                }
                this.ThemeAdapter.ApplyMode(this.CurrentMode);
            }
            /** Zwraca aktualnie ustawiony motyw */
            Controller.prototype.GetCurrentMode = function () {
                return this.CurrentMode;
            };
            /** Zmienia tryb */
            Controller.prototype.RequestMode = function (mode) {
                // Nie rób nic, jeśli żądany tryb jest już ustawiony
                if (mode == this.CurrentMode)
                    return;
                this.CurrentMode = mode;
                this.ThemeAdapter.ApplyMode(mode);
                this.InvokeModeChangeListeners();
                this.Storage.SaveMode(mode);
            };
            /**
             * Rejestruje funkcję do wywołania po zmianie trybu
             * @param func Funkcja do wywołania przy zmianie trybu
             */
            Controller.prototype.SetNotificationOnModeChange = function (func) {
                this.ModeChangeListeners.push(func);
            };
            /** Wywołuje procedury obsługi zmiany trybu */
            Controller.prototype.InvokeModeChangeListeners = function () {
                for (var _i = 0, _a = this.ModeChangeListeners; _i < _a.length; _i++) {
                    var listener = _a[_i];
                    listener();
                }
            };
            /** Zwraca zarządcę pamięci */
            Controller.prototype.GetDataStorage = function () {
                return this.Storage;
            };
            /**
             * Zmienia ustawienia i aktualizuje odpowiednie obiekty
             * @param new_settings Nowe ustawienia
             */
            Controller.prototype.ChangeSettings = function (new_settings) {
                this.Storage.SaveSettings(new_settings);
                // Zastosować autoukrywanie
                for (var _i = 0, _a = this.Switchers; _i < _a.length; _i++) {
                    var switcher = _a[_i];
                    switcher.SetAutoHide(new_settings.AutoHideSwitcher);
                }
            };
            return Controller;
        }());
        VectorDark.Controller = Controller;
    })(VectorDark = Msz2001.VectorDark || (Msz2001.VectorDark = {}));
})(Msz2001 || (Msz2001 = {}));
var Msz2001;
(function (Msz2001) {
    var VectorDark;
    (function (VectorDark) {
        /**
         * Klasa odpowiedzialna za zapisywanie i odczytywanie ustawień
         */
        var DataStorage = /** @class */ (function () {
            function DataStorage() {
                this.CurrentSettings = this.ReadSettings();
                this.CorsImage = document.createElement('img');
                this.CorsImage.style.width = this.CorsImage.style.height = '0px';
                this.CorsImage.style.display = 'none';
                document.body.appendChild(this.CorsImage);
            }
            /** Zwraca aktualnie ustawiony tryb */
            DataStorage.prototype.GetMode = function () {
                var cookie_index = document.cookie.indexOf('disable_vectorDark_Msz2001=1');
                if (cookie_index < 0) {
                    return VectorDark.Mode.Dark;
                }
                else {
                    return VectorDark.Mode.Light;
                }
            };
            /**
             * Zapisuje tryb
             * @param mode Tryb do zapisania
             */
            DataStorage.prototype.SaveMode = function (mode) {
                // Zapisuje ciastko widoczne tylko po stronie klienckiej (nie trafia do ToolForge)
                var cookie_value = (mode == VectorDark.Mode.Light) ? 1 : 0;
                document.cookie = 'disable_vectorDark_Msz2001=' + cookie_value + '; path=/';
                this.PingForCookie(mode);
            };
            /**
             * Pinguje serwer ToolForge w celu ustawienia ciasteczka
             * @param mode Tryb do ustawienia
             */
            DataStorage.prototype.PingForCookie = function (mode) {
                if (!window.Msz2001_vectorDark_pingujCookie)
                    return;
                var is_on = (mode == VectorDark.Mode.Light) ? 'false' : 'true';
                /* Wysyła żądanie do serwera z plikami CSS, by ustawił cookie dla siebie */
                this.CorsImage.src = 'https://vector-dark.toolforge.org/setcookie.php?is_on=' + is_on;
            };
            /**
             * Zapisuje ustawienia użytkownika (poza wybranym trybem)
             * @param settings Ustawienia do zapisania
             */
            DataStorage.prototype.SaveSettings = function (settings) {
                var descriptors = this.PrepareSettingsDescriptors(settings);
                this.CurrentSettings = settings;
                var params = {
                    action: 'options',
                    change: "userjs-vectorDark-settings=" + descriptors.Settings + "|userjs-vectorDark-gadgets=" + descriptors.Gadgets,
                    format: 'json'
                };
                var api = new mw.Api();
                api.postWithToken('csrf', params).done(function (data) {
                    console.log(data);
                });
            };
            /**
             * Zwraca bieżące ustawienia
             * @returns Obiekt, zawierający bieżące ustawienia
             */
            DataStorage.prototype.GetSettings = function () {
                return this.CurrentSettings;
            };
            /**
             * Odczytuje ustawienia (w stanie z momentu załadowania strony)
             * @returns Obiekt, zawierający ustawienia
             */
            DataStorage.prototype.ReadSettings = function () {
                var settings_desc_raw = mw.user.options.get('userjs-vectorDark-settings');
                var gadgets_desc_raw = mw.user.options.get('userjs-vectorDark-gadgets');
                var settings_desc = Number(settings_desc_raw !== null && settings_desc_raw !== void 0 ? settings_desc_raw : undefined);
                if (isNaN(settings_desc))
                    settings_desc = 0;
                var gadgets_desc = Number(gadgets_desc_raw !== null && gadgets_desc_raw !== void 0 ? gadgets_desc_raw : undefined);
                if (isNaN(gadgets_desc))
                    gadgets_desc = VectorDark.GadgetValues.Popups + VectorDark.GadgetValues.Sandbox;
                var settings = {
                    AutoHideSwitcher: !!(settings_desc & VectorDark.SettingValues.AutoHideSwitcher),
                    PingServer: !!(settings_desc & VectorDark.SettingValues.PingServer),
                    Gadgets: {
                        Popups: !!(gadgets_desc & VectorDark.GadgetValues.Popups),
                        UserColors: !!(gadgets_desc & VectorDark.GadgetValues.UserColors),
                        TalkColors: !!(gadgets_desc & VectorDark.GadgetValues.TalkColors),
                        Sandbox: !!(gadgets_desc & VectorDark.GadgetValues.Sandbox)
                    }
                };
                return settings;
            };
            /**
             * Tłumaczy ustawienia na parę deskryptorów, używanych w żądaniach
             * @param settings Obiekt, przechowujący ustawienia
             * @returns Parę deskryptorów ustawień
             */
            DataStorage.prototype.PrepareSettingsDescriptors = function (settings) {
                var settings_desc = 0;
                var gadgets_desc = 0;
                for (var setting in settings) {
                    // Gadżety są osobno zapisywane
                    if (setting == 'Gadgets')
                        continue;
                    if (!(setting in VectorDark.SettingValues)) {
                        console.error("Ustawienie " + setting + " nie ma przypisanej warto\u015Bci");
                        continue;
                    }
                    settings_desc |= (+settings[setting] * VectorDark.SettingValues[setting]);
                }
                for (var gadget in settings.Gadgets) {
                    if (!(gadget in VectorDark.GadgetValues)) {
                        console.error("Gad\u017Cet " + gadget + " nie ma przypisanej warto\u015Bci");
                        continue;
                    }
                    gadgets_desc |= (+settings.Gadgets[gadget] * VectorDark.GadgetValues[gadget]);
                }
                return {
                    Settings: settings_desc,
                    Gadgets: gadgets_desc
                };
            };
            return DataStorage;
        }());
        VectorDark.DataStorage = DataStorage;
    })(VectorDark = Msz2001.VectorDark || (Msz2001.VectorDark = {}));
})(Msz2001 || (Msz2001 = {}));
var Msz2001;
(function (Msz2001) {
    var VectorDark;
    (function (VectorDark) {
        /**
         * Klasa odpowiedzialna za przełącznik trybów
         * Ten jest umieszczony koło lewego dolnego rogu okna przeglądarki
         */
        var FloatingSwitcher = /** @class */ (function () {
            /**
             * Tworzy przełącznik trybów
             * @param controller Odwołanie do kontrolera
             * @param settings_dialog Okno ustawień
             */
            function FloatingSwitcher(controller, settings_dialog) {
                this.Controller = controller;
                this.SettingsDialog = settings_dialog;
                this.SwitcherWrapper = document.createElement('div');
                this.SwitcherWrapper.classList.add('vector-dark-floating-switcher');
                // Tworzy przycisk do przełączenia na tryb ciemny
                this.ToDarkModeButton = document.createElement('button');
                this.ToDarkModeButton.type = 'button';
                this.ToDarkModeButton.innerText = '🌙';
                this.ToDarkModeButton.title = 'Przełącz na tryb ciemny';
                this.ToDarkModeButton.style.display = 'none';
                this.ToDarkModeButton.addEventListener('click', this.OnToDarkClick.bind(this));
                this.SwitcherWrapper.appendChild(this.ToDarkModeButton);
                // Tworzy przycisk do przełączenia na tryb jasny
                this.ToLightModeButton = document.createElement('button');
                this.ToLightModeButton.type = 'button';
                this.ToLightModeButton.innerText = '🌞';
                this.ToLightModeButton.title = 'Przełącz na tryb jasny';
                this.ToLightModeButton.style.display = 'none';
                this.ToLightModeButton.addEventListener('click', this.OnToLightClick.bind(this));
                this.SwitcherWrapper.appendChild(this.ToLightModeButton);
                // Tworzy przycisk ustawień
                this.SettingsButton = document.createElement('button');
                this.SettingsButton.classList.add('settings-button');
                this.SettingsButton.type = 'button';
                this.SettingsButton.innerText = '🔧';
                this.SettingsButton.title = 'Ustawienia trybu ciemnego';
                this.SettingsButton.addEventListener('click', this.OnSettingsClick.bind(this));
                this.SwitcherWrapper.appendChild(this.SettingsButton);
                // Rejestruje nasłuchiwanie zmian trybu i umieszcza przełącznik w dokumencie
                this.Controller.SetNotificationOnModeChange(this.AdjustToCurrentMode.bind(this));
                this.AttachToDocument();
            }
            FloatingSwitcher.prototype.AdjustToCurrentMode = function () {
                var current_mode = this.Controller.GetCurrentMode();
                switch (current_mode) {
                    case VectorDark.Mode.Light:
                        this.ToLightModeButton.style.display = 'none';
                        this.ToDarkModeButton.style.display = '';
                        break;
                    case VectorDark.Mode.Dark:
                        this.ToLightModeButton.style.display = '';
                        this.ToDarkModeButton.style.display = 'none';
                        break;
                }
            };
            /** Obsługuje kliknięcie na link "tryb jasny" */
            FloatingSwitcher.prototype.OnToLightClick = function () {
                this.Controller.RequestMode(VectorDark.Mode.Light);
            };
            /** Obsługuje kliknięcie na link "tryb ciemny" */
            FloatingSwitcher.prototype.OnToDarkClick = function () {
                this.Controller.RequestMode(VectorDark.Mode.Dark);
            };
            /** Obsługuje kliknięcie na przycisk ustawień */
            FloatingSwitcher.prototype.OnSettingsClick = function () {
                this.SettingsDialog.Open();
            };
            /** Dołącza przełącznik do dokumentu */
            FloatingSwitcher.prototype.AttachToDocument = function () {
                document.body.appendChild(this.SwitcherWrapper);
            };
            FloatingSwitcher.prototype.SetAutoHide = function (autohide) {
                if (autohide) {
                    this.SwitcherWrapper.classList.add('auto-hide');
                }
                else {
                    this.SwitcherWrapper.classList.remove('auto-hide');
                }
            };
            return FloatingSwitcher;
        }());
        VectorDark.FloatingSwitcher = FloatingSwitcher;
    })(VectorDark = Msz2001.VectorDark || (Msz2001.VectorDark = {}));
})(Msz2001 || (Msz2001 = {}));
var Msz2001;
(function (Msz2001) {
    var VectorDark;
    (function (VectorDark) {
        /**
         * Klasa odpowiedzialna za przełącznik trybów
         */
        var InMenuSwitcher = /** @class */ (function () {
            /**
             * Tworzy przełącznik trybów
             * @param controller Odwołanie do kontrolera
             */
            function InMenuSwitcher(controller) {
                this.Controller = controller;
                this.SwitcherWrapper = document.createElement('li');
                // Tworzy link do przełączenia na tryb ciemny
                this.ToDarkModeLink = document.createElement('a');
                this.ToDarkModeLink.href = 'javascript:void(0)';
                this.ToDarkModeLink.innerText = 'Tryb ciemny';
                this.ToDarkModeLink.style.display = 'none';
                this.ToDarkModeLink.addEventListener('click', this.OnToDarkClick.bind(this));
                this.SwitcherWrapper.appendChild(this.ToDarkModeLink);
                // Tworzy link do przełączenia na tryb jasny
                this.ToLightModeLink = document.createElement('a');
                this.ToLightModeLink.href = 'javascript:void(0)';
                this.ToLightModeLink.innerText = 'Tryb jasny';
                this.ToLightModeLink.style.display = 'none';
                this.ToLightModeLink.addEventListener('click', this.OnToLightClick.bind(this));
                this.SwitcherWrapper.appendChild(this.ToLightModeLink);
                // Rejestruje nasłuchiwanie zmian trybu i umieszcza przełącznik w dokumencie
                this.Controller.SetNotificationOnModeChange(this.AdjustToCurrentMode.bind(this));
                this.AttachToDocument();
            }
            InMenuSwitcher.prototype.AdjustToCurrentMode = function () {
                var current_mode = this.Controller.GetCurrentMode();
                switch (current_mode) {
                    case VectorDark.Mode.Light:
                        this.ToLightModeLink.style.display = 'none';
                        this.ToDarkModeLink.style.display = '';
                        break;
                    case VectorDark.Mode.Dark:
                        this.ToLightModeLink.style.display = '';
                        this.ToDarkModeLink.style.display = 'none';
                        break;
                }
            };
            /** Obsługuje kliknięcie na link "tryb jasny" */
            InMenuSwitcher.prototype.OnToLightClick = function () {
                this.Controller.RequestMode(VectorDark.Mode.Light);
            };
            /** Obsługuje kliknięcie na link "tryb ciemny" */
            InMenuSwitcher.prototype.OnToDarkClick = function () {
                this.Controller.RequestMode(VectorDark.Mode.Dark);
            };
            /** Dołącza przełącznik do dokumentu */
            InMenuSwitcher.prototype.AttachToDocument = function () {
                var _this = this;
                var _a;
                // Spróbuj dołączyć link w menu po lewej, pod pozycją FAQ (desktop)
                var link_faq = document.getElementById("n-FAQ");
                if (link_faq !== null) {
                    (_a = link_faq.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(this.SwitcherWrapper, link_faq.nextSibling);
                    return;
                }
                // Jeśli nie ma linku FAQ, jest to prawdopodobnie wersja mobilna.
                // Poczekaj na zainicjalizowanie menu, a następnie dodaj link.
                setTimeout(function () {
                    var _a;
                    var elAboutWikipediaLink = document.querySelector("#mw-mf-page-left ul.hlist li:first-child");
                    if (elAboutWikipediaLink !== null) {
                        (_a = elAboutWikipediaLink.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(_this.SwitcherWrapper, elAboutWikipediaLink);
                        return;
                    }
                    // Link "O Wikipedii" nie istnieje, więc być może wystąpił jakiś problem.
                    // Umieść przełącznik po prostu w wysuwanym menu
                    var elMobileLeftNav = document.getElementById("mw-mf-page-left");
                    if (elMobileLeftNav !== null) {
                        elMobileLeftNav.appendChild(_this.SwitcherWrapper);
                        return;
                    }
                    // Jeśli nadal się nie udało, to może użytkownik jest na innej wiki na desktopie.
                    // Wrzuć przełącznik na koniec lewego menu.
                    var elLeftMenu = document.getElementById("mw-panel");
                    elLeftMenu === null || elLeftMenu === void 0 ? void 0 : elLeftMenu.appendChild(_this.SwitcherWrapper);
                }, 1000);
            };
            InMenuSwitcher.prototype.SetAutoHide = function (autohide) {
                // Przełącznik nie obsługuje autoukrywania, więc nie rób nic
            };
            return InMenuSwitcher;
        }());
        VectorDark.InMenuSwitcher = InMenuSwitcher;
    })(VectorDark = Msz2001.VectorDark || (Msz2001.VectorDark = {}));
})(Msz2001 || (Msz2001 = {}));
var Msz2001;
(function (Msz2001) {
    var VectorDark;
    (function (VectorDark) {
        /** Opisuje dostępne tryby */
        var Mode;
        (function (Mode) {
            Mode[Mode["Light"] = 0] = "Light";
            Mode[Mode["Dark"] = 1] = "Dark";
        })(Mode = VectorDark.Mode || (VectorDark.Mode = {}));
    })(VectorDark = Msz2001.VectorDark || (Msz2001.VectorDark = {}));
})(Msz2001 || (Msz2001 = {}));
var Msz2001;
(function (Msz2001) {
    var VectorDark;
    (function (VectorDark) {
        /**
         * Przechowuje wartości odpowiadające ustawieniom
         */
        var SettingValues = /** @class */ (function () {
            function SettingValues() {
            }
            SettingValues.AutoHideSwitcher = 1;
            SettingValues.PingServer = 2;
            return SettingValues;
        }());
        VectorDark.SettingValues = SettingValues;
        /**
         * Przechowuje wartości odpowiadające gadżetom
         */
        var GadgetValues = /** @class */ (function () {
            function GadgetValues() {
            }
            GadgetValues.Popups = 1;
            GadgetValues.UserColors = 2;
            GadgetValues.TalkColors = 4;
            GadgetValues.Sandbox = 8;
            return GadgetValues;
        }());
        VectorDark.GadgetValues = GadgetValues;
    })(VectorDark = Msz2001.VectorDark || (Msz2001.VectorDark = {}));
})(Msz2001 || (Msz2001 = {}));
var Msz2001;
(function (Msz2001) {
    var VectorDark;
    (function (VectorDark) {
        var SettingsDialog = /** @class */ (function () {
            function SettingsDialog(controller) {
                this.Controller = controller;
                var dialog_root = document.createElement('div');
                dialog_root.id = 'vector-dark-settings-dialog';
                dialog_root.title = 'Ciemny Wektor – ustawienia';
                document.body.appendChild(dialog_root);
                this.Form = new VectorDark.SettingsForm();
                var nodes = this.Form.GetElements();
                for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                    var node = nodes_1[_i];
                    dialog_root.appendChild(node);
                }
                $(dialog_root).dialog({
                    autoOpen: false,
                    modal: true,
                    width: 600,
                    buttons: {
                        "Zastosuj": this.ApplyChanges.bind(this),
                        "Zamknij": this.Close.bind(this)
                    }
                });
            }
            /** Otwiera okienko */
            SettingsDialog.prototype.Open = function () {
                var storage = this.Controller.GetDataStorage();
                var settings = storage.GetSettings();
                this.Form.PopulateWithSettings(settings);
                $('#vector-dark-settings-dialog').dialog('open');
            };
            /** Zamyka okienko */
            SettingsDialog.prototype.Close = function () {
                $('#vector-dark-settings-dialog').dialog('close');
            };
            /** Stosuje zmiany */
            SettingsDialog.prototype.ApplyChanges = function () {
                var settings = this.Form.GetSettings();
                this.Controller.ChangeSettings(settings);
            };
            return SettingsDialog;
        }());
        VectorDark.SettingsDialog = SettingsDialog;
    })(VectorDark = Msz2001.VectorDark || (Msz2001.VectorDark = {}));
})(Msz2001 || (Msz2001 = {}));
var Msz2001;
(function (Msz2001) {
    var VectorDark;
    (function (VectorDark) {
        var SettingsForm = /** @class */ (function () {
            function SettingsForm() {
                var intro_par = document.createElement('p');
                intro_par.textContent = 'W tym miejscu możesz dostosować konfigurację ciemnej skórki. Poniższe ustawienia zostaną skojarzone z twoim kontem i synchronizowane między urządzeniami.';
                intro_par.style.marginBottom = '1.5em';
                this.AutohideCheckbox = document.createElement('input');
                this.AutohideCheckbox.type = 'checkbox';
                var autohide_lbl = document.createElement('label');
                autohide_lbl.appendChild(this.AutohideCheckbox);
                autohide_lbl.appendChild(document.createTextNode(' Automatycznie ukrywaj przełącznik w lewym dolnym rogu'));
                autohide_lbl.style.fontWeight = '700';
                var autohide_expl = document.createElement('p');
                autohide_expl.classList.add('vector-dark-settings-secondary');
                autohide_expl.textContent = 'Jeśli zaznaczysz tę opcję, menu narzędzia w lewym dolnym rogu domyślnie będzie częściowo schowane. Pokaże się w całości po najechaniu na nie myszką.';
                autohide_expl.style.marginBottom = '1.5em';
                this.PingToolforgeCheckbox = document.createElement('input');
                this.PingToolforgeCheckbox.type = 'checkbox';
                var toolforge_lbl = document.createElement('label');
                toolforge_lbl.appendChild(this.PingToolforgeCheckbox);
                toolforge_lbl.appendChild(document.createTextNode(' Informuj serwer pomocniczy o przełączeniu skórki'));
                toolforge_lbl.style.fontWeight = '700';
                var toolforge_expl = document.createElement('p');
                toolforge_expl.classList.add('vector-dark-settings-secondary');
                toolforge_expl.textContent = 'Arkusze stylów są przechowywane na innym serwerze Wikimedia Foundation. Jeśli zgodzisz się na powiadamianie go o zmianie trybu, nie doświadczysz błyśnięć tła po wybraniu jasnego motywu i przeładowaniu strony. Zaznaczając tę opcję zgadzasz się na ustawienie dodatkowych plików cookies. ';
                toolforge_expl.style.marginBottom = '1.5em';
                var toolforge_more_link = document.createElement('a');
                toolforge_more_link.textContent = 'Więcej informacji...';
                toolforge_more_link.href = '/wiki/Wikipedia:Narzędzia/Ciemny_Wektor';
                toolforge_more_link.target = '_blank';
                toolforge_expl.appendChild(toolforge_more_link);
                var gadgets_header = document.createElement('p');
                gadgets_header.textContent = 'Gadżety';
                gadgets_header.style.fontWeight = '700';
                var gadgets_subtitle = document.createElement('p');
                gadgets_subtitle.textContent = 'Dla niektórych gadżetów powstały dodatki, pozwalające na bezproblemową pracę w trybie ciemnym. Możesz je tutaj włączyć lub wyłączyć';
                gadgets_subtitle.classList.add('vector-dark-settings-secondary');
                this.GadgetPopupsCheckbox = document.createElement('input');
                this.GadgetPopupsCheckbox.type = 'checkbox';
                var gadget_popups_lbl = document.createElement('label');
                gadget_popups_lbl.classList.add('vector-dark-settings-inset-label');
                gadget_popups_lbl.appendChild(this.GadgetPopupsCheckbox);
                gadget_popups_lbl.appendChild(document.createTextNode(' Popups'));
                this.GadgetUserColorsCheckbox = document.createElement('input');
                this.GadgetUserColorsCheckbox.type = 'checkbox';
                var gadget_usercolors_lbl = document.createElement('label');
                gadget_usercolors_lbl.classList.add('vector-dark-settings-inset-label');
                gadget_usercolors_lbl.appendChild(this.GadgetUserColorsCheckbox);
                gadget_usercolors_lbl.appendChild(document.createTextNode(' Kolorowanie nazw użytkowników'));
                this.GadgetTalkColorsCheckbox = document.createElement('input');
                this.GadgetTalkColorsCheckbox.type = 'checkbox';
                var gadget_talkcolors_lbl = document.createElement('label');
                gadget_talkcolors_lbl.classList.add('vector-dark-settings-inset-label');
                gadget_talkcolors_lbl.appendChild(this.GadgetTalkColorsCheckbox);
                gadget_talkcolors_lbl.appendChild(document.createTextNode(' Alternatywny sposób kolorowania dyskusji'));
                this.GadgetSandboxCheckbox = document.createElement('input');
                this.GadgetSandboxCheckbox.type = 'checkbox';
                var gadget_sandbox_lbl = document.createElement('label');
                gadget_sandbox_lbl.classList.add('vector-dark-settings-inset-label');
                gadget_sandbox_lbl.appendChild(this.GadgetSandboxCheckbox);
                gadget_sandbox_lbl.appendChild(document.createTextNode(' Przenieś do brudnopisu'));
                this.Nodes = [
                    intro_par, autohide_lbl, autohide_expl, toolforge_lbl, toolforge_expl,
                    gadgets_header, gadgets_subtitle,
                    gadget_popups_lbl, gadget_usercolors_lbl, gadget_talkcolors_lbl, gadget_sandbox_lbl
                ];
            }
            /** Zwraca tablicę obiektów w formularzu */
            SettingsForm.prototype.GetElements = function () {
                return this.Nodes;
            };
            /**
             * Wypełnia formularz ustawieniami
             * @param settings Ustawienia użytkownika
             */
            SettingsForm.prototype.PopulateWithSettings = function (settings) {
                this.AutohideCheckbox.checked = settings.AutoHideSwitcher;
                this.PingToolforgeCheckbox.checked = settings.PingServer;
                this.GadgetPopupsCheckbox.checked = settings.Gadgets.Popups;
                this.GadgetUserColorsCheckbox.checked = settings.Gadgets.UserColors;
                this.GadgetTalkColorsCheckbox.checked = settings.Gadgets.TalkColors;
                this.GadgetSandboxCheckbox.checked = settings.Gadgets.Sandbox;
            };
            /** Zwraca ustawienia określone przez użytkownika */
            SettingsForm.prototype.GetSettings = function () {
                return {
                    AutoHideSwitcher: this.AutohideCheckbox.checked,
                    PingServer: this.PingToolforgeCheckbox.checked,
                    Gadgets: {
                        Popups: this.GadgetPopupsCheckbox.checked,
                        UserColors: this.GadgetUserColorsCheckbox.checked,
                        TalkColors: this.GadgetTalkColorsCheckbox.checked,
                        Sandbox: this.GadgetSandboxCheckbox.checked
                    }
                };
            };
            return SettingsForm;
        }());
        VectorDark.SettingsForm = SettingsForm;
    })(VectorDark = Msz2001.VectorDark || (Msz2001.VectorDark = {}));
})(Msz2001 || (Msz2001 = {}));
var Msz2001;
(function (Msz2001) {
    var VectorDark;
    (function (VectorDark) {
        /**
         * Klasa pośrednicząca przy wpływaniu na wygląd strony
         */
        var ThemeAdapter = /** @class */ (function () {
            /** Tworzy egzemplarz klasy i odwołania do wykorzystywanych obiektów */
            function ThemeAdapter() {
                this.MetaTheme = document.querySelector("meta[name=theme-color]");
            }
            /**
             * Stosuje wybrany tryb do strony
             * @param mode Bieżący tryb
             */
            ThemeAdapter.prototype.ApplyMode = function (mode) {
                var _a, _b;
                var root_cl = document.documentElement.classList;
                switch (mode) {
                    case VectorDark.Mode.Light:
                        root_cl.add('disable-dark-skin');
                        root_cl.remove('enable-dark-skin');
                        (_a = this.MetaTheme) === null || _a === void 0 ? void 0 : _a.setAttribute("content", "#eaecf0");
                        break;
                    case VectorDark.Mode.Dark:
                        root_cl.remove('disable-dark-skin');
                        root_cl.add('enable-dark-skin');
                        (_b = this.MetaTheme) === null || _b === void 0 ? void 0 : _b.setAttribute("content", "#222");
                        break;
                }
            };
            return ThemeAdapter;
        }());
        VectorDark.ThemeAdapter = ThemeAdapter;
    })(VectorDark = Msz2001.VectorDark || (Msz2001.VectorDark = {}));
})(Msz2001 || (Msz2001 = {}));
/* Nie dołączaj skryptu ponownie */
if (window.Msz2001_vectorDark_loaded === undefined) {
    window.Msz2001_vectorDark_loaded = true;
    if (window.Msz2001_vectorDark_pingujCookie === undefined) {
        window.Msz2001_vectorDark_pingujCookie = false;
    }
    // Utwórz kontroler po załadowaniu się strony
    $(function () {
        new Msz2001.VectorDark.Controller();
    });
}
