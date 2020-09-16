import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import packageJson from './package.json'

const {['@pkit/web']:{modules, docRoot, jsRoot}} = packageJson;
const outDir = [docRoot, jsRoot].join('/');

const createConfig = (name) => ({
  input: name,
  output: {
    dir: `${outDir}/${name}`,
    entryFileNames: 'index.js',
    sourcemap: true,
    format: 'module'
  },
  plugins: [
    json(),
    alias({
      entries: [
        {find: 'path', replacement: 'rollup-plugin-node-builtins/src/es6/path'}
      ]
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
      'process.cwd()': '"/"',
      'this._mLastChar[1] = aBuf[0];': 'try{this._mLastChar[1]=aBuf[0];}catch(e){}',
      'this._mLastChar[0] = aBuf[aLen - 1];': 'try{this._mLastChar[0]=aBuf[aLen - 1];}catch(e){}',
      delimiters: ['', ''],
    })
  ]
})

export default modules.map((name) => createConfig(name))
