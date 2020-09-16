const {['@pkit/web']:{modules, docRoot, jsRoot}} = require('./package');
const outDir = [docRoot, jsRoot].join('/');

const tsConfig = {
  "extends": "./tsconfig.esm.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": outDir,
    "plugins": [
      {
        "transform": "ts-transformer-esm-web",
        "resolve": [
          {
            "prefix": `/${jsRoot}/`,
            "suffix": ".js",
            "modules": ["snabbdom/**"]
          },
          {
            "prefix": `/${jsRoot}/vendor/`,
            "suffix": "/index.js",
            "modules": ["pkit", "pkit/**", "@pkit/**"]
          },
          {
            "prefix": `/${jsRoot}/`,
            "suffix": "/index.js",
            modules
          }
        ],
        "replace": {
          "../server/": `/${jsRoot}/vendor/@pkit/next/mock/server.js`,
          ...[
            "jsx", "h", "tovnode", "init",
            "modules/attributes", "modules/props", "modules/style", "modules/eventlisteners", "modules/dataset"
          ].reduce((acc, name) => ({
            ...acc,
            [`@pkit/snabbdom/lib/${name}`]: `/${jsRoot}/snabbdom/${name}.js`
          }), {}),
        },
        "after": true
      }
    ]
  },
  "include": [
    "src/app",
    "src/vendor"
  ]
}

module.exports = tsConfig;

console.log(JSON.stringify(tsConfig, undefined, 2));
