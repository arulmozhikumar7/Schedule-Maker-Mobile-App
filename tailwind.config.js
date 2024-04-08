/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-color': '#73e1ed',
        'text-color': '#0d323f',
        'card-bg': '#d3f8fa',
        'btn-color': '#197085',
      },
    },
  },
  plugins: [],
};
