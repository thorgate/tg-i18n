// @flow
import * as React from 'react';

import makeI18n, { type I18nObject } from '.';


export const I18nContext = React.createContext<I18nObject>(makeI18n());

export type I18nProviderProps = {
    i18n: I18nObject,
    children: React.Node,
}

const I18nProvider = (props: I18nProviderProps) => (
    <I18nContext.Provider value={props.i18n}>
        {props.children}
    </I18nContext.Provider>
);

export default I18nProvider;
