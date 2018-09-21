/**
 * @module tg-i18n/po-parser/header
 */
import Message from './message';

/**
 * @class Header
 * @classdesc Single PO/POT file header container.
 * @memberof module:tg-i18n.po-parser
 */
class Header {
    /**
     * Create new message container from {@link Message}
     * @param {Object} headerData
     * @param {string[]} comments
     */
    constructor(headerData, comments) {
        this._headerData = headerData;
        this._comments = comments;
        this._numPlurals = 2;

        this._processHeader();
    }

    _processHeader() {
        if ('Plural-Forms' in this._headerData) {
            const pluralFormRegex = /nplurals\W=\W(\d+)/;
            const pluralForms = this._headerData['Plural-Forms']; // type: string

            const match = pluralForms.match(pluralFormRegex);
            if (match) {
                this._numPlurals = Number(match[1]);
            }
        }
    }

    get headerData() {
        return this._headerData;
    }

    set headerData(headerData) {
        this._headerData = headerData;
    }

    get numPlurals() {
        return this._numPlurals;
    }

    toString() {
        const messageString = Object.keys(this._headerData).map(key => (
            `${key}: ${this._headerData[key]}\\n`
        ));

        const message = new Message({
            comments: this._comments,
            msgId: '',
            msgStr: [''].concat(messageString),
        });

        return `${message}`;
    }

    /**
     * Create new header container from {@link module:tg-i18n.po-parser.Message}
     * @param {module:tg-i18n.po-parser.Message} message
     */
    static fromMessage(message) {
        if (!message.isHeader) {
            throw new Error('Message is not header');
        }

        const headerItemRegex = /(.*):[ ]+(.*)\\n/;

        const headerData = {};
        message.messageString.forEach((item) => {
            const match = item.match(headerItemRegex);

            if (!match) {
                return;
            }

            headerData[match[1]] = match[2];
        });

        return new Header(headerData, message.comments);
    }
}

export default Header;
