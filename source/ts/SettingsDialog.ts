namespace Msz2001.VectorDark {
    export class SettingsDialog {
        protected Form: SettingsForm;
        protected Controller: Controller;

        public constructor(controller: Controller) {
            this.Controller = controller;

            let dialog_root = document.createElement('div');
            dialog_root.id = 'vector-dark-settings-dialog';
            dialog_root.title = 'Ciemny Wektor – ustawienia';
            document.body.appendChild(dialog_root);

            this.Form = new SettingsForm();
            let nodes = this.Form.GetElements();
            for(let node of nodes) {
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
        public Open() {
            let storage = this.Controller.GetDataStorage();
            let settings = storage.ReadSettings();
            this.Form.PopulateWithSettings(settings);
            $('#vector-dark-settings-dialog').dialog('open');
        }

        /** Zamyka okienko */
        protected Close() {
            $('#vector-dark-settings-dialog').dialog('close');
        }

        /** Stosuje zmiany */
        protected ApplyChanges() {
            let settings = this.Form.GetSettings();
            this.Controller.ChangeSettings(settings);
        }
    }
}