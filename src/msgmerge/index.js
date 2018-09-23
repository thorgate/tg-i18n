// @flow
import fs from 'fs';
import gettextParser from 'gettext-parser';

import { HeaderKeyOrder, makeArray } from './utils';

import plurals from '../plurals.json';


export type MergeOptionType = {
    language: string,
};

export type TranslationType = {
    msgctxt?: string,
    msgid: string,
    msgid_plural?: string,
    msgstr: Array<string>,
    comments: {
        translator?: string,
        reference?: string,
        extracted?: string,
        flag?: string,
        previous?: string,
    },
};

export type CatalogueHeaders = {
    'content-type'?: string,
    'project-id-version'?: string,
    'report-msgid-bugs-to'?: string,
    'pot-creation-date'?: string,
    'po-revision-date'?: string,
    'last-translator'?: string,
    'language-team'?: string,
    'language'?: string,
    'mime-version'?: string,
    'content-transfer-encoding'?: string,
    'plural-forms'?: string
};

export type CatalogueType = {
    charset: string,
    headers?: CatalogueHeaders,

    translations: {
        [string]: {
            [string]: TranslationType,
        },
    },
};

const DefaultHeader: CatalogueHeaders = {
    'content-type': 'text/plain; charset=UTF-8',
    'project-id-version': 'PACKAGE VERSION',
    'report-msgid-bugs-to': '',
    'pot-creation-date': 'YEAR-MO-DA HO:MI+ZONE',
    'po-revision-date': 'YEAR-MO-DA HO:MI+ZONE',
    'last-translator': 'FULL NAME <EMAIL@ADDRESS>',
    'language-team': 'LANGUAGE <LL@li.org>',
    language: '',
    'mime-version': '1.0',
    'content-transfer-encoding': 'Content-Transfer-Encoding',
};

const DefaultHeaderComment = [
    'SOME DESCRIPTIVE TITLE.',
    'Copyright (C) YEAR THE PACKAGE\'S COPYRIGHT HOLDER',
    'This file is distributed under the same license as the PACKAGE package.',
    'FIRST AUTHOR <EMAIL@ADDRESS>, YEAR.',
    '',
].join('\n');


/**
 * Get language, language-team and plural-forms from `plurals.json`
 * @param {MergeOptionType} options - Merge options
 * @returns {CatalogueHeaders} - Returns language info from `plurals.json`
 */
function fillLanguageInfo(options: MergeOptionType): CatalogueHeaders {
    // Use defined language to select correct plural form
    const { language = '' } = options;

    const languageData: {
        code: string,
        name: string,
        numPlurals: number,
        pluralForm: string,
    } = plurals[language];

    // Return empty language info if language code is not defined
    if (!languageData) {
        return {};
    }

    return {
        language: languageData.code,
        'language-team': `${languageData.name} <LL@li.org>`,
        'plural-forms': languageData.pluralForm,
    };
}


/**
 * Create new
 * @param {CatalogueType} reference - Reference .pot/.po file containing new translations
 * @param {CatalogueType} definitions - Definitions .pot/.po file containing existing translations
 * @param {MergeOptionType} options
 * @returns {CatalogueType} - Generated
 */
function mergeHeader(reference: CatalogueType, definitions: CatalogueType, options: MergeOptionType): CatalogueType {
    // Create empty translation object
    const output = (gettextParser.po.parse(''): CatalogueType);

    // Copy charset from the reference file
    output.charset = reference.charset;

    // Create new headers
    const headers = {
        ...DefaultHeader,
        ...fillLanguageInfo(options),
        ...reference.headers || {},
        ...definitions.headers || {},
    };

    // Copy reference .pot creation date, other attributes will used from definitions file
    if (reference.headers && reference.headers['pot-creation-date']) {
        headers['pot-creation-date'] = reference.headers['pot-creation-date'];
    }

    // At-least try to preserve some order
    output.headers = HeaderKeyOrder.reduce((result, key) => {
        result[key] = headers[key];
        return result;
    }, {});

    let translator = DefaultHeaderComment;
    const hasHeaderComment = (
        definitions.translations && definitions.translations[''] && definitions.translations['']['']
        && definitions.translations['']['']?.comments?.translator
    );
    if (hasHeaderComment) {
        // eslint-disable-next-line prefer-destructuring
        translator = definitions.translations[''][''].comments.translator;
    }

    // Copy comments over from definition or use defaults
    output.translations = {
        '': {
            '': {
                msgid: '',
                msgstr: [''],
                comments: {
                    translator,
                },
            },
        },
    };

    return output;
}


/**
 * Get number of plural forms from catalogue header
 * @param {CatalogueType} catalogue - Translation catalogue object
 * @returns {number} - Number of plural forms or default
 */
function getNumPluralsFromCatalogue(catalogue: CatalogueType): number {
    const defaultPlurals = 2;

    const headers = catalogue?.headers || {};
    const pluralForms = headers['plural-forms'];

    if (!pluralForms) {
        return defaultPlurals;
    }

    const match = pluralForms.match(/nplurals[ ]?=[ ]?(\d+);.*/);

    if (match) {
        return Number(match[1]);
    }

    return defaultPlurals;
}


function getMessageFromCatalogue(catalogue: CatalogueType, context: string, msgid: string): ?TranslationType {
    const translations = catalogue?.translations || {};
    const contextCatalogue = translations[context];

    if (!contextCatalogue) {
        return null;
    }

    const message = contextCatalogue[msgid];

    return message || null;
}


function mergeMessage(refMessage: TranslationType, defMessage: ?TranslationType, out: CatalogueType) {
    const message: TranslationType = {
        ...refMessage,
    };

    if (defMessage) {
        message.msgstr = defMessage.msgstr;

        if (defMessage.comments && defMessage.comments.translator) {
            message.comments = {
                ...message.comments || {},
                translator: defMessage.comments.translator,
            };
        }
    }

    const numPlurals = getNumPluralsFromCatalogue(out);
    const delta = numPlurals - message.msgstr.length;

    if (delta > 0) {
        message.msgstr.push(...makeArray('', delta));
    } else if (delta < 0) {
        message.msgstr = message.msgstr.slice(0, delta);
    }

    out.translations = {
        ...out.translations,
        [message.msgctxt || '']: {
            ...out.translations[message.msgctxt || ''],

            [message.msgid]: message,
        },
    };
}


/**
 * Merge messages from reference and definitions file into output file.
 *
 * Comments are preserved in definitions file. Extracted comments and
 *  location references are taken from reference file.
 *
 * @param ref - Po/Pot file containing new translations
 * @param def - Existing Po/Pot file
 * @param out - Output Po file
 */
function mergeMessages(ref: CatalogueType, def: CatalogueType, out: CatalogueType) {
    Object.keys(ref.translations).forEach((context) => {
        Object.keys(ref.translations[context]).forEach((msgid) => {
            const defMessage = getMessageFromCatalogue(def, context, msgid);
            mergeMessage(ref.translations[context][msgid], defMessage, out);
        });
    });
}


/**
 * Merge messages from reference and definitions file into output file.
 *
 * Comments are preserved in definitions file. Extracted comments and
 *  location references are taken from reference file.
 *
 * @param {CatalogueType} reference - Po/Pot file containing new translations
 * @param {CatalogueType} definitions - Existing Po/Pot file
 * @param {MergeOptionType} options - Merge options
 * @returns {CatalogueType}
 */
export function merge(reference: CatalogueType, definitions: CatalogueType, options: MergeOptionType) {
    const output = mergeHeader(reference, definitions, options);
    mergeMessages(reference, definitions, output);
    return output;
}


/**
 * Convert catalogue to string. Encoding is based on catalogue.charset.
 *  Line endings will be trimmed.
 *
 * @param {CatalogueType} catalogue
 * @returns {string}
 */
export function toString(catalogue: CatalogueType): string {
    let fileData = (gettextParser.po.compile(catalogue).toString(catalogue.charset): string);

    fileData = fileData.split('\n').reduce((result, line) => (
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
export function parse(fileData: string): CatalogueType {
    return gettextParser.po.parse(fileData);
}


/**
 * Parse {@link CatalogueType} from file.
 *  Parsing is done with {@link https://github.com/smhg/gettext-parser|gettextParser.po.parse}
 *
 * @param {string} source - Path to .po/.pot file
 * @returns {CatalogueType} - Parsed {@link CatalogueType}
 */
export function parseFile(source: string): CatalogueType {
    return gettextParser.po.parse(fs.readFileSync(source));
}
