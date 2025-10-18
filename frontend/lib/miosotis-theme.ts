// Educandário Miosótis - Professional Theme
// Based on school branding and identity guidelines

export const miosotisTheme = {
  // Professional Color Palette - Premium Education Brand
  colors: {
    // Primary: Deep Professional Blue - Trust, Education, Excellence
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
    // Secondary: Warm Green - Growth, Nature, Life
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
    // Accent: Gold/Amber - Excellence, Achievement, Stars
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
    },
    // Status Colors
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9',
    },
    // Neutral - Professional grays
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
  },

  // Professional Typography
  fonts: {
    body: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'Menlo, Monaco, "Courier New", monospace',
  },

  // Font Sizes - Professional hierarchy
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
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
  },

  // Border Radius - Modern, rounded
  borderRadius: {
    none: '0',
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows - Professional depth
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
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

// School Structure - Turmas (Classes/Grades)
export const schoolStructure = {
  infantil: {
    name: 'Educação Infantil',
    color: '#ffa500', // Gold
    classes: [
      { id: 'bercario', name: 'Berçário', minAge: 0, maxAge: 1 },
      { id: 'maternal1', name: 'Maternal I', minAge: 1, maxAge: 2 },
      { id: 'maternal2', name: 'Maternal II', minAge: 2, maxAge: 3 },
      { id: 'periodo1', name: 'I Período', minAge: 3, maxAge: 4 },
      { id: 'periodo2', name: 'II Período', minAge: 4, maxAge: 5 },
      { id: 'periodo3', name: 'III Período', minAge: 5, maxAge: 6 },
    ],
  },
  fundamental1: {
    name: 'Ensino Fundamental I',
    color: '#41aa80', // Green
    classes: [
      { id: 'ano1', name: '1º Ano', grade: 1 },
      { id: 'ano2', name: '2º Ano', grade: 2 },
      { id: 'ano3', name: '3º Ano', grade: 3 },
      { id: 'ano4', name: '4º Ano', grade: 4 },
      { id: 'ano5', name: '5º Ano', grade: 5 },
    ],
  },
  fundamental2: {
    name: 'Ensino Fundamental II',
    color: '#4180a4', // Blue
    classes: [
      { id: 'ano6', name: '6º Ano', grade: 6 },
      { id: 'ano7', name: '7º Ano', grade: 7 },
      { id: 'ano8', name: '8º Ano', grade: 8 },
      { id: 'ano9', name: '9º Ano', grade: 9 },
    ],
  },
  medio: {
    name: 'Ensino Médio',
    color: '#2d5f8f', // Dark Blue
    classes: [
      { id: 'serie1', name: '1ª Série', grade: 10 },
      { id: 'serie2', name: '2ª Série', grade: 11 },
      { id: 'serie3', name: '3ª Série', grade: 12 },
    ],
  },
};

export default miosotisTheme;
