/** Rozszerza typ obiektu window o dodatkowe właściwości */
interface Window {

    /** Kontener dla wszystkich potrzebnych obiektów */
    Msz2001_vectorDark: {
        /** Obrazek, odpowiadający za wykonywanie żądań */
        obrazek_cors: HTMLImageElement | null,

        /** Linki do przełączania trybu */
        link_ciemny: HTMLElement | null,
        link_jasny: HTMLElement | null,

        /** Przechowuje informację, czy trwa inicjalizacja */
        inicjalizacja: boolean;
    };

    /** Pozwala skonfigurować, czy pingować ToolForge po zmianie trybu */
    Msz2001_vectorDark_pingujCookie: boolean | undefined;
}

enum Mode {
    Light,
    Dark
}