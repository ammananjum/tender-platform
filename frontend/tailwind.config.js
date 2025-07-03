// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6A5ACD',
        secondary: '#C4B5FD',
        background: '#FFFFFF', // Make sure this is white
        accent: '#7C3AED',
      },
    },
  },
  plugins: [],
}
