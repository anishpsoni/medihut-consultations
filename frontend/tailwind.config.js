/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7f6',
          100: '#e3e9e7',
          200: '#c5d3ce',
          300: '#9eb4ad',
          400: '#75938a',
          500: '#56766d',
          600: '#425d57',
          700: '#354a46',
          800: '#2d3d3a',
          900: '#263331',
          DEFAULT: '#2d3d3a', // Rich dark green/black
        },
        sand: {
          50: '#fdfcf8',
          100: '#fbf9f1',
          200: '#f5f0e1',
          300: '#ede0c3',
          400: '#e2cba0',
          500: '#d6b27e',
          600: '#c29661',
          700: '#a2764b',
          800: '#855f41',
          900: '#6e4e38',
        },
        medical: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
