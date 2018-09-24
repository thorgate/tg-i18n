declare module 'jed' {
    class Jed {
        constructor(localeData: {domain: string, locale_data: {[domain: string]: any}});

        gettext(key: string): string;
        pgettext(context: string, key: string): string;
        ngettext(singular: string, plural: string, value: number): string;
        npgettext(context: string, singular: string, plural: string, value: number): string;

        static sprintf(format: string, ...args: Array<any>): string;
    }

    export default Jed;
}
