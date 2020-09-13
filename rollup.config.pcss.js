import copy from 'rollup-plugin-copy'
import postcss from 'rollup-plugin-postcss'
import virtual from "@rollup/plugin-virtual";

const makeConfig = (appName) => ([
  {
    input: `src/app/${appName}/ui/css/index.pcss`,
    output: {
      dir: `src/app/${appName}/ui/css`,
      entryFileNames: '[name].js'
    },
    plugins: [
      postcss({
        extract: true,
        plugins: [
          require('tailwindcss')({
            purge: [`src/app/${appName}/ui/**/*.tsx`],
            theme: {
              extend: {
                height: {
                  'screen-1/4': '25vh',
                  'screen-1/2': '50vh',
                  'screen-1/3': '75vh'
                }
              }
            }
          })
        ]
      })
    ]
  },
  ...(process.env.NODE_ENV === 'production' ? [{
    input: 'dummy',
    plugins: [
      virtual({
        dummy: `console.log('dummy');`
      }),
      copy({
        targets: [
          {src: `src/app/${appName}/ui/css/index.css`, dest: `public/${appName}/css`}
        ],
        verbose: true
      })
    ]
  }] : [])
])

export default [
  'html-pretty-print',
  'worker-todomvc'
].flatMap(makeConfig)

