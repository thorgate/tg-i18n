import {
    BaseMessages, BaseMessagesOptions, DefaultFileMode, LocaleCatalogue,
} from '@thorgate/i18n-utils';
import fs from 'fs';
import * as po2json from 'po2json';


export enum FileOutputMode {
    NONE = 'none',
    SEPARATE = 'separate',
    COMBINED = 'combined',
}

export interface CompileMessagesOptions extends BaseMessagesOptions {
    outputMode?: FileOutputMode;
}


export class CompileMessages extends BaseMessages {
    protected _outputMode: FileOutputMode;

    protected _output: LocaleCatalogue;

    constructor(options: CompileMessagesOptions = {}) {
        super(options);
        // Compile messages uses all options by default
        this._all = options.all || true ;
        this._outputMode = options.outputMode || FileOutputMode.NONE;

        this._output = this.createInitialCatalogue();
    }

    public get outputMode() {
        return this._outputMode;
    }

    public set outputMode(outputMode: FileOutputMode) {
        this._outputMode = outputMode;
    }

    public process() {
        super.process();

        // Initialize empty catalogue
        this._output = this.createInitialCatalogue();

        this.languages.forEach((language) => {
            this.processLanguage(language);
        });

        if (this.outputMode === FileOutputMode.COMBINED) {
            fs.writeFileSync(
                `${this.localeDir}/${this.domain}.json`,
                JSON.stringify(this._output),
                { mode: DefaultFileMode }
            );
        }

        return this._output;
    }

    protected validateConfig(): void {
        super.validateConfig();

        if (!fs.existsSync(this.localeDir)) {
            throw new Error('Locale directory does not exist');
        }
    }

    protected processLanguage(language: string) {
        if (!this.silent) {
            console.log(`Processing locale ${language}`);
        }

        const languageDir = this.getLanguageDirectory(language);
        const poFile = `${languageDir}/${this.domain}.po`;

        if (!fs.existsSync(poFile)) {
            console.warn(`Locale "${language} missing ${this.domain}.po file`);
            return;
        }

        const localeData = po2json.parseFileSync(poFile, {
            format: 'jed',
            domain: this.domain,
        });

        if (this.outputMode === FileOutputMode.SEPARATE) {
            fs.writeFileSync(
                `${languageDir}/${this.domain}.json`,
                JSON.stringify(localeData),
                { mode: DefaultFileMode },
            );
            return;
        }

        this._output.locales[language] = localeData.locale_data[this.domain];
    }

    protected createInitialCatalogue(): LocaleCatalogue {
        return {
            domain: this.domain,
            locales: {},
        }
    }
}
