/**
 * NavigationLoadingScreen Component
 *
 * Premium Loading Screen during navigation/lazy loading
 * - Uses 3D GoalGPT Logo
 * - Pulsing Animation
 * - Neon styling
 */

import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeonText } from './atoms/NeonText';
import { spacing } from '../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface NavigationLoadingScreenProps {
  message?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const NavigationLoadingScreen: React.FC<NavigationLoadingScreenProps> = ({
  message = 'Loading...',
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated 3D Logo */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }], marginBottom: spacing.xl }}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/goalgpt-logo-new.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color="#4BC41E" style={styles.indicator} />

        {/* Message */}
        <NeonText color="white" glow="small" size="small" weight="semibold" style={{ opacity: 0.8 }}>
          {message}
        </NeonText>
      </View>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05120d', // Matches the dark greenish-black background from screenshot
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 80, // Circular container as per the "glow" effect, or square if preferred. Screenshot looks like a square box inside a circular glow? 
    // Actually looking closely at uploaded_image_0, it's a square image inside a circular glow or just a square with glow.
    // The previous prompt said "2. resimdeki logoyu kullanacaksın" (use the logo in the 2nd picture).
    // The 1st picture shows the desired RESULT.
    // The result has a circular green glow around a square/rectangular logo area.
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Black background for the logo box
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.5)',
    shadowColor: '#4BC41E',
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  indicator: {
    marginTop: spacing.xl * 1.5,
    marginBottom: spacing.md,
  },
});

export default NavigationLoadingScreen;
