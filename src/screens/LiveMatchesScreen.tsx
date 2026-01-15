/**
 * LiveMatchesScreen
 *
 * Full screen template for live matches feed
 * Shows all ongoing matches grouped by league
 * Features: Live feed, filters, pull-to-refresh
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LiveMatchesFeed } from '../components/organisms/LiveMatchesFeed';
import { ConnectionStatus } from '../components/molecules/ConnectionStatus';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, typography } from '../constants/tokens';
import type { MatchItem } from '../components/organisms/LiveMatchesFeed';
import { getLiveMatches, getTodayMatches } from '../services/matches.service';
import { useWebSocket } from '../hooks/useWebSocket';

// ============================================================================
// TYPES
// ============================================================================

type FilterOption = 'all' | 'live' | 'today' | 'upcoming';

interface Filter {
  key: FilterOption;
  label: string;
  icon: string;
}

export interface LiveMatchesScreenProps {
  /** Array of matches (optional - will fetch from API if not provided) */
  matches?: MatchItem[];

  /** Loading state */
  isLoading?: boolean;

  /** Refreshing state */
  isRefreshing?: boolean;

  /** On refresh callback */
  onRefresh?: () => void;

  /** On match press */
  onMatchPress?: (matchId: string | number) => void;

  /** On filter change */
  onFilterChange?: (filter: FilterOption) => void;
}

// ============================================================================
// FILTERS CONFIG
// ============================================================================

const FILTERS: Filter[] = [
  { key: 'all', label: 'All', icon: '⚽' },
  { key: 'live', label: 'Live', icon: '🔴' },
  { key: 'today', label: 'Today', icon: '📅' },
  { key: 'upcoming', label: 'Soon', icon: '🕐' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const LiveMatchesScreen: React.FC<LiveMatchesScreenProps> = ({
  matches: propMatches,
  isLoading: propIsLoading = false,
  isRefreshing: propIsRefreshing = false,
  onRefresh: propOnRefresh,
  onMatchPress,
  onFilterChange: propOnFilterChange,
}) => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  // Local state for API data
  const [matches, setMatches] = useState<MatchItem[]>(propMatches || []);
  const [allMatches, setAllMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Fetch matches based on filter
  const fetchMatches = useCallback(async (filter: FilterOption = 'all') => {
    try {
      console.log('🔄 fetchMatches called with filter:', filter);
      setError(null);
      setIsLoading(true);

      let fetchedMatches: MatchItem[] = [];

      if (filter === 'live') {
        console.log('📡 Calling getLiveMatches...');
        fetchedMatches = await getLiveMatches();
        console.log('✅ getLiveMatches returned:', fetchedMatches.length, 'matches');
      } else if (filter === 'today' || filter === 'all') {
        console.log('📡 Calling getTodayMatches...');
        fetchedMatches = await getTodayMatches();
        console.log('✅ getTodayMatches returned:', fetchedMatches.length, 'matches');
      }

      console.log('📊 Setting matches:', fetchedMatches.length);
      setAllMatches(fetchedMatches);
      setMatches(fetchedMatches);
    } catch (error: any) {
      console.error('❌ Failed to fetch matches:', error);
      setError(error.message || 'Failed to load matches');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    console.log('🎯 LiveMatchesScreen useEffect triggered', {
      propMatches: propMatches?.length || 0,
      propIsLoading,
      activeFilter,
    });

    if (!propMatches && !propIsLoading) {
      console.log('✅ Conditions met, calling fetchMatches');
      fetchMatches(activeFilter);
    } else {
      console.log('⏭️ Skipping fetchMatches - using props');
    }
  }, [propMatches, propIsLoading, activeFilter, fetchMatches]);

  // Update local state when props change
  useEffect(() => {
    if (propMatches) {
      setMatches(propMatches);
      setAllMatches(propMatches);
    }
    if (propIsLoading !== undefined) setIsLoading(propIsLoading);
  }, [propMatches, propIsLoading]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    if (propOnRefresh) {
      propOnRefresh();
    } else {
      setIsRefreshing(true);
      await fetchMatches(activeFilter);
      setIsRefreshing(false);
    }
  }, [propOnRefresh, activeFilter, fetchMatches]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const applyFilters = useCallback(() => {
    // Filter matches by status
    let filtered: MatchItem[] = [];

    switch (activeFilter) {
      case 'live':
        filtered = allMatches.filter((m) => m.status === 'live' || m.status === 'halftime');
        break;
      case 'today':
        filtered = allMatches;
        break;
      case 'upcoming':
        filtered = allMatches.filter((m) => m.status === 'upcoming');
        break;
      case 'all':
      default:
        filtered = allMatches;
        break;
    }

    // Apply search filter if active
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.homeTeam.name.toLowerCase().includes(query) ||
          m.awayTeam.name.toLowerCase().includes(query) ||
          (m.league && m.league.toLowerCase().includes(query))
      );
    }

    setMatches(filtered);
  }, [allMatches, activeFilter, searchQuery]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterPress = useCallback((filter: FilterOption) => {
    setActiveFilter(filter);

    // Call prop callback if provided
    if (propOnFilterChange) {
      propOnFilterChange(filter);
    }
  }, [propOnFilterChange]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleSearchToggle = useCallback(() => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery(''); // Clear search when closing
    }
  }, [showSearch]);

  // ============================================================================
  // WEBSOCKET INTEGRATION
  // ============================================================================

  // Get match IDs to subscribe
  const matchIds = useMemo(() => {
    return matches.map((match) => match.id);
  }, [matches]);

  // Use WebSocket hook
  const { isConnected, isReconnecting, matchUpdates } = useWebSocket({
    autoConnect: true,
    matchIds,
  });

  // Apply WebSocket updates to matches
  const updatedMatches = useMemo(() => {
    if (matchUpdates.size === 0) return matches;

    return matches.map((match): MatchItem => {
      const update = matchUpdates.get(match.id);
      if (!update) return match;

      // Merge update with existing match data
      const updatedMatch: MatchItem = {
        ...match,
        homeTeam: {
          ...match.homeTeam,
          score: update.homeScore ?? match.homeTeam.score,
        },
        awayTeam: {
          ...match.awayTeam,
          score: update.awayScore ?? match.awayTeam.score,
        },
        status: (update.status ?? match.status) as MatchItem['status'],
        minute: update.minute ?? match.minute,
      };
      return updatedMatch;
    });
  }, [matches, matchUpdates]);

  // ============================================================================
  // RENDER FILTER BAR
  // ============================================================================

  const renderFilterBar = () => {
    return (
      <View style={styles.filterBar}>
        {/* Search Bar */}
        {showSearch ? (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Takım veya lig ara..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleSearchToggle} style={styles.closeSearchButton}>
              <Ionicons name="close" size={24} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.filterRow}>
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.key;
                return (
                  <TouchableOpacity
                    key={filter.key}
                    style={[styles.filterButton, isActive && styles.filterButtonActive]}
                    onPress={() => handleFilterPress(filter.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.filterIcon}>{filter.icon}</Text>
                    <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {/* Search Button */}
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearchToggle}
                activeOpacity={0.7}
              >
                <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>
            <View style={styles.connectionStatusWrapper}>
              <ConnectionStatus isConnected={isConnected} isReconnecting={isReconnecting} />
            </View>
          </>
        )}
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // ============================================================================
  // RENDER ERROR/EMPTY STATES
  // ============================================================================

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchMatches(activeFilter)}
            style={styles.retryButton}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isLoading && matches.length === 0) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4BC41E" />
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      );
    }

    if (matches.length === 0) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.emptyIcon}>⚽</Text>
          <Text style={styles.emptyText}>
            {activeFilter === 'live'
              ? 'No live matches at the moment'
              : activeFilter === 'upcoming'
              ? 'No upcoming matches'
              : 'No matches found'}
          </Text>
        </View>
      );
    }

    return (
      <LiveMatchesFeed
        matches={updatedMatches}
        groupByLeague={true}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onMatchPress={onMatchPress}
        showHeader={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Filter Bar */}
        {renderFilterBar()}

        {/* Content */}
        {renderContent()}
      </View>
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
  filterBar: {
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  connectionStatusWrapper: {
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    borderColor: '#4BC41E',
  },
  filterIcon: {
    fontSize: 16,
  },
  filterLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  filterLabelActive: {
    fontFamily: typography.fonts.ui.semibold,
    color: '#4BC41E',
  },
  searchButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
  closeSearchButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.md,
  },
  errorIcon: {
    fontSize: 64,
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

export default LiveMatchesScreen;
