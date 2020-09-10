import postcss from 'rollup-plugin-postcss'

const makeConfig = (appName) => ({
  input: `public/${appName}/css/index.pcss`,
  output: {
    dir: `public/${appName}/css`,
    entryFileNames: '[name].js'
  },
  plugins: [
    postcss({
      extract: true,
      plugins: [
        require('tailwindcss')({
          purge: [`public/${appName}/**/*.tsx`],
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

export default [
  'html-pretty-print',
  'worker-todomvc'
].map(makeConfig)
