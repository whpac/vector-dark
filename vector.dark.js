/* Nie dołączaj skryptu ponownie */
if(window.Msz2001_vectorDark === undefined){
    jQuery(document).ready(function () {
        Msz2001_vectorDark_uruchom();
    });
    
    window.Msz2001_vectorDark = {
        obrazek_cors: null,
        link_ciemny: null,
        link_jasny: null,
        inicjalizacja: true
    };
    
    if(window.Msz2001_vectorDark_pingujCookie === undefined){
        window.Msz2001_vectorDark_pingujCookie = false;
    }
    
    var Msz2001_vectorDark_uruchom = function() {
        /* Wstaw obrazek do realizowania żądań bez CORS */
        var obrazek_cors = document.createElement("img");
        obrazek_cors.style.width = obrazek_cors.style.height = '0px';
        obrazek_cors.style.display = 'none';
        document.body.appendChild(obrazek_cors);
        window.Msz2001_vectorDark.obrazek_cors = obrazek_cors;
    
        var ciemny_wlaczony = Msz2001_vectorDark_czyWlaczony();
    
        /* Wyłącz tryb ciemny, jeśli użytkownik go nie chce */
        if(!ciemny_wlaczony) Msz2001_vectorDark_wylacz();
        else Msz2001_vectorDark_wlacz();
    
        /* Dodaj linki do przełączania trybu */
        var link_jasny = Msz2001_vectorDark_nowyLink("Tryb jasny", Msz2001_vectorDark_wylacz);
        if(!ciemny_wlaczony) link_jasny.style.display = "none";
        window.Msz2001_vectorDark.link_jasny = link_jasny;
    
        var link_ciemny = Msz2001_vectorDark_nowyLink("Tryb ciemny", Msz2001_vectorDark_wlacz);
        if(ciemny_wlaczony) link_ciemny.style.display = "none";
        window.Msz2001_vectorDark.link_ciemny = link_ciemny;
    
        var wiki_id = mw.config.get("wgWikiID");
        var id_linku = "n-FAQ";
        switch(wiki_id){
            case "plwiki": id_linku = "n-FAQ"; break;
            case "wikidatawiki": id_linku = "n-sitesupport"; break;
            case "plwikinews": id_linku = "n-Kontakt"; break;
            case "enwiki": id_linku = "n-sitesupport"; break;
            case "commonswiki": id_linku = "n-help"; break;
        }

        var ostatni_link = document.getElementById(id_linku);
    
        if(ostatni_link) {
            ostatni_link.parentNode.insertBefore(link_jasny, ostatni_link.nextSibling);
            ostatni_link.parentNode.insertBefore(link_ciemny, ostatni_link.nextSibling);
        } else {
            setTimeout(function () {
                var elAboutWikipediaLink = document.querySelector("#mw-mf-page-left ul.hlist li:first-child");
                var elNavLeft = document.getElementById("mw-mf-page-left");
                if(elAboutWikipediaLink) {
                    elAboutWikipediaLink.parentNode.insertBefore(link_jasny, elAboutWikipediaLink);
                    elAboutWikipediaLink.parentNode.insertBefore(link_ciemny, elAboutWikipediaLink);
                } else {
                    elNavLeft.appendChild(link_jasny);
                    elNavLeft.appendChild(link_ciemny);
                }
            }, 1000);
        }
        window.Msz2001_vectorDark.inicjalizacja = false;
    };
    
    /**
     * Włącza ciemny motyw
     */
    var Msz2001_vectorDark_wlacz = function() {
        Msz2001_vectorDark_zapiszCzyWlaczony(true);
    };
    
    /**
     * Wyłącza ciemny motyw
     */
    var Msz2001_vectorDark_wylacz = function() {
        Msz2001_vectorDark_zapiszCzyWlaczony(false);
    };
    
    /**
     * Sprawdza, czy ciemny motyw jest ustawiony
     * @returns Czy ciemny motyw jest ustawiony
     */
    var Msz2001_vectorDark_czyWlaczony = function() {
        return (document.cookie.indexOf("disable_vectorDark_Msz2001=1") < 0);
    };
    
    /**
     * Zapisuje tryb wybrany przez użytkownika i ustawia widoczność elementów
     * @param {boolean} czy_wlaczony 
     */
    var Msz2001_vectorDark_zapiszCzyWlaczony = function(czy_wlaczony){
        /* Zamienia wartość logiczną na liczbę - pomaga w adresowaniu tablic */
        czy_wlaczony = czy_wlaczony ? 1 : 0;
    
        /* Ustawia odpowiednią klasę CSS na znaczniku <html> */
        var klasa_do_ustawienia = [ /* jasny: */ "disable-dark-skin", /* ciemny: */ "enable-dark-skin"];
        var klasa_do_usuniecia = [ /* jasny: */ "enable-dark-skin", /* ciemny: */ "disable-dark-skin"];
    
        document.documentElement.classList.add(klasa_do_ustawienia[czy_wlaczony]);
        document.documentElement.classList.remove(klasa_do_usuniecia[czy_wlaczony]);
    
        /* Ustawia kolor paska adresu w przeglądarkach mobilnych */
        var kolor_motywu = [ /* jasny: */ "#eaecf0", /* ciemny: */ "#222"];
        var metaThemeColor = document.querySelector("meta[name=theme-color]");
        if(metaThemeColor) metaThemeColor.setAttribute("content", kolor_motywu[czy_wlaczony]);
    
        /* Wartości właściwości display dla linków w poszczególnych stanach */
        var pokaz_link_ciemny = [ /* jasny: */ "inherit", /* ciemny: */ "none"];
        var pokaz_link_jasny = [ /* jasny: */ "none", /* ciemny: */ "inherit"];
    
        /* Ustawia widoczność linków do przełączania */
        if(window.Msz2001_vectorDark.link_ciemny != null && window.Msz2001_vectorDark.link_jasny != null){
            window.Msz2001_vectorDark.link_ciemny.style.display = pokaz_link_ciemny[czy_wlaczony];
            window.Msz2001_vectorDark.link_jasny.style.display = pokaz_link_jasny[czy_wlaczony];
        }
    
        /* Ustawia cookie, które jest dostępne tylko dla front-endu */
        document.cookie = "disable_vectorDark_Msz2001=" + (1-czy_wlaczony) + "; path=/";
        Msz2001_vectorDark_zapiszCookie(czy_wlaczony);
    };
    
    /**
     * Tworzy element <li> z linkiem w środku
     * @param {string} tekst Tekst do umieszczenia w linku
     * @param {() => void} klik Procedura obsługi kliknięcia
     * @returns Element listy
     */
    var Msz2001_vectorDark_nowyLink = function(tekst, klik){
        var li = document.createElement("li");
        var link = document.createElement("a");
        link.href = "javascript:void(0)";
        link.textContent = tekst;
        link.addEventListener("click", klik);
        li.appendChild(link);
        return li;
    };

    /**
     * Pinguje serwer z plikami CSS, aby ustawił odpowiedni plik cookie
     * @param {number} czy_wlaczony Liczba 0 lub 1, określająca, czy tryb ciemny jest włączony
     */
    var Msz2001_vectorDark_zapiszCookie = function(czy_wlaczony){
        /* Nie pinguj jeśli trwa inicjalizacja (nie było zmiany) ani jeśli użytkownik sobie nie życzy */
        if(window.Msz2001_vectorDark.inicjalizacja) return;
        if(!window.Msz2001_vectorDark_pingujCookie) return;

        /* Wysyła żądanie do serwera z plikami CSS, by ustawił cookie dla siebie */
        window.Msz2001_vectorDark.obrazek_cors.src = "https://vector-dark.toolforge.org/setcookie.php?is_on=" + (czy_wlaczony ? "true" : "false");
    };
}