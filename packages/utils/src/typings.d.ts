declare module 'gettext-parser' {
    const getTextParser: {
        po: {
            compile: (catalogue: any) => Buffer,
            parse: (fileData: string | Buffer) => any,
        }
    };

    export = getTextParser;
}
