# tg-i18n

> Internal tool to use translations in React that are loaded from our Django backend

Example init:
    
    // i18n.js
    import makeI18n, {setConfig} from 'tg-i18n';
    
    const LANGUAGE_CODE = 'en';
    const LOCALE_DATA = {
        '': {
            'domain': 'djangojs',
            // locale header
        },
        
        'en': {
            // translation strings
        },
    }; 
    
    setConfig('languageCode', LANGUAGE_CODE);
    setConfig('localeData', LOCALE_DATA || {});
    
    const i18n = makeI18n();
    
    export const gettext = i18n.gettext;
    export const pgettext = i18n.pgettext;
    export const ngettext = i18n.ngettext;
    export const npgettext = i18n.npgettext;
    export const interpolate = i18n.interpolate;
    
    export {setConfig} from 'tg-i18n';
    export default i18n;

Using:
    
    import i18n, {gettext} from './i18n';
    
    i18n.setActiveLang('en');
    
    console.log(gettext('Test string');
    
