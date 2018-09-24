import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import createContext from 'create-react-context';

import { I18nContext, I18nProviderState } from './types';


export const {
    Consumer: I18nConsumer,
    Provider,
} = createContext<I18nProviderState>({} as any);


export function  withI18n<Props>(Component: React.ComponentType<Props & I18nContext>) {
    const WrappedComponent: React.SFC<Props> = (props: Props) => (
        <I18nConsumer>
            {(i18nObj: I18nProviderState) => <Component {...props} i18n={i18nObj} />}
        </I18nConsumer>
    );

    (WrappedComponent as React.SFC<Props> & {
        WrappedComponent: React.ReactNode,
    }).WrappedComponent = Component;

    WrappedComponent.displayName = `i18n(${Component.displayName || Component.name})`;

    // Remove any non-react stats
    return hoistNonReactStatics(WrappedComponent, Component);
}
