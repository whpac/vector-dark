namespace Msz2001.VectorDark {
    /**
     * Klasa odpowiedzialna za przełącznik trybów
     * Ten jest umieszczony koło lewego dolnego rogu okna przeglądarki
     */
    export class FloatingSwitcher implements ThemeSwitcher {
        protected Controller: Controller;
        protected SwitcherWrapper: HTMLElement;
        protected ToDarkModeButton: HTMLButtonElement;
        protected ToLightModeButton: HTMLButtonElement;
        protected SettingsButton: HTMLButtonElement;
        protected SettingsDialog: SettingsDialog;

        /**
         * Tworzy przełącznik trybów
         * @param controller Odwołanie do kontrolera
         * @param settings_dialog Okno ustawień
         */
        public constructor(controller: Controller, settings_dialog: SettingsDialog) {
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

        public AdjustToCurrentMode() {
            let current_mode = this.Controller.GetCurrentMode();

            switch(current_mode) {
                case Mode.Light:
                    this.ToLightModeButton.style.display = 'none';
                    this.ToDarkModeButton.style.display = '';
                    break;
                case Mode.Dark:
                    this.ToLightModeButton.style.display = '';
                    this.ToDarkModeButton.style.display = 'none';
                    break;
            }
        }

        /** Obsługuje kliknięcie na link "tryb jasny" */
        protected OnToLightClick() {
            this.Controller.RequestMode(Mode.Light);
        }

        /** Obsługuje kliknięcie na link "tryb ciemny" */
        protected OnToDarkClick() {
            this.Controller.RequestMode(Mode.Dark);
        }

        /** Obsługuje kliknięcie na przycisk ustawień */
        protected OnSettingsClick() {
            this.SettingsDialog.Open();
        }

        /** Dołącza przełącznik do dokumentu */
        protected AttachToDocument() {
            document.body.appendChild(this.SwitcherWrapper);
        }

        public SetAutoHide(autohide: boolean) {
            if(autohide) {
                this.SwitcherWrapper.classList.add('auto-hide');
            } else {
                this.SwitcherWrapper.classList.remove('auto-hide');
            }
        }
    }
}