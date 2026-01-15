/**
 * Toast Component
 * Displays temporary notification messages
 * Supports success, error, warning, and info types
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top' | 'bottom';

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  position?: ToastPosition;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

// ============================================================================
// TOAST ICONS
// ============================================================================

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const { id, type, message, duration = 3000, position = 'top' } = toast;

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    // Slide out
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(id);
    });
  };

  // ============================================================================
  // STYLES
  // ============================================================================

  const backgroundColor = {
    success: theme.success.main,
    error: theme.error.main,
    warning: theme.warning.main,
    info: theme.info.main,
  }[type];

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: position === 'top' ? [-100, 0] : [100, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.positionTop : styles.positionBottom,
        {
          backgroundColor,
          opacity: opacityAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable onPress={dismiss} style={styles.pressable}>
        <View style={styles.content}>
          {/* Icon */}
          <Text style={styles.icon}>{TOAST_ICONS[type]}</Text>

          {/* Message */}
          <Text style={styles.message} numberOfLines={3}>
            {message}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// ============================================================================
// TOAST CONTAINER
// ============================================================================

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  // Group toasts by position
  const topToasts = toasts.filter((t) => (t.position || 'top') === 'top');
  const bottomToasts = toasts.filter((t) => t.position === 'bottom');

  return (
    <>
      {/* Top Toasts */}
      {topToasts.length > 0 && (
        <View style={[styles.containerWrapper, styles.containerTop]} pointerEvents="box-none">
          {topToasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
          ))}
        </View>
      )}

      {/* Bottom Toasts */}
      {bottomToasts.length > 0 && (
        <View style={[styles.containerWrapper, styles.containerBottom]} pointerEvents="box-none">
          {bottomToasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
          ))}
        </View>
      )}
    </>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  containerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: spacing[4],
    gap: spacing[2],
    zIndex: 9998, // Below OfflineIndicator (9999)
    pointerEvents: 'box-none',
  },
  containerTop: {
    top: spacing[12], // Below status bar and offline indicator
  },
  containerBottom: {
    bottom: spacing[4],
  },
  container: {
    borderRadius: 12,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  positionTop: {
    marginBottom: spacing[2],
  },
  positionBottom: {
    marginTop: spacing[2],
  },
  pressable: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  icon: {
    fontSize: 20,
  },
  message: {
    ...typography.body2,
    fontSize: typography.sizes.sm,
    color: '#FFFFFF',
    flex: 1,
    fontWeight: '600',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default Toast;
