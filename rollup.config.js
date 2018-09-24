import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import pkg from './package.json';

const input = './compiled/index.js';
const external = ['react', 'react-native'];


// TODO : Define cli
const buildCjs = ({ env }) => ({
    input,
    external: external.concat(Object.keys(pkg.dependencies)),
    output: [
        {
            file: `./dist/${pkg.name}.cjs.${env}.js`,
            format: 'cjs',
            sourcemap: true,
        },
    ],
    plugins: [
        resolve(),
        replace({
            exclude: 'node_modules/**',
            'process.env.NODE_ENV': JSON.stringify(env),
        }),
        sourceMaps(),
    ],
});

export default [
    buildCjs({ env: 'production' }),
    buildCjs({ env: 'development' }),
    {
        input,
        external: external.concat(Object.keys(pkg.dependencies)),
        output: [
            {
                file: pkg.module,
                format: 'es',
                sourcemap: true,
            },
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true,
            },
        ],
        plugins: [
            resolve(),
            sourceMaps(),
        ],
    },
];
