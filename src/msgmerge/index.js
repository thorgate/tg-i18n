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


function fillLanguageInfo(language): CatalogueHeaders {
    const pluralData: {
        code: string,
        name: string,
        numPlurals: number,
        pluralForm: string,
    } = plurals[language];

    return {
        language: pluralData.code,
        'language-team': `${pluralData.name} <LL@li.org>`,
        'plural-forms': pluralData.pluralForm,
    };
}


function mergeHeader(reference: CatalogueType, definitions: CatalogueType, options: MergeOptionType): CatalogueType {
    // Use defined language to select correct plural form
    const { language } = options;

    // Create empty translation object
    const output = (gettextParser.po.parse(''): CatalogueType);

    output.charset = reference.charset;

    const headers = {
        ...DefaultHeader,
        ...fillLanguageInfo(language),
        ...reference.headers || {},
        ...definitions.headers || {},
    };

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
        definitions.translations && definitions.translations[''] &&
        definitions.translations[''][''].comments && definitions.translations[''][''].comments.translator
    );
    if (hasHeaderComment) {
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


function getNumPluralsFromCatalogue(catalogue: CatalogueType): number {
    if (!(catalogue.headers && catalogue.headers['plural-forms'])) {
        return 2;
    }

    const defaultPlurals = 2;

    if (!catalogue.headers) {
        return defaultPlurals;
    }

    const pluralForms = catalogue.headers['plural-forms'];
    if (!pluralForms) {
        return defaultPlurals;
    }

    const match = pluralForms.match(/nplurals[ ]?=[ ]?(\d+).*/);

    if (match) {
        return Number(match[1]);
    }

    return defaultPlurals;
}


function getMessageFromCatalogue(catalogue: CatalogueType, context: string, msgid: string): ?TranslationType {
    if (!catalogue.translations) {
        return null;
    }

    const contextCatalogue = catalogue.translations[context];
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
 * @param ref - Po/Pot file containing new translations.
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


export function merge(reference: CatalogueType, definitions: CatalogueType, options: MergeOptionType) {
    const output = mergeHeader(reference, definitions, options);
    mergeMessages(reference, definitions, output);
    return output;
}


export function toString(catalogue: CatalogueType): string {
    let fileData = (gettextParser.po.compile(catalogue).toString('utf-8'): string);

    fileData = fileData.split('\n').reduce((result, line) => (
        result.concat([line.trimRight()])
    ), []).join('\n');

    return `${fileData}\n`;
}


export function parse(fileData: string): CatalogueType {
    return gettextParser.po.parse(fileData);
}


export function parseFile(source: string, encoding: string = 'utf8'): CatalogueType {
    return gettextParser.po.parse(fs.readFileSync(source, { encoding }));
}
