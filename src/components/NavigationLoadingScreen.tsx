/**
 * NavigationLoadingScreen Component
 *
 * Loading screen shown during navigation transitions
 * - Consistent with app theme
 * - Smooth animation
 * - Optional message
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeonText } from './atoms/NeonText';
import { spacing, typography } from '../constants/tokens';

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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo or Icon */}
        <Text style={styles.logo}>⚽</Text>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color="#4BC41E" style={styles.indicator} />

        {/* Message */}
        <NeonText color="white" glow="small" size="small" weight="medium">
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
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  indicator: {
    marginBottom: spacing.lg,
  },
});

export default NavigationLoadingScreen;
