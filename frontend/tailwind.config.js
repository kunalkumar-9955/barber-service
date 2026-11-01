/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: '#fcbe32',
        dark: '#07070d',
        panel: 'rgba(255,255,255,0.08)'
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0,0,0,0.25)'
      }
    }
  },
  plugins: []
};
