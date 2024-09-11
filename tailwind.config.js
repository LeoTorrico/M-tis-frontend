/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#031930', // Color de fondo del sidebar
        'light-blue': '#B3D6F9', // Color de hover en los items
        'light-gray': '#7588A5',
      },
      fontFamily: {
        title:["Montserrat",],
      },
    },
  },
  plugins: [],
}

