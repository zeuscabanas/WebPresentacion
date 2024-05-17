/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        // Puedes agregar más tamaños de pantalla si es necesario
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

