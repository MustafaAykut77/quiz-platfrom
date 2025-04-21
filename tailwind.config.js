module.exports = {
  mode: 'jit',
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#202225',
        secondary: '#5865f2',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('tw-animate-css')],
}
