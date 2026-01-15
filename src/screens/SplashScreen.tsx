/**
 * SplashScreen
 *
 * Initial loading screen with logo animation
 * Master Plan compliant - Authentication Layer
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { typography, spacing } from '../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface SplashScreenProps {
  /** Callback when splash animation completes */
  onComplete?: () => void;

  /** Duration in ms (default: 2500) */
  duration?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 2500,
}) => {
  const { theme } = useTheme();

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const scanlinePosition = useRef(new Animated.Value(-120)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animation sequence
    Animated.sequence([
      // Logo entrance
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 500,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),

      // Tagline fade in
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Scanline continuous loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanlinePosition, {
          toValue: 120,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanlinePosition, {
          toValue: -120,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Exit transition
    const exitTimer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onComplete?.();
      });
    }, duration);

    return () => clearTimeout(exitTimer);
  }, [duration, onComplete]);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: containerOpacity },
      ]}
    >
      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Text style={styles.logoText}>⚽</Text>
        <Text style={styles.logoTitle}>GoalGPT</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        POWERED BY AI
      </Animated.Text>

      {/* Scanline */}
      <Animated.View
        style={[
          styles.scanline,
          {
            transform: [{ translateX: scanlinePosition }],
          },
        ]}
      />
    </Animated.View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 100,
    marginBottom: spacing.md,
  },
  logoTitle: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 48,
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(75, 196, 30, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontFamily: typography.fonts.ui.medium,
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 24,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scanline: {
    position: 'absolute',
    bottom: 100,
    width: 120,
    height: 2,
    backgroundColor: 'rgba(75, 196, 30, 0.8)',
    shadowColor: '#4BC41E',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default SplashScreen;
