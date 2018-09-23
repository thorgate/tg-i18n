// @flow
import fs from 'fs';
import path from 'path';


export const getFixturePath = (fileName: string): string => (
    path.normalize(path.join(__dirname, 'fixtures', fileName))
);

export const loadFixture = (fileName: string, encoding: string = 'utf8'): string => (
    fs.readFileSync(getFixturePath(fileName), { encoding })
);
