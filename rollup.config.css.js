import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/app/markdown-converter/ui/css/index.pcss',
  output: {
    dir: 'src/app/markdown-converter/ui/css',
    entryFileNames: '[name].js'
  },
  plugins: [
    postcss({
      extract: true,
      plugins: [
        require('tailwindcss')({
          purge: ['./src/app/markdown-converter/ui/**/*.tsx']
        })
      ]
    })
  ]
}