namespace Msz2001.VectorDark {
    /**
     * Klasa odpowiedzialna za przełącznik trybów
     * Ten jest umieszczony koło lewego dolnego rogu okna przeglądarki
     */
    export class FloatingSwitcher implements ThemeSwitcher {
        protected Controller: Controller;
        protected SwitcherWrapper: HTMLElement;
        protected ToDarkModeLink: HTMLAnchorElement;
        protected ToLightModeLink: HTMLAnchorElement;

        /**
         * Tworzy przełącznik trybów
         * @param controller Odwołanie do kontrolera
         */
        public constructor(controller: Controller) {
            this.Controller = controller;
            this.SwitcherWrapper = document.createElement('div');
            this.SwitcherWrapper.style.position = 'fixed';
            this.SwitcherWrapper.style.bottom = '0';
            this.SwitcherWrapper.style.left = '20px';
            this.SwitcherWrapper.style.padding = '8px';
            this.SwitcherWrapper.style.background = '#111';

            // Tworzy link do przełączenia na tryb ciemny
            this.ToDarkModeLink = document.createElement('a');
            this.ToDarkModeLink.href = 'javascript:void(0)';
            this.ToDarkModeLink.innerText = '🌙';
            this.ToDarkModeLink.style.display = 'none';
            this.ToDarkModeLink.addEventListener('click', this.OnToDarkClick.bind(this));
            this.SwitcherWrapper.appendChild(this.ToDarkModeLink);

            // Tworzy link do przełączenia na tryb jasny
            this.ToLightModeLink = document.createElement('a');
            this.ToLightModeLink.href = 'javascript:void(0)';
            this.ToLightModeLink.innerText = '☀';
            this.ToLightModeLink.style.display = 'none';
            this.ToLightModeLink.addEventListener('click', this.OnToLightClick.bind(this));
            this.SwitcherWrapper.appendChild(this.ToLightModeLink);

            // Rejestruje nasłuchiwanie zmian trybu i umieszcza przełącznik w dokumencie
            this.Controller.SetNotificationOnModeChange(this.AdjustToCurrentMode.bind(this));
            this.AttachToDocument();
        }

        /** Dopasowuje treść przełącznika do aktualnego trybu */
        public AdjustToCurrentMode() {
            let current_mode = this.Controller.GetCurrentMode();

            switch(current_mode) {
                case Mode.Light:
                    this.ToLightModeLink.style.display = 'none';
                    this.ToDarkModeLink.style.display = '';
                    break;
                case Mode.Dark:
                    this.ToLightModeLink.style.display = '';
                    this.ToDarkModeLink.style.display = 'none';
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

        /** Dołącza przełącznik do dokumentu */
        protected AttachToDocument() {
            document.body.appendChild(this.SwitcherWrapper);
        }
    }
}