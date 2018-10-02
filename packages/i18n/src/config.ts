import Jed from 'jed';
import warning from 'warning';

import { I18nCallback, I18nOptions, LocaleCatalogue } from './types';


export const DefaultCatalogue: LocaleCatalogue = {
    domain: 'messages',
    locales: {},
};


export function gettextNoop(key: string) {
    return key;
}


export function interpolate(format: string, ...args: any[]): string {
    warning(
        (args.length >= 1 && typeof args[0] !== 'object'),
        'WARN: Prefer kwarg object instead of positional arguments. ' +
        'Translators cannot move arguments around to provide better translations.',
    );

    return Jed.sprintf(format, ...args);
}


export class I18N {
    public readonly defaultLanguage: string;

    constructor(options: I18nOptions) {
        if (!options.defaultLanguage) {
            throw new Error('Default language is required');
        }

        this.defaultLanguage = options.defaultLanguage;
        this._localeCatalogue = options.localeCatalogue;
        this._activeLanguage = options.activeLanguage;

        this.activateLanguage(this._activeLanguage, true);

        // Bind all methods to this instance
        // This is faster than arrow function for repeated initialization
        this.activateLanguage = this.activateLanguage.bind(this);
        this.gettext = this.gettext.bind(this);
        this.pgettext = this.pgettext.bind(this);
        this.ngettext = this.ngettext.bind(this);
        this.npgettext = this.npgettext.bind(this);
    }

    private _activeLanguage: string | null;
    private _localeCatalogue: LocaleCatalogue = DefaultCatalogue;
    private translationEngine: Jed | null = null;

    public get activeLanguage() {
        return this._activeLanguage;
    }

    public get localeCatalogue() {
        return this._localeCatalogue;
    }

    public setLocaleCatalogue(localeCatalogue: LocaleCatalogue, callBack?: I18nCallback) {
        this._localeCatalogue = localeCatalogue;
        this.activateLanguage(this.activeLanguage, true, callBack);
    }

    public activateLanguage(languageCode: string | null, force: boolean = false, callBack?: I18nCallback) {
        const nextLanguageCode = languageCode || this.defaultLanguage;

        if (this.activeLanguage === nextLanguageCode && !force) {
            return;
        }

        const localeData = this.localeCatalogue.locales[nextLanguageCode];
        warning(!localeData, `Missing locale data for language: "${nextLanguageCode}"`);
        warning(!this.localeCatalogue.domain, 'Missing locale domain in language catalogue');

        if (localeData) {
            this.translationEngine = new Jed({
                domain: this.localeCatalogue.domain,
                locale_data: {
                    [this.localeCatalogue.domain]: localeData,
                },
            });

            if (callBack) {
                callBack(nextLanguageCode);
            }

            this._activeLanguage = nextLanguageCode;
        }
    }

    public gettext(key: string): string {
        if (!this.translationEngine) {
            return key;
        }

        return this.translationEngine.gettext(key);
    }

    public pgettext(context: string, key: string): string {
        if (!this.translationEngine) {
            return key;
        }

        return this.translationEngine.pgettext(context, key);
    }

    public ngettext(singular: string, plural: string, value: number): string {
        if (!this.translationEngine) {
            return (value === 0 || value === 1) ? singular : plural;
        }

        return this.translationEngine.ngettext(singular, plural, value);
    }

    public npgettext(context: string, singular: string, plural: string, value: number): string {
        if (!this.translationEngine) {
            return (value === 0 || value === 1) ? singular : plural;
        }

        return this.translationEngine.npgettext(context, singular, plural, value);
    }
}


export function createI18N(defaultLanguage: string, localeCatalogue: LocaleCatalogue) {
    return new I18N({
        defaultLanguage,
        localeCatalogue,
        activeLanguage: null,
    });
}
