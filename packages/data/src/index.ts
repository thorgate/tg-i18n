export interface LanguagePluralForm {
    'code': string,
    'name': string,
    'numPlurals': number,
    'pluralForm': string
}


export interface PluralForms {
    [languageCode: string]: LanguagePluralForm,
}


export const plurals: PluralForms = {
    af: {
        code: 'af',
        name: 'Afrikaans',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    ar: {
        code: 'ar',
        name: 'Arabic',
        numPlurals: 6,
        pluralForm: 'nplurals=6; plural=n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && ' +
            'n%100<=10 ? 3 : n%100>=11 && n%100<=99 ? 4 : 5;'
    },
    ast: {
        code: 'ast',
        name: 'Asturian',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    az: {
        code: 'az',
        name: 'Azerbaijani',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    be: {
        code: 'be',
        name: 'Belarusian',
        numPlurals: 4,
        pluralForm: 'nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && ' +
            '(n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);'
    },
    bg: {
        code: 'bg',
        name: 'Bulgarian',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    bn: {
        code: 'bn',
        name: 'Bengali',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    br: {
        code: 'br',
        name: 'Breton',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n > 1);'
    },
    bs: {
        code: 'bs',
        name: 'Bosnian',
        numPlurals: 3,
        pluralForm: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && ' +
            '(n%100<10 || n%100>=20) ? 1 : 2);'
    },
    ca: {
        code: 'ca',
        name: 'Catalan',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    cs: {
        code: 'cs',
        name: 'Czech',
        numPlurals: 3,
        pluralForm: 'nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;'
    },
    cy: {
        code: 'cy',
        name: 'Welsh',
        numPlurals: 4,
        pluralForm: 'nplurals=4; plural=(n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3;'
    },
    da: {
        code: 'da',
        name: 'Danish',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    de: {
        code: 'de',
        name: 'German',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    dsb: {
        code: 'dsb',
        name: 'Lower Sorbian',
        numPlurals: 4,
        pluralForm: 'nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3);'
    },
    el: {
        code: 'el',
        name: 'Greek',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    en: {
        code: 'en',
        name: '',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    en_AU: {
        code: 'en_AU',
        name: 'English (Australia)',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    en_GB: {
        code: 'en_GB',
        name: 'English (United Kingdom)',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    eo: {
        code: 'eo',
        name: 'Esperanto',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    es: {
        code: 'es',
        name: 'Spanish',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    es_AR: {
        code: 'es_AR',
        name: 'Spanish (Argentina)',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    es_CO: {
        code: 'es_CO',
        name: 'Spanish (Colombia)',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    es_MX: {
        code: 'es_MX',
        name: 'Spanish (Mexico)',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    es_VE: {
        code: 'es_VE',
        name: 'Spanish (Venezuela)',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    et: {
        code: 'et',
        name: 'Estonian',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    eu: {
        code: 'eu',
        name: 'Basque',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    fa: {
        code: 'fa',
        name: 'Persian',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    fi: {
        code: 'fi',
        name: 'Finnish',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    fr: {
        code: 'fr',
        name: 'French',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n > 1);'
    },
    fy: {
        code: 'fy',
        name: 'Western Frisian',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    ga: {
        code: 'ga',
        name: 'Irish',
        numPlurals: 5,
        pluralForm: 'nplurals=5; plural=(n==1 ? 0 : n==2 ? 1 : n<7 ? 2 : n<11 ? 3 : 4);'
    },
    gd: {
        code: 'gd',
        name: 'Gaelic, Scottish',
        numPlurals: 4,
        pluralForm: 'nplurals=4; plural=(n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3;'
    },
    gl: {
        code: 'gl',
        name: 'Galician',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    he: {
        code: 'he',
        name: 'Hebrew',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    hi: {
        code: 'hi',
        name: 'Hindi',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    hr: {
        code: 'hr',
        name: 'Croatian',
        numPlurals: 3,
        pluralForm: 'nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && ' +
            'n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;'
    },
    hsb: {
        code: 'hsb',
        name: 'Upper Sorbian',
        numPlurals: 4,
        pluralForm: 'nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3);'
    },
    hu: {
        code: 'hu',
        name: 'Hungarian',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    ia: {
        code: 'ia',
        name: 'Interlingua',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    id: {
        code: 'id',
        name: 'Indonesian',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    io: {
        code: 'io',
        name: 'Ido',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    is: {
        code: 'is',
        name: 'Icelandic',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n % 10 != 1 || n % 100 == 11);'
    },
    it: {
        code: 'it',
        name: 'Italian',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    ja: {
        code: 'ja',
        name: 'Japanese',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    ka: {
        code: 'ka',
        name: 'Georgian',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    kk: {
        code: 'kk',
        name: 'Kazakh',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    km: {
        code: 'km',
        name: 'Khmer',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    kn: {
        code: 'kn',
        name: 'Kannada',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    ko: {
        code: 'ko',
        name: 'Korean',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    lb: {
        code: 'lb',
        name: 'Luxembourgish',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    lt: {
        code: 'lt',
        name: 'Lithuanian',
        numPlurals: 3,
        pluralForm: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2);'
    },
    lv: {
        code: 'lv',
        name: 'Latvian',
        numPlurals: 3,
        pluralForm: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);'
    },
    mk: {
        code: 'mk',
        name: 'Macedonian',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n % 10 == 1 && n % 100 != 11) ? 0 : 1;'
    },
    ml: {
        code: 'ml',
        name: 'Malayalam',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    mn: {
        code: 'mn',
        name: 'Mongolian',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    mr: {
        code: 'mr',
        name: 'Marathi',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    my: {
        code: 'my',
        name: 'Burmese',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    nb: {
        code: 'nb',
        name: 'Norwegian Bokm\u00e5l',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    ne: {
        code: 'ne',
        name: 'Nepali',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    nl: {
        code: 'nl',
        name: 'Dutch',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    nn: {
        code: 'nn',
        name: 'Norwegian Nynorsk',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    os: {
        code: 'os',
        name: 'Ossetic',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    pa: {
        code: 'pa',
        name: 'Panjabi (Punjabi)',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    pl: {
        code: 'pl',
        name: 'Polish',
        numPlurals: 4,
        pluralForm: 'nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>=14) ? 1 : n!=1 && ' +
            '(n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);'
    },
    pt: {
        code: 'pt',
        name: 'Portuguese',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    pt_BR: {
        code: 'pt_BR',
        name: 'Portuguese (Brazil)',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n > 1);'
    },
    ro: {
        code: 'ro',
        name: 'Romanian',
        numPlurals: 3,
        pluralForm: 'nplurals=3; plural=(n==1?0:(((n%100>19)||((n%100==0)&&(n!=0)))?2:1));'
    },
    ru: {
        code: 'ru',
        name: 'Russian',
        numPlurals: 4,
        pluralForm: 'nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? ' +
            '1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);'
    },
    sk: {
        code: 'sk',
        name: 'Slovak',
        numPlurals: 3,
        pluralForm: 'nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;'
    },
    sl: {
        code: 'sl',
        name: 'Slovenian',
        numPlurals: 4,
        pluralForm: 'nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3);'
    },
    sq: {
        code: 'sq',
        name: 'Albanian',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    sr: {
        code: 'sr',
        name: 'Serbian',
        numPlurals: 3,
        pluralForm: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && ' +
            '(n%100<10 || n%100>=20) ? 1 : 2);'
    },
    'sr@latin': {
        code: 'sr@latin',
        name: 'Serbian (Latin)',
        numPlurals: 3,
        pluralForm: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && ' +
            '(n%100<10 || n%100>=20) ? 1 : 2);'
    },
    sv: {
        code: 'sv',
        name: 'Swedish',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    sw: {
        code: 'sw',
        name: 'Swahili',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    ta: {
        code: 'ta',
        name: 'Tamil',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    te: {
        code: 'te',
        name: 'Telugu',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    th: {
        code: 'th',
        name: 'Thai',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    tr: {
        code: 'tr',
        name: 'Turkish',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n > 1);'
    },
    tt: {
        code: 'tt',
        name: 'Tatar',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    udm: {
        code: 'udm',
        name: 'Udmurt',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    uk: {
        code: 'uk',
        name: 'Ukrainian',
        numPlurals: 3,
        pluralForm: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && ' +
            '(n%100<10 || n%100>=20) ? 1 : 2);'
    },
    ur: {
        code: 'ur',
        name: 'Urdu',
        numPlurals: 2,
        pluralForm: 'nplurals=2; plural=(n != 1);'
    },
    vi: {
        code: 'vi',
        name: 'Vietnamese',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    zh_CN: {
        code: 'zh_CN',
        name: 'Chinese (China)',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    },
    zh_TW: {
        code: 'zh_TW',
        name: 'Chinese (Taiwan)',
        numPlurals: 1,
        pluralForm: 'nplurals=1; plural=0;'
    }
};
