import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Rotary-inspired color palette
      colors: {
        // Primary: Rotary Blue
        primary: {
          50: '#f0f5ff',
          100: '#d9e5ff',
          200: '#b3ccff',
          300: '#8db2ff',
          400: '#6699ff',
          500: '#3366ff',
          600: '#2952cc',
          700: '#1f3d99',
          800: '#152966',
          900: '#0a1533',
        },
        // Secondary: Rotary Gold
        secondary: {
          50: '#fffbf0',
          100: '#ffe8cc',
          200: '#ffd699',
          300: '#ffc366',
          400: '#ffb333',
          500: '#ffa500',
          600: '#cc8400',
          700: '#996300',
          800: '#664200',
          900: '#332100',
        },
        // Accent colors
        accent: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0ea5e9',
        },
      },
      // Professional fonts
      fontFamily: {
        body: ['Open Sans', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        heading: ['Roboto Slab', 'Georgia', 'serif'],
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
