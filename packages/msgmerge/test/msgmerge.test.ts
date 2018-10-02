/* global expect */
import { compilePo, parsePo } from '@thorgate/i18n-utils';

import * as MsgMerge from '../src/index';

import { loadFixture } from './utils';


describe('MsgMerge', () => {
    test('merge existing : 2 plural forms', () => {
        const potFile = loadFixture('messages.pot');
        const poFile = loadFixture('messages.po');

        const merged = MsgMerge.merge(
            parsePo(potFile), parsePo(poFile), { language: 'en' },
        );
        expect(compilePo(merged)).toEqual(loadFixture('result.po'));
    });

    test('merge existing : 3 plural forms', () => {
        const potFile = loadFixture('messages-ru.pot');
        const poFile = loadFixture('messages-ru.po');

        const merged = MsgMerge.merge(
            parsePo(potFile), parsePo(poFile), { language: 'ru' },
        );
        expect(compilePo(merged)).toEqual(loadFixture('result-ru.po'));
    });

    test('merge new .po : 2 plural forms', () => {
        const potFile = loadFixture('messages.pot');

        const merged = MsgMerge.merge(
            parsePo(potFile), { charset: 'utf8', translations: {} }, { language: 'en' },
        );
        expect(compilePo(merged)).toEqual(loadFixture('new-messages.po'));
    });

    test('merge new .po : 3 plural forms', () => {
        const potFile = loadFixture('messages-ru.pot');

        const merged = MsgMerge.merge(
            parsePo(potFile), { charset: 'utf8', translations: {} }, { language: 'ru' },
        );
        expect(compilePo(merged)).toEqual(loadFixture('new-messages-ru.po'));
    });
});
