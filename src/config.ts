import Jed from 'jed';
import warning from 'warning';

import { I18NConfig } from './types';


export const DefaultCatalogue = {
    domain: 'messages',
    locales: {},
};


const config: I18NConfig = {
    activeLanguage: null,
    defaultLanguage: null,
    localeCatalogue: DefaultCatalogue,
    translationEngine: null,
};


export const setConfig = (key: string, val: any) => {
    config[key] = val;
};


export const getConfig = (key: string): any => {
    return config[key];
};


export const activateLanguage = (
    languageCode: string | null, force: boolean = false, callBack?: (languageCode: string) => void,
) => {
    if (!languageCode) {
        config.translationEngine = null;
        return;
    }

    if (config.activeLanguage === languageCode && !force) {
        return;
    }

    const localeData = config.localeCatalogue.locales[languageCode];
    warning(!localeData, `Missing locale data for language: "${languageCode}"`);
    warning(!config.localeCatalogue.domain, 'Missing locale domain in language catalogue');

    if (localeData) {
        config.translationEngine = new Jed({
            domain: config.localeCatalogue.domain,
            locale_data: {
                [config.localeCatalogue.domain]: localeData,
            },
        });

        if (callBack) {
            callBack(languageCode);
        }
    }
};


export const gettextNoop = (key: string) => key;


export const gettext = (key: string): string => {
    if (!config.translationEngine) {
        return key;
    }

    return config.translationEngine.gettext(key);
};


export const pgettext = (context: string, key: string): string => {
    if (!config.translationEngine) {
        return key;
    }

    return config.translationEngine.pgettext(context, key);
};


export const ngettext = (singular: string, plural: string, value: number): string => {
    if (!config.translationEngine) {
        return (value === 0 || value === 1) ? singular : plural;
    }

    return config.translationEngine.ngettext(singular, plural, value);
};


export const npgettext = (context: string, singular: string, plural: string, value: number): string => {
    if (!config.translationEngine) {
        return (value === 0 || value === 1) ? singular : plural;
    }

    return config.translationEngine.npgettext(context, singular, plural, value);
};


export const interpolate = (format: string, ...args: any[]): string => {
    if (args.length > 1 && typeof args[0] !== 'object') {
        // add warning if positional args are used
        // translators cannot move arguments around to provide better translations
    }

    return Jed.sprintf(format, ...args);
};
