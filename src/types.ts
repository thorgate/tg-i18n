import * as React from 'react';
import Jed from 'jed';


export type LocaleData = {
};


export type LocaleCatalogueType = {
    domain: string,
    locales: {
        [languageCode: string]: LocaleData,
    },
};


export type I18nAttributes = {
    activeLanguage: string | null,
    defaultLanguage: string | null,
    localeCatalogue: LocaleCatalogueType,
};

export type I18nProviderProps = I18nAttributes & {
    onLanguageChange: (languageCode: string) => void,
    children: React.ReactNode,
};

/**
 * I18N Configuration storage object.
 *   For internal use only.
 */
export type I18NConfig = I18nAttributes & {
    translationEngine: Jed | null,
    [key: string]: any,
};


export type I18nProviderState = {
    activeLanguage: string | null,
    gettext: (key: string) => string,
    pgettext: (context: string, key: string) => string,
    ngettext: (singular: string, plural: string, value: number) => string,
    npgettext: (context: string, singular: string, plural: string, value: number) => string,
    interpolate: (format: string, ...args: Array<any>) => string,
    changeLanguage: (languageCode: string, force?: boolean) => void,
};


export type I18nContext = {
    i18n: I18nProviderState,
};


export interface RenderProps<T> {
    /**
     * Translated component to render. Can either be a string like 'select' or a component.
     */
    component?: string | React.ComponentType<T | void>;

    /**
     * Render prop (works like React router's <Route render={props =>} />)
     */
    render?: ((props: T) => React.ReactNode);

    /**
     * Children render function <Translated name>{props => ...}</Translated>)
     */
    children?: ((props: T) => React.ReactNode);
}
