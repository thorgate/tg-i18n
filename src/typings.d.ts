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


declare module 'gettext-parser' {
    const getTextParser: {
        po: {
            compile: (catalogue: any) => Buffer,
            parse: (fileData: string | Buffer) => any,
        }
    };

    export default getTextParser;
}


declare module '*.json' {
  const value: any;
  export default value;
}
