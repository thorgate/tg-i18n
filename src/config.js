import is from 'is';


const cfg = {
    domain: 'django',
    activeLanguage: null,
    languageCode: null,
    logger: console,
    localeData: {},
    onLanguageChange: () => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    }
};

export const setConfig = (key, val) => {
    cfg[key] = val;
};

export const getConfig = (key) => {
    let res = cfg[key];

    if (key === 'activeLanguage' || key === 'languageCode') {
        if (is.fn(res)) {
            res = res();
        }
    }

    return res;
};

export const getLogger = () => {
    return cfg.logger;
};

export const onLanguageChange = (newLanguage) => {
    return cfg.onLanguageChange(newLanguage);
};
