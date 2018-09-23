// @flow
/**
 * @module tg-i18n/i18n
 */
import * as React from 'react';
import is from 'is';
import Jed from 'jed';
import memoize from 'memoize-one';

import type { LocaleCatalogueType } from './config';
import { getConfig, getLogger, onLanguageChange } from './config';


type I18nObject = {
    activeLanguage: string,
    gettext: (key: string) => string,
    pgettext: (context: string, key: string) => string,
    ngettext: (singular: string, plural: string, value: number) => string,
    npgettext: (context: string, singular: string, plural: string, value: number) => string,
    interpolate: (format: string, ...args: Array<string | number | { [string]: any }>) => string,
    changeLanguage: (languageCode: string) => void,
};


export const I18nContext = React.createContext<?I18nObject>(null);


export type I18nProviderProps = {
    children: React.Node,
    defaultLanguage: string,
    localeData: LocaleCatalogueType,
    activeLanguage?: string,
    onLanguageChange?: (string) => void,
};


type I18nProviderState = {
    activeLanguage: string,
    translationEngine: ?Jed,
}


class I18nProvider extends React.Component<I18nProviderProps, I18nProviderState> {
    // Local Jed instance for translations
    $t: ?Jed = null;

    constructor(props) {
        super(props);

        if (process.env.NODE_ENV !== 'production') {
            if (!is.object(this.props.localeData) || Object.keys(this.props.localeData).length === 0) {
                // eslint-disable-next-line no-console
                console.error('No languages defined');
            }

            if (!this.props.defaultLanguage) {
                // eslint-disable-next-line no-console
                console.error('Default language not defined');
            }

            if (is.undef(this.props.localeData[this.props.defaultLanguage])) {
                // eslint-disable-next-line no-console
                console.error('Default language not in available languages');
            }
        }

        this.state = {
            activeLanguage: this.props.defaultLanguage,
            gettext: this.gettext,
            pgettext: this.pgettext,
            ngettext: this.ngettext,
            npgettext: this.npgettext,
            interpolate: this.interpolate,
            changeLanguage: this.setActiveLanguage,
            translationEngine: null,
        };
    }

    // This will removed in React 17.
    // Remove when better API is defined for this component
    componentWillMount() {
        let activeLanguage = this.props.defaultLanguage;

        if (this.props.activeLanguage) {
            ({ activeLanguage } = this.props);
        }

        this.setActiveLanguage(activeLanguage);
    }

    // static getDerivedStateFromProps(props, state) {
    //
    // }

    /**
     * Create memoized function to get new `i18n` context.
     * This is to avoid extra re-renders when it is not required.
     */
    getI18nObject = memoize(
        // eslint-disable-next-line no-unused-vars
        (activeLanguage, translationEngine): I18nObject => ({
            activeLanguage,
            gettext: this.gettext,
            pgettext: this.pgettext,
            ngettext: this.ngettext,
            npgettext: this.npgettext,
            interpolate: this.interpolate,
            changeLanguage: this.setActiveLanguage,
        }),
    );

    /**
     * Activate new language if language has changed.
     * If language data for new language is not defined.
     * Jed will be uninitialized and no translation is provided.
     *
     * @param {string} languageCode
     */
    setActiveLanguage = (languageCode: string): void => {
        // TODO : extra logic
        if (this.props.onLanguageChange) {
            this.props.onLanguageChange(languageCode);
        }
    };

    // TODO : Decide what to do with these
    // Maybe move to separate file and provide `translationEngine` as argument
    // Or return memoized fn based on translation engine.
    gettext = (key: string): string => {
        if (!this.$t) {
            return key;
        }

        return this.$t.gettext(key);
    };

    pgettext = (context: string, key: string): string => {
        if (!this.$t) {
            return key;
        }

        return this.$t.pgettext(context, key);
    };

    ngettext = (singular: string, plural: string, value: number): string => {
        if (!this.$t) {
            return (value === 0 || value === 1) ? singular : plural;
        }

        return this.$t.ngettext(singular, plural, value);
    };

    npgettext = (context: string, singular: string, plural: string, value: number): string => {
        if (!this.$t) {
            return (value === 0 || value === 1) ? singular : plural;
        }

        return this.$t.npgettext(context, singular, plural, value);
    };

    interpolate = (format: string, ...args: Array<string | number | { [string]: any }>) => (
        Jed.sprintf(format, ...args)
    );

    render() {
        return (
            <I18nContext.Provider value={this.getI18nObject(this.state.activeLanguage, this.state.translationEngine)}>
                {this.props.children}
            </I18nContext.Provider>
        );
    }
}


// TODO : Transform this to provider
// TODO : Limit public config to localeData, defaultLanguage and activeLanguage
// TODO : Or drop this entirely and expect props

/**
 * Translation instance to be used for translating messages.
 *   An instance of this class is returned by {@link module:tg-i18n.i18n.makeI18nObject}.
 *
 * @class
 * @memberof module:tg-i18n.i18n
 */
export class I18N {
    // Default language instance
    defaultLanguage: string;

    // Locale catalogues
    localeData: LocaleCatalogueType;

    // Current active language
    _activeLang: ?string = null;

    // Local Jed instance for translations
    $t: ?Jed = null;

    constructor(activeLanguage: string, defaultLanguage: string, localeData: LocaleCatalogueType) {
        if (process.env.NODE_ENV !== 'production') {
            if (!is.object(localeData) || Object.keys(localeData).length === 0) {
                getLogger().error('No languages defined');
                localeData = {};
            }

            if (!defaultLanguage) {
                getLogger().error('Default language not defined');
            }

            if (is.undef(localeData[defaultLanguage])) {
                getLogger().error('Default language not in available languages');
            }
        }

        this.defaultLanguage = defaultLanguage;

        this.localeData = localeData;

        this._activeLang = null;
        this.$t = null;

        // Set active language if specified
        if (activeLanguage) {
            this.setActiveLanguage(activeLanguage);
        }
    }

    setActiveLanguage = (languageCode: string) => {
        if (!is.undef(this.localeData[languageCode])) {
            if (this._activeLang !== languageCode) {
                if (!this.localeData[languageCode]) {
                    getLogger().warning(`Missing locale_data for language ${languageCode}`);
                    return;
                }

                // Format locale data
                // Locale data can be provided as Object or JSON string
                let localeData = this.localeData[languageCode] || '{}';
                if (is.string(localeData)) {
                    localeData = JSON.parse(localeData);
                }

                this._activeLang = languageCode;
                const domain = getConfig('domain');
                this.$t = new Jed({
                    domain,
                    locale_data: {
                        [domain]: localeData,
                    },
                });

                // Trigger onLanguageChange event to update config and any user provided callback
                onLanguageChange(languageCode);
            }
        } else if (this.$t !== null) {
            // There was old translations active, deactivate it and
            // log a warning that new translation locale data is missing
            getLogger().warn(`Language code "${languageCode}" is not defined in "localeData"`);
            this.$t = null;
        }
    };

    /**
     * Get translation for `key`
     * @param {string} key - Translation key
     * @returns {string} - Key or translated string if translation engine Jed is initialized
     */
    gettext = (key: string): string => {
        if (!this.$t) {
            return key;
        }

        return this.$t.gettext(key);
    };

    pgettext = (context: string, key: string): string => {
        if (!this.$t) {
            return key;
        }

        return this.$t.pgettext(context, key);
    };

    ngettext = (singular: string, plural: string, value: number): string => {
        if (!this.$t) {
            return (value === 0 || value === 1) ? singular : plural;
        }

        return this.$t.ngettext(singular, plural, value);
    };

    npgettext = (context: string, singular: string, plural: string, value: number): string => {
        if (!this.$t) {
            return (value === 0 || value === 1) ? singular : plural;
        }

        return this.$t.npgettext(context, singular, plural, value);
    };

    interpolate = (format: string, ...args: Array<string | number | { [string]: any }>) => (
        Jed.sprintf(format, ...args)
    );


    /**
     * Initialize I18N instance from string
     * @returns {module:tg-i18n.i18n.I18N}
     */
    static initFromConfig(): I18N {
        return new I18N(
            getConfig('activeLanguage'),
            getConfig('languageCode'),
            getConfig('localeData'),
        );
    }
}


export type I18nObject = {
    i18n: I18N,
    gettext: (key: string) => string,
    pgettext: (context: string, key: string) => string,
    ngettext: (singular: string, plural: string, value: number) => string,
    npgettext: (context: string, singular: string, plural: string, value: number) => string,
    interpolate: (format: string, ...args: Array<string | number | { [string]: any }>) => string,
    setActiveLanguage: (languageCode: string) => void,
};

/**
 * Create I18N instance from config and return directly usable functions.
 * @returns {I18nObject}
 * @function makeI18nObject
 * @memberof module:tg-i18n.i18n
 */
function makeI18nObject(): I18nObject {
    const i18n = I18N.initFromConfig();

    return {
        i18n,
        gettext: i18n.gettext,
        pgettext: i18n.pgettext,
        ngettext: i18n.ngettext,
        npgettext: i18n.npgettext,
        interpolate: i18n.interpolate,
        setActiveLanguage: i18n.setActiveLanguage,
    };
}

export default makeI18nObject;
