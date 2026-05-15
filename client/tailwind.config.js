/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
        // Light mode colors
        'light-bg': '#F7F3EF',
        'light-text': '#1F2937',
        'light-text-secondary': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};