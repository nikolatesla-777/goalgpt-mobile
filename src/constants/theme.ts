// src/constants/theme.ts
// GoalGPT Mobile App - Dual Theme Design System
// Brand Colors: #4BC41E (Neon Green), OLED Black, Glassmorphism

import { Platform } from 'react-native';

// ============================================================================
// BASE COLOR PALETTE (Brand Compliance)
// ============================================================================

export const brandColors = {
  // Primary Green (#4BC41E from Brandbook)
  green: {
    50: '#E8F7E3',
    100: '#C4EBB7',
    200: '#9CDE87',
    300: '#74D157',
    400: '#57C732',
    500: '#4BC41E', // Main brand color
    600: '#42AD1A',
    700: '#379416',
    800: '#2D7B12',
    900: '#1E5409',
  },

  // Supporting Colors (from Brandbook)
  supporting: {
    darkGray: '#2C2C2C',
    deepGreen: '#0E2C07',
    white: '#FFFFFF',
    black: '#000000',
  },
};

// ============================================================================
// DARK THEME (Primary - OLED Optimized)
// ============================================================================

export const darkTheme = {
  mode: 'dark' as const,

  // Background Colors
  background: {
    primary: '#000000', // Pure OLED black (battery efficient)
    secondary: '#0A0A0A', // Slightly lifted
    tertiary: '#141414', // Cards, panels
    elevated: '#1A1A1A', // Elevated elements
    glass: 'rgba(26, 26, 26, 0.7)', // Glassmorphism
    overlay: 'rgba(0, 0, 0, 0.8)', // Modals, overlays
  },

  // Primary Brand Color (Neon Green)
  primary: {
    50: '#E8F7E3',
    100: '#C4EBB7',
    200: '#9CDE87',
    300: '#74D157',
    400: '#57C732',
    500: '#4BC41E', // Main brand color
    600: '#42AD1A',
    700: '#379416',
    800: '#2D7B12',
    900: '#1E5409',
    glow: 'rgba(75, 196, 30, 0.4)', // Neon glow effect
  },

  // Text Colors
  text: {
    primary: '#FFFFFF', // High emphasis
    secondary: '#B3B3B3', // Medium emphasis
    tertiary: '#808080', // Low emphasis
    disabled: '#4D4D4D', // Disabled
    inverse: '#000000', // On colored backgrounds
    brand: '#4BC41E', // Brand text
  },

  // Border Colors
  border: {
    primary: 'rgba(255, 255, 255, 0.1)', // Subtle borders
    secondary: 'rgba(255, 255, 255, 0.05)', // Very subtle
    focus: '#4BC41E', // Focus state
    glass: 'rgba(255, 255, 255, 0.15)', // Glass borders
  },

  // Semantic Colors
  success: {
    main: '#00E676',
    bg: 'rgba(0, 230, 118, 0.1)',
    border: 'rgba(0, 230, 118, 0.2)',
    glow: 'rgba(0, 230, 118, 0.3)',
  },
  error: {
    main: '#FF1744',
    bg: 'rgba(255, 23, 68, 0.1)',
    border: 'rgba(255, 23, 68, 0.2)',
    glow: 'rgba(255, 23, 68, 0.3)',
  },
  warning: {
    main: '#FFEA00',
    bg: 'rgba(255, 234, 0, 0.1)',
    border: 'rgba(255, 234, 0, 0.2)',
    glow: 'rgba(255, 234, 0, 0.3)',
  },
  info: {
    main: '#00B0FF',
    bg: 'rgba(0, 176, 255, 0.1)',
    border: 'rgba(0, 176, 255, 0.2)',
    glow: 'rgba(0, 176, 255, 0.3)',
  },

  // Live Match Colors
  live: {
    indicator: '#00E676', // Green pulsing dot
    text: '#00E676', // Live text
    glow: 'rgba(0, 230, 118, 0.5)',
    background: 'rgba(0, 230, 118, 0.05)',
  },

  // XP Levels (with metallic + neon glow)
  levels: {
    bronze: {
      main: '#CD7F32',
      glow: 'rgba(205, 127, 50, 0.4)',
    },
    silver: {
      main: '#C0C0C0',
      glow: 'rgba(192, 192, 192, 0.4)',
    },
    gold: {
      main: '#FFD700',
      glow: 'rgba(255, 215, 0, 0.5)',
    },
    platinum: {
      main: '#E5E4E2',
      glow: 'rgba(229, 228, 226, 0.5)',
    },
    diamond: {
      main: '#B9F2FF',
      glow: 'rgba(185, 242, 255, 0.6)',
    },
    vip_elite: {
      main: '#FF00FF',
      glow: 'rgba(255, 0, 255, 0.6)',
    },
  },

  // Badge Rarities
  rarities: {
    common: {
      main: '#9E9E9E',
      glow: 'rgba(158, 158, 158, 0.3)',
    },
    rare: {
      main: '#2196F3',
      glow: 'rgba(33, 150, 243, 0.4)',
    },
    epic: {
      main: '#9C27B0',
      glow: 'rgba(156, 39, 176, 0.5)',
    },
    legendary: {
      main: '#FFD700',
      glow: 'rgba(255, 215, 0, 0.6)',
    },
  },

  // Glassmorphism Effects
  glass: {
    light: {
      background: 'rgba(26, 26, 26, 0.5)',
      blur: 10,
      border: 'rgba(255, 255, 255, 0.1)',
    },
    medium: {
      background: 'rgba(26, 26, 26, 0.7)',
      blur: 20,
      border: 'rgba(255, 255, 255, 0.15)',
    },
    heavy: {
      background: 'rgba(26, 26, 26, 0.85)',
      blur: 30,
      border: 'rgba(255, 255, 255, 0.2)',
    },
  },
};

// ============================================================================
// LIGHT THEME (Secondary - Accessibility Focused)
// ============================================================================

export const lightTheme = {
  mode: 'light' as const,

  // Background Colors
  background: {
    primary: '#FFFFFF', // Pure white
    secondary: '#F8F8F8', // Slightly gray
    tertiary: '#F3F3F3', // Cards, panels
    elevated: '#FFFFFF', // Elevated elements
    glass: 'rgba(255, 255, 255, 0.7)', // Glassmorphism
    overlay: 'rgba(0, 0, 0, 0.5)', // Modals, overlays
  },

  // Primary Brand Color (Same green, adjusted glow)
  primary: {
    50: '#E8F7E3',
    100: '#C4EBB7',
    200: '#9CDE87',
    300: '#74D157',
    400: '#57C732',
    500: '#4BC41E', // Main brand color
    600: '#42AD1A',
    700: '#379416',
    800: '#2D7B12',
    900: '#1E5409',
    glow: 'rgba(75, 196, 30, 0.2)', // Less intense glow for light theme
  },

  // Text Colors
  text: {
    primary: '#000000', // High emphasis
    secondary: '#4D4D4D', // Medium emphasis
    tertiary: '#808080', // Low emphasis
    disabled: '#B3B3B3', // Disabled
    inverse: '#FFFFFF', // On colored backgrounds
    brand: '#4BC41E', // Brand text
  },

  // Border Colors
  border: {
    primary: 'rgba(0, 0, 0, 0.12)', // Subtle borders
    secondary: 'rgba(0, 0, 0, 0.06)', // Very subtle
    focus: '#4BC41E', // Focus state
    glass: 'rgba(0, 0, 0, 0.1)', // Glass borders
  },

  // Semantic Colors
  success: {
    main: '#00C853',
    bg: 'rgba(0, 200, 83, 0.1)',
    border: 'rgba(0, 200, 83, 0.2)',
    glow: 'rgba(0, 200, 83, 0.15)',
  },
  error: {
    main: '#D50000',
    bg: 'rgba(213, 0, 0, 0.1)',
    border: 'rgba(213, 0, 0, 0.2)',
    glow: 'rgba(213, 0, 0, 0.15)',
  },
  warning: {
    main: '#FFD600',
    bg: 'rgba(255, 214, 0, 0.1)',
    border: 'rgba(255, 214, 0, 0.2)',
    glow: 'rgba(255, 214, 0, 0.15)',
  },
  info: {
    main: '#0091EA',
    bg: 'rgba(0, 145, 234, 0.1)',
    border: 'rgba(0, 145, 234, 0.2)',
    glow: 'rgba(0, 145, 234, 0.15)',
  },

  // Live Match Colors
  live: {
    indicator: '#00C853',
    text: '#00C853',
    glow: 'rgba(0, 200, 83, 0.3)',
    background: 'rgba(0, 200, 83, 0.05)',
  },

  // XP Levels (with metallic + subtle glow)
  levels: {
    bronze: {
      main: '#CD7F32',
      glow: 'rgba(205, 127, 50, 0.2)',
    },
    silver: {
      main: '#C0C0C0',
      glow: 'rgba(192, 192, 192, 0.2)',
    },
    gold: {
      main: '#FFD700',
      glow: 'rgba(255, 215, 0, 0.25)',
    },
    platinum: {
      main: '#E5E4E2',
      glow: 'rgba(229, 228, 226, 0.25)',
    },
    diamond: {
      main: '#00BCD4',
      glow: 'rgba(0, 188, 212, 0.3)',
    },
    vip_elite: {
      main: '#E91E63',
      glow: 'rgba(233, 30, 99, 0.3)',
    },
  },

  // Badge Rarities
  rarities: {
    common: {
      main: '#757575',
      glow: 'rgba(117, 117, 117, 0.15)',
    },
    rare: {
      main: '#1976D2',
      glow: 'rgba(25, 118, 210, 0.2)',
    },
    epic: {
      main: '#7B1FA2',
      glow: 'rgba(123, 31, 162, 0.25)',
    },
    legendary: {
      main: '#F57F17',
      glow: 'rgba(245, 127, 23, 0.3)',
    },
  },

  // Glassmorphism Effects
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.5)',
      blur: 10,
      border: 'rgba(0, 0, 0, 0.08)',
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.7)',
      blur: 20,
      border: 'rgba(0, 0, 0, 0.12)',
    },
    heavy: {
      background: 'rgba(255, 255, 255, 0.85)',
      blur: 30,
      border: 'rgba(0, 0, 0, 0.15)',
    },
  },
};

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

export const typography: any = {
  // Font Families (Hybrid: Nohemi + Monospace)
  fonts: {
    // Nohemi (Brand Font - from Brandbook)
    regular: 'Nohemi-Regular',
    medium: 'Nohemi-Medium',
    semiBold: 'Nohemi-SemiBold',
    bold: 'Nohemi-Bold',

    // Monospace (Data Terminal Aesthetic)
    mono: Platform.select({
      ios: 'SF Mono',
      android: 'RobotoMono-Regular',
      default: 'monospace',
    }),
    monoBold: Platform.select({
      ios: 'SF Mono',
      android: 'RobotoMono-Bold',
      default: 'monospace',
    }),
  },

  // Font Sizes
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font Weights
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },

  // Typography Presets (UI Elements - Nohemi)
  h1: {
    fontFamily: 'Nohemi-Bold',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'Nohemi-Bold',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: 'Nohemi-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: 'Nohemi-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  subtitle1: {
    fontFamily: 'Nohemi-SemiBold',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  subtitle2: {
    fontFamily: 'Nohemi-Medium',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  body1: {
    fontFamily: 'Nohemi-Regular',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  body2: {
    fontFamily: 'Nohemi-Regular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  caption: {
    fontFamily: 'Nohemi-Regular',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  overline: {
    fontFamily: 'Nohemi-SemiBold',
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
  button: {
    fontFamily: 'Nohemi-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },

  // Data Presets (Monospace - Terminal Aesthetic)
  dataLarge: {
    fontFamily: Platform.select({
      ios: 'SF Mono',
      android: 'RobotoMono-Bold',
      default: 'monospace',
    }),
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  dataMedium: {
    fontFamily: Platform.select({
      ios: 'SF Mono',
      android: 'RobotoMono-Bold',
      default: 'monospace',
    }),
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  dataSmall: {
    fontFamily: Platform.select({
      ios: 'SF Mono',
      android: 'RobotoMono-Regular',
      default: 'monospace',
    }),
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  dataCaption: {
    fontFamily: Platform.select({
      ios: 'SF Mono',
      android: 'RobotoMono-Regular',
      default: 'monospace',
    }),
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
};

// Add backward compatibility aliases directly to typography
// @ts-ignore - Adding backward compatible properties
typography.body = typography.body1;
// @ts-ignore - Adding backward compatible properties
typography.subtitle = typography.subtitle1;

// ============================================================================
// SPACING SYSTEM (8pt Grid)
// ============================================================================

export const spacing = {
  0: 0,
  1: 4, // 0.5 * 8
  2: 8, // 1 * 8
  3: 12, // 1.5 * 8
  4: 16, // 2 * 8
  5: 20, // 2.5 * 8
  6: 24, // 3 * 8
  8: 32, // 4 * 8
  10: 40, // 5 * 8
  12: 48, // 6 * 8
  16: 64, // 8 * 8
  20: 80, // 10 * 8
  24: 96, // 12 * 8

  // Semantic Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },

  // Neon Glow Shadows
  neonSmall: {
    shadowColor: '#4BC41E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  neonMedium: {
    shadowColor: '#4BC41E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  neonLarge: {
    shadowColor: '#4BC41E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 12,
  },
};

// ============================================================================
// ANIMATION TIMING
// ============================================================================

export const animations = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 1000,
  },
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// ============================================================================
// THEME TYPE DEFINITION
// ============================================================================

export type Theme = typeof darkTheme | typeof lightTheme;
export type ThemeMode = 'light' | 'dark';

// ============================================================================
// BACKWARD COMPATIBILITY (for existing code using old theme structure)
// ============================================================================

// Export colors object for backward compatibility
// This maintains compatibility with Phase 5 & 6 code
export const colors = {
  // Primary (Brand Green - numeric shades only for backward compatibility)
  primary: {
    50: darkTheme.primary[50],
    100: darkTheme.primary[100],
    200: darkTheme.primary[200],
    300: darkTheme.primary[300],
    400: darkTheme.primary[400],
    500: darkTheme.primary[500],
    600: darkTheme.primary[600],
    700: darkTheme.primary[700],
    800: darkTheme.primary[800],
    900: darkTheme.primary[900],
  },
  // Secondary (Purple)
  secondary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#9C27B0',
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },
  // Accent colors
  accent: {
    green: '#00E676',
    red: '#FF1744',
    yellow: '#FFEA00',
    orange: '#FF9100',
  },
  // Gray scale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  // Background
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F3F4F6',
    dark: '#1A1A1A',
  },
  // Text
  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#9E9E9E',
    inverse: '#FFFFFF',
    link: '#4BC41E',
  },
  // Border
  border: {
    primary: '#E0E0E0',
    secondary: '#BDBDBD',
    tertiary: '#F5F5F5',
  },
  // Success (numeric shades for backward compatibility)
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  // Error (numeric shades for backward compatibility)
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },
  // Warning (numeric shades for backward compatibility)
  warning: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },
  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  // XP Levels
  levels: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',
    vip_elite: '#9C27B0',
  },
  // Badge Rarities
  rarities: {
    common: '#9E9E9E',
    rare: '#2196F3',
    epic: '#9C27B0',
    legendary: '#FFD700',
  },
} as const;

// Typography is now backward compatible (see added aliases above)

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export const theme = {
  dark: darkTheme,
  light: lightTheme,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  brandColors,

  // Backward compatibility: export colors at top level
  colors,
};

export default theme;
