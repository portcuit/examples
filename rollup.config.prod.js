import alias from '@rollup/plugin-alias'
import { terser } from "rollup-plugin-terser";

const outDir = 'src/app/ui/esm'

export default {
  input: {
    'worker-todomvc/client/top/main': `${outDir}/app/worker-todomvc/client/top/main`
  },
  output: {
    dir: `${outDir}/app`,
    format: 'es',
    entryFileNames: '[name].js'
  },
  plugins: [
    alias({
      entries:[
        {find: /^\/esm\/(.*)/, replacement: `${__dirname}/${outDir}/$1`}
      ]
    }),
    terser()
  ]
}
