namespace Msz2001.VectorDark {

    /**
     * Przechowuje ustawienia gadżetu
     */
    export interface Settings {
        AutoHideSwitcher: boolean;
        PingServer: boolean;
        Gadgets: Gadgets;
        UsesDeprecatedPingSetting: boolean;
    }

    /**
     * Przechowuje wartości odpowiadające ustawieniom
     */
    export enum SettingValues {
        AutoHideSwitcher = 1,
        PingServer = 2
    }

    /**
     * Przechowuje ustawienia włączonych gadżetów
     */
    export interface Gadgets {
        Popups: boolean;
        UserColors: boolean;
        TalkColors: boolean;
        Sandbox: boolean;
    }

    /**
     * Przechowuje wartości odpowiadające gadżetom
     */
    export enum GadgetValues {
        Popups = 1,
        UserColors = 2,
        TalkColors = 4,
        Sandbox = 8
    }
}