import * as React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';

import { Gettext, LanguageSwitch, TestApp } from './TestApp';


jest.mock('warning', () => () => null);
afterEach(cleanup);


const emptyCatalogue = {
    domain: 'messages',
    locales: {},
};


const catalogue = {
    domain: 'messages',
    locales: {
        en: {
            '': {
                lang: 'en',
                plural_forms: 'nplurals=2; plural=(n != 1)',
            },
            test: ['EN: test', 'EN: tests'],
        },
        et: {
            '': {
                lang: 'en',
                plural_forms: 'nplurals=2; plural=(n != 1)',
            },
            test: ['ET: test', 'ET: tests'],
        },
    },
};


describe('I18N Provider', () => {

    test('render w/ catalogue', () => {
        const { getByText, rerender } = render(
            <TestApp catalogue={emptyCatalogue}>
                <Gettext />
                <LanguageSwitch code="et">ET</LanguageSwitch>
            </TestApp>
        );

        expect(getByText(/test$/).textContent).toEqual('test');

        rerender(
            <TestApp catalogue={catalogue}>
                <Gettext />
                <LanguageSwitch code="et">ET</LanguageSwitch>
            </TestApp>
        );

        expect(getByText(/test$/).textContent).toEqual('EN: test');

        // Language is switched
        fireEvent.click(getByText('ET'));

        expect(getByText(/test$/).textContent).toEqual('ET: test');
    });
});
