const cfg = {
    domain: 'django',
    activeLanguage: null,
    languageCode: null,
    localeData: {}
};

export const setConfig = (key, val) => {
    cfg[key] = val;
};

export const getConfig = (key) => {
    return cfg[key];
};
