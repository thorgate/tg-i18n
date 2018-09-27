export const HeaderKeyOrder = [
    'content-type',
    'project-id-version',
    'report-msgid-bugs-to',
    'pot-creation-date',
    'po-revision-date',
    'last-translator',
    'language-team',
    'language',
    'mime-version',
    'content-transfer-encoding',
    'plural-forms',
];


export function makeArray<T>(value: T, length: number): T[] {
    const array = [];
    let i = 0;

    while (i < length) {
        array.push(value);

        i += 1;
    }

    return array;
}
