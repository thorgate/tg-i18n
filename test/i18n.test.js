import { I18N } from '../src/i18n';


// TODO : Add other tests to ensure translations work
describe('I18N', () => {
    test('Interpolate', () => {
        const i18n = new I18N('en', 'en', { en: '{}' });
        expect(i18n.interpolate('Lets count from %s to %s', 1, 100)).toEqual('Lets count from 1 to 100');
        expect(i18n.interpolate('Test string %(num)s', { num: 1 })).toEqual('Test string 1');
    });
});
