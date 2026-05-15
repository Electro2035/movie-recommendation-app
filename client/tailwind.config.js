/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#151515',
        surface: '#202020',
        elevated: '#262626',
        primary: '#C44536',
        'primary-hover': '#D85646',
        'text-main': '#F3F4F6',
        'text-secondary': '#A1A1AA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};