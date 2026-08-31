import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F5EF',
        sand: '#EFE7DA',
        gold: '#B59A70',
        ink: '#1D1D1B',
        muted: '#707070',
        brown: '#8B6B4A',
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
