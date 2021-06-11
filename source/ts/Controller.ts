namespace Msz2001.VectorDark {
    export class Controller {
        protected ModeChangeListeners: (() => void)[];
        protected CurrentMode: Mode;
        protected Storage: DataStorage;
        protected ThemeSwitcher: Switcher;
        protected ThemeAdapter: ThemeAdapter;

        public constructor() {
            this.ModeChangeListeners = [];

            // Przygotuj interfejs do magazynu
            this.Storage = new DataStorage();

            // Przygotuj warstwę interakcji z użytkownikiem
            this.ThemeAdapter = new ThemeAdapter();
            this.ThemeSwitcher = new Switcher(this);

            this.CurrentMode = this.Storage.GetMode();

            // Wywołaj, kiedy odczytano początkowy tryb
            this.ThemeSwitcher.AdjustToCurrentMode();
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
    }
}