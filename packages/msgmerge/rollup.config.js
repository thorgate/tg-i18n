import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const input = './src/index.ts';
const external = ['fs', 'path'];

export default [
    {
        input,
        external: [
            ...external,
            ...Object.keys(pkg.dependencies || {}),
            // ...Object.keys(pkg.peerDependencies || {}),
        ],
        output: [
            {
                file: pkg.module,
                format: 'es',
            },
            {
                file: pkg.main,
                format: 'cjs',
            },
        ],
        plugins: [
            resolve(),
            commonjs(),
            replace({
                exclude: 'node_modules/**',
                VERSION: pkg.version,
                delimiters: ['<@', '@>'],
            }),
            typescript({
                check: true,
                cacheRoot: '/tmp/.tg-i18n-rts2_cache',
                typescript: require('typescript'),
            }),
            json({
                compact: true,
            }),
        ],
    },
];
