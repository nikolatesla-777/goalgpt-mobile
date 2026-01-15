/**
 * Theme Configuration
 *
 * Provides dark/light theme support with automatic switching
 * Primary theme: Dark (OLED optimized)
 * Secondary theme: Light (future)
 */

import { colors, typography, spacing, borderRadius, shadows, glassmorphism, layout } from '../constants/tokens';

// ============================================
// THEME TYPES
// ============================================

export type ThemeMode = 'dark' | 'light';

export interface Theme {
  mode: ThemeMode;
  colors: {
    // Base
    background: string;
    surface: string;
    overlay: string;

    // Text
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
    };

    // Brand
    primary: string;
    primaryGlow: string;

    // Semantic
    success: string;
    warning: string;
    error: string;
    info: string;

    // Status
    live: string;
    win: string;
    pending: string;
    lose: string;
    vip: string;

    // Borders
    border: string;
    divider: string;
  };
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  glassmorphism: typeof glassmorphism;
  layout: typeof layout;
}

// ============================================
// DARK THEME (Primary - OLED Optimized)
// ============================================

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    // Base
    background: colors.neutral.black,        // Pure black (OLED)
    surface: colors.neutral.darkGray,        // Card backgrounds
    overlay: colors.opacity.black95,         // Modals

    // Text
    text: {
      primary: colors.neutral.white,         // White (21:1 contrast)
      secondary: colors.neutral.lightGray,   // Gray (4.5:1 contrast)
      tertiary: '#48484A',                   // Dark gray
      disabled: '#3A3A3C',                   // Very dark gray
    },

    // Brand
    primary: colors.brand.primary,           // Brand green
    primaryGlow: colors.opacity.primary30,

    // Semantic
    success: colors.semantic.win,
    warning: colors.semantic.pending,
    error: colors.semantic.alert,
    info: colors.semantic.info,

    // Status
    live: colors.semantic.live,
    win: colors.semantic.win,
    pending: colors.semantic.pending,
    lose: colors.semantic.lose,
    vip: colors.semantic.vip,

    // Borders
    border: colors.opacity.white10,
    divider: colors.opacity.white05,
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  glassmorphism,
  layout,
};

// ============================================
// LIGHT THEME (Secondary - Future)
// ============================================

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    // Base
    background: colors.neutral.white,        // White
    surface: '#F2F2F7',                      // Light gray
    overlay: 'rgba(0, 0, 0, 0.3)',          // Dark overlay

    // Text
    text: {
      primary: colors.neutral.black,         // Black
      secondary: '#3A3A3C',                  // Dark gray
      tertiary: colors.neutral.lightGray,    // Medium gray
      disabled: '#C7C7CC',                   // Light gray
    },

    // Brand (same)
    primary: colors.brand.primary,
    primaryGlow: colors.opacity.primary20,

    // Semantic (adjusted for light)
    success: '#2EAE4F',                      // Darker green
    warning: colors.semantic.vipOrange,      // Orange
    error: colors.semantic.alert,            // Red (same)
    info: colors.semantic.info,              // Blue (same)

    // Status (adjusted)
    live: colors.semantic.live,
    win: '#2EAE4F',
    pending: colors.semantic.vipOrange,
    lose: colors.neutral.lightGray,
    vip: colors.semantic.vipOrange,          // Orange gold

    // Borders
    border: 'rgba(0, 0, 0, 0.1)',
    divider: 'rgba(0, 0, 0, 0.05)',
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  glassmorphism,
  layout,
};

// ============================================
// THEME UTILITIES
// ============================================

/**
 * Get theme based on mode
 */
export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

/**
 * Default theme (dark)
 */
export const defaultTheme = darkTheme;
