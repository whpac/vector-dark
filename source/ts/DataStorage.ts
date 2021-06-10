/**
 * Klasa odpowiedzialna za zapisywanie i odczytywanie ustawionego trybu
 */
class DataStorage {
    protected CorsImage: HTMLImageElement;

    public constructor() {
        this.CorsImage = document.createElement('img');
        this.CorsImage.style.width = this.CorsImage.style.height = '0px';
        this.CorsImage.style.display = 'none';
        document.body.appendChild(this.CorsImage);
    }

    /** Zwraca aktualnie ustawiony tryb */
    public GetMode(): Mode {
        let cookie_index = document.cookie.indexOf('disable_vectorDark_Msz2001=1');
        if(cookie_index < 0) {
            return Mode.Light;
        } else {
            return Mode.Dark;
        }
    }

    /**
     * Zapisuje tryb
     * @param mode Tryb do zapisania
     */
    public SaveMode(mode: Mode) {
        // Zapisuje ciastko widoczne tylko po stronie klienckiej (nie trafia do ToolForge)
        let cookie_value = (mode == Mode.Light) ? 1 : 0;
        document.cookie = 'disable_vectorDark_Msz2001=' + cookie_value + '; path=/';
    }

    protected PingForCookie(mode: Mode) {
        if(!window.Msz2001_vectorDark_pingujCookie) return;

        let is_on = (mode == Mode.Light) ? 'false' : 'true';

        /* Wysyła żądanie do serwera z plikami CSS, by ustawił cookie dla siebie */
        this.CorsImage.src = 'https://vector-dark.toolforge.org/setcookie.php?is_on=' + is_on;
    }
}