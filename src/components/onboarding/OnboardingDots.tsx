/**
 * OnboardingDots Component
 * Pagination dots indicator for onboarding carousel
 */

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export interface OnboardingDotsProps {
  total: number;
  currentIndex: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const OnboardingDots: React.FC<OnboardingDotsProps> = ({ total, currentIndex }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === currentIndex;

        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: isActive ? theme.primary[500] : theme.background.elevated,
                borderColor: isActive ? theme.primary[500] : theme.border.primary,
                width: isActive ? 32 : 8,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
  },
  dot: {
    height: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default OnboardingDots;
