module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        qriblue: {
          '50': '#BFEEFF',
          '100': '#A6E7FF',
          '200': '#8CE0FF',
          '300': '#6ED8FF',
          '400': '#53D1FF',
          '500': '#4FC7F3',
          'DEFAULT': '#4FC7F3',
          '600': '#3DAFD9',
          '700': '#3F9DBF',
          '800': '#3788A6',
          '900': '#2E738C'
        },
        qrinavy: {
          '50': '#6B97D6',
          '100': '#5781BD',
          '200': '#416AA3',
          '300': '#32568A',
          '400': '#234370',
          '500': '#1B3356',
          DEFAULT: '#1B3356',
          '600': '#10223D',
          '700': '#0D1C33',
          '800': '#0A1629',
          '900': '#081221'
        },
      },
    },
  },
  variants: {
    extend: {
      fontWeight: ['hover'],
      cursor: ['hover']
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
