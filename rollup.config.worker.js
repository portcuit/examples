import alias from '@rollup/plugin-alias'
import { terser } from "rollup-plugin-terser";

const outDir = 'public/esm'

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
        {find: /^\/esm\/(.*)/, replacement: `${__dirname}/${outDir}/$1`}
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
  'worker-todomvc/client/app/main',
  'html-pretty-print/client/app/main'
].map(makeConfig)
