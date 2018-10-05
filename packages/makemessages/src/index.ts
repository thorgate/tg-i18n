import {
    BaseMessages, BaseMessagesOptions, compilePo, DefaultFileMode, ExtractorHeaders,
    getDefaultHeaders, getLanguageDirectory, getLanguageHeaders,
    makeRecursivePath, parsePoFile,
} from '@thorgate/i18n-utils';
import * as msgmerge from '@thorgate/node-msgmerge';
import fs from 'fs';
import { GettextExtractor, JsExtractors } from 'gettext-extractor';


export interface MakeMessageOptions extends BaseMessagesOptions {
    path?: string;
    extensions?: string[];
    keepPot?: boolean;
}


export class Makemessages extends BaseMessages {
    protected _path: string;
    protected _extensions: string[];
    protected _keepPot: boolean;

    constructor(options: MakeMessageOptions = {}) {
        super(options);
        this._path = options.path || '.';
        this._extensions = options.extensions || ['js', 'jsx', 'ts', 'tsx'];
        this._keepPot = options.keepPot || false;
    }

    public get extensions() {
        return this._extensions;
    }

    public set extensions(extensions: string[]) {
        this._extensions = extensions;
    }

    public get keepPot() {
        return this._keepPot;
    }

    public set keepPot(keepPot: boolean) {
        this._keepPot = keepPot;
    }

    public get potFile() {
        return `${this.localeDir}/${this.domain}.pot`;
    }

    public get path() {
        return this._path;
    }

    public set path(path: string) {
        this._path = path;
    }

    public process() {
        super.process();

        // Ensure locale directory is created
        makeRecursivePath(this.localeDir);

        const extractor = this.processFiles();

        this.languages.forEach((language) => {
            this.processLanguage(extractor, language);
        });

        if (!this.keepPot) {
            fs.unlinkSync(this.potFile);
        }

        // Show stats for extracted messages
        extractor.printStats();
    }

    public getLanguageDirectory(language: string) {
        return getLanguageDirectory(this.localeDir, language);
    }

    protected validateConfig() {
        if (!fs.existsSync(this.path)) {
            throw new Error(`Path "${this.path}" does not exist`);
        }

        if (!this.extensions) {
            throw new Error('File extensions are undefined');
        }

        super.validateConfig();
    }

    protected processLanguage(extractor: GettextExtractor, language: string) {
        console.log(`Processing locale ${language}`);

        const languageDir = this.getLanguageDirectory(language);
        const poFile = `${languageDir}/${this.domain}.po`;
        const poHeader = {
            ...getLanguageHeaders(language),
            ...getDefaultHeaders(),
        } as ExtractorHeaders;

        const messages = extractor.getMessages();

        const invalidMessage = messages.find((message) => !message.text);
        const references = invalidMessage!.references;

        if (references) {
            throw new Error(`Message "" is invalid, used in files: ${references.join()}`);
        }

        extractor.savePotFile(this.potFile, poHeader);

        if (!fs.existsSync(poFile)) {
            makeRecursivePath(languageDir);
            extractor.savePotFile(poFile, poHeader);
        }

        // Merge generated .pot and .po files, store in string format
        const poContents = compilePo(
            msgmerge.merge(
                parsePoFile(this.potFile),
                parsePoFile(poFile),
                { language },
            ),
        );

        // Write to po file
        fs.writeFileSync(poFile, poContents, { mode: DefaultFileMode });
    }

    protected processFiles(): GettextExtractor {
        const commentOptions = {
            otherLineLeading: true,
        };
        const extractor = new GettextExtractor();
        extractor
            .createJsParser([
                JsExtractors.callExpression([
                    'gettextNoop', 'gettext', '[i18n].gettext', '[props.i18n].gettext', '[this.props.i18n].gettext',
                ], {
                    arguments: {
                        text: 0,
                    },
                    comments: commentOptions,
                }),
                JsExtractors.callExpression(['ngettext', '[i18n].ngettext'], {
                    arguments: {
                        text: 0,
                        textPlural: 1,
                    },
                    comments: commentOptions,
                }),
                JsExtractors.callExpression(['pgettext', '[i18n].pgettext'], {
                    arguments: {
                        context: 0,
                        text: 1,
                    },
                    comments: commentOptions,
                }),
                JsExtractors.callExpression(['ngettext', '[i18n].ngettext'], {
                    arguments: {
                        text: 0,
                        textPlural: 1,
                    },
                }),
                JsExtractors.callExpression(['npgettext', '[i18n].npgettext'], {
                    arguments: {
                        context: 0,
                        text: 1,
                        textPlural: 2,
                    },
                    comments: commentOptions,
                }),
            ])
            .parseFilesGlob(`${this.path}/**/*.@(${this.extensions.join('|')})`);

        return extractor;
    }
}
