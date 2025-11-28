/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          accent: '#10b981',
          light: '#d1fae5',
          dark: '#064e3b'
        }
      }
    },
  },
  plugins: [],
}
