import Header from './header';
import Message from './message';


export const FILE_TYPE = {
    PO_FILE: 'po',
    POT_FILE: 'pot',
};


class PoFile {
    /**
     * Create new Po/Pot file
     * @param {module:tg-i18n.po-parser.Message[]} messages
     * @param {string} fileType
     */
    constructor(messages = [], fileType = FILE_TYPE.POT_FILE) {
        this._messages = {};
        this._fileType = fileType;

        messages.forEach((message) => {
            if (message.isHeader) {
                this._header = Header.fromMessage(message);
            } else {
                this._messages[message.key] = message;
            }
        });
    }

    get fileType() {
        return this._fileType;
    }

    get header() {
        return this._header;
    }

    get messages() {
        const messages = Object.values(this._messages);
        messages.sort(Message.compare);

        return messages;
    }

    getMessage(key) {
        return this._messages[key];
    }

    toString() {
        return `${this.header}\n${this.messages.join('\n')}`;
    }
}

export default PoFile;
