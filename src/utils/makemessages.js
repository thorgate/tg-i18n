import fs from 'fs';
import shell from 'shelljs';
import moment from 'moment';
import { run as potMerge } from 'pot-merge';
import { GettextExtractor, JsExtractors } from 'gettext-extractor';

import { getLogger } from '../config';
import plurals from '../plurals.json';


class MakeMessages {
    constructor(options = {}) {
        this.domain = options.domain;
        this.path = options.path;
        this.extensions = options.extension;
        this.localeDir = options['locale-dir'];
        this.keepPot = options['keep-pot'];

        this.potFile = `${this.localeDir}/${this.domain}.pot`;

        this.languages = this.validateLanguages(
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

    validateLanguages(locales = [], excludes = [], all) {
        const localesExist = fs.existsSync(this.localeDir);

        let languages = [];

        if (all && !localesExist) {
            throw new Error(`Locale directory "${this.localeDir}" does not exist.`);
        }

        if (all) {
            languages = shell.ls(this.localeDir);
            languages = languages.filter(language => !excludes.includes(language));
        }

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

        return {
            'Project-Id-Version': 'PACKAGE VERSION',
            'Report-Msgid-Bugs-To': '',
            'POT-Creation-Date': moment().format('YYYY-MM-DD HH:mmZZ'),
            'PO-Revision-Date': moment().format('YYYY-MM-DD HH:mmZZ'),
            'Last-Translator': 'FULL NAME <EMAIL@ADDRESS>',
            'Language-Team': 'LANGUAGE <LL@li.org>',
            Language: this.plurals[language].name,
            'MIME-Version': '1.0',
            'Content-Transfer-Encoding': 'Content-Transfer-Encoding',
            'Content-Type': 'text/plain; charset=UTF-8',
            'Plural-Forms': this.plurals[language].pluralForm,
        };
    }

    process() {
        if (!this.languages) {
            throw new Error('No locales to process');
        }

        // Ensure locale directory is created
        shell.mkdir('-p', this.localeDir);

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
        const isNewLocale = !fs.existsSync(poFile);
        const poHeader = this.getHeader(language);

        extractor.savePotFile(this.potFile, poHeader);

        if (isNewLocale) {
            shell.mkdir('-p', languageDir);
            extractor.savePotFile(poFile, poHeader);
        }

        // const poContents = mergePotContents(this.potFile, poFile);
        potMerge(poFile, this.potFile, poFile);
        // console.log(poContents);
        // fs.writeFileSync(poFile, poContents, { mode: 0o766 });
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


export default MakeMessages;
