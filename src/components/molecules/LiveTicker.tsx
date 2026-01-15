/**
 * LiveTicker Component
 * Animated status indicator for live matches
 * Shows match time, period, and live status with pulsing effect
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { LiveIndicator } from '../atoms/NeonText';
import { typography, spacing, borderRadius } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export type MatchPeriod = 'FIRST_HALF' | 'HALF_TIME' | 'SECOND_HALF' | 'EXTRA_TIME' | 'PENALTIES';

export interface LiveTickerProps {
  /** Current match minute */
  minute?: number;

  /** Match period */
  period: MatchPeriod;

  /** Additional time (injury time) */
  additionalTime?: number;

  /** Show live indicator */
  showLiveIndicator?: boolean;

  /** Enable pulsing animation */
  animate?: boolean;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Custom container style */
  style?: ViewStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LiveTicker: React.FC<LiveTickerProps> = ({
  minute,
  period,
  additionalTime,
  showLiveIndicator = true,
  animate = true,
  size = 'medium',
  style,
}) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotPulseAnim = useRef(new Animated.Value(1)).current;

  // ============================================================================
  // ANIMATION
  // ============================================================================

  useEffect(() => {
    if (animate) {
      // Background pulse
      const bgAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Dot pulse (faster)
      const dotAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(dotPulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dotPulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );

      bgAnimation.start();
      dotAnimation.start();

      return () => {
        bgAnimation.stop();
        dotAnimation.stop();
      };
    }
  }, [animate]);

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getPeriodText = (): string => {
    switch (period) {
      case 'FIRST_HALF':
        return '1st Half';
      case 'HALF_TIME':
        return 'Half Time';
      case 'SECOND_HALF':
        return '2nd Half';
      case 'EXTRA_TIME':
        return 'Extra Time';
      case 'PENALTIES':
        return 'Penalties';
      default:
        return 'Live';
    }
  };

  const getTimeDisplay = (): string => {
    if (period === 'HALF_TIME') {
      return 'HT';
    }
    if (period === 'PENALTIES') {
      return 'PEN';
    }
    if (minute === undefined) {
      return getPeriodText();
    }
    if (additionalTime) {
      return `${minute}+${additionalTime}'`;
    }
    return `${minute}'`;
  };

  // ============================================================================
  // SIZE CONFIGURATIONS
  // ============================================================================

  const sizeConfig = {
    small: {
      fontSize: typography.sizes.xs,
      padding: spacing[2],
      dotSize: 6,
      gap: spacing[2],
    },
    medium: {
      fontSize: typography.sizes.sm,
      padding: spacing[3],
      dotSize: 8,
      gap: spacing[3],
    },
    large: {
      fontSize: typography.sizes.base,
      padding: spacing[4],
      dotSize: 10,
      gap: spacing[4],
    },
  };

  const config = sizeConfig[size];

  // ============================================================================
  // STYLES
  // ============================================================================

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: config.padding,
    paddingVertical: config.padding * 0.75,
    borderRadius: borderRadius.md,
    backgroundColor: theme.success.bg,
    borderWidth: 1,
    borderColor: theme.success.border,
  };

  const dotStyle: ViewStyle = {
    width: config.dotSize,
    height: config.dotSize,
    borderRadius: config.dotSize / 2,
    backgroundColor: theme.success.main,
    marginRight: config.gap,
  };

  const timeTextStyle: TextStyle = {
    ...typography.dataSmall,
    fontSize: config.fontSize,
    fontFamily: typography.fonts.monoBold,
    color: theme.success.main,
  };

  const periodTextStyle: TextStyle = {
    ...typography.caption,
    fontSize: config.fontSize * 0.9,
    color: theme.text.tertiary,
    marginLeft: config.gap,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Animated.View
      style={[
        containerStyle,
        animate && {
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      {/* Pulsing Dot */}
      <Animated.View
        style={[
          dotStyle,
          animate && {
            transform: [{ scale: dotPulseAnim }],
          },
        ]}
      />

      {/* Time Display */}
      <Text style={timeTextStyle}>{getTimeDisplay()}</Text>

      {/* Period Text (optional) */}
      {period !== 'FIRST_HALF' && period !== 'SECOND_HALF' && minute !== undefined && (
        <Text style={periodTextStyle}>• {getPeriodText()}</Text>
      )}

      {/* Live Indicator (optional) */}
      {showLiveIndicator && size !== 'small' && (
        <View style={{ marginLeft: config.gap }}>
          <LiveIndicator />
        </View>
      )}
    </Animated.View>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * CompactLiveTicker
 * Small live ticker for list views
 */
export const CompactLiveTicker: React.FC<Omit<LiveTickerProps, 'size' | 'showLiveIndicator'>> = (
  props
) => <LiveTicker {...props} size="small" showLiveIndicator={false} />;

/**
 * HalfTimeTicker
 * Specialized ticker for half-time
 */
export const HalfTimeTicker: React.FC<Omit<LiveTickerProps, 'period' | 'minute'>> = (props) => (
  <LiveTicker {...props} period="HALF_TIME" />
);

/**
 * PenaltiesTicker
 * Specialized ticker for penalty shootout
 */
export const PenaltiesTicker: React.FC<Omit<LiveTickerProps, 'period' | 'minute'>> = (props) => (
  <LiveTicker {...props} period="PENALTIES" />
);

/**
 * FirstHalfTicker
 * Ticker for first half with minute
 */
interface FirstHalfTickerProps extends Omit<LiveTickerProps, 'period'> {
  minute: number;
}

export const FirstHalfTicker: React.FC<FirstHalfTickerProps> = ({ minute, ...props }) => (
  <LiveTicker {...props} period="FIRST_HALF" minute={minute} />
);

/**
 * SecondHalfTicker
 * Ticker for second half with minute
 */
interface SecondHalfTickerProps extends Omit<LiveTickerProps, 'period'> {
  minute: number;
}

export const SecondHalfTicker: React.FC<SecondHalfTickerProps> = ({ minute, ...props }) => (
  <LiveTicker {...props} period="SECOND_HALF" minute={minute} />
);

// ============================================================================
// EXPORT
// ============================================================================

export default LiveTicker;
