import { interpolate } from '../src/config';


describe('I18N', () => {
    test('Interpolate', () => {
        expect(interpolate('Lets count from %s to %s', 1, 100)).toEqual('Lets count from 1 to 100');
        expect(interpolate('Test string %(num)s', { num: 1 })).toEqual('Test string 1');
    });
});
