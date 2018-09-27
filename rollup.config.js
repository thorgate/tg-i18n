import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const input = './src/index.ts';
const external = ['react', 'react-native', 'fs', 'path'];

export default [
    {
        input,
        external: external.concat(Object.keys(pkg.dependencies)),
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
                clean: true,
                cacheRoot: __dirname + '/.rts2_cache',
            }),
            json({
                compact: true,
            }),
        ],
    },
];
