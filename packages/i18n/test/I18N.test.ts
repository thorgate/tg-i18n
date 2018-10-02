import { createI18N, gettextNoop, interpolate } from '../src/config';


jest.mock('warning', () => () => null);


describe('I18N generics', () => {
    test('interpolate', () => {
        expect(interpolate('Lets count from %s to %s', 1, 100)).toEqual('Lets count from 1 to 100');
        expect(interpolate('Test string %(num)s', { num: 1 })).toEqual('Test string 1');
    });

    test('gettextNoop does not modify', () => {
        expect(gettextNoop('Test string')).toEqual('Test string');
    });
});


describe('I18N w/ filled catalogue', () => {
    const catalogue = {
        domain: 'messages',
        locales: {
            en: {
                '': {
                    lang: 'en',
                    plural_forms: 'nplurals=2; plural=(n != 1)',
                },
                test: ['EN: test', 'EN: tests'],
                'context\x04test small': ['EN: test small', 'EN: tests big'],
            },
            et: {
                '': {
                    lang: 'en',
                    plural_forms: 'nplurals=2; plural=(n != 1)',
                },
                test: ['ET: test', 'ET: tests'],
            },
        },
    };

    test('activeLanguage', () => {
        const i18n = createI18N('en', catalogue);
        expect(i18n.activeLanguage).toEqual('en');
    });

    test('activateLanguage', () => {
        const i18n = createI18N('en', catalogue);

        i18n.activateLanguage('et');

        expect(i18n.activeLanguage).toEqual('et');
        expect(i18n.gettext('test')).toEqual('ET: test');
    });

    test('activateLanguage w/ callback', () => {
        const i18n = createI18N('en', catalogue);

        const cb = jest.fn();
        i18n.activateLanguage('et', false, cb);

        expect(cb.mock.calls).toEqual([['et']]);

        expect(i18n.activeLanguage).toEqual('et');
        expect(i18n.gettext('test')).toEqual('ET: test');

        // Re-activate should not call callback again
        i18n.activateLanguage('et', false, cb);
        expect(cb.mock.calls).toEqual([['et']]);

        // Force re-activate
        i18n.activateLanguage('et', true, cb);
        expect(cb.mock.calls).toEqual([['et'], ['et']]);
    });

    test('gettext', () => {
        const i18n = createI18N('en', catalogue);
        expect(i18n.gettext('test')).toEqual('EN: test');
    });

    test('pgettext', () => {
        const i18n = createI18N('en', catalogue);
        expect(i18n.pgettext('context', 'test small')).toEqual('EN: test small');
    });

    test('ngettext', () => {
        const i18n = createI18N('en', catalogue);
        expect(i18n.ngettext('test', 'tests', 1)).toEqual('EN: test');
        expect(i18n.ngettext('test', 'tests', 2)).toEqual('EN: tests');
    });

    test('npgettext', () => {
        const i18n = createI18N('en', catalogue);
        expect(i18n.npgettext('context', 'test small', 'tests big', 1))
            .toEqual('EN: test small');
        expect(i18n.npgettext('context', 'test small', 'tests big', 2))
            .toEqual('EN: tests big');
    });
});


describe('I18N w/ empty catalogue', () => {
    const emptyCatalogue = {
        domain: 'messages',
        locales: {},
    };

    const catalogue = {
        domain: 'messages',
        locales: {
            en: {
                '': {
                    lang: 'en',
                    plural_forms: 'nplurals=2; plural=(n != 1)',
                },
                test: ['EN: test', 'EN: tests'],
            },
        },
    };

    test('activeLanguage', () => {
        const i18n = createI18N('en', emptyCatalogue);
        expect(i18n.activeLanguage).toEqual(null);
    });

    test('setLocaleCatalogue', () => {
        const i18n = createI18N('en', emptyCatalogue);
        expect(i18n.activeLanguage).toEqual(null);

        i18n.setLocaleCatalogue(catalogue);

        expect(i18n.activeLanguage).toEqual('en');
        expect(i18n.gettext('test')).toEqual('EN: test');
    });

    test('setLocaleCatalogue w/callback', () => {
        const i18n = createI18N('en', emptyCatalogue);
        expect(i18n.activeLanguage).toEqual(null);

        const cb = jest.fn();

        i18n.setLocaleCatalogue(catalogue, cb);

        // Expect activeLanguage language to match
        expect(i18n.activeLanguage).toEqual('en');

        // Expect callback have been called with current language for re-activation
        expect(cb.mock.calls).toEqual([['en']]);
    });

    test('gettext', () => {
        const i18n = createI18N('en', emptyCatalogue);
        expect(i18n.gettext('test')).toEqual('test');
    });

    test('pgettext', () => {
        const i18n = createI18N('en', emptyCatalogue);
        expect(i18n.pgettext('context', 'test small')).toEqual('test small');
    });

    test('ngettext', () => {
        const i18n = createI18N('en', emptyCatalogue);
        expect(i18n.ngettext('test', 'tests', 1)).toEqual('test');
        expect(i18n.ngettext('test', 'tests', 2)).toEqual('tests');
    });

    test('npgettext', () => {
        const i18n = createI18N('en', emptyCatalogue);
        expect(i18n.npgettext('context', 'test small', 'tests big', 1))
            .toEqual('test small');
        expect(i18n.npgettext('context', 'test big', 'tests big', 2))
            .toEqual('tests big');
    });
});
