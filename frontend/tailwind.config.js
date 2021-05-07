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
        // blush-600 approximates qri red, from https://tailwind.ink/
        blush: {
          '50':  '#fdfcfb',
          '100': '#fcf0ee',
          '200': '#f9cbde',
          '300': '#f19dbc',
          '400': '#f06c97',
          '500': '#e64878',
          '600': '#eb325a',
          '700': '#ad243f',
          '800': '#801929',
          '900': '#501015',
        },
        // olive-300 is the green used for the automation icon, etc, from https://tailwind.ink/
        olive: {
          '50':  '#f9f8f1',
          '100': '#f5efb3',
          '200': '#e9e173',
          '300': '#b6d05e',
          '400': '#939a23',
          '500': '#707d10',
          '600': '#59650a',
          '700': '#464c0a',
          '800': '#30340a',
          '900': '#212008',
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
