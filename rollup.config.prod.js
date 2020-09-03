import alias from '@rollup/plugin-alias'
import { terser } from "rollup-plugin-terser";

export default {
  input: {
    'worker-todomvc/client/top/main': 'src/app/esm/app/worker-todomvc/client/top/main'
  },
  output: {
    dir: 'src/app/esm/app',
    format: 'es',
    entryFileNames: '[name].js'
  },
  plugins: [
    alias({
      entries:[
        {find: /^\/esm\/(.*)/, replacement: `${__dirname}/src/app/esm/$1`}
      ]
    }),
    terser()
  ]
}
