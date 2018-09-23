/**
 * @module tg-i18n
 */

import makeI18nObject from './i18n';
import I18nProvider from './i18n/provider';
import i18n from './i18n/i18n';

export { getConfig, setConfig } from './i18n/config';
export { I18nProvider, i18n };

export default makeI18nObject;
