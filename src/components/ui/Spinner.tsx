// src/components/ui/Spinner.tsx
// GoalGPT Mobile App - Loading Spinner Component

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';

export interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
  style?: ViewStyle;
}

export default function Spinner({
  size = 'large',
  color = colors.primary[500],
  message,
  overlay = false,
  style,
}: SpinnerProps) {
  const content = (
    <View style={[styles.container, overlay && styles.overlay, style]}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
  },

  spinnerContainer: {
    backgroundColor: colors.background.primary,
    padding: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },

  message: {
    marginTop: spacing.md,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
