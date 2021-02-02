module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        qriblue: {
          DEFAULT: '#1B3356'
        },
        qrilightblue: {
          DEFAULT: '#4FC7F3',
          light: '#61ccf4'
        }
      }
    },
  },
  variants: {
    extend: {
      fontWeight: ['hover']
    },
  },
  plugins: [],
}
