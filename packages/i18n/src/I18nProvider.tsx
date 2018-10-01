import * as React from 'react';

import { I18N } from './config';
import { I18nProps, I18nProviderProps } from './types';
import { Provider } from './withI18N';


export class I18nProvider extends React.Component<I18nProviderProps, I18nProps> {
    constructor(props: I18nProviderProps) {
        super(props);

        this.i18n = new I18N({
            localeCatalogue: props.localeCatalogue,
            defaultLanguage: props.defaultLanguage,
            activeLanguage: props.activeLanguage,
        });

        this.state = {
            activeLanguage: props.activeLanguage,
            gettext: this.i18n.gettext,
            ngettext: this.i18n.ngettext,
            pgettext: this.i18n.pgettext,
            npgettext: this.i18n.npgettext,
            interpolate: I18N.interpolate,
            changeLanguage: this.onChangeLanguage,
        };
    }

    private i18n: I18N;

    public componentDidUpdate(prevProps: I18nProviderProps) {
        if (prevProps.localeCatalogue !== this.props.localeCatalogue) {
            this.i18n.setLocaleCatalogue(this.props.localeCatalogue, this.onLanguageChanged);
        }

        if (prevProps.activeLanguage !== this.props.activeLanguage) {
            this.i18n.activateLanguage(this.props.activeLanguage, false, this.props.onLanguageChange);
        }
    }

    public onLanguageChanged = (languageCode: string | null) => this.setState({ activeLanguage: languageCode });

    public onChangeLanguage = (languageCode: string | null, force: boolean = false) => {
        this.i18n.activateLanguage(languageCode, force, this.props.onLanguageChange);
    };

    public render() {
        return (
            <Provider value={this.state}>
                {this.props.children}
            </Provider>
        );
    }
}
