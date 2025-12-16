// tailwind.config.js
//import muiTailwindPlugin from './src/core/tailwind/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",'./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  //plugins: [muiTailwindPlugin]
  plugins:[]
};