/**
 * SplashScreen
 *
 * Initial loading screen with stadium background, dark gradient, and logo animation
 * Master Plan compliant - Authentication Layer
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../../assets/images/splash-bg.png')}
        style={styles.bgContainer}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)', '#000000']}
          locations={[0, 0.6, 1]}
          style={styles.gradient}
        />

        <Animated.View
          style={[
            styles.contentContainer,
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
            <Animated.Image
              source={require('../../assets/images/splash-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoTitle}>GoalGPT</Text>
          </Animated.View>

          {/* Tagline */}
          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            POWERED BY AI
          </Animated.Text>

          {/* Scanline - Optional for this look, keeps tech feel */}
          <Animated.View
            style={[
              styles.scanline,
              {
                transform: [{ translateX: scanlinePosition }],
              },
            ]}
          />
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
    marginBottom: spacing.md,
  },
  logoTitle: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 48,
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Stronger shadow for bg contrast
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontFamily: typography.fonts.ui.medium,
    fontSize: 15,
    color: '#E0E0E0', // Slightly lighter for readability against dark bg
    marginTop: 24,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scanline: {
    position: 'absolute',
    bottom: 150, // Adjusted position relative to container center
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
