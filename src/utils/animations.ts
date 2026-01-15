/**
 * Animation Utilities
 *
 * Reusable animation helpers with Reanimated 2
 * Spring physics, timing functions, and presets
 * Based on Master Plan animation system
 */

/**
 * EXPO GO COMPATIBLE VERSION
 * Using React Native Animated API instead of Reanimated
 */
import { Easing } from 'react-native';
import { animation } from '../constants/tokens';

// Type definitions for compatibility
export type WithSpringConfig = {
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
};

export type WithTimingConfig = {
  duration?: number;
  easing?: (value: number) => number;
};

// ============================================
// SPRING PHYSICS
// ============================================

/**
 * Default spring configuration
 * Natural, bouncy feel for interactions
 */
export const springConfig: WithSpringConfig = {
  damping: animation.spring.damping,
  mass: animation.spring.mass,
  stiffness: animation.spring.stiffness,
  overshootClamping: animation.spring.overshootClamping,
  restDisplacementThreshold: animation.spring.restDisplacementThreshold,
  restSpeedThreshold: animation.spring.restSpeedThreshold,
};

/**
 * Quick spring (faster response)
 */
export const quickSpring: WithSpringConfig = {
  ...springConfig,
  damping: 20,
  stiffness: 200,
};

/**
 * Smooth spring (slower, more fluid)
 */
export const smoothSpring: WithSpringConfig = {
  ...springConfig,
  damping: 25,
  stiffness: 100,
};

// ============================================
// TIMING FUNCTIONS
// ============================================

/**
 * Ease out timing (most common)
 */
export const easeOut: WithTimingConfig = {
  duration: animation.duration.normal,
  easing: Easing.out(Easing.ease),
};

/**
 * Ease in timing
 */
export const easeIn: WithTimingConfig = {
  duration: animation.duration.normal,
  easing: Easing.in(Easing.ease),
};

/**
 * Ease in-out timing
 */
export const easeInOut: WithTimingConfig = {
  duration: animation.duration.normal,
  easing: Easing.inOut(Easing.ease),
};

/**
 * Linear timing
 */
export const linear: WithTimingConfig = {
  duration: animation.duration.normal,
  easing: Easing.linear,
};

/**
 * Fast timing
 */
export const fast: WithTimingConfig = {
  duration: animation.duration.fast,
  easing: Easing.out(Easing.ease),
};

/**
 * Slow timing
 */
export const slow: WithTimingConfig = {
  duration: animation.duration.slow,
  easing: Easing.out(Easing.ease),
};

// ============================================
// ANIMATION PRESETS
// ============================================

/**
 * Fade In Animation
 */
export const fadeIn = (duration = animation.duration.normal) => {
  return withTiming(1, {
    duration,
    easing: Easing.out(Easing.ease),
  });
};

/**
 * Fade Out Animation
 */
export const fadeOut = (duration = animation.duration.normal) => {
  return withTiming(0, {
    duration,
    easing: Easing.in(Easing.ease),
  });
};

/**
 * Scale Up Animation (button press feedback)
 */
export const scaleUp = (toValue = 1, config: WithSpringConfig = springConfig) => {
  return withSpring(toValue, config);
};

/**
 * Scale Down Animation (button press feedback)
 */
export const scaleDown = (toValue = animation.scale.pressed, config: WithSpringConfig = springConfig) => {
  return withSpring(toValue, config);
};

/**
 * Pulse Animation (LIVE badges, notifications)
 */
export const pulse = (duration = 2000) => {
  return withRepeat(
    withTiming(animation.scale.pulse, {
      duration: duration / 2,
      easing: Easing.inOut(Easing.ease),
    }),
    -1, // Infinite
    true // Reverse
  );
};

/**
 * Neon Glow Animation (text shadow radius)
 */
export const neonGlow = (duration = 1500) => {
  return withRepeat(
    withTiming(16, {
      duration: duration / 2,
      easing: Easing.inOut(Easing.ease),
    }),
    -1, // Infinite
    true // Reverse
  );
};

/**
 * Scanline Animation (terminal effect - Y position)
 */
export const scanline = (screenHeight: number, duration = 3000) => {
  return withRepeat(
    withTiming(screenHeight, {
      duration,
      easing: Easing.linear,
    }),
    -1, // Infinite
    false // Don't reverse
  );
};

/**
 * Shimmer Animation (skeleton loading - X position)
 */
export const shimmer = (screenWidth: number, duration = 1500) => {
  return withRepeat(
    withTiming(screenWidth, {
      duration,
      easing: Easing.linear,
    }),
    -1, // Infinite
    false // Don't reverse
  );
};

/**
 * Bounce In Animation (success/celebration)
 */
export const bounceIn = (duration = 500) => {
  return withTiming(1, {
    duration,
    easing: Easing.elastic(1),
  });
};

/**
 * Shake Animation (error feedback)
 * Returns array of keyframe values for translateX
 */
export const shakeKeyframes = () => [0, -10, 10, -10, 10, 0];

/**
 * Shake Animation with timing
 */
export const shake = (duration = 500) => {
  return withTiming(0, {
    duration,
    easing: Easing.linear,
  });
};

// ============================================
// PRESS ANIMATIONS
// ============================================

/**
 * Button Press Animation
 * Returns scale and opacity values
 */
export const buttonPress = () => {
  return {
    scale: withSpring(animation.scale.pressed, quickSpring),
    opacity: withTiming(animation.opacity.pressed, fast),
  };
};

/**
 * Button Release Animation
 * Returns scale and opacity values
 */
export const buttonRelease = () => {
  return {
    scale: withSpring(1, quickSpring),
    opacity: withTiming(1, fast),
  };
};

/**
 * Card Press Animation
 * Returns scale value
 */
export const cardPress = () => {
  return withSpring(animation.scale.pressedButton, quickSpring);
};

/**
 * Card Release Animation
 * Returns scale value
 */
export const cardRelease = () => {
  return withSpring(1, quickSpring);
};

// ============================================
// SLIDE ANIMATIONS
// ============================================

/**
 * Slide From Right (navigation)
 */
export const slideFromRight = (screenWidth: number, duration = animation.duration.normal) => {
  return withTiming(0, {
    duration,
    easing: Easing.out(Easing.ease),
  });
};

/**
 * Slide From Left
 */
export const slideFromLeft = (screenWidth: number, duration = animation.duration.normal) => {
  return withTiming(0, {
    duration,
    easing: Easing.out(Easing.ease),
  });
};

/**
 * Slide From Bottom (modal)
 */
export const slideFromBottom = (screenHeight: number, duration = animation.duration.normal) => {
  return withTiming(0, {
    duration,
    easing: Easing.out(Easing.ease),
  });
};

/**
 * Slide To Bottom (modal dismiss)
 */
export const slideToBottom = (screenHeight: number, duration = animation.duration.normal) => {
  return withTiming(screenHeight, {
    duration,
    easing: Easing.in(Easing.ease),
  });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create delayed animation
 */
export const withDelay = (delayMs: number, animation: any) => {
  'worklet';
  return withTiming(animation, {
    duration: delayMs,
  });
};

/**
 * Create sequence of animations
 */
export const withSequence = (...animations: any[]) => {
  'worklet';
  return animations;
};

/**
 * Get responsive scale factor based on screen width
 */
export const getScaleFactor = (screenWidth: number): number => {
  if (screenWidth < 375) return 0.9;  // Small phones (iPhone SE)
  if (screenWidth < 414) return 1.0;  // Standard phones (iPhone 12)
  if (screenWidth < 480) return 1.1;  // Large phones (iPhone 14 Pro Max)
  return 1.2;                         // Tablets
};

// ============================================
// EXPORT ALL
// ============================================

export const animations = {
  // Spring configs
  springConfig,
  quickSpring,
  smoothSpring,

  // Timing configs
  easeOut,
  easeIn,
  easeInOut,
  linear,
  fast,
  slow,

  // Presets
  fadeIn,
  fadeOut,
  scaleUp,
  scaleDown,
  pulse,
  neonGlow,
  scanline,
  shimmer,
  bounceIn,
  shake,

  // Press animations
  buttonPress,
  buttonRelease,
  cardPress,
  cardRelease,

  // Slide animations
  slideFromRight,
  slideFromLeft,
  slideFromBottom,
  slideToBottom,

  // Utilities
  withDelay,
  withSequence,
  getScaleFactor,
};

export default animations;
