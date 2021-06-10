/**
 * Klasa pośrednicząca przy wpływaniu na wygląd strony
 */
class ThemeAdapter {
    protected MetaTheme: HTMLElement | null;

    /** Tworzy egzemplarz klasy i odwołania do wykorzystywanych obiektów */
    public constructor() {
        this.MetaTheme = document.querySelector("meta[name=theme-color]");
    }

    /**
     * Stosuje wybrany tryb do strony
     * @param mode Bieżący tryb
     */
    public ApplyMode(mode: Mode) {
        let root_cl = document.documentElement.classList;

        switch(mode) {
            case Mode.Light:
                root_cl.add('disable-dark-skin');
                root_cl.remove('enable-dark-skin');
                this.MetaTheme?.setAttribute("content", "#eaecf0");
                break;
            case Mode.Dark:
                root_cl.remove('disable-dark-skin');
                root_cl.add('enable-dark-skin');
                this.MetaTheme?.setAttribute("content", "#222");
                break;
        }
    }
}