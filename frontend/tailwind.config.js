/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        furniro: {
          gold: '#B88E2F',
          goldHover: '#9E7724',
          cream: '#FFF3E3',
          linen: '#F9F1E7',
          bg: '#FCF8F3',
          dark: '#3A3A3A',
          grey: '#666666',
          lightGrey: '#898989',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        furniro: '0 4px 20px rgba(184, 142, 47, 0.15)',
        'furniro-lg': '0 10px 30px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
