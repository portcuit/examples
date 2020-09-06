import postcss from 'rollup-plugin-postcss'

const makeConfig = (appName) => ({
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
          purge: [`./src/app/${appName}/ui/**/*.tsx`],
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
})

export default ['html-pretty-print'].map(makeConfig)
