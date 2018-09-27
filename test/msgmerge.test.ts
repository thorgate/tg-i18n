/* global expect */
import * as MsgMerge from '../src/msgmerge';

import { loadFixture } from './utils';


describe('MsgMerge', () => {
    test('merge existing : 2 plural forms', () => {
        const potFile = loadFixture('messages.pot');
        const poFile = loadFixture('messages.po');

        const merged = MsgMerge.merge(
            MsgMerge.parse(potFile), MsgMerge.parse(poFile), { language: 'en' },
        );
        expect(MsgMerge.toString(merged)).toEqual(loadFixture('result.po'));
    });

    test('merge existing : 3 plural forms', () => {
        const potFile = loadFixture('messages-ru.pot');
        const poFile = loadFixture('messages-ru.po');

        const merged = MsgMerge.merge(
            MsgMerge.parse(potFile), MsgMerge.parse(poFile), { language: 'ru' },
        );
        expect(MsgMerge.toString(merged)).toEqual(loadFixture('result-ru.po'));
    });

    test('merge new .po : 2 plural forms', () => {
        const potFile = loadFixture('messages.pot');

        const merged = MsgMerge.merge(
            MsgMerge.parse(potFile), {charset: 'utf8', translations: {}}, { language: 'en' },
        );
        expect(MsgMerge.toString(merged)).toEqual(loadFixture('new-messages.po'));
    });

    test('merge new .po : 3 plural forms', () => {
        const potFile = loadFixture('messages-ru.pot');

        const merged = MsgMerge.merge(
            MsgMerge.parse(potFile), {charset: 'utf8', translations: {}}, { language: 'ru' },
        );
        expect(MsgMerge.toString(merged)).toEqual(loadFixture('new-messages-ru.po'));
    });
});
