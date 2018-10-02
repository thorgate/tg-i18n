import * as React from 'react';

import { I18nContext, I18nProvider, LocaleCatalogue, withI18n } from '../src';


export interface TestAppProps {
    catalogue: LocaleCatalogue,
    children: React.ReactNode,
}

interface TestAppState {
    activeLanguage: string | null,
}


export class TestApp extends React.Component<TestAppProps, TestAppState> {
    public state = {
        activeLanguage: 'en',
    };

    public onLangChange = (activeLanguage: string | null) => {
        this.setState({ activeLanguage });
    };

    public render() {
        const { catalogue, children } = this.props;

        return (
            <I18nProvider
                defaultLanguage="en"
                activeLanguage={this.state.activeLanguage}
                onLanguageChange={this.onLangChange}
                localeCatalogue={catalogue}
            >
                {children}
            </I18nProvider>
        );
    }
}


const DummyGettext: React.SFC<I18nContext> = ({ i18n }: I18nContext) => (
    <div>
        {i18n.gettext('test')}
    </div>
);

export const Gettext = withI18n<{}>(DummyGettext);


export type LanguageSwitchProps = I18nContext & {
    code: string | null,
    children: React.ReactNode,
}


const Switch: React.SFC<LanguageSwitchProps> = ({ i18n, code, children }: LanguageSwitchProps) => (
    <button onClick={() => i18n.changeLanguage(code)}>
        {children}
    </button>
);

export const LanguageSwitch = withI18n(Switch);
