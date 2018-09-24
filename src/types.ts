import Jed from 'jed';

export type LocaleData = {

};


export type LocaleCatalogueType = {
    domain: string,
    locales: {
        [languageCode: string]: LocaleData,
    },
};


/**
 * I18N Configuration storage object.
 *   For internal use only.
 */
export type I18NConfig = {
    translationEngine: Jed | null,
    activeLanguage: string | null,
    defaultLanguage: string | null,
    localeCatalogue: LocaleCatalogueType,
    [key: string]: any,
};


export type I18nObject = {
    activeLanguage: string | null,
    gettext: (key: string) => string,
    pgettext: (context: string, key: string) => string,
    ngettext: (singular: string, plural: string, value: number) => string,
    npgettext: (context: string, singular: string, plural: string, value: number) => string,
    interpolate: (format: string, ...args: Array<any>) => string,
    changeLanguage: (languageCode: string, force?: boolean) => void,
};
