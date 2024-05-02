/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
        gris: '#BDBDBD',
        'gris-oscuro': '#333333',
      },
      fontFamily: {
        gta: 'Pricedown Bl',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
};
