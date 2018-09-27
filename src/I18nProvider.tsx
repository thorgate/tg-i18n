// I18nProvider
import * as React from 'react';

import { gettext, ngettext, pgettext, npgettext, interpolate, setConfig, activateLanguage } from './config';
import { I18nProviderProps, I18nProps } from './types';
import { Provider } from './withI18N';


export { I18nProviderProps } from './types';

export class I18nProvider extends React.Component<I18nProviderProps, I18nProps> {
    constructor(props: I18nProviderProps) {
        super(props);

        // Set initial config
        setConfig('localeCatalogue', props.localeCatalogue);
        setConfig('defaultLanguage', props.defaultLanguage);
        setConfig('activeLanguage', props.activeLanguage);

        this.state = {
            activeLanguage: props.activeLanguage,
            gettext,
            ngettext,
            pgettext,
            npgettext,
            interpolate,
            changeLanguage: this.onChangeLanguage,
        };
    }

    componentDidUpdate(prevProps: I18nProviderProps) {
        if (prevProps.defaultLanguage !== this.props.defaultLanguage) {
            setConfig('defaultLanguage', this.props.defaultLanguage);
        }

        if (prevProps.localeCatalogue !== this.props.localeCatalogue) {
            setConfig('localeCatalogue', this.props.localeCatalogue);
        }

        if (prevProps.activeLanguage !== this.props.activeLanguage) {
            setConfig('activeLanguage', this.props.activeLanguage);
            this.setState({ activeLanguage: this.props.activeLanguage });
        }
    }

    onChangeLanguage = (languageCode: string, force: boolean = false) => {
        activateLanguage(languageCode, force, this.props.onLanguageChange);
    };

    render() {
        return (
            <Provider value={this.state}>
                {this.props.children}
            </Provider>
        );
    }
}
