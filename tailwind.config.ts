import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#faf7f4',
          100: '#f5ede4',
          200: '#ead9c8',
          300: '#ddc0a5',
          400: '#c99d6f',
          500: '#b8824f',
          600: '#a96f44',
          700: '#8c5a3a',
          800: '#734a35',
          900: '#5f3e2f',
        },
        earth: {
          50: '#faf8f5',
          100: '#f4efe6',
          200: '#e7dcc9',
          300: '#d6c2a5',
          400: '#c2a47c',
          500: '#b38d5f',
          600: '#a67a4f',
          700: '#8a6342',
          800: '#715139',
          900: '#5d4330',
        },
      },
    },
  },
  plugins: [],
}
export default config

