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
    // Base - Premium Dark (Slate)
    background: '#0f172a',           // Slate 900 (Main BG)
    surface: '#1e293b',              // Slate 800 (Card BG / Header)
    overlay: 'rgba(15, 23, 42, 0.8)', // Slate 900 with opacity

    // Text
    text: {
      primary: '#f8fafc',            // Slate 50 (High Contrast)
      secondary: '#94a3b8',          // Slate 400 (Subtitles)
      tertiary: '#64748b',           // Slate 500 (Meta)
      disabled: '#334155',           // Slate 700
    },

    // Brand
    primary: '#3b82f6',              // Blue 500 (Web Active Tab)
    primaryGlow: 'rgba(59, 130, 246, 0.3)',

    // Semantic
    success: '#22c55e',              // Green 500
    warning: '#f59e0b',              // Amber 500
    error: '#ef4444',                // Red 500
    info: '#3b82f6',                 // Blue 500

    // Status
    live: '#22c55e',                 // Green 500
    win: '#22c55e',
    pending: '#f59e0b',
    lose: '#ef4444',
    vip: '#f59e0b',

    // Borders
    border: '#334155',               // Slate 700 (Subtle borders)
    divider: '#1e293b',              // Slate 800
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  glassmorphism,
  layout,
  // Add status bar style for Expo
  // statusBar: 'light',
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
