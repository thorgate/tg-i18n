import fs from 'fs';
import path from 'path';


export const getFixturePath = (fixturePath: string, fileName: string): string => (
    path.normalize(path.join(fixturePath, 'fixtures', fileName))
);

export const loadFixture = (fixturePath: string, fileName: string, encoding: string = 'utf8'): string => (
    fs.readFileSync(getFixturePath(fixturePath, fileName), { encoding })
);
