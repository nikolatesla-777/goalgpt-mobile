// src/components/ui/Card.tsx
// GoalGPT Mobile App - Card Component

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

export interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: keyof typeof spacing;
  style?: ViewStyle;
  onPress?: () => void;
}

export default function Card({ children, variant = 'elevated', padding = 'md', style }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], { padding: spacing[padding] }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.primary,
  },

  // Variants
  elevated: {
    ...shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  flat: {
    backgroundColor: colors.background.secondary,
  },
});
