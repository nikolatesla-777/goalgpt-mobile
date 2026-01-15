/**
 * ConnectionStatus Component
 *
 * Shows WebSocket connection status indicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography } from '../../constants/tokens';

export interface ConnectionStatusProps {
  isConnected: boolean;
  isReconnecting?: boolean;
  showWhenConnected?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isReconnecting = false,
  showWhenConnected = false,
}) => {
  // Don't show anything when connected (unless forced)
  if (isConnected && !showWhenConnected) {
    return null;
  }

  const statusText = isConnected
    ? 'Live'
    : isReconnecting
    ? 'Reconnecting...'
    : 'Offline';

  const statusColor = isConnected ? '#4BC41E' : isReconnecting ? '#FF9500' : '#FF3B30';

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: statusColor }]} />
      <Text style={styles.statusText}>{statusText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    gap: spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.small,
    color: '#FFFFFF',
  },
});

export default ConnectionStatus;
