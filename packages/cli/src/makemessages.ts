import * as yargs from 'yargs';

import { Makemessages } from '@thorgate/node-makemessages';


const argv = yargs
    .usage('Usage: $0 [options]')
    .scriptName('node-makemessages')
    .option('path', {
        string: true,
        normalize: true,
        alias: 'p',
        default: '.',
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
        description: 'Locales to exclude. Can be used multiple times. ' +
            'If "locale" and exclude are both specified',
        type: 'string',
    })
    .option('extension', {
        array: true,
        alias: 'e',
        default: 'js',
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
        description: 'Display help message',
    })
    .help('h')
    .version('version', '<@ VERSION @>').alias('v', 'version')
    .epilog('for more information visit https://github.com/thorgate/tg-i18n')
    .group([
        'path', 'domain', 'locale', 'exclude', 'extension', 'locale-dir', 'show-pot', 'keep-pot', 'all',
    ], 'Message options:')
    .argv;


try {
    const makemessages = new Makemessages({
        all: argv.all,
        path: argv.path,
        domain: argv.domain,
        locales: argv.locale,
        excludes: argv.exclude,
        extensions: argv.extension,
        keepPot: argv['keep-pot'],
        localeDir: argv['locale-dir'],
    });

    // Run makemessages
    makemessages.process();
} catch (error) {
    console.error(error);
}
