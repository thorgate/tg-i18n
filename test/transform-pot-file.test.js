import fs from 'fs';
import path from 'path';
import { Message, Merger } from '../src/utils/transform-pot-file';


describe('Parsing .pot file', () => {
    const potFile = fs.readFileSync(path.join(__dirname, 'fixtures', 'messages.pot'), { encoding: 'utf8' });

    test('Validate parsing', () => {
        const messages = Merger.parseMessages(potFile);
        console.log(messages);
    });
});
