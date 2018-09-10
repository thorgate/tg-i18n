import Message from './message';

import { MAGIC_CONTEXT_NUMBER } from './utils';


export const FILE_TYPE = {
    PO_FILE: 'po',
    POT_FILE: 'pot',
};


class PoFile {
    /**
     * Create new Po/Pot file
     * @param {module:tg-i18n.po-parser.Message[]} messages
     * @param {string} fileType
     * @param {number} numPlurals
     */
    constructor(messages = [], fileType, numPlurals = 2) {
        this._messages = {};
        this._fileType = fileType;
        this._numPlurals = numPlurals;

        messages.forEach((message) => {
            this._messages[message.key] = message;
        });
    }

    get fileType() {
        return this._fileType;
    }

    get numPlurals() {
        return this._numPlurals;
    }

    getMessage(key) {
        return this._messages[key];
    }

    /**
     * Merge current translations with POT file.
     * Only merging to .po file is supported.
     *
     * @param {PoFile} potFile
     */
    merge(potFile) {
        if (this.fileType === FILE_TYPE.POT_FILE) {
            throw new Error('Only merging to .po file is supported.');
        }

        // TODO : Finish this
    }

    _mergeHeader(source) {
    }

    _mergeTranslations(source) {
    }

    /**
     * Create empty message with correct plural values
     * @param {string} key
     * @returns {module:tg-i18n.po-parser.Message}
     */
    createEmptyMessage(key) {
        let context = '';
        let messageId = key;

        if (messageId.includes(MAGIC_CONTEXT_NUMBER)) {
            [context, messageId] = messageId.split(MAGIC_CONTEXT_NUMBER);
        }

        return new Message({
            msgCtx: context,
            msgId: messageId,
            msgStr: Array(this.numPlurals).fill(''),
        });
    }

    toString() {
        let messages = Object.values(this._messages);
        messages.sort(Message.compare);

        messages = messages.map(message => `${message}`);

        return `${messages.join('\n')}`;
    }

    static extractValue(lines, regex) {
        const parsedValue = [];
        let parsedGroup = [];

        let isMatch = false;
        for (let i = 0; i < lines.length; i += 1) {
            if (regex.test(lines[i])) {
                isMatch = true;

                if (parsedGroup.length) {
                    parsedValue.push(parsedGroup);
                }

                parsedGroup = [];
            }

            if ((isMatch && lines[i].indexOf('"') === 0)) {
                parsedGroup.push(lines[i].replace(/"/g, ''));
            } else {
                isMatch = false;
            }
        }

        if (!parsedValue.length) {
            return '';
        }

        if (parsedValue.length === 1) {
            return parsedValue[0];
        }

        return parsedValue;
    }

    static extractValue2(lines, identifier) {
        let parsedValue = '';
        let isMatch = false;

        for (let i = 0; i < lines.length; i += 1) {
            if (lines[i].indexOf(`${identifier}`) >= 0) {
                isMatch = true;
            } else if (lines[i].indexOf('msgid_plural') >= 0) {
                isMatch = false;
            }

            if (isMatch) {
                parsedValue += lines[i].replace(/"/g, '');
            }
        }

        return parsedValue;
    }

    static createMessage(lines) {
        // TODO : Fix this - better parsing to get required parts
        const msgId = Message.extractValue(lines, /msgid /);
        const msgIdPlural = Message.extractValue(lines, /msgid_plural /);
        const msgStr = Message.extractValue(lines, /msgstr(\[\d+])? /);
        const msgCtx = Message.extractValue(lines, /msgctx /);
        const references = Message.extractValue(lines, /#: /);
        const comments = Message.extractValue(lines, /#\. /);

        return new Message(msgId, msgIdPlural, msgStr, msgCtx, references, comments);
    }
}

export default PoFile;
