import createContext from 'create-react-context';
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

import { I18nContext, I18nProps } from './types';


export const {
    Consumer,
    Provider,
} = createContext<I18nProps>({} as any);


export function withI18n<Props>(Component: React.ComponentType<Props & I18nContext>) {
    const WrappedComponent: React.SFC<Props> = (props: Props) => (
        <Consumer>
            {(i18nObj: I18nProps) => <Component {...props} i18n={i18nObj} />}
        </Consumer>
    );

    (WrappedComponent as React.SFC<Props> & {
        WrappedComponent: React.ReactNode,
    }).WrappedComponent = Component;

    WrappedComponent.displayName = `i18n(${Component.displayName || Component.name})`;

    // Remove any non-react stats
    return hoistNonReactStatics(WrappedComponent, Component);
}
