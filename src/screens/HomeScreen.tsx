/**
 * HomeScreen
 *
 * Main dashboard/landing page
 * Combines live matches and top predictions
 * Features: Quick access to all main sections
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeonText } from '../components/atoms/NeonText';
import { LiveMatchesFeed } from '../components/organisms/LiveMatchesFeed';
import { PredictionsList } from '../components/organisms/PredictionsList';
import { ConnectionStatus } from '../components/molecules/ConnectionStatus';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, typography } from '../constants/tokens';
import type { MatchItem } from '../components/organisms/LiveMatchesFeed';
import type { PredictionItem } from '../components/organisms/PredictionsList';
import { getLiveMatches } from '../services/matches.service';
import { getTopPredictions } from '../services/predictions.service';
import { useWebSocket } from '../hooks/useWebSocket';

// ============================================================================
// TYPES
// ============================================================================

export interface HomeScreenProps {
  /** Live matches (optional - will fetch from API if not provided) */
  liveMatches?: MatchItem[];

  /** Top AI predictions (optional - will fetch from API if not provided) */
  topPredictions?: PredictionItem[];

  /** Loading states */
  isLoadingMatches?: boolean;
  isLoadingPredictions?: boolean;

  /** Refreshing state */
  isRefreshing?: boolean;

  /** Callbacks */
  onRefresh?: () => void;
  onMatchPress?: (matchId: string | number) => void;
  onPredictionPress?: (predictionId: string | number) => void;
  onSeeAllMatches?: () => void;
  onSeeAllPredictions?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const HomeScreen: React.FC<HomeScreenProps> = ({
  liveMatches: propLiveMatches,
  topPredictions: propTopPredictions,
  isLoadingMatches: propIsLoadingMatches = false,
  isLoadingPredictions: propIsLoadingPredictions = false,
  isRefreshing: propIsRefreshing = false,
  onRefresh: propOnRefresh,
  onMatchPress,
  onPredictionPress,
  onSeeAllMatches,
  onSeeAllPredictions,
}) => {
  const { theme } = useTheme();

  // Local state for API data
  const [liveMatches, setLiveMatches] = useState<MatchItem[]>(propLiveMatches || []);
  const [topPredictions, setTopPredictions] = useState<PredictionItem[]>(propTopPredictions || []);
  const [isLoadingMatches, setIsLoadingMatches] = useState(propIsLoadingMatches);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(propIsLoadingPredictions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [matchesError, setMatchesError] = useState<string | null>(null);
  const [predictionsError, setPredictionsError] = useState<string | null>(null);

  // Fetch live matches
  const fetchLiveMatches = useCallback(async () => {
    try {
      setMatchesError(null);
      setIsLoadingMatches(true);
      const matches = await getLiveMatches();
      setLiveMatches(matches);
    } catch (error: any) {
      console.error('Failed to fetch live matches:', error);
      setMatchesError(error.message || 'Failed to load matches');
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  // Fetch top predictions
  const fetchTopPredictions = useCallback(async () => {
    try {
      setPredictionsError(null);
      setIsLoadingPredictions(true);
      const predictions = await getTopPredictions(3); // Top 3 for home screen
      setTopPredictions(predictions);
    } catch (error: any) {
      console.error('Failed to fetch predictions:', error);
      setPredictionsError(error.message || 'Failed to load predictions');
    } finally {
      setIsLoadingPredictions(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    // Only fetch if no props provided (standalone mode)
    if (!propLiveMatches && !propIsLoadingMatches) {
      fetchLiveMatches();
    }
    if (!propTopPredictions && !propIsLoadingPredictions) {
      fetchTopPredictions();
    }
  }, [
    propLiveMatches,
    propTopPredictions,
    propIsLoadingMatches,
    propIsLoadingPredictions,
    fetchLiveMatches,
    fetchTopPredictions,
  ]);

  // Update local state when props change
  useEffect(() => {
    if (propLiveMatches) setLiveMatches(propLiveMatches);
    if (propTopPredictions) setTopPredictions(propTopPredictions);
    if (propIsLoadingMatches !== undefined) setIsLoadingMatches(propIsLoadingMatches);
    if (propIsLoadingPredictions !== undefined) setIsLoadingPredictions(propIsLoadingPredictions);
  }, [propLiveMatches, propTopPredictions, propIsLoadingMatches, propIsLoadingPredictions]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    if (propOnRefresh) {
      // Use prop callback if provided
      propOnRefresh();
    } else {
      // Otherwise, use local fetch
      setIsRefreshing(true);
      await Promise.all([fetchLiveMatches(), fetchTopPredictions()]);
      setIsRefreshing(false);
    }
  }, [propOnRefresh, fetchLiveMatches, fetchTopPredictions]);

  // ============================================================================
  // WEBSOCKET INTEGRATION
  // ============================================================================

  // Get match IDs to subscribe
  const matchIds = useMemo(() => {
    return liveMatches.map((match) => match.id);
  }, [liveMatches]);

  // Use WebSocket hook
  const { isConnected, isReconnecting, matchUpdates } = useWebSocket({
    autoConnect: true,
    matchIds,
  });

  // Apply WebSocket updates to matches
  const updatedMatches = useMemo(() => {
    if (matchUpdates.size === 0) return liveMatches;

    return liveMatches.map((match) => {
      const update = matchUpdates.get(match.id);
      if (!update) return match;

      // Merge update with existing match data
      return {
        ...match,
        homeScore: update.homeScore ?? match.homeScore,
        awayScore: update.awayScore ?? match.awayScore,
        status: update.status ?? match.status,
        minute: update.minute ?? match.minute,
      };
    });
  }, [liveMatches, matchUpdates]);

  // ============================================================================
  // RENDER LOADING STATE
  // ============================================================================

  const renderLoadingState = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4BC41E" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  };

  // ============================================================================
  // RENDER ERROR STATE
  // ============================================================================

  const renderErrorState = (error: string, onRetry: () => void) => {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton} activeOpacity={0.7}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ============================================================================
  // RENDER EMPTY STATE
  // ============================================================================

  const renderEmptyState = (message: string, icon: string = '📭') => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{icon}</Text>
        <Text style={styles.emptyText}>{message}</Text>
      </View>
    );
  };

  // ============================================================================
  // RENDER SECTION HEADER
  // ============================================================================

  const renderSectionHeader = (title: string, icon: string, onSeeAll?: () => void) => {
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionIcon}>{icon}</Text>
          <NeonText color="white" glow="small" size="medium" weight="bold">
            {title}
          </NeonText>
        </View>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
            <Text style={styles.seeAllButton}>See All →</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // ============================================================================
  // RENDER QUICK STATS
  // ============================================================================

  const renderQuickStats = () => {
    const liveCount = updatedMatches.filter((m) => m.status === 'live').length;
    const htCount = updatedMatches.filter((m) => m.status === 'halftime').length;
    const predictionCount = topPredictions.length;

    return (
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔴</Text>
          <Text style={styles.statValue}>{liveCount}</Text>
          <Text style={styles.statLabel}>Live Now</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⏸️</Text>
          <Text style={styles.statValue}>{htCount}</Text>
          <Text style={styles.statLabel}>Half Time</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🤖</Text>
          <Text style={styles.statValue}>{predictionCount}</Text>
          <Text style={styles.statLabel}>AI Tips</Text>
        </View>
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#4BC41E"
            colors={['#4BC41E']}
          />
        }
      >
      {/* Hero Header */}
      <View style={styles.heroSection}>
        <View style={styles.headerTop}>
          <View style={styles.titleWrapper}>
            <NeonText color="brand" glow="large" size="large" weight="bold" style={styles.heroTitle}>
              GoalGPT
            </NeonText>
            <NeonText color="white" glow="small" size="small" style={styles.heroSubtitle}>
              AI-Powered Football Intelligence
            </NeonText>
          </View>
          <ConnectionStatus isConnected={isConnected} isReconnecting={isReconnecting} />
        </View>
      </View>

      {/* Quick Stats */}
      {renderQuickStats()}

      {/* Live Matches Section */}
      <View style={styles.section}>
        {renderSectionHeader('Live Matches', '⚽', onSeeAllMatches)}
        {matchesError ? (
          renderErrorState(matchesError, fetchLiveMatches)
        ) : isLoadingMatches && liveMatches.length === 0 ? (
          renderLoadingState()
        ) : updatedMatches.length === 0 ? (
          renderEmptyState('No live matches at the moment', '⚽')
        ) : (
          <View style={{ height: 400 }}>
            <LiveMatchesFeed
              matches={updatedMatches.slice(0, 5)} // Show first 5 with live updates
              groupByLeague={false} // Flat list for home
              isLoading={isLoadingMatches}
              onMatchPress={onMatchPress}
              showHeader={false}
            />
          </View>
        )}
      </View>

      {/* Top Predictions Section */}
      <View style={styles.section}>
        {renderSectionHeader('Top AI Predictions', '🤖', onSeeAllPredictions)}
        {predictionsError ? (
          renderErrorState(predictionsError, fetchTopPredictions)
        ) : isLoadingPredictions && topPredictions.length === 0 ? (
          renderLoadingState()
        ) : topPredictions.length === 0 ? (
          renderEmptyState('No AI predictions available', '🤖')
        ) : (
          <View style={{ height: 500 }}>
            <PredictionsList
              predictions={topPredictions.slice(0, 3)} // Show first 3
              isLoading={isLoadingPredictions}
              onPredictionPress={onPredictionPress}
              title=""
            />
          </View>
        )}
      </View>

      {/* Footer Spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
  },
  heroSection: {
    padding: spacing.xl,
    paddingTop: spacing.xl * 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'flex-start',
  },
  heroTitle: {
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    opacity: 0.8,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(23, 80, 61, 0.65)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.15)',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 24,
    color: '#4BC41E',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionIcon: {
    fontSize: 24,
  },
  seeAllButton: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.small,
    color: '#4BC41E',
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  loadingText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.md,
  },
  errorContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
    borderRadius: 12,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: '#4BC41E',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  retryButtonText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyIcon: {
    fontSize: 64,
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

export default HomeScreen;
