import path from 'path';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const PKG_ROOT = process.cwd();
const PKG = require(path.join(PKG_ROOT, 'package.json'));

const configs = [];
const external = ['fs', 'path'];

const createConfig = (input, output, tsconfigOverride) => ({
    input,
    external: [
        ...external,
        ...Object.keys(PKG.dependencies || {}),
        ...Object.keys(PKG.peerDependencies || {}),
    ],
    output,
    plugins: [
        resolve(),
        commonjs(),
        replace({
            exclude: 'node_modules/**',
            VERSION: PKG.version,
            delimiters: ['<@ ', ' @>'],
        }),
        typescript({
            cacheRoot: `${require('temp-dir')}/.rpt2_cache`,
            typescript: require('typescript'),
            tslib: require('tslib'),
            useTsconfigDeclarationDir: true,
            tsconfig: path.join(PKG_ROOT, '/tsconfig.json'),
            tsconfigOverride,
        }),
    ],
});

console.log(`\nBuilding ${PKG.name}`);

const output = [];

if (PKG.module) {
    output.push({
        file: PKG.module,
        format: 'es',
    });
}

if (PKG.main) {
    output.push({
        file: PKG.main,
        format: 'cjs',
    });
}

if (output.length) {
    configs.push(createConfig('./src/index.ts', output, { compilerOptions: { declaration: true } }))
}


if (PKG.bin && typeof PKG.bin === 'string') {
    configs.push(createConfig('', {
        file: PKG.bin,
        format: 'cjs',
        banner: '#!/usr/bin/env node\n',
    }, { compilerOptions: { declaration: true, target: 'es5' } }));
} else if (PKG.bin) {
    Object.keys(PKG.bin).map((key) => PKG.bin[key]).forEach((bin) => {
        configs.push(createConfig(bin.replace(/\.\/bin\/(.+)\.js/, './src/$1.ts'), {
            file: bin,
            format: 'cjs',
            banner: '#!/usr/bin/env node\n',
        }, { compilerOptions: { declaration: true, target: 'es5' } }));

    });
}


if (!configs.length) {
    console.error('Missing rollup configs');
    process.exit(1);
}

export default configs;
