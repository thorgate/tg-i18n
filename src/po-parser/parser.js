/* eslint-disable */
import fs from 'fs';

import Message from './message';
import PoFile, { FILE_TYPE } from './pofile';


export { FILE_TYPE } from './pofile';


class Parser {
    LEXERS = [
        // Match extracted comments
        {
            key: 'extractedComments',
            test: /^#\. (.*)$/,
        },

        // Match reference comment
        {
            key: 'references',
            test: /^#: (.*)$/,
        },

        // Match message flags
        {
            key: 'flags',
            test: /^#, (.*)$/,
        },

        // Match .po comments
        {
            key: 'comments',
            test: /^#[ ]?(.*)?$/,
        },

        // Match message context
        {
            key: 'msgCtx',
            test: /^msgctxt ["'](.*)["']$/,
        },

        // Match singular message id
        {
            key: 'msgId',
            test: /^msgid ["'](.*)["']$/,
        },

        // Match plural form message id
        {
            key: 'msgIdPlural',
            test: /^msgid_plural ["'](.*)["']$/,
        },

        // Match singular message string
        {
            key: 'msgStr',
            test: /^msgstr ["'](.*)["']$/,
        },

        // Match plural message string
        {
            key: 'msgStr',
            test: /^msgstr\[(\d+)] ["'](.*)["']$/,
            multi: true,
        },

        // MultiLine should always be last
        {
            test: /^["'](.*)["']$/,
            requireLast: true,
        },
    ];

    constructor(fileData) {
        this._lines = fileData.split(/\r?\n/);
    }

    parse() {
        return new PoFile(this._processMessages());
    }

    /**
     *
     * @param {string[]} messageLines
     * @returns {module:tg-i18n.po-parser.Message}
     * @private
     */
    _parseMessage(messageLines) {
        const messageObject = {};

        let lastMatchingKey = null;
        for (let line of messageLines) {
            if (!line) {
                continue;
            }

            const matchingLexer = this.LEXERS.find((lexer) => {
                if (lexer.requireLast && !lastMatchingKey) {
                    return false;
                }

                return lexer.test.test(line);
            });

            if (!matchingLexer) {
                throw new Error(`No matches found for line: ${line}`);
            }

            if (matchingLexer.key !== undefined && matchingLexer.key !== lastMatchingKey) {
                lastMatchingKey = null;
            }

            const match = line.match(matchingLexer.test);

            const key = matchingLexer.key !== undefined ? matchingLexer.key : lastMatchingKey;

            if (matchingLexer.multi) {
                const idx = match[1];

                if (!messageObject[key]) {
                    messageObject[key] = [];
                }

                if (!messageObject[key][idx]) {
                    messageObject[key][idx] = [];
                }

                messageObject[key][idx].push(match[2]);
            } else {
                if (!messageObject[key]) {
                    messageObject[key] = [];
                }

                messageObject[key].push((match[1] || ''));
            }

            lastMatchingKey = key;
        }

        Object.keys(messageObject).forEach((key) => {
            if (messageObject[key].length === 1) {
                messageObject[key] = messageObject[key][0];
            }
        });

        return new Message(messageObject);
    }

    /**
     * Parse file lines to messages.
     * @returns {module:tg-i18n.po-parser.Message[]}
     * @private
     */
    _processMessages() {
        const messages = [];

        let messageLines = [];

        for (let line of this._lines) {
            if (!line) {
                messages.push(this._parseMessage(messageLines));
                messageLines = [];
            } else {
                messageLines.push(line);
            }
        }

        return messages;
    }

    static readFile(source, encoding = 'utf8') {
        return new Parser(fs.readFileSync(source, { encoding }));
    }
}

export default Parser;
