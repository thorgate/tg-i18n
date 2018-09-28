import * as yargs from 'yargs';

import { mergeFile } from '@thorgate/node-msgmerge';


const argv = yargs
    .usage('Usage: $0 [options]')
    .scriptName('node-msgmerge')
    .positional('ref', {
        describe: 'Po/Pot file containing new translations',
    })
    .positional('def', {
        describe: 'Existing Po/Pot file',
    })
    .positional('out', {
        describe: 'Output file',
    })
    .option('language', {
        string: true,
        alias: 'l',
        description: 'Override language, language-team and plural forms to this language',
    })
    .option('h', {
        alias: 'help',
        description: 'Display help message',
    })
    .help('h')
    .version('version', '<@ VERSION @>').alias('v', 'version')
    .epilog('for more information visit https://github.com/thorgate/tg-i18n')
    .group(['ref', 'def', 'out', 'language'], 'Merge options:')
    .argv;


try {
    mergeFile(argv.ref, argv.def, argv.out, {
        language: argv.language,
    });
} catch (error) {
    console.error(error);
}
