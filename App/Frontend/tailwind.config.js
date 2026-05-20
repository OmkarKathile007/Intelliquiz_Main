/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'], 
      },

      colors: {
        'custom-gray': '#181A1B',
      },
      backgroundImage: {
        'custom-grid': "url('./src/assets/bg-image.jpg')",
        'LoginBg':"url('./src/assets/Login.jpg')"
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        appear: 'appear linear',
        'fade-move': 'fade-move 2s ease-in-out',
        'fade-in': 'fade-in 2s ease-in-out',
        'move-up-down': 'move-up-down 2s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 2s ease-out forwards',
        'letter-pull-up': 'letter-pull-up 0.5s ease-out forwards',
      },
      keyframes: {
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
          
        },
        'letter-pull-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: 0, transform: 'translateX(-50%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'fade-move': {
          '0%': { opacity: 0, transform: 'translateY(-25px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'move-up-down': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
          '100%': { transform: 'translateY(0)' },
        },
        

      },
    },
  },
  plugins: [
    
  ],
}
