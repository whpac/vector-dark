/* Nie dołączaj skryptu ponownie */
if(window.Msz2001_vectorDark_loaded === undefined) {
    window.Msz2001_vectorDark_loaded = true;

    if(window.Msz2001_vectorDark_pingujCookie === undefined) {
        window.Msz2001_vectorDark_pingujCookie = false;
    }

    // Utwórz kontroler po załadowaniu się strony
    $(function () {
        new Msz2001.VectorDark.Controller();
    });
}

/** Rozszerza typ obiektu window o dodatkowe właściwości */
interface Window {
    /** Opisuje, czy już załadowano gadżet */
    Msz2001_vectorDark_loaded: boolean | undefined;

    /** Pozwala skonfigurować, czy pingować ToolForge po zmianie trybu */
    Msz2001_vectorDark_pingujCookie: boolean | undefined;
}