import alias from '@rollup/plugin-alias'
import { terser } from "rollup-plugin-terser";

const makeConfig = (name) => ({
  input: {
    [name]: `src/app/esm/app/${name}`
  },
  output: {
    dir: 'src/app/esm/app',
    format: 'iife',
    entryFileNames: '[name].js'
  },
  plugins: [
    alias({
      entries:[
        {find: /^\/esm\/(.*)/, replacement: `${__dirname}/src/app/esm/$1`}
      ]
    }),
    terser({
      mangle: {
        reserved: ['ReplaceObject', 'ReplaceArray', 'EphemeralBoolean', 'splice', 'padArray']
      }
    })
  ]
})

export default [
  'worker-todomvc/client/app/main'
].map(makeConfig)
