/**
 * LiveMatchCardSkeleton Component
 * Loading skeleton for live match cards
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { GlassCard } from '../atoms/GlassCard';

// ============================================================================
// COMPONENT
// ============================================================================

export const LiveMatchCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const skeletonStyle = {
    backgroundColor: theme.border.primary,
    opacity,
  };

  return (
    <GlassCard intensity="medium" style={styles.card}>
      <View style={styles.container}>
        {/* League Header Skeleton */}
        <View style={styles.leagueSection}>
          <Animated.View style={[styles.leagueLogo, skeletonStyle]} />
          <Animated.View style={[styles.leagueName, skeletonStyle]} />
        </View>

        {/* Match Content Skeleton */}
        <View style={styles.matchContent}>
          {/* Home Team */}
          <View style={styles.teamSection}>
            <Animated.View style={[styles.teamBadge, skeletonStyle]} />
            <Animated.View style={[styles.teamName, skeletonStyle]} />
          </View>

          {/* Score & Status */}
          <View style={styles.scoreSection}>
            <View style={styles.scoreRow}>
              <Animated.View style={[styles.score, skeletonStyle]} />
              <Animated.View style={[styles.scoreSeparator, skeletonStyle]} />
              <Animated.View style={[styles.score, skeletonStyle]} />
            </View>
            <Animated.View style={[styles.status, skeletonStyle]} />
          </View>

          {/* Away Team */}
          <View style={styles.teamSection}>
            <Animated.View style={[styles.teamBadge, skeletonStyle]} />
            <Animated.View style={[styles.teamName, skeletonStyle]} />
          </View>
        </View>
      </View>
    </GlassCard>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing[3],
  },
  container: {
    padding: spacing[3],
  },
  leagueSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  leagueLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  leagueName: {
    width: 120,
    height: 14,
    borderRadius: 4,
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[2],
  },
  teamBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  teamName: {
    width: 80,
    height: 12,
    borderRadius: 4,
  },
  scoreSection: {
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  score: {
    width: 30,
    height: 32,
    borderRadius: 6,
  },
  scoreSeparator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  status: {
    width: 60,
    height: 20,
    borderRadius: 10,
  },
});
