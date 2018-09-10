/**
 * @module tg-i18n/i18n
 */
import is from 'is';
import Jed from 'jed';
import moment from 'moment';

import { getConfig, getLogger, onLanguageChange } from './config';


/**
 * Translation instance to be used for translating messages.
 *   An instance of this class is returned by {@link module:tg-i18n.i18n.makeI18n}.
 *
 * @class
 * @memberof module:tg-i18n.i18n
 */
export class I18N {
    constructor(activeLanguage, defaultLanguage, localeData) {
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

        this.localeData = localeData;
        this.requestLanguage = activeLanguage || defaultLanguage;

        this._activeLang = null;
        this.$t = null;

        // Set active language if specified
        if (activeLanguage) {
            this.setActiveLang(activeLanguage);
        }
    }

    forceLanguage = (activeLanguage) => {
        this.requestLanguage = activeLanguage || activeLanguage;
        this.setActiveLang(this.requestLanguage);
    };

    setActiveLang = (theLanguage) => {
        if (!is.undef(this.localeData[theLanguage])) {
            if (this._activeLang !== theLanguage) {
                if (!this.localeData[theLanguage]) {
                    getLogger().warning(`Missing locale_data for language ${theLanguage}`);
                    return;
                }

                this._activeLang = theLanguage;
                const domain = getConfig('domain');
                this.$t = new Jed({
                    domain,
                    locale_data: {
                        [domain]: JSON.parse(this.localeData[theLanguage] || '{}'),
                    },
                });

                if (theLanguage !== this.requestLanguage) {
                    onLanguageChange(theLanguage);
                }
            }
        }

        // Also fix moment locale
        moment.locale(theLanguage === 'en-us' ? 'en-gb' : theLanguage);
    };

    gettext = (key) => {
        if (!this.$t) {
            return key;
        }

        return this.$t.gettext(key);
    };

    pgettext = (context, key) => {
        if (!this.$t) {
            return key;
        }

        return this.$t.pgettext(context, key);
    };

    ngettext = (singularKey, pluralKey, value) => {
        if (!this.$t) {
            return (value === 0 || value === 1) ? singularKey : pluralKey;
        }

        return this.$t.ngettext(singularKey, pluralKey, value);
    };

    npgettext = (context, singularKey, pluralKey, value) => {
        if (!this.$t) {
            return (value === 0 || value === 1) ? singularKey : pluralKey;
        }

        return this.$t.npgettext(context, singularKey, pluralKey, value);
    };

    interpolate = (out, ...args) => (
        Jed.sprintf(out, ...args)
    );

    static initFromConfig() {
        return new I18N(
            getConfig('activeLanguage'),
            getConfig('languageCode'),
            getConfig('localeData'),
        );
    }
}


/**
 * Create I18N instance from config and return directly usable functions.
 * @returns {{
 *   i18n: module:tg-i18n.i18n.I18N,
 *   gettext: module:tg-i18n.i18n.I18N.gettext,
 *   pgettext: module:tg-i18n.i18n.I18N.pgettext,
 *   ngettext: module:tg-i18n.i18n.I18N.ngettext,
 *   npgettext: module:tg-i18n.i18n.I18N.npgettext,
 *   interpolate: (function(*=, ...[*]): *),
 *   forceLanguage: module:tg-i18n.i18n.I18N.forceLanguage,
 *   setActiveLang: module:tg-i18n.i18n.I18N.setActiveLang
 * }}
 * @function makeI18n
 * @memberof module:tg-i18n.i18n
 */
function makeI18n() {
    const i18n = I18N.initFromConfig();

    return {
        i18n,
        gettext: i18n.gettext,
        pgettext: i18n.pgettext,
        ngettext: i18n.ngettext,
        npgettext: i18n.npgettext,
        interpolate: i18n.interpolate,
        forceLanguage: i18n.forceLanguage,
        setActiveLang: i18n.setActiveLang,
    };
}

export default makeI18n;
