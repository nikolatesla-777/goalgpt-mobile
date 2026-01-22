/**
 * HomeScreen (AI Predictions Dashboard)
 *
 * Main landing page for the mobile app.
 * Replicates the "AI Predictions" web page functionality.
 * 
 * Refactored: Uses extracted hooks and components for cleaner architecture.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../constants/tokens';

// Feature components and hooks
import { useHomePredictions, HomeHeader, HomePredictionList } from '../features/home';

// Shared components
import { StatsBoard, DateFilter } from '../components/molecules/StatsBoard';
import { FilterTabs, FilterTabKey } from '../components/molecules/FilterTabs';
import { BlogSlider } from '../components/organisms/BlogSlider';
import { CoreEngineWidget } from '../components/organisms/CoreEngineWidget';
import { BankoCouponsWidget } from '../components/organisms/BankoCouponsWidget';
import { BotStatsModal } from '../components/organisms/BotStatsModal';
import { AnnouncementModal } from '../components/organisms/AnnouncementModal';

// Hooks
import { useWebSocket } from '../hooks/useWebSocket';
import { useDateFilteredItems, DateFilter as DateFilterType } from '../hooks/useDateFilter';
import { usePredictionStats, useTabCounts } from '../hooks/usePredictionStats';
import { useDailyRewards } from '../hooks/useDailyRewards';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { usePredictionUnlock } from '../hooks/usePredictionUnlock';
import { useAuth } from '../context/AuthContext';

// Types
import { BotStat } from '../services/botStats.service';

// ============================================================================
// COMPONENT
// ============================================================================

export const HomeScreen: React.FC = ({ navigation }: any) => {
  const { theme } = useTheme();

  // Data fetching via extracted hook
  const {
    predictions,
    botStatsMap,
    isRefreshing,
    onRefresh,
  } = useHomePredictions();

  // Filter state
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [activeTab, setActiveTab] = useState<FilterTabKey>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modal state
  const [selectedBotData, setSelectedBotData] = useState<BotStat | null>(null);
  const [isBotModalVisible, setIsBotModalVisible] = useState(false);

  // Daily Rewards hook
  const { status: dailyRewardStatus } = useDailyRewards();

  // Announcements hook
  const {
    currentAnnouncement,
    hasAnnouncements,
    dismissAnnouncement,
    handleButtonAction,
  } = useAnnouncements();

  // Auth hook for VIP status
  const { user } = useAuth();
  // User is VIP if they have an active subscription
  const isUserVip = user?.subscription?.status === 'active';

  // Prediction unlock hook for FREE users
  const {
    unlockedIds,
    unlockInfo,
    isUnlocking,
    fetchUnlockedPredictions,
    unlockPrediction,
  } = usePredictionUnlock();

  // Fetch unlocked predictions on mount
  React.useEffect(() => {
    if (!isUserVip) {
      fetchUnlockedPredictions();
    }
  }, [isUserVip, fetchUnlockedPredictions]);

  // ============================================================================
  // FILTERING & STATS (Using Custom Hooks - DRY compliant)
  // ============================================================================

  // Step 1: Filter predictions by date
  const dateFilteredPredictions = useDateFilteredItems(predictions, dateFilter as DateFilterType);

  // Step 2: Calculate stats from date-filtered predictions
  const stats = usePredictionStats(dateFilteredPredictions);

  // Step 3: Calculate tab counts
  const tabCounts = useTabCounts(dateFilteredPredictions, favorites);

  // Step 4: Apply tab filter on top of date filter
  const filteredPredictions = useMemo(() => {
    let result = dateFilteredPredictions;

    if (activeTab === 'favorites') {
      result = result.filter(p => favorites.includes(p.id));
    } else if (activeTab === 'active') {
      result = result.filter(p => !p.result || p.result === 'pending');
    } else if (activeTab === 'won') {
      result = result.filter(p => p.result === 'won');
    } else if (activeTab === 'lost') {
      result = result.filter(p => p.result === 'lost');
    }

    // Sort by created_at descending
    return result.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [dateFilteredPredictions, activeTab, favorites]);

  // ============================================================================
  // WEBSOCKET INTEGRATION
  // ============================================================================

  const filteredMatchIds = useMemo(() =>
    filteredPredictions.map(p => p.match_id).filter(Boolean) as string[],
    [filteredPredictions]
  );

  const { matchUpdates } = useWebSocket({
    matchIds: filteredMatchIds,
    autoConnect: true,
  });

  // Apply live updates to predictions
  const livePredictions = useMemo(() => {
    if (matchUpdates.size === 0) return filteredPredictions;

    return filteredPredictions.map(pred => {
      if (!pred.match_id) return pred;
      const update = matchUpdates.get(pred.match_id);
      if (!update) return pred;

      return {
        ...pred,
        home_score_display: update.homeScore,
        away_score_display: update.awayScore,
        live_match_status: update.status === 'live' ? 2 : update.status === 'halftime' ? 3 : update.status === 'finished' ? 8 : pred.live_match_status,
        live_match_minute: update.minute,
      };
    });
  }, [filteredPredictions, matchUpdates]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }, []);

  const handleBotInfoPress = useCallback((botName: string) => {
    const stat = botStatsMap[botName] || botStatsMap[botName.toLowerCase()];
    if (stat) {
      setSelectedBotData(stat);
      setIsBotModalVisible(true);
    } else {
      // Mock data if not found (for dev/demo)
      setSelectedBotData({
        bot_id: 0,
        bot_name: botName,
        total_predictions: 100,
        total_wins: 85,
        total_losses: 15,
        win_rate: 85.0,
        last_updated: new Date().toISOString()
      });
      setIsBotModalVisible(true);
    }
  }, [botStatsMap]);

  const handlePredictionPress = useCallback((matchId: string) => {
    navigation.navigate('MatchDetail', { matchId });
  }, [navigation]);

  const handleDailyRewardsPress = useCallback(() => {
    navigation.getParent()?.navigate('DailyRewards');
  }, [navigation]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Header */}
        <HomeHeader
          notificationCount={3}
          subscriptionDays={365}
          subscriptionPlan="yearly"
          isVip={true}
          canClaimDailyReward={dailyRewardStatus?.canClaim || false}
          onDailyRewardsPress={handleDailyRewardsPress}
        />

        {/* Blog Slider */}
        <BlogSlider
          onPostPress={(post) => {
            navigation.getParent()?.navigate('BlogDetail', { post });
          }}
        />

        {/* Bank of the Day Widget */}
        <BankoCouponsWidget />

        {/* Core Engine Status Widget */}
        <View style={{ marginBottom: spacing.lg, marginTop: spacing.xs }}>
          <CoreEngineWidget />
        </View>

        {/* Stats Board */}
        <StatsBoard
          totalPredictions={stats.total}
          totalWins={stats.wins}
          winRate={stats.winRate}
          selectedDateFilter={dateFilter}
          onSelectDateFilter={setDateFilter}
        />

        {/* Filter Tabs */}
        <FilterTabs
          selectedTab={activeTab}
          onSelectTab={setActiveTab}
          counts={tabCounts}
        />

        {/* Prediction List */}
        <HomePredictionList
          predictions={livePredictions}
          botStatsMap={botStatsMap}
          favorites={favorites}
          onPredictionPress={handlePredictionPress}
          onToggleFavorite={toggleFavorite}
          onBotInfoPress={handleBotInfoPress}
          isUserVip={isUserVip}
          unlockedPredictionIds={unlockedIds}
          creditBalance={unlockInfo?.currentBalance ?? 0}
          onUnlockPrediction={unlockPrediction}
          isUnlocking={isUnlocking}
          onDailyRewardPress={() => navigation.navigate('DailyRewards')}
          onVipPress={() => navigation.navigate('Subscription')}
          onWatchAdPress={() => {
            // TODO: Show AdMob rewarded video or custom video modal
            console.log('Watch ad pressed - implement reward video');
          }}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bot Stats Modal */}
      {selectedBotData && (
        <BotStatsModal
          visible={isBotModalVisible}
          onClose={() => setIsBotModalVisible(false)}
          botName={selectedBotData.bot_name}
          winRate={selectedBotData.win_rate}
          totalWins={selectedBotData.total_wins}
          totalLoss={selectedBotData.total_losses}
          totalPredictions={selectedBotData.total_predictions}
          onDetailPress={() => {
            setIsBotModalVisible(false);
            // navigation.navigate('BotDetail', { botName: selectedBotData.bot_name }); 
          }}
        />
      )}

      {/* Announcement Popup */}
      <AnnouncementModal
        visible={hasAnnouncements}
        announcement={currentAnnouncement}
        onDismiss={() => currentAnnouncement && dismissAnnouncement(currentAnnouncement.id)}
        onButtonPress={() => currentAnnouncement && handleButtonAction(currentAnnouncement)}
      />
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
