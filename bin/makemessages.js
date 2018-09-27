#! /usr/bin/env node
const yargs = require('yargs');
const { MakeMessages } = require('../dist/tg-i18n');


const argv = yargs
    .usage('Usage: $0 [options]')
    .scriptName('i18n-makemessages')
    .option('path', {
        string: true,
        normalize: true,
        alias: 'p',
        default: 'src',
        description: 'Source folder to scan.',
    })
    .option('domain', {
        string: true,
        default: 'messages',
        description: 'Domain of the messages file.',
    })
    .option('locale', {
        array: true,
        alias: 'l',
        description: 'Creates or updates the messages for the given locale. Can be used multiple times.',
    })
    .option('exclude', {
        array: true,
        alias: 'x',
        description: 'Locales to exclude. Can be used multiple times. '
            + 'If "locale" and exclude are both specified',
        type: 'string',
    })
    .option('extension', {
        array: true,
        alias: 'e',
        default: ['js', 'jsx', 'ts', 'tsx'],
        description: 'Define extensions to examine. Can be used multiple times.',
    })
    .option('locale-dir', {
        normalize: true,
        string: true,
        default: 'locale',
        description: 'Creates or updates the messages for the given locale. Can be used multiple times.',
    })
    .option('keep-pot', {
        boolean: true,
        default: false,
        description: 'Keep the .pot file. Can be helpful for debugging.',
    })
    .option('all', {
        boolean: true,
        alias: 'a',
        default: false,
        description: 'Update messages for all existing locale files.',
    })
    .option('h', {
        alias: 'help',
        description: 'Display this help message',
    })
    .help('h')
    .alias('version', 'v')
    .epilog('for more information visit https://github.com/thorgate/tg-i18n')
    .group([
        'path', 'domain', 'locale', 'exclude', 'extension', 'locale-dir', 'show-pot', 'keep-pot', 'all',
    ], 'Message options:').argv;

try {
    const cli = new MakeMessages(argv);
    cli.process();
} catch (error) {
    console.error('%s', error.stack);
}
