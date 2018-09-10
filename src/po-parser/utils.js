/* eslint no-bitwise: ["error", { "int32Hint": true }] */
// Magic context separator constant used also by GNU Gettext
export const MAGIC_CONTEXT_NUMBER = '\x04';

/**
 * Generate 32-bit hash code for string.
 *
 * @memberof module:tg-i18n.po-parser
 * @param str
 * @returns {number}
 */
export function hashCode(str) {
    let hash = 0;

    if (!str) {
        return hash;
    }

    for (let i = 0; i < str.length; i += 1) {
        hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }

    return hash;
}
