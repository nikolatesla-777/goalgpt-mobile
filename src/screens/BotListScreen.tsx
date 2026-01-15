/**
 * BotListScreen
 *
 * AI Bots grid view with stats
 * Master Plan Phase 7-8 - Tab 3: Predictions (AI Bots)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, typography } from '../constants/tokens';
import { getAllBots, getTopBots, getActiveBots, type Bot } from '../services/bots.service';

// ============================================================================
// TYPES
// ============================================================================

type FilterOption = 'all' | 'top' | 'active';

export interface BotListScreenProps {
  /** On bot press callback */
  onBotPress?: (bot: Bot) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BotListScreen: React.FC<BotListScreenProps> = ({ onBotPress }) => {
  const { theme } = useTheme();
  const [bots, setBots] = useState<Bot[]>([]);
  const [filteredBots, setFilteredBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchBots = useCallback(async () => {
    try {
      console.log('🤖 Fetching bots for filter:', activeFilter);
      setError(null);
      setIsLoading(true);

      let fetchedBots: Bot[] = [];

      switch (activeFilter) {
        case 'top':
          fetchedBots = await getTopBots(20);
          break;
        case 'active':
          fetchedBots = await getActiveBots();
          break;
        case 'all':
        default:
          fetchedBots = await getAllBots();
          break;
      }

      console.log('✅ Fetched', fetchedBots.length, 'bots');
      setBots(fetchedBots);
      setFilteredBots(fetchedBots);
    } catch (error: any) {
      console.error('❌ Failed to fetch bots:', error);
      setError(error.message || 'Failed to load bots');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  // Initial load
  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchBots();
    setIsRefreshing(false);
  }, [fetchBots]);

  const handleFilterPress = useCallback((filter: FilterOption) => {
    setActiveFilter(filter);
  }, []);

  const handleBotPress = useCallback(
    (bot: Bot) => {
      if (onBotPress) {
        onBotPress(bot);
      }
    },
    [onBotPress]
  );

  // ============================================================================
  // RENDER BOT CARD
  // ============================================================================

  const renderBotCard = useCallback(
    ({ item: bot }: { item: Bot }) => {
      const tierColor =
        bot.tier === 'diamond'
          ? '#B9F2FF'
          : bot.tier === 'platinum'
          ? '#E5E4E2'
          : bot.tier === 'gold'
          ? '#FFD700'
          : bot.tier === 'silver'
          ? '#C0C0C0'
          : '#CD7F32';

      return (
        <TouchableOpacity
          style={styles.botCard}
          onPress={() => handleBotPress(bot)}
          activeOpacity={0.7}
        >
          <View style={styles.botCardInner}>
            {/* Rank Badge */}
            {bot.rank && bot.rank <= 3 && (
              <View style={[styles.rankBadge, { backgroundColor: tierColor }]}>
                <Text style={styles.rankText}>#{bot.rank}</Text>
              </View>
            )}

            {/* Bot Icon */}
            <View style={[styles.botIconContainer, { borderColor: tierColor }]}>
              <Text style={styles.botIcon}>{bot.icon}</Text>
            </View>

            {/* Bot Name */}
            <Text style={styles.botName}>{bot.displayName}</Text>

            {/* Success Rate */}
            <View style={styles.successRateContainer}>
              <Text
                style={[
                  styles.successRate,
                  {
                    color:
                      bot.successRate >= 70
                        ? '#4BC41E'
                        : bot.successRate >= 50
                        ? '#FFA500'
                        : '#FF3B30',
                  },
                ]}
              >
                {bot.successRate}%
              </Text>
              <Text style={styles.successRateLabel}>Başarı</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{bot.stats.all.total}</Text>
                <Text style={styles.statLabel}>Tahmin</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{bot.stats.all.wins}</Text>
                <Text style={styles.statLabel}>Kazanç</Text>
              </View>
            </View>

            {/* Active Indicator */}
            {bot.isActive && (
              <View style={styles.activeIndicator}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Aktif</Text>
              </View>
            )}

            {/* Tier Badge */}
            <View style={[styles.tierBadge, { backgroundColor: `${tierColor}20` }]}>
              <Text style={[styles.tierText, { color: tierColor }]}>
                {bot.tier.toUpperCase()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handleBotPress]
  );

  // ============================================================================
  // RENDER FILTER BAR
  // ============================================================================

  const renderFilterBar = () => {
    const filters: { key: FilterOption; label: string; icon: string }[] = [
      { key: 'all', label: 'Tümü', icon: '🤖' },
      { key: 'top', label: 'En İyiler', icon: '🏆' },
      { key: 'active', label: 'Aktif', icon: '⚡' },
    ];

    return (
      <View style={styles.filterBar}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[styles.filterButton, activeFilter === filter.key && styles.filterButtonActive]}
            onPress={() => handleFilterPress(filter.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterLabel,
                activeFilter === filter.key && styles.filterLabelActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ============================================================================
  // RENDER HEADER
  // ============================================================================

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>AI Botlar</Text>
            <Text style={styles.headerSubtitle}>
              {filteredBots.length} bot bulundu
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🤖</Text>
          </View>
        </View>
        {renderFilterBar()}
      </View>
    );
  };

  // ============================================================================
  // RENDER LOADING
  // ============================================================================

  if (isLoading && bots.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        {renderHeader()}
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4BC41E" />
          <Text style={styles.loadingText}>Botlar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================================
  // RENDER ERROR
  // ============================================================================

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        {renderHeader()}
        <View style={styles.centerContent}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchBots} style={styles.retryButton} activeOpacity={0.7}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================================
  // RENDER EMPTY
  // ============================================================================

  if (filteredBots.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        {renderHeader()}
        <View style={styles.centerContent}>
          <Text style={styles.emptyIcon}>🤖</Text>
          <Text style={styles.emptyText}>Bot bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================================
  // RENDER BOT GRID
  // ============================================================================

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <FlatList
        data={filteredBots}
        renderItem={renderBotCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#4BC41E"
            colors={['#4BC41E']}
          />
        }
      />
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 28,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    fontSize: 32,
  },
  filterBar: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
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
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  botCard: {
    flex: 1,
    marginTop: spacing.md,
  },
  botCardInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rankText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 11,
    color: '#000000',
  },
  botIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(75, 196, 30, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
  },
  botIcon: {
    fontSize: 36,
  },
  botName: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  successRateContainer: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  successRate: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 32,
    textShadowColor: 'rgba(75, 196, 30, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  successRateLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    marginBottom: spacing.sm,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    borderRadius: 12,
    marginBottom: spacing.xs,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4BC41E',
  },
  activeText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 10,
    color: '#4BC41E',
  },
  tierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tierText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 9,
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

export default BotListScreen;
