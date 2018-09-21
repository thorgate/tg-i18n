/**
 * @module tg-i18n/po-parser/message
 */
import { hashCode, MAGIC_CONTEXT_NUMBER } from './utils';


const withQuotes = (value, quotes = false) => (
    quotes ? `"${value}"` : value
);

class MessageHelper {
    constructor() {
        this.lines = [];
    }

    addFragment(data, identifier, quotes = true, multiLine = true, skipEmpty = false) {
        if ((!data || (data && data.length === 0)) && skipEmpty) {
            return this;
        }

        if (Array.isArray(data)) {
            data.forEach((value, idx) => {
                if (!multiLine || (multiLine && idx === 0)) {
                    this.lines.push(`${identifier} ${withQuotes(value, quotes)}`.trimRight());
                } else {
                    this.lines.push(`${withQuotes(value, quotes)}`.trimRight());
                }
            });
        } else {
            this.lines.push(`${identifier} ${withQuotes(data, quotes)}`.trimRight());
        }

        return this;
    }

    toString() {
        return `${this.lines.join('\n')}\n`;
    }
}


/**
 * @typedef {Object} tg-i18n.po-parser.message.MessageObject
 * @property {string|string[]} msgId
 * @property {string|string[]} [msgIdPlural]
 * @property {string|string[]|string[][]} msgStr
 * @property {string} [msgCtx]
 * @property {string[]} [references]
 * @property {string[]} [extractedComments]
 * @property {string[]} [comments]
 * @property {string[]} [flags]
 * @memberof module:tg-i18n.po-parser.message
 */


/**
 * @class Message
 * @classdesc Single PO/POT file message container.
 * @memberof module:tg-i18n.po-parser
 */
class Message {
    /**
     * Create new message container from {@link MessageObject}
     * @param {...MessageObject} message
     */
    constructor(message) {
        const {
            msgId,
            msgIdPlural = [],
            msgStr,
            msgCtx = '',
            references = [],
            extractedComments = [],
            comments = [],
            flags = [],
        } = message;

        this.messageId = msgId;
        this.messageIdPlural = msgIdPlural || [];
        this.messageString = msgStr || '';
        this.messageContext = msgCtx || '';
        this.references = references || [];
        this.comments = comments || [];
        this.extractedComments = extractedComments || [];
        this.flags = flags || [];

        // Organize references
        if (!Array.isArray(this.references)) {
            this.references = [this.references];
        }
        this.references.sort((a, b) => a.localeCompare(b));
    }

    get isHeader() {
        return this.messageId === '';
    }

    get isPluralMessage() {
        return !!this.messageIdPlural.length;
    }

    /**
     * Get message identifier.
     * @returns {string}
     */
    get key() {
        const key = Array.isArray(this.messageId) ? this.messageId.join('\n') : this.messageId;

        if (this.messageContext) {
            return `${this.messageContext}${MAGIC_CONTEXT_NUMBER}${key}`;
        }

        return key;
    }

    hash() {
        return hashCode(this.key);
    }

    eq(messageB) {
        return this.hash() === messageB.hash();
    }

    /**
     * Compare message to determine correct sorting order.
     * @param messageA
     * @param messageB
     * @returns {number}
     */
    static compare(messageA, messageB) {
        const comparingHeader = messageA.isHeader || messageB.isHeader;

        if (comparingHeader) {
            return (messageA.isHeader && !messageB.isHeader) ? -1 : 1;
        }

        return messageA.hash - messageB.hash;
    }

    toString() {
        const helper = new MessageHelper();

        helper.addFragment(this.comments, '#', false, false, true)
            .addFragment(this.extractedComments, '#.', false, false, true)
            .addFragment(this.references, '#:', false, false, true)
            .addFragment(this.flags, '#,', false, false, true)
            .addFragment(this.messageContext, 'msgctxt', true, true, true)
            .addFragment(this.messageId, 'msgid')
            .addFragment(this.messageIdPlural, 'msgid_plural', true, true, true);

        if (this.isPluralMessage) {
            this.messageString.forEach((msgStr, index) => {
                helper.addFragment(msgStr, `msgstr[${index}]`);
            });
        } else {
            helper.addFragment(this.messageString, 'msgstr');
        }

        return `${helper}`;
    }
}

export default Message;
