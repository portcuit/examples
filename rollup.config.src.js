import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default {
  input: {
    'worker-todomvc/client/app/main': 'src/app/worker-todomvc/client/app/main.js'
  },
  output: {
    dir: 'src/app/esm/app',
    format: 'iife',
    entryFileNames: '[name].js'
  },
  plugins: [
    json(),
    alias({
      entries: [
        {find: 'path', replacement: 'rollup-plugin-node-builtins/src/es6/path'},
        {find: 'snabbdom/modules/class', replacement: 'snabbdom/build/package/modules/class'},
        {find: 'snabbdom/modules/props', replacement: 'snabbdom/build/package/modules/props'},
        {find: 'snabbdom/modules/attributes', replacement: 'snabbdom/build/package/modules/attributes'},
        {find: 'snabbdom/modules/eventlisteners', replacement: 'snabbdom/build/package/modules/eventlisteners'},
        {find: 'snabbdom/modules/dataset', replacement: 'snabbdom/build/package/modules/dataset'},
        {find: 'snabbdom/modules/style', replacement: 'snabbdom/build/package/modules/style'},
        {find: 'snabbdom/tovnode', replacement: 'snabbdom/build/package/tovnode'},
        {find: 'snabbdom/init', replacement: 'snabbdom/build/package/init'},
        {find: '@pkit/snabbdom/lib/jsx', replacement: 'snabbdom/build/package/jsx'},
        {find: '@pkit/snabbdom/lib/h', replacement: 'snabbdom/build/package/h'}
      ]
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG)
    }),
  ]
}
