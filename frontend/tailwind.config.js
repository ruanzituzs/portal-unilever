/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        unilever: {
          blue: '#1F36C7', // Example Unilever Blue
          light: '#F2F2F2',
          dark: '#333333'
        }
      }
    },
  },
  plugins: [],
}
