/**
 * OnboardingSlide Component
 * Individual slide for the onboarding carousel
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export interface OnboardingSlideData {
  id: number;
  title: string;
  description: string;
  icon: string;
  accentColor?: 'primary' | 'success' | 'warning' | 'error';
}

export interface OnboardingSlideProps {
  slide: OnboardingSlideData;
  width: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide, width }) => {
  const { theme } = useTheme();

  const getAccentColor = () => {
    switch (slide.accentColor) {
      case 'success':
        return theme.success.main;
      case 'warning':
        return theme.warning.main;
      case 'error':
        return theme.error.main;
      default:
        return theme.primary[500];
    }
  };

  return (
    <View style={[styles.container, { width }]}>
      {/* Icon Container */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: theme.background.elevated,
            borderColor: getAccentColor(),
          },
        ]}
      >
        <NeonText size="display" style={{ fontSize: 120 }}>
          {slide.icon}
        </NeonText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <NeonText
          size="3xl"
          color="primary"
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: spacing[4],
          }}
        >
          {slide.title}
        </NeonText>

        {/* Description */}
        <NeonText
          size="lg"
          style={{
            color: theme.text.secondary,
            textAlign: 'center',
            lineHeight: 28,
            paddingHorizontal: spacing[6],
          }}
        >
          {slide.description}
        </NeonText>
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: spacing[8],
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default OnboardingSlide;
