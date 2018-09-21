/* global expect */
import Parser, { FILE_TYPE } from '../src/po-parser/parser';

import { loadFixture } from './utils';


describe('Parsing .pot file', () => {
    const potFile = loadFixture('messages.pot');

    test('Validate parsing', () => {
        const parser = new Parser(potFile, FILE_TYPE.POT_FILE);
        const parsedPotFile = parser.parse();

        expect(`${parsedPotFile}`).toEqual(potFile);
    });
});
