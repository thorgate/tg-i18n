import { plurals } from '@thorgate/i18n-data';
import { format } from 'date-fns';
import fs from 'fs';
import gettextParser from 'gettext-parser';
import path from 'path';


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


export interface TranslationObject {
    msgctxt?: string,
    msgid: string,
    msgid_plural?: string,
    msgstr: string[],
    comments?: {
        translator?: string,
        reference?: string,
        extracted?: string,
        flag?: string,
        previous?: string,
    },
}

export interface CatalogueLanguageHeaders {
    'language-team'?: string,
    'language'?: string,
    'plural-forms'?: string,

    [key: string]: any,
}

export interface CatalogueHeaders extends CatalogueLanguageHeaders {
    'content-type'?: string,
    'project-id-version'?: string,
    'report-msgid-bugs-to'?: string,
    'pot-creation-date'?: string,
    'po-revision-date'?: string,
    'last-translator'?: string,
    'mime-version'?: string,
    'content-transfer-encoding'?: string,
}

export interface CatalogueType {
    charset: string,
    headers?: CatalogueHeaders,

    translations: {
        [context: string]: {
            [key: string]: TranslationObject,
        },
    },
}


export interface ExtractorLanguageHeaders {
    'Language-Team': string,
    'Language': string,
    'Plural-Forms': string,

    [key: string]: any,
}


export interface ExtractorHeaders extends ExtractorLanguageHeaders {
    'Project-Id-Version': string,
    'Report-Msgid-Bugs-To': string,
    'POT-Creation-Date': string,
    'PO-Revision-Date': string,
    'Last-Translator': string,
    'MIME-Version': string,
    'Content-Transfer-Encoding': string,
    'Content-Type': string,
}


export type LanguageHeader = ExtractorLanguageHeaders | CatalogueLanguageHeaders;
export type PoHeaders = ExtractorHeaders | CatalogueHeaders;


export const DefaultDomain = 'messages';
export const DefaultLocaleDir = 'messages';
export const DefaultFileMode = 0o766;
export const DefaultHeaderComment = 'SOME DESCRIPTIVE TITLE.\n' +
    'Copyright (C) YEAR THE PACKAGE\'S COPYRIGHT HOLDER\n' +
    'This file is distributed under the same license as the PACKAGE package.\n' +
    'FIRST AUTHOR <EMAIL@ADDRESS>, YEAR.\n';


/**
 * Convert catalogue to string. Encoding is based on catalogue.charset.
 *  Compilation is done with {@link https://github.com/smhg/gettext-parser|gettextParser.po.compile}
 *  Line endings will be trimmed.
 *
 * @param {CatalogueType} catalogue
 * @returns {string}
 */
export function compilePo(catalogue: CatalogueType): string {
    let fileData = gettextParser.po.compile(catalogue).toString(catalogue.charset);

    fileData = fileData.split('\n').reduce((result: string[], line: string) => (
        result.concat([line.trimRight()])
    ), []).join('\n');

    return `${fileData}\n`;
}


/**
 * Parse {@link CatalogueType} from file data.
 *  Parsing is done with {@link https://github.com/smhg/gettext-parser|gettextParser.po.parse}
 *
 * @param {string} fileData - String containing .po/.pot file
 * @returns {CatalogueType} - Parsed {@link CatalogueType}
 */
export function parsePo(fileData: string | Buffer): CatalogueType {
    return gettextParser.po.parse(fileData);
}


/**
 * Parse {@link CatalogueType} from file.
 *  Parsing is done with {@link https://github.com/smhg/gettext-parser|gettextParser.po.parse}
 *
 * @param {string} source - Path to .po/.pot file
 * @returns {CatalogueType} - Parsed {@link CatalogueType}
 */
export function parsePoFile(source: string): CatalogueType {
    return gettextParser.po.parse(fs.readFileSync(source));
}


/**
 * Get directories in `dir`.
 *
 * @param {string} dir - Directory
 * @returns {string[]} - List of directories
 */
export function getDirectories(dir: string): string[] {
    return fs.readdirSync(dir).filter((dirItem) => (
        fs.statSync(path.join(dir, dirItem)).isDirectory()
    ));
}


export function makeRecursivePath(dir: string): void {
    const separator = (path.sep as string);
    let fullPath = '';
    dir.split(separator).forEach((fragment) => {

        if (fullPath === '') {
            fullPath = fragment;
        } else {
            fullPath = `${fullPath}${separator}${fragment}`;
        }

        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath);
        }
    });
}


export const HeaderKeyOrder = [
    'content-type',
    'project-id-version',
    'report-msgid-bugs-to',
    'pot-creation-date',
    'po-revision-date',
    'last-translator',
    'language-team',
    'language',
    'mime-version',
    'content-transfer-encoding',
    'plural-forms',
];


export function hasKey<O>(obj: O, key: string): key is Extract<keyof O, string> {
    return key in obj
}


export function makeArray<T>(value: T, length: number): T[] {
    const array = [];
    let i = 0;

    while (i < length) {
        array.push(value);

        i += 1;
    }

    return array;
}


export function getLanguageHeaders(language: string, asCatalogue: boolean = false): LanguageHeader {
    if (!hasKey(plurals, language)) {
        throw new Error(`"${language}" missing a plural form definition`);
    }

    const languageData = plurals[language];

    const languageHeader: ExtractorLanguageHeaders = {
        'Language-Team': `${languageData.name} <LL@li.org>`,
        Language: languageData.code,
        'Plural-Forms': languageData.pluralForm,
    };

    if (!asCatalogue) {
        return languageHeader;
    }

    const result: CatalogueLanguageHeaders = {};
    Object.keys(languageHeader).forEach((key: string) => {
        result[key.toLowerCase()] = languageHeader[key];
    });

    return result;
}


export function getDefaultHeaders(asCatalogue: boolean = false): PoHeaders {
    const headers: ExtractorHeaders = {
        'Project-Id-Version': 'PACKAGE VERSION',
        'Report-Msgid-Bugs-To': '',
        'POT-Creation-Date': format(new Date(), 'YYYY-MM-DD HH:mmZZ'),
        'PO-Revision-Date': format(new Date(), 'YYYY-MM-DD HH:mmZZ'),
        'Last-Translator': 'FULL NAME <EMAIL@ADDRESS>',
        'Language-Team': ' <LL@li.org>',
        Language: '',
        'MIME-Version': '1.0',
        'Content-Transfer-Encoding': 'Content-Transfer-Encoding',
        'Content-Type': 'text/plain; charset=utf-8',
        'Plural-Forms': 'nplurals=NUM_PLURALS; EXPRESSION',
    };

    if (!asCatalogue) {
        return headers;
    }

    const result: CatalogueHeaders = {};
    Object.keys(headers).forEach((key: string) => {
        result[key.toLowerCase()] = headers[key];
    });

    return result;
}


export function getValidLocales(dir: string, locales: string[] = [], excludes: string[] = [], all: boolean = false) {
    const localesExist = fs.existsSync(dir);

    let languages: string[] = [];

    if (all && !localesExist) {
        throw new Error(
            `Locale directory "${dir}" does not exist. Cannot use "all" option.`
        );
    }

    if (localesExist) {
        languages = getDirectories(dir);
    }

    languages = languages.filter((language) => !excludes.includes(language));

    // Add specified locales
    locales.forEach((locale) => {
        if (!languages.includes(locale)) {
            languages.push(locale);
        }
    });

    languages.sort((a, b) => (
        a.localeCompare(b)
    ));

    return languages;
}

export function getLanguageDirectory(localeDir: string, language: string) {
    return `${localeDir}/${language}/LC_MESSAGES`;
}

export interface BaseMessagesOptions {
    domain?: string;
    locales?: string[];
    excludes?: string[];
    all?: boolean;
    localeDir?: string;
}

export class BaseMessages {
    protected _localeDir: string;
    protected _domain: string;
    protected _all: boolean;
    protected _locales: string[];
    protected _excludes: string[];

    protected _languages: string[];

    constructor(options: BaseMessagesOptions = {}) {
        this._domain = options.domain || DefaultDomain;
        this._localeDir = options.localeDir || DefaultLocaleDir;

        this._all = options.all || false;
        this._locales = options.locales || [];
        this._excludes = options.locales || [];

        this._languages = [];
    }

    public get all() {
        return this._all;
    }

    public set all(all: boolean) {
        this._all = all;
        this.validateLocales();
    }

    public get domain() {
        return this._domain;
    }

    public set domain(domain: string) {
        this._domain = domain;
    }

    public get locales() {
        return this._locales;
    }

    public get excludes() {
        return this._excludes;
    }

    public get localeDir() {
        return this._localeDir;
    }

    public set localeDir(localeDir: string) {
        this._localeDir = localeDir;
    }

    public get languages() {
        return this._languages;
    }

    public addExclusion(exclude: string) {
        if (!hasKey(plurals, exclude)) {
            throw new Error('Locale not supported');
        }

        if (!this._excludes.includes(exclude)) {
            this._excludes.push(exclude);
        }

        this.validateLocales();
    }

    public removeExclusion(locale: string) {
        this._excludes = this._excludes.filter((code) => code !== locale);
        this.validateLocales();
    }

    public addLocale(locale: string) {
        if (!hasKey(plurals, locale)) {
            throw new Error('Locale not supported');
        }

        if (!this._locales.includes(locale)) {
            this._locales.push(locale);
        }

        this.validateLocales();
    }

    public removeLocale(locale: string) {
        this._locales = this._locales.filter((code) => code !== locale);
        this.validateLocales();
    }

    public validateLocales(): void {
        this._languages = getValidLocales(this.localeDir, this.locales, this.excludes, this.all);
    }

    public getLanguageDirectory(language: string) {
        return getLanguageDirectory(this.localeDir, language);
    }

    public process() {
        this.validateConfig();
    }

    protected validateConfig() {
        if (!this.domain) {
            throw new Error('Domain name is undefined');
        }

        if (!this.localeDir) {
            throw new Error('Locale destination directory is undefined');
        }

        this.validateLocales();

        if (!this.languages || (Array.isArray(this.languages) && !this.languages.length)) {
            throw new Error('No locales to process');
        }
    }
}
