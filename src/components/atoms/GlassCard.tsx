/**
 * GlassCard Component
 *
 * Glassmorphism card with backdrop blur
 * Master Plan v1.0 compliant - 3 intensities: default, intense, subtle
 */

import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../theme/ThemeProvider';

export type GlassIntensity = 'default' | 'intense' | 'subtle';

export interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: GlassIntensity;
  padding?: number;
  borderRadius?: number;
  useNativeBlur?: boolean;
  style?: ViewStyle;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 'default',
  padding,
  borderRadius: customRadius,
  useNativeBlur = false,
  style,
  ...rest
}) => {
  const { theme } = useTheme();

  const glassStyle = theme.glassmorphism[intensity];
  const finalPadding = padding !== undefined ? padding : theme.spacing.lg;
  const finalRadius = customRadius !== undefined ? customRadius : theme.borderRadius.xxl;

  const containerStyle: ViewStyle = {
    ...glassStyle,
    borderRadius: finalRadius,
    padding: finalPadding,
    overflow: 'hidden',
  };

  if (useNativeBlur) {
    return (
      <View style={[containerStyle, theme.shadows.card[intensity], style]} {...rest}>
        <BlurView
          intensity={intensity === 'intense' ? 40 : intensity === 'subtle' ? 10 : 20}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        <View style={{ padding: finalPadding }}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[containerStyle, theme.shadows.card[intensity], style]} {...rest}>
      {children}
    </View>
  );
};

export default GlassCard;
