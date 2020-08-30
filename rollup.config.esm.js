// import {identity} from 'ramda'
// import {dirname,basename} from 'path'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import virtual from '@rollup/plugin-virtual'
// import {terser} from 'rollup-plugin-terser';
// import typescript from '@rollup/plugin-typescript'

const esmDir = 'src/esm';
const outputDir = 'esm';

const createConfig = (name) => ({
  // input: `${esmDir}/${name}`,
  input: name,
  output: {
    // dir: `${['esm',dirname(name)].filter(identity).join('/')}`,
    dir: `${outputDir}/${name}`,
    entryFileNames: 'index.js',
    sourcemap: true,
    format: 'module',
    // entryFileNames: `${basename(name)}.js`
  },
  // external: ['/esm/path/index.js'],

  plugins: [
    virtual({
      // path: 'export default null',
      // 'snabbdom/init': 'export * from "snabbdom/build/package/init"'
    }),

    alias({
      entries: [
        // {find: 'snabbdom/init', replacement: 'snabbdom/build/package/init'}
        // {find: 'path', replacement: `/esm/path/index.js`}
      ]
    }),


    nodeResolve({
      // mainFields: ['module'],
      browser: true,
      preferBuiltins: false
    }),

    commonjs({
      ignore: ['path']
    }),


    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG)
    }),
    // typescript({
    //   declaration: false,
    //   outDir: `${['esm',dirname(name)].filter(identity).join('/')}`,
    // }),
    // terser()
  ]
})

export default [
  "minimatch",
  'ramda',
  'dayjs',
].map((name) => createConfig(name))
