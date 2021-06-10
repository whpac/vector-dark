/** Rozszerza typ obiektu window o dodatkowe właściwości */
interface Window {
    Msz2001_vectorDark_loaded: boolean | undefined;

    /** Pozwala skonfigurować, czy pingować ToolForge po zmianie trybu */
    Msz2001_vectorDark_pingujCookie: boolean | undefined;
}

enum Mode {
    Light,
    Dark
}