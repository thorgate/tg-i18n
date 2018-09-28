import * as yargs from 'yargs';

import { CompileMessages, FileOutputMode } from '@thorgate/node-compilemessages';


const argv = yargs
    .usage('Usage: $0 [options]')
    .scriptName('node-compilemessages')
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
    .option('locale-dir', {
        normalize: true,
        string: true,
        default: 'locale',
        description: 'Creates or updates the messages for the given locale. Can be used multiple times.',
    })
    .option('combined', {
        boolean: true,
        default: false,
        description: 'Generate combined .json file from .po files',
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
        'combined', 'domain', 'locale', 'exclude', 'locale-dir', 'all',
    ], 'Message options:')
    .argv;


try {
    const compilemessages = new CompileMessages({
        all: argv.all,
        domain: argv.domain,
        locales: argv.locale,
        excludes: argv.exclude,
        localeDir: argv['locale-dir'],
        outputMode: argv.combined ? FileOutputMode.COMBINED : FileOutputMode.SEPARATE,
    });

    // Run compilemessages
    compilemessages.process();
} catch (error) {
    console.error(error);
}
