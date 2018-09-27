import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { GettextExtractor, JsExtractors } from 'gettext-extractor';
import { IMessage } from 'gettext-extractor/dist/builder';

import * as msgmerge from './msgmerge';
import { MakeMessageOptions } from './types';
import { hasKey } from './utils';
import * as plurals from './plurals.json';


const getDirectories = (p: string) => (
    fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory())
);

function getDefaultHeader(language: string) {
    if (!hasKey(plurals, language)) {
        throw new Error(`"${language}" missing a plural form definition`);
    }

    const languageData = plurals[language];

    return {
        'Project-Id-Version': 'PACKAGE VERSION',
        'Report-Msgid-Bugs-To': '',
        'POT-Creation-Date': format(new Date(), 'YYYY-MM-DD HH:mmZZ'),
        'PO-Revision-Date': format(new Date(), 'YYYY-MM-DD HH:mmZZ'),
        'Last-Translator': 'FULL NAME <EMAIL@ADDRESS>',
        'Language-Team': `${languageData.name} <LL@li.org>`,
        Language: languageData.code,
        'MIME-Version': '1.0',
        'Content-Transfer-Encoding': 'Content-Transfer-Encoding',
        'Content-Type': 'text/plain; charset=utf-8',
        'Plural-Forms': languageData.pluralForm,
    };
}


function mkdirRecursiveSync(dir: string) {
    const separator = (path.sep as string);
    let paths = dir.split(separator);
    let fullPath = '';
    paths.forEach((path) => {

        if (fullPath === '') {
            fullPath = path;
        } else {
            fullPath = `${fullPath}${separator}${path}`;
        }

        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath);
        }
    });
}


class Makemessages {
    localeDir: string;
    domain: string;
    path: string;
    extensions: string[];
    keepPot: boolean;
    potFile: string;
    languages: string[];

    constructor(options: MakeMessageOptions) {
        this.domain = options.domain;
        this.path = options.path;
        this.extensions = options.extension;
        this.localeDir = options['locale-dir'];
        this.keepPot = options['keep-pot'];

        this.potFile = `${this.localeDir}/${this.domain}.pot`;

        this.languages = this.getValidLanguages(
            options.locale, options.exclude, options.all,
        );

        this.validateConfig();
    }

    validateConfig() {
        if (!fs.existsSync(this.path)) {
            throw new Error(`Path "${this.path}" does not exist`);
        }

        if (!this.domain) {
            throw new Error('Domain name is undefined');
        }

        if (!this.extensions) {
            throw new Error('File extensions are undefined');
        }

        if (!this.localeDir) {
            throw new Error('Locale destination directory is undefined');
        }

        if (!this.languages || (Array.isArray(this.languages) && !this.languages.length)) {
            throw new Error('No locales to process');
        }
    }

    getValidLanguages(locales: string[] = [], excludes: Array<string> = [], all: boolean) {
        const localesExist = fs.existsSync(this.localeDir);

        let languages: string[] = [];

        if (all && !localesExist) {
            throw new Error(`Locale directory "${this.localeDir}" does not exist.`);
        }

        if (localesExist) {
            languages = getDirectories(this.localeDir);
        }

        languages = languages.filter(language => !excludes.includes(language));

        // Add specified locales
        locales.forEach((locale) => {
            if (!languages.includes(locale)) {
                languages.push(locale);
            }
        });

        return languages;
    }

    process() {
        if (!this.languages) {
            throw new Error('No locales to process');
        }

        // Ensure locale directory is created
        mkdirRecursiveSync(this.localeDir);

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

    processLanguage(extractor: GettextExtractor, language: string) {
        console.log(`Processing locale ${language}`);

        const languageDir = `${this.localeDir}/${language}/LC_MESSAGES`;
        const poFile = `${languageDir}/${this.domain}.po`;
        const poHeader = getDefaultHeader(language);

        const messages = extractor.getMessages();

        const invalidMessage = messages.find((message: IMessage) => !message.text);
        const references = invalidMessage!.references;

        if (references) {
            throw new Error(`Message "" is invalid, used in files: ${references.join()}`);
        }

        extractor.savePotFile(this.potFile, poHeader);

        if (!fs.existsSync(poFile)) {
            mkdirRecursiveSync(languageDir);
            extractor.savePotFile(poFile, poHeader);
        }

        const poContents = msgmerge.toString(
            msgmerge.merge(
                msgmerge.parseFile(this.potFile),
                msgmerge.parseFile(poFile),
                { language },
            ),
        );

        // Write to po file
        fs.writeFileSync(poFile, poContents, { mode: 0o766 });
    }

    processFiles(): GettextExtractor {
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


export default Makemessages;

export { MakeMessageOptions } from './types';
