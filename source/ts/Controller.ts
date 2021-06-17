namespace Msz2001.VectorDark {
    export class Controller {
        protected ModeChangeListeners: (() => void)[];
        protected CurrentMode: Mode;
        protected Storage: DataStorage;
        protected Switchers: ThemeSwitcher[];
        protected ThemeAdapter: ThemeAdapter;

        public constructor() {
            this.ModeChangeListeners = [];

            // Przygotuj interfejs do magazynu
            this.Storage = new DataStorage();

            // Przygotuj warstwę interakcji z użytkownikiem
            this.ThemeAdapter = new ThemeAdapter();

            // Przełączników może być więcej niż jeden
            this.Switchers = [
                new InMenuSwitcher(this),
                new FloatingSwitcher(this, new SettingsDialog(this))
            ];

            this.CurrentMode = this.Storage.GetMode();

            let current_settings = this.Storage.ReadSettings();

            // Zastosuj bieżący tryb do przełączników i całej strony
            for(let switcher of this.Switchers) {
                switcher.AdjustToCurrentMode();
                switcher.SetAutoHide(current_settings.AutoHideSwitcher);
            }
            this.ThemeAdapter.ApplyMode(this.CurrentMode);
        }

        /** Zwraca aktualnie ustawiony motyw */
        public GetCurrentMode(): Mode {
            return this.CurrentMode;
        }

        /** Zmienia tryb */
        public RequestMode(mode: Mode) {
            // Nie rób nic, jeśli żądany tryb jest już ustawiony
            if(mode == this.CurrentMode) return;

            this.CurrentMode = mode;
            this.ThemeAdapter.ApplyMode(mode);
            this.InvokeModeChangeListeners();
            this.Storage.SaveMode(mode);
        }

        /**
         * Rejestruje funkcję do wywołania po zmianie trybu
         * @param func Funkcja do wywołania przy zmianie trybu
         */
        public SetNotificationOnModeChange(func: () => void) {
            this.ModeChangeListeners.push(func);
        }

        /** Wywołuje procedury obsługi zmiany trybu */
        protected InvokeModeChangeListeners() {
            for(let listener of this.ModeChangeListeners) {
                listener();
            }
        }

        /** Zwraca zarządcę pamięci */
        public GetDataStorage() {
            return this.Storage;
        }

        /**
         * Zmienia ustawienia i aktualizuje odpowiednie obiekty
         * @param new_settings Nowe ustawienia
         */
        public ChangeSettings(new_settings: Settings) {
            this.Storage.SaveSettings(new_settings);

            // Zastosować autoukrywanie
            for(let switcher of this.Switchers) {
                switcher.SetAutoHide(new_settings.AutoHideSwitcher);
            }
        }
    }
}