import * as React from 'react';

import { activateLanguage, gettext, interpolate, ngettext, npgettext, pgettext, setConfig } from './config';
import { I18nProps, I18nProviderProps } from './types';
import { Provider } from './withI18N';


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

    public componentDidUpdate(prevProps: I18nProviderProps) {
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

    public onChangeLanguage = (languageCode: string, force: boolean = false) => {
        activateLanguage(languageCode, force, this.props.onLanguageChange);
    };

    public render() {
        return (
            <Provider value={this.state}>
                {this.props.children}
            </Provider>
        );
    }
}
