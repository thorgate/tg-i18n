/* tslint:disable:interface-name */
import * as React from 'react';


export interface JedCatalogueHeader {
    lang: string,
    plural_forms: string,
}

export interface LocaleCatalogue {
    domain: string,
    locales: {
        [languageCode: string]: {
            '': JedCatalogueHeader,

            [key: string]: JedCatalogueHeader | string[],
        },
    },
}


export interface I18nOptions {
    activeLanguage: string | null,
    defaultLanguage: string,
    localeCatalogue: LocaleCatalogue,
}

export type I18nCallback = (languageCode: string | null) => void;


export type I18nProviderProps = I18nOptions & {
    onLanguageChange: I18nCallback,
    children: React.ReactNode,
};


export interface I18nProps {
    activeLanguage: string | null,
    gettext: (key: string) => string,
    pgettext: (context: string, key: string) => string,
    ngettext: (singular: string, plural: string, value: number) => string,
    npgettext: (context: string, singular: string, plural: string, value: number) => string,
    changeLanguage: (languageCode: string | null, force?: boolean) => void,
}


export interface I18nContext {
    i18n: I18nProps,
}


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
