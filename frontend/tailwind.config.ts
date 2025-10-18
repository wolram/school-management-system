import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Miosótis School professional color palette
      colors: {
        // Primary: Professional Miosótis Blue - Trust, Education, Excellence
        primary: {
          50: '#f0f4fa',
          100: '#d9e5f0',
          200: '#b3cbdd',
          300: '#8db2ca',
          400: '#6799b7',
          500: '#4180a4', // Main primary - Professional blue
          600: '#2d5f8f',
          700: '#1e427a',
          800: '#122b65',
          900: '#0a1850',
        },
        // Secondary: Miosótis Green - Growth, Nature, Life
        secondary: {
          50: '#f1f8f4',
          100: '#d9ede5',
          200: '#b3ddcc',
          300: '#8dccb3',
          400: '#67bb99',
          500: '#41aa80', // Warm green accent
          600: '#2d8f66',
          700: '#1e744d',
          800: '#125934',
          900: '#0a3d1b',
        },
        // Accent: Miosótis Gold/Amber - Excellence, Achievement, Stars
        accent: {
          50: '#fffbf0',
          100: '#ffe8cc',
          200: '#ffd699',
          300: '#ffc366',
          400: '#ffb333',
          500: '#ffa500', // Gold accent
          600: '#cc8400',
          700: '#996300',
          800: '#664200',
          900: '#332100',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0ea5e9',
        },
      },
      // Professional fonts from Miosótis theme
      fontFamily: {
        body: ['Inter', '"Segoe UI"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Poppins', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['Menlo', 'Monaco', '"Courier New"', 'monospace'],
      },
      // Enhanced shadows for better depth
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
export default config
