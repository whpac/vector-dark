namespace Msz2001.VectorDark {

    export interface ThemeSwitcher {

        /** Dopasowuje wygląd przełącznika do aktualnego trybu */
        AdjustToCurrentMode(): void;

        /**
         * Ustawia autoukrywanie przełącznika
         * @param autohide Czy ukrywać automatycznie
         */
        SetAutoHide(autohide: boolean): void;
    }
}