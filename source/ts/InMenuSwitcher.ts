namespace Msz2001.VectorDark {
    /**
     * Klasa odpowiedzialna za przełącznik trybów
     */
    export class InMenuSwitcher implements ThemeSwitcher {
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
            // Spróbuj dołączyć link w menu po lewej, pod pozycją FAQ (desktop)
            let link_faq = document.getElementById("n-FAQ");
            if(link_faq !== null) {
                link_faq.parentNode?.insertBefore(this.SwitcherWrapper, link_faq.nextSibling);
                return;
            }

            // Jeśli nie ma linku FAQ, jest to prawdopodobnie wersja mobilna.
            // Poczekaj na zainicjalizowanie menu, a następnie dodaj link.
            setTimeout(() => {
                let elAboutWikipediaLink = document.querySelector("#mw-mf-page-left ul.hlist li:first-child");
                if(elAboutWikipediaLink !== null) {
                    elAboutWikipediaLink.parentNode?.insertBefore(this.SwitcherWrapper, elAboutWikipediaLink);
                    return;
                }

                // Link "O Wikipedii" nie istnieje, więc być może wystąpił jakiś problem.
                // Umieść przełącznik po prostu w wysuwanym menu
                let elMobileLeftNav = document.getElementById("mw-mf-page-left");
                if(elMobileLeftNav !== null) {
                    elMobileLeftNav.appendChild(this.SwitcherWrapper);
                    return;
                }

                // Jeśli nadal się nie udało, to może użytkownik jest na innej wiki na desktopie.
                // Wrzuć przełącznik na koniec lewego menu.
                let elLeftMenu = document.getElementById("mw-panel");
                elLeftMenu?.appendChild(this.SwitcherWrapper);
            }, 1000);
        }

        public SetAutoHide(autohide: boolean) {
            // Przełącznik nie obsługuje autoukrywania, więc nie rób nic
        }
    }
}