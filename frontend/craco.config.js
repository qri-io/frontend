// "craco" stands for: Create React App Configuration Override
// this lets us override CRA with tailwind plugin details.
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}