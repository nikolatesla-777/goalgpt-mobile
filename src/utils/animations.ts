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
 * Returns target opacity and duration for manual animation
 */
export const fadeIn = (duration = animation.duration.normal) => {
  return {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.ease),
  };
};

/**
 * Fade Out Animation
 * Returns target opacity and duration for manual animation
 */
export const fadeOut = (duration = animation.duration.normal) => {
  return {
    toValue: 0,
    duration,
    easing: Easing.in(Easing.ease),
  };
};

/**
 * Scale Up Animation (button press feedback)
 * Returns target scale and config for manual animation
 */
export const scaleUp = (toValue = 1, config: WithSpringConfig = springConfig) => {
  return { toValue, config };
};

/**
 * Scale Down Animation (button press feedback)
 * Returns target scale and config for manual animation
 */
export const scaleDown = (toValue = animation.scale.pressed, config: WithSpringConfig = springConfig) => {
  return { toValue, config };
};

/**
 * Pulse Animation (LIVE badges, notifications)
 * Returns config for repeating scale animation
 */
export const pulse = (duration = 2000) => {
  return {
    toValue: animation.scale.pulse,
    duration: duration / 2,
    easing: Easing.inOut(Easing.ease),
    repeat: -1,
    reverse: true,
  };
};

/**
 * Neon Glow Animation (text shadow radius)
 * Returns config for repeating glow animation
 */
export const neonGlow = (duration = 1500) => {
  return {
    toValue: 16,
    duration: duration / 2,
    easing: Easing.inOut(Easing.ease),
    repeat: -1,
    reverse: true,
  };
};

/**
 * Scanline Animation (terminal effect - Y position)
 * Returns config for infinite vertical animation
 */
export const scanline = (screenHeight: number, duration = 3000) => {
  return {
    toValue: screenHeight,
    duration,
    easing: Easing.linear,
    repeat: -1,
    reverse: false,
  };
};

/**
 * Shimmer Animation (skeleton loading - X position)
 * Returns config for infinite horizontal animation
 */
export const shimmer = (screenWidth: number, duration = 1500) => {
  return {
    toValue: screenWidth,
    duration,
    easing: Easing.linear,
    repeat: -1,
    reverse: false,
  };
};

/**
 * Bounce In Animation (success/celebration)
 * Returns config for elastic bounce animation
 */
export const bounceIn = (duration = 500) => {
  return {
    toValue: 1,
    duration,
    easing: Easing.elastic(1),
  };
};

/**
 * Shake Animation (error feedback)
 * Returns array of keyframe values for translateX
 */
export const shakeKeyframes = () => [0, -10, 10, -10, 10, 0];

/**
 * Shake Animation with timing
 * Returns config for shake animation
 */
export const shake = (duration = 500) => {
  return {
    toValue: 0,
    duration,
    easing: Easing.linear,
  };
};

// ============================================
// PRESS ANIMATIONS
// ============================================

/**
 * Button Press Animation
 * Returns scale and opacity config
 */
export const buttonPress = () => {
  return {
    scale: { toValue: animation.scale.pressed, config: quickSpring },
    opacity: { toValue: animation.opacity.pressed, ...fast },
  };
};

/**
 * Button Release Animation
 * Returns scale and opacity config
 */
export const buttonRelease = () => {
  return {
    scale: { toValue: 1, config: quickSpring },
    opacity: { toValue: 1, ...fast },
  };
};

/**
 * Card Press Animation
 * Returns scale config
 */
export const cardPress = () => {
  return { toValue: animation.scale.pressedButton, config: quickSpring };
};

/**
 * Card Release Animation
 * Returns scale config
 */
export const cardRelease = () => {
  return { toValue: 1, config: quickSpring };
};

// ============================================
// SLIDE ANIMATIONS
// ============================================

/**
 * Slide From Right (navigation)
 * Returns config for slide animation
 */
export const slideFromRight = (screenWidth: number, duration = animation.duration.normal) => {
  return {
    toValue: 0,
    fromValue: screenWidth,
    duration,
    easing: Easing.out(Easing.ease),
  };
};

/**
 * Slide From Left
 * Returns config for slide animation
 */
export const slideFromLeft = (screenWidth: number, duration = animation.duration.normal) => {
  return {
    toValue: 0,
    fromValue: -screenWidth,
    duration,
    easing: Easing.out(Easing.ease),
  };
};

/**
 * Slide From Bottom (modal)
 * Returns config for slide animation
 */
export const slideFromBottom = (screenHeight: number, duration = animation.duration.normal) => {
  return {
    toValue: 0,
    fromValue: screenHeight,
    duration,
    easing: Easing.out(Easing.ease),
  };
};

/**
 * Slide To Bottom (modal dismiss)
 * Returns config for slide animation
 */
export const slideToBottom = (screenHeight: number, duration = animation.duration.normal) => {
  return {
    toValue: screenHeight,
    fromValue: 0,
    duration,
    easing: Easing.in(Easing.ease),
  };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create delayed animation
 * Returns config with delay
 */
export const withDelay = (delayMs: number, animationConfig: any) => {
  return {
    ...animationConfig,
    delay: delayMs,
  };
};

/**
 * Create sequence of animations
 * Returns array of animation configs
 */
export const withSequence = (...animations: any[]) => {
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
