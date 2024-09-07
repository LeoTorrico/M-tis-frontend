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
        'light-blue': '#1c4e80', // Color de hover en los items
      },
    },
  },
  plugins: [],
}

