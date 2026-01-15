/**
 * Skeleton Component
 *
 * Loading placeholder with animated pulse effect
 * Used while data is being fetched
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

export interface SkeletonProps {
  /** Width of skeleton */
  width?: number | string;

  /** Height of skeleton */
  height?: number;

  /** Border radius */
  borderRadius?: number;

  /** Style override */
  style?: any;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  // ============================================================================
  // ANIMATION
  // ============================================================================

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// ============================================================================
// SKELETON CARD (Preset)
// ============================================================================

export const SkeletonMatchCard: React.FC = () => {
  return (
    <View style={styles.matchCard}>
      {/* Teams */}
      <View style={styles.teamsRow}>
        <Skeleton width={60} height={60} borderRadius={30} />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={32} />
        </View>
        <Skeleton width={60} height={60} borderRadius={30} />
      </View>

      {/* League */}
      <Skeleton width="50%" height={14} style={{ marginTop: 12 }} />
    </View>
  );
};

// ============================================================================
// SKELETON PREDICTION CARD (Preset)
// ============================================================================

export const SkeletonPredictionCard: React.FC = () => {
  return (
    <View style={styles.predictionCard}>
      {/* Header */}
      <View style={styles.predictionHeader}>
        <Skeleton width={80} height={24} />
        <Skeleton width={60} height={20} borderRadius={12} />
      </View>

      {/* Match */}
      <View style={{ gap: 6, marginVertical: 12 }}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="100%" height={16} />
      </View>

      {/* Prediction */}
      <View style={styles.predictionRow}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width="40%" height={20} />
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  matchCard: {
    backgroundColor: 'rgba(23, 80, 61, 0.65)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.15)',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  predictionCard: {
    backgroundColor: 'rgba(23, 80, 61, 0.65)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.15)',
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default Skeleton;
