
/* eslint-disable */
import fs from 'fs';

import Message from './message';
import PoFile, { FILE_TYPE } from './pofile';


class Parser {
    LEXERS = [
        // Match translator comments
        {
            key: 'comments',
            test: /^# (.*)$/,
        },

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
        this._lines = fileData.split(/\r?\n/).reverse();
    }

    parse() {
        /* to Handle
#  translator-comments
#. extracted-comments
#: reference…
#, javascript-format fuzzy
#| msgid previous-untranslated-string-singular
#| msgid_plural previous-untranslated-string-plural
msgid untranslated-string-singular
msgid_plural untranslated-string-plural
msgstr[0] translated-string-case-0
...
msgstr[N] translated-string-case-n
         */

        return new PoFile(this._processMessages(), FILE_TYPE.PO_FILE);
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

            if (matchingLexer.key !== undefined) {
                lastMatchingKey = matchingLexer.key;
            }

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

                messageObject[key].push(match[1]);
            }
        }

        Object.keys(messageObject).forEach((key) => {
            if (messageObject[key].length === 1) {
                messageObject[key] = messageObject[key][0];
            }
        });

        // console.log(messageObject);

        return new Message(messageObject);
    }

    /**
     * Process lines until single message is found.
     * @returns {module:tg-i18n.po-parser.Message}
     * @private
     */
    _processMessage() {
        const messageLines = [];
        let line = this._lines.pop();

        // Process until line is valid
        while (line) {
            messageLines.push(line);
            line = this._lines.pop();
        }
        return this._parseMessage(messageLines);
    }

    /**
     * Parse file lines to messages.
     * @returns {module:tg-i18n.po-parser.Message[]}
     * @private
     */
    _processMessages() {
        const messages = [];
        let message = null;
        while (this._lines.length > 0) {
            message = this._processMessage();
            messages.push(message);
        }
        return messages;
    }

    static readFile(source, encoding = 'utf8') {
        return new Parser(fs.readFileSync(source, { encoding }));
    }
}

export default Parser;
