/* Nie dołączaj skryptu ponownie */
if(window.Msz2001_vectorDark_loaded === undefined) {
    window.Msz2001_vectorDark_loaded = true;

    if(window.Msz2001_vectorDark_pingujCookie === undefined) {
        window.Msz2001_vectorDark_pingujCookie = false;
    }

    // Utwór kontroler po załadowaniu się strony
    $(function () {
        new Msz2001.VectorDark.Controller();
    });
}