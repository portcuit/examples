import alias from '@rollup/plugin-alias'
import { terser } from "rollup-plugin-terser";
import packageJson from './package.json'

const {['@pkit/web']:{jsRoot, docRoot}} = packageJson;
const outDir = [docRoot, jsRoot].join('/');

const makeConfig = (name) => ({
  input: {
    [name]: `${outDir}/app/${name}`
  },
  output: {
    dir: `${outDir}/app`,
    format: 'iife',
    entryFileNames: '[name].js'
  },
  plugins: [
    alias({
      entries:[
        // {find: /^\/js\/(.*)/, replacement: `${__dirname}/${outDir}/$1`}
        {find: new RegExp(`^/${jsRoot}/(.*)`), replacement: `${__dirname}/${outDir}/$1`}
      ]
    }),
    terser({
      mangle: {
        reserved: ['ReplaceObject', 'ReplaceArray', 'EphemeralBoolean', 'EphemeralString', 'EphemeralContainer', 'splice', 'padArray']
      }
    })
  ]
})

export default [
  'worker-todomvc/ui/main',
  'html-pretty-print/ui/main'
].map(makeConfig)
