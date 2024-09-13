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
        'semi-blue': '#223A59',
        'sky-blue': '#3684DB',
      },
      fontFamily: {
        title:["Montserrat",],
      },

      fontWeight: {
        normal: 400,    
        bold: 700,        
        light: 300,       
        semiBold: 600,    
        extraBold: 800,   
      },

      borderRadius: {
        'custom-sm': '280px',
        'custom-md': '180px',
        'custom-lg': '240px',
        'custom-xl': '32px',
      }
    },
  },
  plugins: [],
}

