/* global expect */
import Parser from '../src/po-parser/parser';

import { loadFixture } from './utils';


describe('Parsing .pot file', () => {
    const potFile = loadFixture('messages.pot');

    test('Validate parsing', () => {
        const parser = new Parser(potFile);
        const parsedPoFile = parser.parse();

        expect(`${parsedPoFile}`).toEqual(potFile);
    });
});
