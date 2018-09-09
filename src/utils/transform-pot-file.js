/* eslint no-bitwise: ["error", { "int32Hint": true }] */
/*
This script is based of https://github.com/laget-se/pot-merge/blob/master/pot-merge.js

Changes made are to support keeping .pot header in the start of the file.
And keep sorting based on reference.
 */
import fs from 'fs';


const MAGIC_CONTEXT_NUMBER = '\x04';

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
        hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }
    return hash;
}


export class Message {
    constructor(msgId, msgIdPlural, msgStr, msgCtx, references, comments) {
        this.messageId = msgId;
        this.messageIdPlural = msgIdPlural;
        this.messageString = msgStr;
        this.messageContext = msgCtx;
        this.references = references;
        this.comments = comments;
    }

    hash() {
        const context = this.extractValue(this.messageContext);
        const messageId = this.extractValue(this.messageId);
        return hashCode(`${context}${MAGIC_CONTEXT_NUMBER}${messageId}`);
    }

    eq(b) {
        return this.hash() === b.hash();
    }

    merge(b) {

    }

    toString() {
        // TODO : fix this to use predefined format export
        // Message can then only contain only required parts
        const messageBlock = [];

        if (this.comments.length > 0) {
            messageBlock.push(this.comments.join('\n'));
        }

        if (this.references.length > 0) {
            messageBlock.push(this.references.join('\n'));
        }

        if (this.messageContext.length > 0) {
            messageBlock.push(this.messageContext.join('\n'));
        }

        if (this.messageId.length > 0) {
            messageBlock.push(this.messageId.join('\n'));
        }

        if (this.messageString.length > 0) {
            messageBlock.push(this.messageString.join('\n'));
        }

        messageBlock.push('');
        messageBlock.push('');

        return messageBlock.join('\n');
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


export class Merger {
    constructor(potFile, poFile, options) {
        this.potFile = potFile;
        this.poFile = poFile;
    }

    static parseMessage(lines) {
        const messageLines = [];
        let line = lines.pop();

        // Process until line is valid
        while (line) {
            messageLines.push(line);
            line = lines.pop();
        }
        return [lines, Message.createMessage(messageLines)];
    }

    static parseMessages(fileData) {
        const messages = [];
        let message = null;
        let lines = fileData.split(/\r?\n/).reverse();

        while (lines.length > 0) {
            [lines, message] = Merger.parseMessage(lines);
            messages.push(message);
        }
        return messages;
    }
}


export function process(potFile, poFile, output) {

}
