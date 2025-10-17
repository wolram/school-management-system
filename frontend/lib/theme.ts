// Rotary-inspired Theme for School Management System
// Based on Rotary International branding guidelines

export const rotaryTheme = {
  // Primary Colors - Rotary Blue Theme
  colors: {
    primary: {
      50: '#f0f5ff',
      100: '#d9e5ff',
      200: '#b3ccff',
      300: '#8db2ff',
      400: '#6699ff',
      500: '#3366ff', // Rotary Primary Blue
      600: '#2952cc',
      700: '#1f3d99',
      800: '#152966',
      900: '#0a1533',
    },
    secondary: {
      50: '#fffbf0',
      100: '#ffe8cc',
      200: '#ffd699',
      300: '#ffc366',
      400: '#ffb333',
      500: '#ffa500', // Gold/Amber - Rotary Secondary
      600: '#cc8400',
      700: '#996300',
      800: '#664200',
      900: '#332100',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    accent: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9',
    },
  },

  // Typography - Professional & Accessible
  fonts: {
    // Main body text - Open Sans (sans-serif fallback)
    body: 'Open Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    // Headings - Roboto Slab for structure
    heading: 'Roboto Slab, Georgia, serif',
    // Code/Technical
    mono: 'Menlo, Monaco, "Courier New", monospace',
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Spacing Scale
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Rotary Theme CSS Variables for Tailwind
export const rotaryThemeCss = `
@layer theme {
  :root {
    /* Primary Blue - Rotary */
    --color-primary: #3366ff;
    --color-primary-dark: #2952cc;
    --color-primary-light: #6699ff;

    /* Secondary Gold - Rotary */
    --color-secondary: #ffa500;
    --color-secondary-dark: #cc8400;
    --color-secondary-light: #ffb333;

    /* Neutral Colors */
    --color-neutral-900: #111827;
    --color-neutral-800: #1f2937;
    --color-neutral-700: #374151;
    --color-neutral-600: #4b5563;
    --color-neutral-500: #6b7280;
    --color-neutral-400: #9ca3af;
    --color-neutral-300: #d1d5db;
    --color-neutral-200: #e5e7eb;
    --color-neutral-100: #f3f4f6;
    --color-neutral-50: #f9fafb;

    /* Accent Colors */
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-info: #0ea5e9;

    /* Fonts */
    --font-body: Open Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --font-heading: Roboto Slab, Georgia, serif;
    --font-mono: Menlo, Monaco, "Courier New", monospace;
  }
}
`;

export default rotaryTheme;
