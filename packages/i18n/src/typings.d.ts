declare module 'jed' {
    class Jed {
        constructor(localeData: {domain: string, locale_data: {[domain: string]: any}});

        public gettext(key: string): string;
        public pgettext(context: string, key: string): string;
        public ngettext(singular: string, plural: string, value: number): string;
        public npgettext(context: string, singular: string, plural: string, value: number): string;

        public static sprintf(format: string, ...args: any[]): string;
    }

    export default Jed;
}
