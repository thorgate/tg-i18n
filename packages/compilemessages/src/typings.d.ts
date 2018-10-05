declare module 'po2json' {
    interface Po2jsonOptions {
        pretty?: boolean,
        fuzzy?: boolean,
        stringify?: boolean,
        format?: string,
        domain?: string,
        charset?: string,
        fullMF?: boolean,
    }

    const po2json: {
        parse: (fileData: string | Buffer, options?: Po2jsonOptions) => any,
        parseFile: (fileName: string, options: Po2jsonOptions, cb: (error: any, catalogue: any) => void) => any,
        parseFileSync: (fileName: string, options?: Po2jsonOptions) => any,
    };

    export = po2json;
}
