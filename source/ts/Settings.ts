namespace Msz2001.VectorDark {

    /**
     * Przechowuje ustawienia gadżetu
     */
    export interface Settings {
        AutoHideSwitcher: boolean;
        PingServer: boolean;
        Gadgets: Gadgets;
    }

    /**
     * Przechowuje wartości odpowiadające ustawieniom
     */
    export abstract class SettingValues {
        public static AutoHideSwitcher = 1;
        public static PingServer = 2;
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
    export abstract class GadgetValues {
        public static Popups = 1;
        public static UserColors = 2;
        public static TalkColors = 4;
        public static Sandbox = 8;
    }
}