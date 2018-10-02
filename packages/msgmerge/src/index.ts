import {
    CatalogueHeaders, CatalogueType, compilePo, DefaultFileMode, DefaultHeaderComment,
    getDefaultHeaders, getLanguageHeaders,
    hasKey, HeaderKeyOrder, makeArray, parsePoFile, TranslationObject,
} from '@thorgate/i18n-utils';
import fs from 'fs';


export interface MergeOptions {
    language?: string,
}


export type MessageMergeOptions = MergeOptions & {
    reference: CatalogueType,
    definition: CatalogueType,
};


export class MessageMerge {
    protected _reference: CatalogueType;
    protected _definition: CatalogueType;
    protected _output: CatalogueType;
    protected _language: string | null;

    constructor(options: MessageMergeOptions) {
        this._reference = options.reference;
        this._definition = options.definition;
        this._language = options.language || null;

        this._output = MessageMerge.createInitialCatalogue(this.reference.charset);
    }

    public get languageOverride() {
        return this._language;
    }

    public set languageOverride(language: string | null) {
        this._language = language;
    }

    public get reference() {
        return this._reference;
    }

    public set reference(reference: CatalogueType) {
        this._reference = reference;
    }

    public get definition() {
        return this._definition;
    }

    public set definition(definition: CatalogueType) {
        this._definition = definition;
    }

    public process() {
        const referenceHasLanguage = this.reference && this.reference.headers && this.reference.headers.language;
        const definitionHasLanguage = this.definition && this.definition.headers && this.definition.headers.language;

        if (!referenceHasLanguage && !definitionHasLanguage && !this.languageOverride) {
            throw new Error('Missing language declaration');
        }

        this.mergeHeader();

        // Merge messages
        Object.keys(this.reference.translations).forEach((context) => {
            Object.keys(this.reference.translations[context]).forEach((msgid) => {
                this.mergeMessage(context, msgid);
            });
        });

        return this._output;
    }

    protected get numPlurals(): number {
        const defaultPlurals = 2;

        const headers = this._output.headers || {};
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

    /**
     * Get language code for new .po header.
     *  Respect following order: reference.headers.language < definitions.headers.language < options.language
     */
    protected get languageCode(): string {
        let language = '';

        if (this.reference.headers && this.reference.headers.language) {
            language = this.reference.headers.language;
        }

        if (this.definition.headers && this.definition.headers.language) {
            language = this.definition.headers.language;
        }

        if (typeof this.languageOverride === 'string') {
            language = this.languageOverride;
        }

        return language as string;
    }

    /**
     * Create new Translation catalogue by merging default, reference and definition headers.
     *  Respect following order: default < defaultLanguage < reference < definition
     */
    protected mergeHeader() {
        // Create empty translation object
        this._output = MessageMerge.createInitialCatalogue(this.reference.charset);

        // Create new headers
        let headers: CatalogueHeaders = {
            ...getDefaultHeaders(true),
            ...getLanguageHeaders(this.languageCode, true),
            ...this.reference.headers || {},
            ...this.definition.headers || {},
        };

        // Copy reference .pot creation date, other attributes will used from definitions file
        if (this.reference.headers && this.reference.headers['pot-creation-date']) {
            headers['pot-creation-date'] = this.reference.headers['pot-creation-date'];
        }

        // language, language-team & plural forms will be overwritten using languageOverride
        if (typeof this.languageOverride === 'string') {
            headers = {
                ...headers,
                ...getLanguageHeaders(this.languageOverride, true),
            }
        }

        // At-least try to preserve some order
        this._output.headers = HeaderKeyOrder.reduce((result: CatalogueHeaders, key: string) => {
            result[key] = headers[key];
            return result;
        }, {} as CatalogueHeaders);

        let translator = DefaultHeaderComment;
        const hasHeaderComment = (
            hasKey(this.definition, 'translations')
            && hasKey(this.definition.translations, '')
            && hasKey(this.definition.translations[''], '')
            && hasKey(this.definition.translations[''][''], 'comments')
            && hasKey(this.definition.translations[''][''].comments, 'translator')
        );

        if (hasHeaderComment) {
            translator = (this.definition.translations[''][''].comments!.translator as string);
        }

        // Copy header comments over from definition or use defaults
        this._output.translations = {
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
    }

    protected getDefinitionMessage(context: string, msgid: string): TranslationObject | null {
        const translations = this.definition.translations || {};
        const contextCatalogue = translations[context];

        if (!contextCatalogue) {
            return null;
        }

        const message = contextCatalogue[msgid];

        return message || null;
    }

    protected mergeMessage(context: string, msgid: string) {
        const referenceMessage = this.reference.translations[context][msgid];
        const definitionMessage = this.getDefinitionMessage(context, msgid);

        const message: TranslationObject = {
            ...referenceMessage,
        };

        if (definitionMessage) {
            message.msgstr = definitionMessage.msgstr;

            if (definitionMessage.comments && definitionMessage.comments.translator) {
                message.comments = {
                    ...message.comments || {},
                    translator: definitionMessage.comments.translator,
                };
            }
        }

        const numPlurals = this.numPlurals;
        const delta = numPlurals - message.msgstr.length;

        if (delta > 0) {
            message.msgstr.push(...makeArray('', delta));
        } else if (delta < 0) {
            message.msgstr = message.msgstr.slice(0, delta);
        }

        if (this._output.translations === undefined) {
            this._output.translations = {};
        }

        if (this._output.translations[message.msgctxt || ''] === undefined) {
            this._output.translations[message.msgctxt || ''] = {};
        }

        // Update message
        this._output.translations[message.msgctxt || ''][message.msgid] = message;
    }


    protected static createInitialCatalogue(charset: string = 'utf8'): CatalogueType {
        return {
            charset,
            translations: {},
        };
    }
}


/**
 * Merge messages from reference and definitions catalogue into output catalogue.
 *
 * Comments are preserved in definitions file. Extracted comments and
 *  location references are taken from reference file.
 *
 * @param {CatalogueType} ref - Po/Pot catalogue containing new translations
 * @param {CatalogueType} def - Existing Po/Pot catalogue
 * @param {MessageMergeOptions} options - Merge options
 * @returns {CatalogueType}
 */
export function merge(ref: CatalogueType, def: CatalogueType, options: MergeOptions) {
    const msgMerge = new MessageMerge({
        reference: ref,
        definition: def,
        ...options
    });

    return msgMerge.process();
}


/**
 * Merge messages from reference and definitions file into output file.
 *
 * Comments are preserved in definitions file. Extracted comments and
 *  location references are taken from reference file.
 *
 * @param {string} ref - Po/Pot file containing new translations
 * @param {string} def - Existing Po/Pot file
 * @param {string} out - Output file
 * @param {MessageMergeOptions} options - Merge options
 */
export function mergeFile(ref: string, def: string, out: string, options: MergeOptions) {
    const msgMerge = new MessageMerge({
        reference: parsePoFile(ref),
        definition: parsePoFile(def),
        ...options
    });

    const catalogue = msgMerge.process();

    fs.writeFileSync(out, compilePo(catalogue), { mode: DefaultFileMode });
}
