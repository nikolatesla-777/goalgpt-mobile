/**
 * ProfileHeaderSkeleton Component
 * Loading skeleton for profile header
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { GlassCard } from '../atoms/GlassCard';

// ============================================================================
// COMPONENT
// ============================================================================

export const ProfileHeaderSkeleton: React.FC = () => {
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
        {/* Avatar Skeleton */}
        <Animated.View style={[styles.avatar, skeletonStyle]} />

        {/* User Info Skeleton */}
        <View style={styles.info}>
          <Animated.View style={[styles.username, skeletonStyle]} />
          <Animated.View style={[styles.email, skeletonStyle]} />
          <Animated.View style={[styles.joinDate, skeletonStyle]} />
        </View>

        {/* Edit Button Skeleton */}
        <Animated.View style={[styles.editButton, skeletonStyle]} />

        {/* XP Progress Skeleton */}
        <View style={styles.xpSection}>
          <View style={styles.xpHeader}>
            <Animated.View style={[styles.levelBadge, skeletonStyle]} />
            <Animated.View style={[styles.xpText, skeletonStyle]} />
          </View>
          <Animated.View style={[styles.progressBar, skeletonStyle]} />
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
    marginBottom: spacing[4],
  },
  container: {
    padding: spacing[4],
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing[3],
  },
  info: {
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  username: {
    width: 150,
    height: 24,
    borderRadius: 6,
  },
  email: {
    width: 180,
    height: 16,
    borderRadius: 4,
  },
  joinDate: {
    width: 120,
    height: 14,
    borderRadius: 4,
  },
  editButton: {
    width: 140,
    height: 40,
    borderRadius: 20,
    marginBottom: spacing[4],
  },
  xpSection: {
    width: '100%',
    gap: spacing[2],
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBadge: {
    width: 80,
    height: 28,
    borderRadius: 14,
  },
  xpText: {
    width: 100,
    height: 16,
    borderRadius: 4,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
});
