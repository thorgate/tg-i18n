# tg-i18n

> Internal tool to use translations in React that are loaded from our Django backend

Old API:
Example init:

    // i18n.js
    import makeI18n, {setConfig} from 'tg-i18n';
    
    const LANGUAGE_CODE = 'en';
    const LOCALE_DATA = {
        '': {
            'domain': 'messages',
            // locale header
        },
        
        'en': {
            // translation strings
        },
    };
    
    setConfig('languageCode', LANGUAGE_CODE);
    setConfig('localeData', LOCALE_DATA || {});
    
    const i18n = makeI18n();
    
    export i18n;
    
    export {setConfig} from 'tg-i18n';
    export default i18n;

Using:

    import i18n, {gettext} from './i18n';
    
    i18n.setActiveLang('en');
    
    console.log(gettext('Test string');
    

New API:
TODO : Add more examples

    import { I18nProvider } from 'tg-i18n';
    
    // webpack.config.js
    //
    // plugins: [
    //     ...
    //     new webpack.DefinePlugin({
    //         LOCALE_DATA: i18n.loadMessages('locale', {stringify: true'}),
    //         DEFAULT_LANGUAGE: 'en',
    //     }),
    // ]
    
    class App extends React.Component {
        state = {
            activeLanguage: DEFAULT_LANGUAGE,
        };
        
        onLanguageChange = code => this.setState({activeLanguage: code});
        
        render() {
            return (
                <I18nProvider
                    defaultLanguage={this.state.activeLanguage}
                    onLanguageChange={this.onLanguageChange}
                    localeData={LOCALE_DATA}
                >
                    {this.props.children}
                </I18nProvider>
            );
        }
    }

Using:

    import { i18n } from 'tg-i18n';
    
    // Translated strings
    const MyComponent = props => (
        <span>{props.i18n.gettext('Translate this')}</span>
    );
    
    const TranslatedComponent = i18n(MyComponent);
    
    // Language changer
    const MyChangeLanguage = props (
        <button onClick={() => props.i18n.changeLanguage('en')}>Change language</button>
    );
    
    const MyLanguageChanger = i18n(MyChangeLanguage);
