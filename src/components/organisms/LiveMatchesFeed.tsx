/**
 * LiveMatchesFeed Component
 *
 * Organism component for live matches feed
 * Scrollable list of MatchCard molecules grouped by league
 * Master Plan v1.0 compliant
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import { MatchCard, type MatchCardProps } from '../molecules/MatchCard';
import { CompactMatchCard } from '../molecules/CompactMatchCard';
import { LiveIndicator } from '../atoms/NeonText';
import { typography, spacing } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface MatchItem extends MatchCardProps {
  id: string | number;
  league?: string;
  leagueLogo?: string;
}

export interface LiveMatchesFeedProps {
  /** Array of live matches */
  matches: MatchItem[];

  /** Group by league */
  groupByLeague?: boolean;

  /** Loading state */
  isLoading?: boolean;

  /** Refreshing state */
  isRefreshing?: boolean;

  /** On refresh callback */
  onRefresh?: () => void;

  /** Empty state message */
  emptyMessage?: string;

  /** On match press */
  onMatchPress?: (id: string | number) => void;

  /** Show header */
  showHeader?: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const groupMatchesByLeague = (matches: MatchItem[]) => {
  const grouped: { [key: string]: MatchItem[] } = {};

  matches.forEach((match) => {
    const leagueName = match.league || 'Other';
    if (!grouped[leagueName]) {
      grouped[leagueName] = [];
    }
    grouped[leagueName].push(match);
  });

  return grouped;
};

// ============================================================================
// COMPONENT
// ============================================================================

export const LiveMatchesFeed: React.FC<LiveMatchesFeedProps> = ({
  matches,
  groupByLeague = true,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  emptyMessage = 'No live matches at the moment',
  onMatchPress,
  showHeader = true,
}) => {
  // ============================================================================
  // RENDER LOADING
  // ============================================================================

  if (isLoading) {
    return (
      <View style={styles.container}>
        {showHeader && (
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <LiveIndicator />
              <Text style={styles.title}>Live Matches</Text>
            </View>
          </View>
        )}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>⚽</Text>
          <Text style={styles.loadingText}>Loading live matches...</Text>
        </View>
      </View>
    );
  }

  // ============================================================================
  // RENDER EMPTY STATE
  // ============================================================================

  if (matches.length === 0) {
    return (
      <View style={styles.container}>
        {showHeader && (
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.emptyDot}>⚪</Text>
              <Text style={styles.title}>Live Matches</Text>
            </View>
          </View>
        )}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚽</Text>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
          <Text style={styles.emptySubtext}>
            Check back later for live action
          </Text>
        </View>
      </View>
    );
  }

  // ============================================================================
  // RENDER GROUPED MATCHES
  // ============================================================================

  const renderGroupedMatches = () => {
    const grouped = groupMatchesByLeague(matches);

    return Object.entries(grouped).map(([leagueName, leagueMatches]) => {
      // Get league logo from first match
      const leagueLogo = leagueMatches[0]?.leagueLogo;

      return (
        <View key={leagueName} style={styles.leagueGroup}>
          {/* League Header - New Design */}
          <View style={styles.leagueHeader}>
            <View style={styles.leagueHeaderLeft}>
              {leagueLogo ? (
                <Image
                  source={{ uri: leagueLogo }}
                  style={styles.leagueLogo}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.leagueLogoPlaceholder}>
                  <Text style={styles.leagueIcon}>⚽</Text>
                </View>
              )}
              <Text style={styles.leagueName}>{leagueName}</Text>
            </View>
            <View style={styles.leagueHeaderRight}>
              <Text style={styles.popularityIcon}>🔥</Text>
              <Text style={styles.popularityText}>9999+</Text>
            </View>
          </View>

          {/* Matches - Compact Design */}
          <View style={styles.matchesContainer}>
            {leagueMatches.map((match) => (
              <CompactMatchCard
                key={match.id}
                matchId={match.id}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                status={match.status}
                time={match.time}
                minute={match.minute}
                onPress={() => onMatchPress?.(match.id)}
              />
            ))}
          </View>
        </View>
      );
    });
  };

  // ============================================================================
  // RENDER FLAT MATCHES
  // ============================================================================

  const renderFlatMatches = () => {
    return (
      <View style={styles.matchesContainer}>
        {matches.map((match) => (
          <CompactMatchCard
            key={match.id}
            matchId={match.id}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            status={match.status}
            time={match.time}
            minute={match.minute}
            onPress={() => onMatchPress?.(match.id)}
          />
        ))}
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={styles.container}>
      {/* Header */}
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <LiveIndicator />
            <Text style={styles.title}>Live Matches</Text>
          </View>
          <Text style={styles.subtitle}>
            {matches.length} {matches.length === 1 ? 'match' : 'matches'} in progress
          </Text>
        </View>
      )}

      {/* Matches Feed */}
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
        <View style={styles.feedContainer}>
          {groupByLeague ? renderGroupedMatches() : renderFlatMatches()}
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
  emptyDot: {
    fontSize: 24,
    opacity: 0.3,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  feedContainer: {
    paddingVertical: spacing.sm,
  },
  leagueGroup: {
    marginBottom: spacing.lg,
  },
  leagueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  leagueHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  leagueLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  leagueLogoPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leagueIcon: {
    fontSize: 14,
  },
  leagueName: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
  },
  leagueHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  popularityIcon: {
    fontSize: 14,
  },
  popularityText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 13,
    color: '#FF3B30',
  },
  matchesContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
    opacity: 0.3,
  },
  emptyText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default LiveMatchesFeed;
