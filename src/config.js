const cfg = {
    domain: 'django',
    activeLanguage: null,
    languageCode: null,
    logger: console,
    localeData: {}
};

export const setConfig = (key, val) => {
    cfg[key] = val;
};

export const getConfig = (key) => {
    return cfg[key];
};

export const getLogger = () => {
    return cfg.logger;
};
