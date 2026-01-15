/**
 * OnboardingScreen
 *
 * 4-slide onboarding carousel
 * Master Plan compliant - Authentication Layer
 */

import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Button } from '../components/atoms/Button';
import { useTheme } from '../theme/ThemeProvider';
import { typography, spacing } from '../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  illustration: string;
}

export interface OnboardingScreenProps {
  /** Callback when onboarding is completed */
  onComplete?: () => void;

  /** Callback when skip is pressed */
  onSkip?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to GoalGPT',
    description:
      'AI-powered football predictions that help you make smarter betting decisions.',
    illustration: '⚽🤖',
  },
  {
    id: 2,
    title: 'Real-Time AI Analysis',
    description:
      'Our advanced AI analyzes matches in real-time and provides instant predictions.',
    illustration: '📊⚡',
  },
  {
    id: 3,
    title: 'AI Bots with 80%+ Accuracy',
    description:
      'Multiple specialized AI bots working 24/7 to find the best betting opportunities.',
    illustration: '🤖💯',
  },
  {
    id: 4,
    title: 'Unlock Premium Features',
    description:
      'Get access to exclusive AI bots, unlimited predictions, and expert analysis.',
    illustration: '👑💎',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentSlide(slideIndex);
  };

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentSlide + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      onComplete?.();
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  // ============================================================================
  // RENDER SLIDE
  // ============================================================================

  const renderSlide = (slide: OnboardingSlide) => {
    return (
      <View key={slide.id} style={styles.slide}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustration}>{slide.illustration}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{slide.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{slide.description}</Text>
      </View>
    );
  };

  // ============================================================================
  // RENDER PAGINATION DOTS
  // ============================================================================

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationDots}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentSlide && styles.dotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          {currentSlide + 1}/{SLIDES.length}
        </Text>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map(renderSlide)}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        {renderPaginationDots()}

        {/* Next/Get Started Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleNext}
          style={styles.nextButton}
        >
          {isLastSlide ? 'Get Started' : 'Next'}
        </Button>
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
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  skipButton: {
    fontFamily: typography.fonts.ui.medium,
    fontSize: 15,
    color: '#8E8E93',
  },
  pageIndicator: {
    fontFamily: typography.fonts.mono.regular,
    fontSize: 13,
    color: '#8E8E93',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    backgroundColor: 'rgba(75, 196, 30, 0.1)',
    borderRadius: 150,
    borderWidth: 2,
    borderColor: 'rgba(75, 196, 30, 0.3)',
  },
  illustration: {
    fontSize: 120,
  },
  title: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    backgroundColor: '#4BC41E',
    shadowColor: '#4BC41E',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  nextButton: {
    marginTop: 0,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default OnboardingScreen;
