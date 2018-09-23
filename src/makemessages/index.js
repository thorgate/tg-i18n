import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import format from 'date-fns/format';
import { GettextExtractor, JsExtractors } from 'gettext-extractor';

import { getLogger } from '../i18n/config';
import * as msgmerge from '../msgmerge';
import plurals from '../plurals.json';


const getDirectories = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());


class Makemessages {
    constructor(options = {}) {
        this.domain = options.domain;
        this.path = options.path;
        this.extensions = options.extension;
        this.localeDir = options['locale-dir'];
        this.keepPot = options['keep-pot'];

        this.potFile = `${this.localeDir}/${this.domain}.pot`;

        this.languages = this.getValidLanguages(
            options.locale, options.exclude, options.all,
        );
        this.plurals = plurals;

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

    getValidLanguages(locales = [], excludes = [], all) {
        const localesExist = fs.existsSync(this.localeDir);

        let languages = [];

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

    getHeader(language = null) {
        if (!this.plurals[language]) {
            throw new Error(`"${language}" missing a plural form definition`);
        }

        const languageData = this.plurals[language];

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

    process() {
        if (!this.languages) {
            throw new Error('No locales to process');
        }

        // Ensure locale directory is created
        shell.mkdir('-p', this.localeDir);

        // TODO - create all dir's needed
        if (!fs.existsSync(this.localeDir)) {
            fs.mkdirSync(this.localeDir);
        }

        const extractor = this.processFiles();

        this.languages.forEach((language) => {
            this.processLanguage(extractor, language);
        });

        if (!this.keepPot) {
            shell.rm('-f', this.potFile);
        }

        // Show stats for extracted messages
        extractor.printStats();
    }

    processLanguage(extractor, language) {
        getLogger().log(`Processing locale ${language}`);
        const languageDir = `${this.localeDir}/${language}/LC_MESSAGES`;
        const poFile = `${languageDir}/${this.domain}.po`;
        const poHeader = this.getHeader(language);

        const messages = extractor.getMessages();

        const invalidMessage = messages.find(message => !message.text);

        if (invalidMessage) {
            throw new Error(`Message "" is invalid, used in files: ${invalidMessage.references.join()}`);
        }

        extractor.savePotFile(this.potFile, poHeader);

        if (!fs.existsSync(poFile)) {
            shell.mkdir('-p', languageDir);
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

    processFiles() {
        const commentOptions = {
            otherLineLeading: true,
        };
        const extractor = new GettextExtractor();
        extractor
            .createJsParser([
                JsExtractors.callExpression(['_', 'gettext', '[i18n].gettext'], {
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
