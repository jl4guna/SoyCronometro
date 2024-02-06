/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rosa: '#f80046',
        negro: '#111827',
        blanco: '#F4F4F9',
        verde: '#27AE60',
        'verde-oscuro': '#219653',
        azul: '#2D9CDB',
        'azul-oscuro': '#2F80ED',
        rojo: '#EB5757',
        'rojo-oscuro': '#CF3838',
      },
    },
  },
  plugins: [],
};
