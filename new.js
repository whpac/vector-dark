$(function(){
    var LOCAL_OPTIONS_KEY = 'gadget.vector-dark.options';
    var REMOTE_PREF_KEY = 'gadget-vector-dark-styles';
    var STYLES_GADGET = 'ext.gadget.vector-dark-styles';
    var DEFAULT_OPTIONS = {
        isOn: false
    };

    var THEMES = {
        dark: {
            htmlClass: 'enable-dark-skin',
            toggleButton: null
        },
        light: {
            htmlClass: 'disable-dark-skin',
            toggleButton: null
        }
    };

    var gadgetOptions = DEFAULT_OPTIONS;


    function insertToggles(){
        THEMES.dark.toggleButton = mw.util.addPortletLink('p-personal', 'javascript:void(0)', 'Light theme');
        THEMES.dark.toggleButton.addEventListener('click', function(){ setTheme(false); });

        THEMES.light.toggleButton = mw.util.addPortletLink('p-personal', 'javascript:void(0)', 'Dark theme');
        THEMES.light.toggleButton.addEventListener('click', function(){ setTheme(true); });
    }

    function setTheme(isOn){
        gadgetOptions.isOn = isOn;
        saveThemeOptions();
        applyCurrentOptions();
    }

    function applyCurrentOptions(){
        var themeOff = gadgetOptions.isOn ? THEMES.light : THEMES.dark;
        var themeOn = gadgetOptions.isOn ? THEMES.dark : THEMES.light;

        var htmlClassList = document.documentElement.classList;
        htmlClassList.remove(themeOff.htmlClass);
        htmlClassList.add(themeOn.htmlClass);

        if (themeOff.toggleButton) themeOff.toggleButton.style.display = 'none';
        if (themeOn.toggleButton) themeOn.toggleButton.style.display = '';

        if (gadgetOptions.isOn){
            mw.loader.load(STYLES_GADGET);
        }
    }

    function saveThemeOptions(){
        mw.storage.setObject(LOCAL_OPTIONS_KEY, gadgetOptions);
        mw.user.options.set(REMOTE_PREF_KEY, Number(gadgetOptions.isOn));
    }

    function readThemeOptions(){
        var storedOptions = mw.storage.getObject(LOCAL_OPTIONS_KEY) || {};
        gadgetOptions = $.extend({}, DEFAULT_OPTIONS, storedOptions);
    }

    mw.loader.using([ 'mediawiki.storage', 'mediawiki.util', 'user.options' ], function(){
        readThemeOptions();
        insertToggles();
        applyCurrentOptions();
    });
});