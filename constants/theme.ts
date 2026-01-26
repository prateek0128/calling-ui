/**
 * Modern Design System for Calling UI App
 * Comprehensive theme with colors, typography, spacing, shadows, and animations
 */

import { Platform } from 'react-native';

// Brand Colors
const brandColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
};

// Neutral Colors
const neutralColors = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
};

export const Colors = {
  light: {
    // Backgrounds
    background: {
      primary: '#ffffff',
      secondary: neutralColors[50],
      tertiary: neutralColors[100],
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    // Text
    text: {
      primary: neutralColors[900],
      secondary: neutralColors[600],
      tertiary: neutralColors[500],
      inverse: '#ffffff',
      disabled: neutralColors[400],
    },
    // Borders
    border: {
      primary: neutralColors[200],
      secondary: neutralColors[300],
      focus: brandColors.primary[500],
      error: brandColors.error[500],
    },
    // Brand colors
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    accent: brandColors.accent,
    warning: brandColors.warning,
    error: brandColors.error,
    // Legacy support
    tint: brandColors.primary[600],
    icon: neutralColors[600],
    tabIconDefault: neutralColors[500],
    tabIconSelected: brandColors.primary[600],
  },
  dark: {
    // Backgrounds
    background: {
      primary: neutralColors[900],
      secondary: neutralColors[800],
      tertiary: neutralColors[700],
      elevated: neutralColors[800],
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
    // Text
    text: {
      primary: neutralColors[50],
      secondary: neutralColors[300],
      tertiary: neutralColors[400],
      inverse: neutralColors[900],
      disabled: neutralColors[500],
    },
    // Borders
    border: {
      primary: neutralColors[700],
      secondary: neutralColors[600],
      focus: brandColors.primary[400],
      error: brandColors.error[400],
    },
    // Brand colors (adjusted for dark mode)
    primary: {
      ...brandColors.primary,
      500: brandColors.primary[400],
      600: brandColors.primary[500],
    },
    secondary: {
      ...brandColors.secondary,
      500: brandColors.secondary[400],
      600: brandColors.secondary[500],
    },
    accent: {
      ...brandColors.accent,
      500: brandColors.accent[400],
      600: brandColors.accent[500],
    },
    warning: {
      ...brandColors.warning,
      500: brandColors.warning[400],
      600: brandColors.warning[500],
    },
    error: {
      ...brandColors.error,
      500: brandColors.error[400],
      600: brandColors.error[500],
    },
    // Legacy support
    tint: '#ffffff',
    icon: neutralColors[400],
    tabIconDefault: neutralColors[400],
    tabIconSelected: '#ffffff',
  },
};

// Typography System
export const Typography = {
  // Font Families
  fonts: Platform.select({
    ios: {
      regular: 'system-ui',
      medium: 'system-ui',
      semibold: 'system-ui',
      bold: 'system-ui',
      rounded: 'ui-rounded',
      mono: 'ui-monospace',
    },
    android: {
      regular: 'Roboto',
      medium: 'Roboto-Medium',
      semibold: 'Roboto-Medium',
      bold: 'Roboto-Bold',
      rounded: 'Roboto',
      mono: 'monospace',
    },
    default: {
      regular: 'system-ui',
      medium: 'system-ui',
      semibold: 'system-ui',
      bold: 'system-ui',
      rounded: 'system-ui',
      mono: 'monospace',
    },
  }),
  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  // Line Heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

// Spacing System
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Border Radius
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Animation Durations
export const Animations = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
};

// Gradients
export const Gradients = {
  primary: [brandColors.primary[500], brandColors.primary[700]],
  secondary: [brandColors.secondary[500], brandColors.secondary[700]],
  accent: [brandColors.accent[500], brandColors.accent[700]],
  sunset: ['#ff7e5f', '#feb47b'],
  ocean: ['#667eea', '#764ba2'],
  forest: ['#134e5e', '#71b280'],
  royal: ['#667eea', '#764ba2'],
  fire: ['#f093fb', '#f5576c'],
};

// Legacy Font Export
export const Fonts = Typography.fonts;
