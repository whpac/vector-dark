namespace Msz2001.VectorDark {
    export class SettingsForm {
        protected AutohideCheckbox: HTMLInputElement;
        protected PingToolforgeCheckbox: HTMLInputElement;
        protected GadgetPopupsCheckbox: HTMLInputElement;
        protected GadgetUserColorsCheckbox: HTMLInputElement;
        protected GadgetTalkColorsCheckbox: HTMLInputElement;
        protected GadgetSandboxCheckbox: HTMLInputElement;
        protected Nodes: HTMLElement[];

        public constructor() {
            let intro_par = document.createElement('p');
            intro_par.textContent = 'W tym miejscu możesz dostosować konfigurację ciemnej skórki. Poniższe ustawienia zostaną skojarzone z twoim kontem i synchronizowane między urządzeniami.';
            intro_par.style.marginBottom = '1.5em';

            this.AutohideCheckbox = document.createElement('input');
            this.AutohideCheckbox.type = 'checkbox';

            let autohide_lbl = document.createElement('label');
            autohide_lbl.appendChild(this.AutohideCheckbox);
            autohide_lbl.appendChild(document.createTextNode(
                ' Automatycznie ukrywaj przełącznik w lewym dolnym rogu'
            ));
            autohide_lbl.style.fontWeight = '700';

            let autohide_expl = document.createElement('p');
            autohide_expl.classList.add('vector-dark-settings-secondary');
            autohide_expl.textContent = 'Jeśli zaznaczysz tę opcję, menu narzędzia w lewym dolnym rogu domyślnie będzie częściowo schowane. Pokaże się w całości po najechaniu na nie myszką.';
            autohide_expl.style.marginBottom = '1.5em';

            this.PingToolforgeCheckbox = document.createElement('input');
            this.PingToolforgeCheckbox.type = 'checkbox';

            let toolforge_lbl = document.createElement('label');
            toolforge_lbl.appendChild(this.PingToolforgeCheckbox);
            toolforge_lbl.appendChild(document.createTextNode(
                ' Informuj serwer pomocniczy o przełączeniu skórki'
            ));
            toolforge_lbl.style.fontWeight = '700';

            let toolforge_expl = document.createElement('p');
            toolforge_expl.classList.add('vector-dark-settings-secondary');
            toolforge_expl.textContent = 'Arkusze stylów są przechowywane na innym serwerze Wikimedia Foundation. Jeśli zgodzisz się na powiadamianie go o zmianie trybu, nie doświadczysz błyśnięć tła po wybraniu jasnego motywu i przeładowaniu strony. Zaznaczając tę opcję zgadzasz się na ustawienie dodatkowych plików cookies. ';
            toolforge_expl.style.marginBottom = '1.5em';

            let toolforge_more_link = document.createElement('a');
            toolforge_more_link.textContent = 'Więcej informacji...';
            toolforge_more_link.href = '/wiki/Wikipedia:Narzędzia/Ciemny_Wektor';
            toolforge_more_link.target = '_blank';
            toolforge_expl.appendChild(toolforge_more_link);

            let gadgets_header = document.createElement('p');
            gadgets_header.textContent = 'Gadżety';
            gadgets_header.style.fontWeight = '700';

            let gadgets_subtitle = document.createElement('p');
            gadgets_subtitle.textContent = 'Dla niektórych gadżetów powstały dodatki, pozwalające na bezproblemową pracę w trybie ciemnym. Możesz je tutaj włączyć lub wyłączyć';
            gadgets_subtitle.classList.add('vector-dark-settings-secondary');

            this.GadgetPopupsCheckbox = document.createElement('input');
            this.GadgetPopupsCheckbox.type = 'checkbox';

            let gadget_popups_lbl = document.createElement('label');
            gadget_popups_lbl.classList.add('vector-dark-settings-inset-label');
            gadget_popups_lbl.appendChild(this.GadgetPopupsCheckbox);
            gadget_popups_lbl.appendChild(document.createTextNode(' Popups'));

            this.GadgetUserColorsCheckbox = document.createElement('input');
            this.GadgetUserColorsCheckbox.type = 'checkbox';

            let gadget_usercolors_lbl = document.createElement('label');
            gadget_usercolors_lbl.classList.add('vector-dark-settings-inset-label');
            gadget_usercolors_lbl.appendChild(this.GadgetUserColorsCheckbox);
            gadget_usercolors_lbl.appendChild(document.createTextNode(' Kolorowanie nazw użytkowników'));

            this.GadgetTalkColorsCheckbox = document.createElement('input');
            this.GadgetTalkColorsCheckbox.type = 'checkbox';

            let gadget_talkcolors_lbl = document.createElement('label');
            gadget_talkcolors_lbl.classList.add('vector-dark-settings-inset-label');
            gadget_talkcolors_lbl.appendChild(this.GadgetTalkColorsCheckbox);
            gadget_talkcolors_lbl.appendChild(document.createTextNode(' Alternatywny sposób kolorowania dyskusji'));

            this.GadgetSandboxCheckbox = document.createElement('input');
            this.GadgetSandboxCheckbox.type = 'checkbox';

            let gadget_sandbox_lbl = document.createElement('label');
            gadget_sandbox_lbl.classList.add('vector-dark-settings-inset-label');
            gadget_sandbox_lbl.appendChild(this.GadgetSandboxCheckbox);
            gadget_sandbox_lbl.appendChild(document.createTextNode(' Przenieś do brudnopisu'));

            let gadgets_ping_notice = document.createElement('p');
            gadgets_ping_notice.classList.add('vector-dark-settings-inset-label', 'vector-dark-settings-secondary');
            gadgets_ping_notice.textContent = 'Włączenie lub wyłączenie ww. dodatków spowoduje przesłanie informacji do serwera pomocniczego, niezależnie od zaznaczenia opcji „Informuj serwer pomocniczy o przełączeniu skórki”. Zmiana zestawu dodatków na inny niż domyślny skutkuje ustawieniem odpowiedniego pliku cookie.';

            this.Nodes = [
                intro_par, autohide_lbl, autohide_expl, toolforge_lbl, toolforge_expl,
                gadgets_header, gadgets_subtitle,
                gadget_popups_lbl, gadget_usercolors_lbl, gadget_talkcolors_lbl, gadget_sandbox_lbl,
                gadgets_ping_notice
            ];
        }

        /** Zwraca tablicę obiektów w formularzu */
        public GetElements() {
            return this.Nodes;
        }

        /**
         * Wypełnia formularz ustawieniami
         * @param settings Ustawienia użytkownika
         */
        public PopulateWithSettings(settings: Settings) {
            this.AutohideCheckbox.checked = settings.AutoHideSwitcher;
            this.PingToolforgeCheckbox.checked = settings.PingServer;
            this.GadgetPopupsCheckbox.checked = settings.Gadgets.Popups;
            this.GadgetUserColorsCheckbox.checked = settings.Gadgets.UserColors;
            this.GadgetTalkColorsCheckbox.checked = settings.Gadgets.TalkColors;
            this.GadgetSandboxCheckbox.checked = settings.Gadgets.Sandbox;
        }

        /** Zwraca ustawienia określone przez użytkownika */
        public GetSettings(): Settings {
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
        }
    }
}