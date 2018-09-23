// @flow
import * as React from 'react';
import hoistStatics from 'hoist-non-react-statics';

import { type I18nObject } from '.';
// eslint-disable-next-line no-unused-vars
import { I18nContext } from './provider';


type TargetComponent<Props> = React.ComponentType<{ i18n: I18nObject } & Props>;


function i18n<Props: {}>(Target: TargetComponent<Props>): React.ComponentType<Props> {
    const WrappedComponent = (props: Props) => (
        <I18nContext.Consumer>
            {(i18nObj: I18nObject) => <Target i18n={i18nObj} {...props} />}
        </I18nContext.Consumer>
    );

    WrappedComponent.displayName = `i18n(${Target.displayName || Target.name})`;

    return hoistStatics(WrappedComponent, Target);
}

export default i18n;
