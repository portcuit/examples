import alias from '@rollup/plugin-alias'
import { terser } from "rollup-plugin-terser";

export default {
  input: {
    'worker-todomvc/client/top/main': 'src/app/ui/esm/app/worker-todomvc/client/top/main'
  },
  output: {
    dir: 'src/app/ui/esm/app',
    format: 'es',
    entryFileNames: '[name].js'
  },
  plugins: [
    alias({
      entries:[
        {find: /^\/esm\/(.*)/, replacement: `${__dirname}/src/app/ui/esm/$1`}
      ]
    }),
    terser()
  ]
}
