const {['@pkit/web']:{docRoot, jsRoot}} = require('./package');
const outDir = [docRoot, jsRoot].join('/');

const tsConfig = {
  "extends": "./tsconfig.esm.json",
  "compilerOptions": {
  "allowJs": true,
    "outDir": `${outDir}/snabbdom`,
    "rootDir": "node_modules/snabbdom/build/package"
  },
  "include": [
    "./node_modules/snabbdom/build/package"
  ]
}

module.exports = tsConfig;

console.log(JSON.stringify(tsConfig, undefined, 2));
