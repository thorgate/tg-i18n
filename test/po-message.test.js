/* global expect */
import Message from '../src/po-parser/message';
import { MAGIC_CONTEXT_NUMBER } from '../src/po-parser/utils';


describe('Message', () => {
    test('eq', () => {
        const messageA = new Message({ msgId: 'message', msgStr: 'translation' });
        const messageB = new Message({ msgId: 'message', msgStr: 'translation' });
        expect(messageA.eq(messageB)).toEqual(true);
    });
    test('compare', () => {
        const messages = [
            new Message({ msgId: 'message', msgStr: 'translation' }),
            new Message({ msgId: 'message2', msgStr: 'translation' }),
            new Message({ msgId: '', msgStr: 'HEADER' }),
            new Message({ msgCtx: 'test', msgId: 'message', msgStr: 'translation' }),
        ];
        messages.sort(Message.compare);

        const expected = ['', 'message', 'message2', `test${MAGIC_CONTEXT_NUMBER}message`];
        expect(messages.map(item => item.key)).toEqual(expected);
    });
});


describe('Message formatting', () => {
    test('singular', () => {
        const message = new Message({
            msgId: 'message',
            msgStr: 'translation',
        });

        const expected = [
            'msgid "message"',
            'msgstr "translation"',
            '',
        ].join('\n');
        expect(`${message}`).toEqual(expected);
    });

    test('plural', () => {
        const message = new Message({
            msgId: 'message',
            msgIdPlural: 'messages',
            msgStr: ['translation', 'translations'],
        });

        const expected = [
            'msgid "message"',
            'msgid_plural "messages"',
            'msgstr[0] "translation"',
            'msgstr[1] "translations"',
            '',
        ].join('\n');
        expect(`${message}`).toEqual(expected);
    });

    test('singular multiline', () => {
        const message = new Message({
            msgId: ['message0\\n', 'message1\\n', 'message2\\n'],
            msgStr: ['translation0\\n', 'translation1\\n', 'translation2\\n'],
        });

        const expected = [
            'msgid "message0\\n"',
            '"message1\\n"',
            '"message2\\n"',
            'msgstr "translation0\\n"',
            '"translation1\\n"',
            '"translation2\\n"',
            '',
        ].join('\n');

        expect(`${message}`).toEqual(expected);
    });

    test('plural multiline', () => {
        const message = new Message({
            msgId: ['message0\\n', 'message1\\n', 'message2\\n'],
            msgIdPlural: ['messages0\\n', 'messages1\\n', 'messages2\\n'],
            msgStr: [
                ['translation0\\n', 'translation1\\n', 'translation2\\n'],
                ['translations0\\n', 'translations1\\n', 'translations2\\n'],
            ],
        });

        const expected = [
            'msgid "message0\\n"',
            '"message1\\n"',
            '"message2\\n"',
            'msgid_plural "messages0\\n"',
            '"messages1\\n"',
            '"messages2\\n"',
            'msgstr[0] "translation0\\n"',
            '"translation1\\n"',
            '"translation2\\n"',
            'msgstr[1] "translations0\\n"',
            '"translations1\\n"',
            '"translations2\\n"',
            '',
        ].join('\n');
        expect(`${message}`).toEqual(expected);
    });

    test('singular w/ all', () => {
        const message = new Message({
            msgCtx: 'test',
            msgId: 'message %s',
            msgStr: 'translation %s',
            references: [
                'somefile.js:12',
                'somefile.js:14',
                'otherfile.js:14',
            ],
            extractedComments: ['test comment 1'],
            comments: ['TRANSLATOR1: Just a sample'],
            flags: ['javascript-format'],
        });

        const expected = [
            '# TRANSLATOR1: Just a sample',
            '#. test comment 1',
            '#: otherfile.js:14',
            '#: somefile.js:12',
            '#: somefile.js:14',
            '#, javascript-format',
            'msgctxt "test"',
            'msgid "message %s"',
            'msgstr "translation %s"',
            '',
        ].join('\n');
        expect(`${message}`).toEqual(expected);
    });

    test('plural w/ all', () => {
        const message = new Message({
            msgCtx: 'test',
            msgId: 'message %s',
            msgIdPlural: 'messages %s',
            msgStr: ['translation %s', 'translations %s'],
            references: [
                'somefile.js:12',
                'somefile.js:14',
                'otherfile.js:14',
            ],
            extractedComments: ['test comment 1'],
            comments: ['TRANSLATOR1: Just a sample'],
            flags: ['javascript-format'],
        });

        const expected = [
            '# TRANSLATOR1: Just a sample',
            '#. test comment 1',
            '#: otherfile.js:14',
            '#: somefile.js:12',
            '#: somefile.js:14',
            '#, javascript-format',
            'msgctxt "test"',
            'msgid "message %s"',
            'msgid_plural "messages %s"',
            'msgstr[0] "translation %s"',
            'msgstr[1] "translations %s"',
            '',
        ].join('\n');
        expect(`${message}`).toEqual(expected);
    });
});
