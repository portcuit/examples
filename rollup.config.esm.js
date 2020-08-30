import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const esmDir = 'src/esm';
const outputDir = 'esm';

const createConfig = (name) => ({
  input: name,
  output: {
    dir: `${outputDir}/${name}`,
    entryFileNames: 'index.js',
    sourcemap: true,
    format: 'module'
  },
  plugins: [
    nodeResolve({
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
  ]
})

export default [
  "minimatch",
  'ramda',
  'dayjs',
].map((name) => createConfig(name))
