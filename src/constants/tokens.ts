/**
 * Design Tokens
 *
 * Central source of truth for all design values
 * Based on GoalGPT Brandbook 2025 & Master Plan v1.0
 *
 * Philosophy: High-Tech AI Analysis Terminal
 */

// ============================================
// COLORS
// ============================================

export const colors = {
  // BRAND COLORS (Primary)
  brand: {
    primary: '#4BC41E',              // Brand Green - "Neon Energy Laser"
    primaryRGB: 'rgb(75, 196, 30)',

    // Supporting Greens (Depth & Layers)
    ultraDarkGreen: '#03271D',       // Ultra deep forest (darkest)
    darkGreen: '#0E2C07',            // Deep forest
    mediumGreen: '#1A3D13',          // Forest shadow
    forestGreen: '#17503D',          // Rich forest (NEW)
    midGreen: '#2C6B1F',             // Grass blade
    tealGreen: '#166866',            // Teal accent (NEW)
  },

  // NEUTRAL TONES (Base Canvas)
  neutral: {
    black: '#000000',                // Pure black (OLED optimized)
    richBlack: '#0A0A0A',            // Rich black (subtle depth)
    darkGray: '#1C1C1E',             // Apple system dark
    mediumGray: '#2C2C2C',           // Separator
    lightGray: '#8E8E93',            // Secondary text
    white: '#FFFFFF',                // Primary text
  },

  // SEMANTIC COLORS (Functional)
  semantic: {
    live: '#FF3B30',                 // Red - Active match
    win: '#34C759',                  // Green - Success
    pending: '#FFD60A',              // Yellow - Waiting
    lose: '#8E8E93',                 // Gray - Loss
    vip: '#FFD700',                  // Gold - Premium
    vipOrange: '#FFA500',            // Orange gold
    alert: '#FF3B30',                // Red - Danger
    info: '#007AFF',                 // Blue - Info
    teal: '#166866',                 // Teal - Accent/Stats (NEW)
  },

  // GRADIENTS
  gradients: {
    primaryGreen: ['#4BC41E', '#2C6B1F'],           // Energy beam
    glassmorphism: [
      'rgba(3, 39, 29, 0.85)',      // Ultra dark green (#03271D)
      'rgba(23, 80, 61, 0.65)',     // Forest green (#17503D)
    ],                                               // Card backgrounds (NEW)
    glassmorphismOld: [
      'rgba(14, 44, 7, 0.8)',
      'rgba(26, 61, 19, 0.6)',
    ],                                               // Card backgrounds (legacy)
    vipGold: ['#FFD700', '#FFA500'],                // Premium badges
    neonGlow: [
      'rgba(75, 196, 30, 1)',
      'rgba(75, 196, 30, 0)',
    ],                                               // LIVE badges
    darkOverlay: [
      'rgba(0, 0, 0, 0.8)',
      'rgba(0, 0, 0, 0.95)',
    ],                                               // Modals
    footballField: ['#0E2C07', '#000000'],          // Match header
  },

  // OPACITY VARIANTS
  opacity: {
    glass60: 'rgba(14, 44, 7, 0.6)',
    glass80: 'rgba(26, 61, 19, 0.8)',
    glass50: 'rgba(28, 28, 30, 0.5)',
    white05: 'rgba(255, 255, 255, 0.05)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
    black80: 'rgba(0, 0, 0, 0.8)',
    black95: 'rgba(0, 0, 0, 0.95)',
    primary15: 'rgba(75, 196, 30, 0.15)',
    primary20: 'rgba(75, 196, 30, 0.2)',
    primary30: 'rgba(75, 196, 30, 0.3)',
  },
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  // FONT FAMILIES
  fonts: {
    ui: {
      regular: 'Nohemi-Regular',
      medium: 'Nohemi-Medium',
      semibold: 'Nohemi-SemiBold',
      bold: 'Nohemi-Bold',
    },
    mono: {
      regular: 'SFMono-Regular',       // iOS
      medium: 'SFMono-Medium',
      semibold: 'SFMono-Semibold',
      bold: 'SFMono-Bold',
    },
    monoAndroid: {
      regular: 'RobotoMono-Regular',   // Android
      medium: 'RobotoMono-Medium',
      semibold: 'RobotoMono-SemiBold',
      bold: 'RobotoMono-Bold',
    },
    system: 'System',
  },

  // FONT SIZES
  fontSize: {
    // Display
    display: {
      large: 48,
      medium: 40,
      small: 32,
    },
    // Heading
    heading: {
      h1: 28,
      h2: 24,
      h3: 20,
      h4: 18,
    },
    // Body
    body: {
      large: 17,
      medium: 15,
      small: 13,
    },
    // Label
    label: {
      large: 15,
      medium: 13,
      small: 11,
      tiny: 9,
    },
    // Button
    button: {
      large: 17,
      medium: 15,
      small: 13,
    },
    // Data (Monospace)
    data: {
      large: 36,
      medium: 24,
      small: 18,
      tiny: 14,
    },
  },

  // FONT WEIGHTS
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // LINE HEIGHTS
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // LETTER SPACING
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

// ============================================
// SPACING
// ============================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  xxxl: 20,
  round: 9999,
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  // Neon Glow Effects
  neonGlow: {
    brand: {
      shadowColor: '#4BC41E',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
    live: {
      shadowColor: '#FF3B30',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 12,
    },
    vip: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
    },
    white: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  },

  // Component Shadows
  card: {
    default: {
      shadowColor: '#4BC41E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    intense: {
      shadowColor: '#4BC41E',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
    },
    subtle: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  },

  button: {
    primary: {
      shadowColor: '#4BC41E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    vip: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
    },
  },
} as const;

// ============================================
// ANIMATION
// ============================================

export const animation = {
  // Spring Physics
  spring: {
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },

  // Duration Standards
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },

  // Scale Factors
  scale: {
    pressed: 0.95,
    pressedButton: 0.98,
    pulse: 1.05,
  },

  // Opacity
  opacity: {
    pressed: 0.8,
    disabled: 0.4,
    pulse: 0.8,
  },
} as const;

// ============================================
// GLASSMORPHISM
// ============================================

export const glassmorphism = {
  default: {
    backgroundColor: 'rgba(23, 80, 61, 0.65)',    // Forest green #17503D (NEW)
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.15)',
    // Note: backdropFilter not directly supported in React Native
    // Use @react-native-community/blur for iOS/Android
  },
  intense: {
    backgroundColor: 'rgba(3, 39, 29, 0.85)',     // Ultra dark green #03271D (NEW)
    borderWidth: 1.5,
    borderColor: 'rgba(75, 196, 30, 0.25)',
  },
  subtle: {
    backgroundColor: 'rgba(22, 104, 102, 0.45)',  // Teal green #166866 (NEW)
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.08)',
  },
} as const;

// ============================================
// LAYOUT
// ============================================

export const layout = {
  // Screen padding
  screenPadding: {
    horizontal: 16,
    vertical: 20,
  },

  // Tab bar
  tabBar: {
    height: 80,
    paddingBottom: 20, // Safe area
  },

  // Header
  header: {
    height: 56,
  },

  // Avatar sizes
  avatar: {
    small: 32,
    medium: 48,
    large: 80,
    xlarge: 100,
  },

  // Icon sizes
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
} as const;

// ============================================
// TYPES (For TypeScript autocomplete)
// ============================================

export type ColorKey = keyof typeof colors;
export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type FontSizeKey = keyof typeof typography.fontSize;
export type FontWeightKey = keyof typeof typography.fontWeight;
