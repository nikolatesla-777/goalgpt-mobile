/**
 * NeonText Component
 *
 * Text component with neon glow effect for emphasis
 * Master Plan v1.0 compliant - 5 color variants: brand, live, vip, win, white
 * Perfect for scores, LIVE indicators, and important data
 */

import React, { useEffect, useRef } from 'react';
import { Text, TextProps, TextStyle, Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { typography } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export type NeonColor = 'brand' | 'live' | 'vip' | 'win' | 'white';
export type GlowIntensity = 'small' | 'medium' | 'large';
export type TextType = 'ui' | 'data';

export interface NeonTextProps extends TextProps {
  /** Text content */
  children: React.ReactNode;

  /** Neon color variant */
  color?: NeonColor;

  /** Glow intensity */
  glow?: GlowIntensity;

  /** Text type (ui = Nohemi, data = Monospace) */
  type?: TextType;

  /** Font size (for data type: large=36, medium=24, small=18) */
  size?: 'small' | 'medium' | 'large';

  /** Font weight (only for ui type) */
  weight?: 'regular' | 'semibold' | 'bold';

  /** Enable pulsing animation */
  pulse?: boolean;

  /** Custom text style */
  style?: TextStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const NeonText: React.FC<NeonTextProps> = ({
  children,
  color = 'brand',
  glow = 'medium',
  type = 'ui',
  size = 'medium',
  weight = 'bold',
  pulse = false,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ============================================================================
  // ANIMATION
  // ============================================================================

  useEffect(() => {
    if (pulse) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      animation.start();

      return () => animation.stop();
    }
  }, [pulse, pulseAnim]);

  // ============================================================================
  // STYLES
  // ============================================================================

  // Get color value based on Master Plan colors
  const getColorValue = (): string => {
    switch (color) {
      case 'brand':
        return theme.colors.primary;           // #4BC41E
      case 'live':
        return theme.colors.live;              // #FF3B30
      case 'vip':
        return theme.colors.vip;               // #FFD700
      case 'win':
        return theme.colors.win;               // #34C759
      case 'white':
        return theme.colors.text.primary;      // #FFFFFF
      default:
        return theme.colors.primary;
    }
  };

  // Get shadow based on glow intensity
  const getShadowStyle = () => {
    const colorValue = getColorValue();

    switch (glow) {
      case 'small':
        return {
          textShadowColor: colorValue,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 8,
        };
      case 'medium':
        return {
          textShadowColor: colorValue,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 12,
        };
      case 'large':
        return {
          textShadowColor: colorValue,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 16,
        };
      default:
        return {
          textShadowColor: colorValue,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 12,
        };
    }
  };

  // Get font family based on type
  const getFontFamily = (): string => {
    if (type === 'data') {
      // Monospace for data
      return weight === 'bold' ? typography.fonts.mono.bold : typography.fonts.mono.regular;
    } else {
      // Nohemi for UI
      switch (weight) {
        case 'regular':
          return typography.fonts.ui.regular;
        case 'semibold':
          return typography.fonts.ui.semibold;
        case 'bold':
          return typography.fonts.ui.bold;
        default:
          return typography.fonts.ui.bold;
      }
    }
  };

  // Get font size
  const getFontSize = (): number => {
    if (type === 'data') {
      // Data type uses large/medium/small from tokens
      switch (size) {
        case 'large':
          return typography.fontSize.data.large;    // 36
        case 'medium':
          return typography.fontSize.data.medium;   // 24
        case 'small':
          return typography.fontSize.data.small;    // 18
        default:
          return typography.fontSize.data.medium;
      }
    } else {
      // UI type uses button sizes (can extend later)
      switch (size) {
        case 'large':
          return typography.fontSize.button.large;   // 17
        case 'medium':
          return typography.fontSize.button.medium;  // 15
        case 'small':
          return typography.fontSize.button.small;   // 13
        default:
          return typography.fontSize.button.medium;
      }
    }
  };

  // Base text style
  const baseTextStyle: TextStyle = {
    color: getColorValue(),
    fontFamily: getFontFamily(),
    fontSize: getFontSize(),
    ...getShadowStyle(),
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (pulse) {
    return (
      <Animated.Text
        style={[
          baseTextStyle,
          {
            opacity: pulseAnim,
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </Animated.Text>
    );
  }

  return (
    <Text style={[baseTextStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * LiveIndicator
 * Pulsing "LIVE" text with red glow (#FF3B30)
 */
export const LiveIndicator: React.FC<Omit<NeonTextProps, 'color' | 'pulse' | 'children'>> = (
  props
) => (
  <NeonText color="live" glow="large" pulse={true} weight="bold" size="small" {...props}>
    LIVE
  </NeonText>
);

/**
 * ScoreText
 * Monospace text for scores with neon glow
 */
export const ScoreText: React.FC<Omit<NeonTextProps, 'type'>> = ({ children, color = 'white', ...props }) => (
  <NeonText type="data" glow="medium" size="large" weight="bold" color={color} {...props}>
    {children}
  </NeonText>
);

/**
 * PercentageText
 * Monospace text for percentages with neon glow
 */
export const PercentageText: React.FC<Omit<NeonTextProps, 'type'>> = ({ children, color = 'brand', ...props }) => (
  <NeonText type="data" glow="small" size="medium" weight="bold" color={color} {...props}>
    {children}
  </NeonText>
);

/**
 * VIPText
 * Gold gradient text for VIP features
 */
export const VIPText: React.FC<Omit<NeonTextProps, 'color'>> = ({ children, ...props }) => (
  <NeonText color="vip" glow="large" weight="bold" {...props}>
    {children}
  </NeonText>
);

// ============================================================================
// EXPORT
// ============================================================================

export default NeonText;
