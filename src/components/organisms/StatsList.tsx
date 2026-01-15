/**
 * StatsList Component
 *
 * Organism component for complete match statistics section
 * Displays multiple StatRow components in a structured layout
 * Master Plan v1.0 compliant
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatRow } from '../molecules/StatRow';
import { typography, spacing, glassmorphism } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface MatchStat {
  /** Stat unique identifier */
  id: string;

  /** Stat label (e.g., "Possession", "Shots", "Corners") */
  label: string;

  /** Home team value */
  homeValue: number | string;

  /** Away team value */
  awayValue: number | string;

  /** Show as percentage with progress bar */
  showProgress?: boolean;

  /** Highlight higher value */
  highlightHigher?: boolean;
}

export interface StatsListProps {
  /** Array of statistics to display */
  stats: MatchStat[];

  /** Section title */
  title?: string;

  /** Show section in scrollable container */
  scrollable?: boolean;

  /** Empty state message */
  emptyMessage?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const StatsList: React.FC<StatsListProps> = ({
  stats,
  title = 'Match Statistics',
  scrollable = false,
  emptyMessage = 'No statistics available',
}) => {
  // ============================================================================
  // RENDER EMPTY STATE
  // ============================================================================

  if (!stats || stats.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.glassCard}>
          {title && <Text style={styles.title}>{title}</Text>}
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        </View>
      </View>
    );
  }

  // ============================================================================
  // RENDER STATS LIST
  // ============================================================================

  const renderStatsList = () => (
    <View style={styles.statsContainer}>
      {stats.map((stat) => (
        <StatRow
          key={stat.id}
          label={stat.label}
          homeValue={stat.homeValue}
          awayValue={stat.awayValue}
          showProgress={stat.showProgress ?? false}
          highlightHigher={stat.highlightHigher ?? true}
        />
      ))}
    </View>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  const Container = scrollable ? ScrollView : View;

  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        {/* Title */}
        {title && (
          <View style={styles.titleContainer}>
            <Text style={styles.titleIcon}>📊</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}

        {/* Stats */}
        <Container
          style={scrollable ? styles.scrollContainer : undefined}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        >
          {renderStatsList()}
        </Container>
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  glassCard: {
    ...glassmorphism.default,
    borderRadius: 16,
    padding: spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  titleIcon: {
    fontSize: 24,
  },
  title: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: typography.fontSize.button.large,
    color: '#FFFFFF',
  },
  statsContainer: {
    gap: spacing.sm,
  },
  scrollContainer: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
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

export default StatsList;
