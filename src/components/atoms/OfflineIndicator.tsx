/**
 * OfflineIndicator Component
 * Shows a banner when app is offline
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../constants/theme';
import { NeonText } from './NeonText';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

// ============================================================================
// COMPONENT
// ============================================================================

export const OfflineIndicator: React.FC = () => {
  const { theme } = useTheme();
  const { isOffline } = useNetworkStatus();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (isOffline) {
      // Slide down
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }).start();
    } else {
      // Slide up
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOffline, slideAnim]);

  if (!isOffline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.error.main,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <NeonText size="sm" style={styles.icon}>
          📵
        </NeonText>
        <NeonText size="sm" style={styles.text}>
          İnternet bağlantısı yok
        </NeonText>
      </View>
    </Animated.View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[10], // Account for status bar
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  icon: {
    fontSize: 16,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
