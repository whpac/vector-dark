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
                this.ThemeSwitcher = new VectorDark.Switcher(this);
                this.CurrentMode = this.Storage.GetMode();
                // Wywołaj, kiedy odczytano początkowy tryb
                this.ThemeSwitcher.AdjustToCurrentMode();
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
         * Klasa odpowiedzialna za zapisywanie i odczytywanie ustawionego trybu
         */
        var DataStorage = /** @class */ (function () {
            function DataStorage() {
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
            return DataStorage;
        }());
        VectorDark.DataStorage = DataStorage;
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
         * Klasa odpowiedzialna za przełącznik trybów
         */
        var Switcher = /** @class */ (function () {
            /**
             * Tworzy przełącznik trybów
             * @param controller Odwołanie do kontrolera
             */
            function Switcher(controller) {
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
            /** Dopasowuje treść przełącznika do aktualnego trybu */
            Switcher.prototype.AdjustToCurrentMode = function () {
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
            Switcher.prototype.OnToLightClick = function () {
                this.Controller.RequestMode(VectorDark.Mode.Light);
            };
            /** Obsługuje kliknięcie na link "tryb ciemny" */
            Switcher.prototype.OnToDarkClick = function () {
                this.Controller.RequestMode(VectorDark.Mode.Dark);
            };
            /** Dołącza przełącznik do dokumentu */
            Switcher.prototype.AttachToDocument = function () {
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
            return Switcher;
        }());
        VectorDark.Switcher = Switcher;
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
