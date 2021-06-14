namespace Msz2001.VectorDark {
    export class SettingsDialog {
        protected Form: SettingsForm;

        public constructor() {
            let dialog_root = document.createElement('div');
            dialog_root.id = 'vector-dark-settings-dialog';
            dialog_root.title = 'Ciemny Wektor – ustawienia';
            document.body.appendChild(dialog_root);

            this.Form = new SettingsForm();
            let nodes = this.Form.GetElements();
            for(let node of nodes) {
                dialog_root.appendChild(node);
            }

            $('#vector-dark-settings-dialog').dialog({
                autoOpen: false,
                modal: true,
                width: 600,
                buttons: {
                    "Zapisz": () => { },
                    "Zamknij": () => { }
                }
            });
        }

        public Open() {
            $('#vector-dark-settings-dialog').dialog('open');
        }
    }
}