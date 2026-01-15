/**
 * PredictionsList Component
 *
 * Organism component for AI predictions feed
 * Scrollable list of PredictionCard molecules
 * Master Plan v1.0 compliant
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { PredictionCard, type PredictionCardProps, type PredictionResult, type PredictionTier } from '../molecules/PredictionCard';
import { typography, spacing } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface PredictionItem extends PredictionCardProps {
  id: string | number;
}

export interface PredictionsListProps {
  /** Array of predictions */
  predictions: PredictionItem[];

  /** Section title */
  title?: string;

  /** Filter by result */
  filterByResult?: PredictionResult | 'all';

  /** Filter by tier */
  filterByTier?: PredictionTier | 'all';

  /** Show only favorites */
  showFavoritesOnly?: boolean;

  /** Loading state */
  isLoading?: boolean;

  /** Refreshing state */
  isRefreshing?: boolean;

  /** On refresh callback */
  onRefresh?: () => void;

  /** Empty state message */
  emptyMessage?: string;

  /** On prediction press */
  onPredictionPress?: (id: string | number) => void;

  /** On favorite toggle */
  onFavoriteToggle?: (id: string | number) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const PredictionsList: React.FC<PredictionsListProps> = ({
  predictions,
  title = 'AI Predictions',
  filterByResult = 'all',
  filterByTier = 'all',
  showFavoritesOnly = false,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  emptyMessage = 'No predictions available',
  onPredictionPress,
  onFavoriteToggle,
}) => {
  // ============================================================================
  // FILTERING
  // ============================================================================

  const filteredPredictions = predictions.filter((pred) => {
    // Filter by result
    if (filterByResult !== 'all' && pred.prediction.result !== filterByResult) {
      return false;
    }

    // Filter by tier
    if (filterByTier !== 'all' && pred.tier !== filterByTier) {
      return false;
    }

    // Filter favorites
    if (showFavoritesOnly && !pred.isFavorite) {
      return false;
    }

    return true;
  });

  // ============================================================================
  // RENDER LOADING
  // ============================================================================

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>⚽</Text>
          <Text style={styles.loadingText}>Loading predictions...</Text>
        </View>
      </View>
    );
  }

  // ============================================================================
  // RENDER EMPTY STATE
  // ============================================================================

  if (filteredPredictions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🤖</Text>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  // ============================================================================
  // RENDER FILTER INFO
  // ============================================================================

  const renderFilterInfo = () => {
    const filters = [];
    if (filterByResult !== 'all') filters.push(filterByResult.toUpperCase());
    if (filterByTier !== 'all') filters.push(filterByTier.toUpperCase());
    if (showFavoritesOnly) filters.push('FAVORITES');

    if (filters.length === 0) return null;

    return (
      <View style={styles.filterInfo}>
        <Text style={styles.filterText}>
          Filters: {filters.join(' • ')}
        </Text>
        <Text style={styles.filterCount}>
          {filteredPredictions.length} {filteredPredictions.length === 1 ? 'result' : 'results'}
        </Text>
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.titleIcon}>🤖</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.subtitle}>
          {filteredPredictions.length} {filteredPredictions.length === 1 ? 'prediction' : 'predictions'}
        </Text>
      </View>

      {/* Filter Info */}
      {renderFilterInfo()}

      {/* Predictions List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#4BC41E"
              colors={['#4BC41E']}
            />
          ) : undefined
        }
      >
        <View style={styles.listContainer}>
          {filteredPredictions.map((prediction) => (
            <PredictionCard
              key={prediction.id}
              bot={prediction.bot}
              match={prediction.match}
              prediction={prediction.prediction}
              tier={prediction.tier}
              isFavorite={prediction.isFavorite}
              onPress={() => onPredictionPress?.(prediction.id)}
              onFavoritePress={() => onFavoriteToggle?.(prediction.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  titleIcon: {
    fontSize: 28,
  },
  title: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: typography.fontSize.button.large,
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(75, 196, 30, 0.1)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.2)',
  },
  filterText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.small,
    color: '#4BC41E',
  },
  filterCount: {
    fontFamily: typography.fonts.mono.regular,
    fontSize: typography.fontSize.button.small,
    color: '#4BC41E',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  loadingText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
    opacity: 0.3,
  },
  emptyText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default PredictionsList;
