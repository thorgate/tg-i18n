// @flow
import is from 'is';


export type LocaleCatalogueType = {
    [string]: string,
}

type ConfigType = {
    domain: string,
    activeLanguage: ?string,
    defaultLanguage: ?string,
    logger: any,
    localeData: LocaleCatalogueType,
    onLanguageChange: ?(string) => void,
};

let cfg: ConfigType = {
    domain: 'messages',
    activeLanguage: null,
    defaultLanguage: null,
    logger: console,
    localeData: {},
    onLanguageChange: null,
};

export const setConfig = (key: string, val: string) => {
    cfg = {
        ...cfg,
        [key]: val,
    };
};

export const getConfig = (key: string) => {
    let res = cfg[key];

    if (key === 'activeLanguage' || key === 'defaultLanguage') {
        if (is.fn(res)) {
            res = res();
        }
    }

    return res;
};

export const getLogger = () => cfg.logger;

export const onLanguageChange = (languageCode: string): void => {
    setConfig('activeLanguage', languageCode);

    if (cfg.onLanguageChange) {
        cfg.onLanguageChange(languageCode);
    }
};
