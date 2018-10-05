import path from 'path';

import { CompileMessages } from '../src';


describe('CompileMessages', () => {
    test('compile :: Output :: NONE', () => {
        const compile = new CompileMessages({
            all: true,
            silent: true,
            domain: 'messages',
            localeDir: path.join(__dirname, 'fixtures'),
        });

        expect(compile.process()).toEqual({
            domain: 'messages',
            locales: {
                en: {
                    '': {
                        domain: 'messages',
                        lang: 'en',
                        plural_forms: 'nplurals=2; plural=(n != 1);',
                    },
                    'Dummy \"test\" string': [''],
                    'Dummy test string': [''],
                    'Dummy test string Dummy test string': [''],
                    'There is %s more waybill': ['', 'There are %s more waybills'],
                    'listThere is %(waybillCount)s more waybill': [
                        'There is %(waybillCount)s more waybill', 'There are %(waybillCount)s more waybills',
                    ],
                    'testDummy test string': ['']
                },
                ru: {
                    '': {
                        domain: 'messages',
                        lang: 'ru',
                        plural_forms: 'nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && ' +
                            'n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || ' +
                            '(n%100>=11 && n%100<=14)? 2 : 3);'
                    },
                    'Dummy \"test\" string': ['RU: Dummy "test" string'],
                    'Dummy test string': ['RU: Dummy test string'],
                    'Dummy test string Dummy test string': ['RU: Dummy test string Dummy test string'],
                    'There is %s more waybill': [
                        'RU: There is %s more waybill', 'RU: There are %s more waybills',
                        'RU: There are %s more waybills', 'RU: There are %s more waybills'
                    ],
                    'listThere is %(waybillCount)s more waybill': [
                        'RU: There is %(waybillCount)s more waybill',
                        'RU: There are %(waybillCount)s more waybills',
                        'RU: There are %(waybillCount)s more waybills',
                        'RU: There are %(waybillCount)s more waybills'
                    ],
                    'testDummy test string': ['RU: Dummy test string']
                },
                ru2: {
                    '': {
                        domain: 'messages',
                        lang: 'ru',
                        plural_forms: 'nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && ' +
                            'n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || ' +
                            '(n%100>=11 && n%100<=14)? 2 : 3);'
                    },
                    'Dummy \"test\" string': [''],
                    'Dummy test string': [''],
                    'Dummy test string Dummy test string': [''],
                    'There is %s more waybill': [
                        '', 'There are %s more waybills', 'There are %s more waybills', 'There are %s more waybills',
                    ],
                    'listThere is %(waybillCount)s more waybill': [
                        '',
                        'There are %(waybillCount)s more waybills',
                        'There are %(waybillCount)s more waybills',
                        'There are %(waybillCount)s more waybills',
                    ],
                    'testDummy test string': ['']
                },
            }
        });
    });
});
