const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

// "craco" stands for: Create React App Configuration Override
// this lets us override CRA with tailwind and webpack plugin details.
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack:{
    plugins: [
      new MonacoWebpackPlugin({
        // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: ['python'],
      })
    ]
  }
}