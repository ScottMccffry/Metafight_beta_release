/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./node_modules/flowbite/**/*.js"
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#142664',
          },
          white:{
            DEFAULT: '#FFFFFF',
            light:"rgba(255, 255, 255, 0.6)",
          },
          black:{
            DEFAULT: '#000710',
            light:" rgba(20, 38, 100, 0.35)",
          },
          green:{
            DEFAULT: '#01E5B2',
            gradiant:"radial-gradient(270% 3033.24% at 18.13% -99.41%, #00E6B3 22.14%, #FFFFFF 34.58%, #01E5B2 88.93%, #FFFFFF 100%)",
            
          },
        },
      },
      screens: {
        'xs': '0px',
        'sm': '640px',
        'md': '786px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        
      },
      fontSize: {
        'xs': '10px',
        'sm': '14px',
        'tiny': '16px',
        'base': '24px',
        'lg':   '30px',
        'xl': '35px',
        '2xl': '40px',
        '3xl': '45px',
        '4xl': '50px',
        '5xl': '75px',
        '6xl': '85px',
        '7xl': '100px',
        '8xl': '20px',
      },
    },
    plugins: [
      require('flowbite/plugin')
  ],
  }
  