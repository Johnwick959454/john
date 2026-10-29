/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          900: '#003C35', // Primary Emerald Green
          950: '#092824', // Dark Forest Green
        },
        gold: {
          500: '#C9A04A', // Royal Gold Accent
          600: '#b0893a',
        },
        surface: {
          light: '#F4F6F4',
          text: '#24332F',
        }
      }
    },
  },
  plugins: [],
};
