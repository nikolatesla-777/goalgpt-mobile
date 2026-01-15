/**
 * LoadingState Component
 * Displays loading states with skeleton screens
 * Provides better UX than simple spinners
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export interface LoadingStateProps {
  /** Loading type */
  type?: 'spinner' | 'skeleton';

  /** Skeleton variant */
  variant?: 'card' | 'list' | 'content' | 'matchCard';

  /** Number of skeleton items */
  count?: number;

  /** Custom container style */
  style?: ViewStyle;
}

// ============================================================================
// SKELETON ITEM
// ============================================================================

interface SkeletonItemProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({
  width = '100%',
  height = 20,
  borderRadius: radius = borderRadius.md,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
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
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const backgroundColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: isDark
      ? [theme.background.tertiary, theme.background.elevated]
      : [theme.background.secondary, theme.background.tertiary],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'skeleton',
  variant = 'content',
  count = 3,
  style,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // RENDER VARIANTS
  // ============================================================================

  const renderSpinner = () => (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color={theme.primary[500]} />
    </View>
  );

  const renderCardSkeleton = () => (
    <View style={[styles.skeletonCard, { backgroundColor: theme.background.tertiary }]}>
      <SkeletonItem width="60%" height={16} style={{ marginBottom: spacing[2] }} />
      <SkeletonItem width="40%" height={14} style={{ marginBottom: spacing[4] }} />
      <SkeletonItem width="100%" height={100} style={{ marginBottom: spacing[3] }} />
      <View style={styles.skeletonRow}>
        <SkeletonItem width="48%" height={40} />
        <SkeletonItem width="48%" height={40} />
      </View>
    </View>
  );

  const renderListSkeleton = () => (
    <View style={styles.skeletonList}>
      <View style={styles.skeletonRow}>
        <SkeletonItem width={40} height={40} borderRadius={20} />
        <View style={styles.skeletonListText}>
          <SkeletonItem width="70%" height={16} style={{ marginBottom: spacing[2] }} />
          <SkeletonItem width="40%" height={12} />
        </View>
      </View>
    </View>
  );

  const renderContentSkeleton = () => (
    <View style={styles.skeletonContent}>
      <SkeletonItem width="80%" height={24} style={{ marginBottom: spacing[4] }} />
      <SkeletonItem width="100%" height={16} style={{ marginBottom: spacing[2] }} />
      <SkeletonItem width="100%" height={16} style={{ marginBottom: spacing[2] }} />
      <SkeletonItem width="60%" height={16} style={{ marginBottom: spacing[4] }} />
      <SkeletonItem width="100%" height={200} />
    </View>
  );

  const renderMatchCardSkeleton = () => (
    <View style={[styles.matchCardSkeleton, { backgroundColor: theme.background.tertiary }]}>
      {/* League Header */}
      <View style={styles.skeletonRow}>
        <SkeletonItem width={20} height={20} borderRadius={4} />
        <View style={{ marginLeft: spacing[3], flex: 1 }}>
          <SkeletonItem width="60%" height={14} style={{ marginBottom: spacing[1] }} />
          <SkeletonItem width="40%" height={12} />
        </View>
      </View>

      {/* Separator */}
      <View
        style={{ height: 1, backgroundColor: theme.border.primary, marginVertical: spacing[3] }}
      />

      {/* Teams */}
      <View style={styles.skeletonRow}>
        <SkeletonItem width={32} height={32} borderRadius={16} />
        <SkeletonItem width="60%" height={16} style={{ marginLeft: spacing[3] }} />
      </View>

      <View style={[styles.skeletonRow, { marginTop: spacing[3] }]}>
        <SkeletonItem width={32} height={32} borderRadius={16} />
        <SkeletonItem width="60%" height={16} style={{ marginLeft: spacing[3] }} />
      </View>

      {/* Score */}
      <View style={{ alignItems: 'center', marginVertical: spacing[4] }}>
        <SkeletonItem width={120} height={40} />
      </View>

      {/* Live Ticker */}
      <View style={{ alignItems: 'center' }}>
        <SkeletonItem width={100} height={32} />
      </View>
    </View>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (type === 'spinner') {
    return renderSpinner();
  }

  const renderSkeletonVariant = () => {
    switch (variant) {
      case 'card':
        return renderCardSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'content':
        return renderContentSkeleton();
      case 'matchCard':
        return renderMatchCardSkeleton();
      default:
        return renderContentSkeleton();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={{ marginBottom: spacing[4] }}>
          {renderSkeletonVariant()}
        </View>
      ))}
    </View>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * LoadingSpinner
 * Simple loading spinner
 */
export const LoadingSpinner: React.FC<Omit<LoadingStateProps, 'type'>> = (props) => (
  <LoadingState {...props} type="spinner" />
);

/**
 * MatchCardSkeleton
 * Loading skeleton for match cards
 */
export const MatchCardSkeleton: React.FC<Omit<LoadingStateProps, 'variant'>> = (props) => (
  <LoadingState {...props} variant="matchCard" />
);

/**
 * ListSkeleton
 * Loading skeleton for lists
 */
export const ListSkeleton: React.FC<Omit<LoadingStateProps, 'variant'>> = (props) => (
  <LoadingState {...props} variant="list" />
);

/**
 * ContentSkeleton
 * Loading skeleton for content pages
 */
export const ContentSkeleton: React.FC<Omit<LoadingStateProps, 'variant'>> = (props) => (
  <LoadingState {...props} variant="content" />
);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  skeletonList: {
    paddingVertical: spacing.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonListText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  skeletonContent: {
    padding: spacing.md,
  },
  matchCardSkeleton: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default LoadingState;
