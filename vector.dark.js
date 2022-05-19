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

        var nav_portlet_ul = document.querySelector("#mw-panel .mw-portlet:first-of-type ul");
    
        if(!document.body.classList.contains('skin-minerva')) {
            nav_portlet_ul.appendChild(link_jasny);
            nav_portlet_ul.appendChild(link_ciemny);
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
        Msz2001_vectorDark_dopasujInfoboks(true);
    };
    
    /**
     * Wyłącza ciemny motyw
     */
    var Msz2001_vectorDark_wylacz = function() {
        Msz2001_vectorDark_zapiszCzyWlaczony(false);
        Msz2001_vectorDark_dopasujInfoboks(false);
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

    /**
     * Reguluje kolor nagłówka infoboksu
     * @param czy_wlaczony - czy tryb ciemny jest włączony
     */
    var Msz2001_vectorDark_dopasujInfoboks = function(czy_wlaczony){
        /* Wczytaj nagłówki infoboksów */
        var captions = document.querySelectorAll('.infobox caption.naglowek');
        captions.forEach(function (caption) {
            if(caption.style === undefined) return;

            /* Przywróć oryginalne kolory */
            if(!czy_wlaczony){
                if(caption.dataset.vdOrigBg)
                    caption.style.backgroundColor = caption.dataset.vdOrigBg;
                if(caption.dataset.vdOrigCol)
                    caption.style.color = caption.dataset.vdOrigCol;
                return;
            }

            /* Wczytaj kolor z atrybutu style i przetwórz na RGB */
            var bg_color = caption.style.backgroundColor;
            if(bg_color === undefined) return;

            var parsed_color = parseColor(bg_color);
            if(parsed_color === null) return;

            /* Zapisz oryginalny kolor w artybutach data-* */
            caption.dataset.vdOrigBg = bg_color;
            caption.dataset.vdOrigCol = caption.style.color || '#000';

            /* Przyciemnij oryginalny kolor */
            var hsl = rgbToHsl(parsed_color);
            hsl[2] = Math.sqrt(hsl[2] / 10) * 10;
            caption.style.backgroundColor = 'hsl('+hsl[0]+'deg,'+hsl[1]+'%,'+hsl[2]+'%)';

            caption.style.color = '#fff';
        });
    }

    // https://gist.github.com/mjackson/5311256
    var rgbToHsl = function (color) {
        var r = color[0] / 255;
        var g = color[1] / 255;
        var b = color[2] / 255;

        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h, s, l;
        l = (max + min) / 2;

        if (max == min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            }

            h /= 6;
        }

        return [h*360, s*100, l*100];
    }

    // https://gist.github.com/THEtheChad/1297590
    var parseColor = function(color) {
        var cache,
            p = parseInt,
            color = color.replace(/\s/g,'');
        
        if (cache = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(color)) 
            cache = [p(cache[1], 16), p(cache[2], 16), p(cache[3], 16)];
            
        else if (cache = /#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(color))
            cache = [p(cache[1], 16) * 17, p(cache[2], 16) * 17, p(cache[3], 16) * 17];
            
        else if (cache = /rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(color))
            cache = [+cache[1], +cache[2], +cache[3], +cache[4]];

        else if (cache = /rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(color))
            cache = [+cache[1], +cache[2], +cache[3]];
            
        else return null;
        
        isNaN(cache[3]) && (cache[3] = 1);
        
        return cache;
    }
}
