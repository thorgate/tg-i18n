import fs from 'fs';
import path from 'path';


export const getFixturePath = fileName => (
    path.normalize(path.join(__dirname, 'fixtures', fileName))
);

export const loadFixture = (fileName, encoding = 'utf8') => (
    fs.readFileSync(getFixturePath(fileName), { encoding })
);

export const loadFixtureAsync = (fileName, encoding = 'utf8') => (
    new Promise((resolve, reject) => {
        try {
            fs.readFile(getFixturePath(fileName), { encoding }, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        } catch (err) {
            reject(err);
        }
    })
);
