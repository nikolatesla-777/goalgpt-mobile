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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/atoms/Button';
import { useTheme } from '../theme/ThemeProvider';
import { typography, spacing } from '../constants/tokens';
import { TechIllustration } from '../components/onboarding/TechIllustration';

// ============================================================================
// TYPES
// ============================================================================

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to GoalGPT',
    description:
      'AI-powered football predictions that help you make smarter betting decisions.',
  },
  {
    id: 2,
    title: 'Real-Time AI Analysis',
    description:
      'Our advanced AI analyzes matches in real-time and provides instant predictions.',
  },
  {
    id: 3,
    title: 'AI Bots with 80%+ Accuracy',
    description:
      'Multiple specialized AI bots working 24/7 to find the best betting opportunities.',
  },
  {
    id: 4,
    title: 'Unlock Premium Features',
    description:
      'Get access to exclusive AI bots, unlimited predictions, and expert analysis.',
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
        {/* Animated Tech Illustration */}
        <View style={styles.illustrationContainer}>
          <TechIllustration slideId={slide.id} />
          {/* <Text style={{ color: 'white', fontSize: 40 }}>ICON</Text> */}
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
      {/* 1. Background Image (Data Center Theme) */}
      <Image
        source={require('../../assets/images/splash-stadium.jpg')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />

      {/* 2. Dark Overlay for readability */}
      <LinearGradient
        colors={['rgba(7, 26, 18, 0.85)', 'rgba(7, 26, 18, 0.95)', '#071A12']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* 3. Subtle Green Glow from bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(75, 196, 30, 0.1)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />

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

        {/* Next/Get Started Button (Neon Green) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNext}
          style={styles.nextButtonContainer}
        >
          <LinearGradient
            colors={['#4BC41E', '#3AA614']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {isLastSlide ? 'GET STARTED' : 'NEXT'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
    backgroundColor: '#071A12', // Fallback color
  },
  bgImage: {
    width: '100%',
    height: '100%',
    opacity: 0.4, // Dim background image
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 10,
  },
  skipButton: {
    fontFamily: typography.fonts.ui.medium,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  pageIndicator: {
    fontFamily: typography.fonts.mono.regular,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40, // Adjusts center balance
  },
  illustrationContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    // No background here, animation handles it
  },
  title: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
    textShadowColor: 'rgba(75, 196, 30, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  description: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    backgroundColor: '#4BC41E',
    width: 24, // Elongated active dot
    shadowColor: '#4BC41E',
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  nextButtonContainer: {
    width: '100%',
    shadowColor: '#4BC41E',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
  },
  nextButtonGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

export default OnboardingScreen;
