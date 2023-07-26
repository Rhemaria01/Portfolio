/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#7A7A7A",
        secondary: "#343434",
        input: "#232323",
        tertiary: "#464646"

      },
      fontSize:{
        'xl': ['1.25rem', {
          lineHeight: "1.875rem",
          letterSpacing: '-0.01rem'
        }],
        '3xl': ['1.875rem',{
          lineHeight: '2.8125rem',
          letterSpacing: '-0.01rem'
        }],
        '4xl': ['40px',{
          lineHeight: '52px',
          letterSpacing: '-0.01rem'
        }]
      },
      dropShadow:{
        'glow-white': "0 5px 25px rgba(256,256,256,0.5)",
        'glow-circle': "0 0 15px rgb(256,256,256)"
      },

    },
    fontFamily:{
      poppins: ['Poppins', 'sans-serif'],
    }
  },
  plugins: [],
}

