/**
 * LiveBadge Component
 *
 * Molecule component for match status badges
 * LIVE, FT, HT, Upcoming time display
 * Master Plan v1.0 compliant
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NeonText, LiveIndicator } from '../atoms/NeonText';
import { typography } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export type BadgeStatus = 'live' | 'finished' | 'halftime' | 'upcoming' | 'postponed' | 'cancelled';

export interface LiveBadgeProps {
  /** Status type */
  status: BadgeStatus;

  /** Display text (e.g., "FT", "HT", "19:00") */
  text?: string;

  /** Show minute for live matches */
  minute?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LiveBadge: React.FC<LiveBadgeProps> = ({ status, text, minute }) => {
  // ============================================================================
  // RENDER
  // ============================================================================

  switch (status) {
    case 'live':
      return (
        <View style={styles.container}>
          <LiveIndicator />
          {minute !== undefined && (
            <NeonText color="live" glow="medium" size="small" weight="bold" style={styles.minute}>
              {minute}'
            </NeonText>
          )}
        </View>
      );

    case 'halftime':
      return (
        <NeonText color="vip" glow="medium" size="small" weight="bold">
          {text || 'HT'}
        </NeonText>
      );

    case 'finished':
      return (
        <NeonText color="white" glow="small" size="small" weight="semibold">
          {text || 'FT'}
        </NeonText>
      );

    case 'postponed':
      return (
        <NeonText color="vip" glow="small" size="small" weight="semibold">
          {text || 'POSTPONED'}
        </NeonText>
      );

    case 'cancelled':
      return (
        <NeonText color="live" glow="small" size="small" weight="semibold">
          {text || 'CANCELLED'}
        </NeonText>
      );

    case 'upcoming':
    default:
      return (
        <NeonText color="white" glow="small" size="small" weight="semibold">
          {text || 'VS'}
        </NeonText>
      );
  }
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  minute: {
    marginTop: 4,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default LiveBadge;
