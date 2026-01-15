/**
 * WebSocket Status Indicator
 * Shows WebSocket connection status (connecting, connected, reconnecting, disconnected)
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useWebSocket } from '../../context/WebSocketContext';
import { useTheme } from '../../context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

export interface WebSocketStatusIndicatorProps {
  /** Show only when reconnecting (default: false, shows all statuses) */
  onlyShowReconnecting?: boolean;
  /** Position: top or bottom (default: top) */
  position?: 'top' | 'bottom';
  /** Callback when tapped */
  onPress?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const WebSocketStatusIndicator: React.FC<WebSocketStatusIndicatorProps> = ({
  onlyShowReconnecting = false,
  position = 'top',
  onPress,
}) => {
  const { status, isConnected, connect } = useWebSocket();
  const { theme } = useTheme();

  // Animation
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Determine if should show
  const shouldShow = onlyShowReconnecting
    ? status.reconnecting
    : status.reconnecting || !isConnected;

  // ============================================================================
  // ANIMATION
  // ============================================================================

  useEffect(() => {
    if (shouldShow) {
      // Slide in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: position === 'top' ? -100 : 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [shouldShow, slideAnim, opacityAnim, position]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default action: try to reconnect
      if (!isConnected) {
        connect();
      }
    }
  };

  // ============================================================================
  // RENDERING
  // ============================================================================

  if (!shouldShow) {
    return null;
  }

  // Determine status text and color
  let statusText = '';
  let statusColor = theme.error.main;
  let statusIcon = '🔴';

  if (status.reconnecting) {
    statusText = `Reconnecting... (${status.reconnectAttempts})`;
    statusColor = theme.warning.main;
    statusIcon = '🔄';
  } else if (!isConnected) {
    statusText = 'Real-time updates disconnected';
    statusColor = theme.error.main;
    statusIcon = '🔴';
  }

  // Container style
  const containerStyle = [
    styles.container,
    {
      backgroundColor: statusColor,
      [position === 'top' ? 'top' : 'bottom']: 0,
    },
  ];

  // Transform style
  const transformStyle = {
    opacity: opacityAnim,
    transform: [
      {
        translateY: slideAnim,
      },
    ],
  };

  return (
    <Animated.View style={[containerStyle, transformStyle]}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <Text style={styles.icon}>{statusIcon}</Text>
        <Text style={styles.text}>{statusText}</Text>
        {!status.reconnecting && (
          <Text style={styles.action}>Tap to reconnect</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Nohemi-SemiBold',
  },
  action: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 12,
    fontFamily: 'Nohemi-Medium',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default WebSocketStatusIndicator;
