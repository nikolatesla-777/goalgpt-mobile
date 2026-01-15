/**
 * BotDetailScreen
 *
 * AI Bot performance detail page
 * Master Plan compliant - Stack Screen
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NeonText } from '../components/atoms/NeonText';
import { GlassCard } from '../components/atoms/GlassCard';
import { PredictionCard } from '../components/molecules/PredictionCard';
import { ShareButton } from '../components/ShareButton';
import { useShare } from '../hooks/useShare';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, typography } from '../constants/tokens';
import type { PredictionItem } from '../components/organisms/PredictionsList';

// ============================================================================
// TYPES
// ============================================================================

type TimePeriod = 'today' | 'yesterday' | 'monthly' | 'all';
type ResultFilter = 'all' | 'win' | 'lose' | 'playing';

export interface Bot {
  id: number;
  name: string;
  description: string;
  icon?: string;
  totalPredictions: number;
  successRate: number;
  stats: {
    today: { total: number; wins: number; rate: number };
    yesterday: { total: number; wins: number; rate: number };
    monthly: { total: number; wins: number; rate: number };
    all: { total: number; wins: number; rate: number };
  };
}

export interface BotDetailScreenProps {
  /** Bot data */
  bot: Bot;

  /** Other bots for horizontal scroll */
  otherBots: Bot[];

  /** Bot predictions */
  predictions: PredictionItem[];

  /** On bot select (from other bots) */
  onBotSelect?: (botId: number) => void;

  /** On prediction press */
  onPredictionPress?: (predictionId: string | number) => void;

  /** On back */
  onBack?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BotDetailScreen: React.FC<BotDetailScreenProps> = ({
  bot,
  otherBots,
  predictions,
  onBotSelect,
  onPredictionPress,
  onBack,
}) => {
  const { theme } = useTheme();
  const { shareBot, isSharing } = useShare();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all');

  // Get current stats based on time period
  const currentStats = bot.stats[timePeriod];

  // Handle share bot
  const handleShare = () => {
    shareBot(bot.id, bot.name, bot.successRate, bot.totalPredictions);
  };

  // Filter predictions
  const filteredPredictions = predictions.filter((pred) => {
    if (resultFilter === 'all') return true;
    if (resultFilter === 'playing') return pred.prediction.result === 'pending';
    return pred.prediction.result === resultFilter;
  });

  // ============================================================================
  // RENDER BOT INFO CARD
  // ============================================================================

  const renderBotInfo = () => {
    return (
      <GlassCard intensity="default" padding={spacing.lg} style={styles.botCard}>
        {/* Bot Header */}
        <View style={styles.botHeader}>
          <View style={styles.botIconContainer}>
            <Text style={styles.botIcon}>{bot.icon || '🤖'}</Text>
          </View>
          <View style={styles.botHeaderInfo}>
            <NeonText color="white" glow="small" size="medium" weight="bold">
              {bot.name}
            </NeonText>
            <Text style={styles.botDescription}>{bot.description}</Text>
          </View>
          <ShareButton
            onPress={handleShare}
            loading={isSharing}
            size="medium"
            color="#FFFFFF"
          />
        </View>

        {/* Success Rate (Large) */}
        <View style={styles.successRateContainer}>
          <Text style={styles.successRate}>{currentStats.rate}%</Text>
          <Text style={styles.successRateLabel}>Success Rate</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentStats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentStats.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentStats.total - currentStats.wins}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
        </View>

        {/* Time Period Tabs */}
        <View style={styles.timePeriodTabs}>
          {[
            { key: 'today', label: 'Bugün' },
            { key: 'yesterday', label: 'Dün' },
            { key: 'monthly', label: 'Aylık' },
            { key: 'all', label: 'Tümü' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.timePeriodTab,
                timePeriod === tab.key && styles.timePeriodTabActive,
              ]}
              onPress={() => setTimePeriod(tab.key as TimePeriod)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.timePeriodTabText,
                  timePeriod === tab.key && styles.timePeriodTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </GlassCard>
    );
  };

  // ============================================================================
  // RENDER OTHER BOTS
  // ============================================================================

  const renderOtherBots = () => {
    if (otherBots.length === 0) return null;

    return (
      <View style={styles.section}>
        <NeonText color="white" glow="small" size="medium" weight="bold" style={styles.sectionTitle}>
          Other Bots
        </NeonText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.botsScroll}>
          {otherBots.map((otherBot) => (
            <TouchableOpacity
              key={otherBot.id}
              style={styles.otherBotCard}
              onPress={() => onBotSelect?.(otherBot.id)}
              activeOpacity={0.7}
            >
              <GlassCard intensity="subtle" padding={spacing.md}>
                <Text style={styles.otherBotIcon}>{otherBot.icon || '🤖'}</Text>
                <Text style={styles.otherBotName}>{otherBot.name}</Text>
                <View style={styles.otherBotStats}>
                  <Text style={styles.otherBotRate}>{otherBot.successRate}%</Text>
                  <Text style={styles.otherBotLabel}>Success</Text>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // ============================================================================
  // RENDER FILTER TABS
  // ============================================================================

  const renderFilterTabs = () => {
    const filters: { key: ResultFilter; label: string; icon: string }[] = [
      { key: 'all', label: 'ALL', icon: '📊' },
      { key: 'win', label: 'WIN', icon: '✅' },
      { key: 'lose', label: 'LOSE', icon: '❌' },
      { key: 'playing', label: 'PLAYING', icon: '⏳' },
    ];

    return (
      <View style={styles.filterTabs}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              resultFilter === filter.key && styles.filterTabActive,
            ]}
            onPress={() => setResultFilter(filter.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterLabel,
                resultFilter === filter.key && styles.filterLabelActive,
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
  // RENDER PREDICTIONS LIST
  // ============================================================================

  const renderPredictionsList = () => {
    if (filteredPredictions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🤖</Text>
          <Text style={styles.emptyText}>No predictions found</Text>
        </View>
      );
    }

    return (
      <View style={styles.predictionsContainer}>
        {filteredPredictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            bot={prediction.bot}
            match={prediction.match}
            prediction={prediction.prediction}
            tier={prediction.tier}
            isFavorite={prediction.isFavorite}
            onPress={() => onPredictionPress?.(prediction.id)}
          />
        ))}
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Bot Info */}
        {renderBotInfo()}

        {/* Other Bots */}
        {renderOtherBots()}

        {/* Filter Tabs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <NeonText color="white" glow="small" size="medium" weight="bold">
              Prediction Results
            </NeonText>
            <Text style={styles.resultsCount}>
              {filteredPredictions.length} results
            </Text>
          </View>
          {renderFilterTabs()}
        </View>

        {/* Predictions List */}
        {renderPredictionsList()}

        {/* Footer Spacing */}
        <View style={{ height: 40 }} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  botCard: {
    marginBottom: spacing.lg,
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  botIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botIcon: {
    fontSize: 32,
  },
  botHeaderInfo: {
    flex: 1,
  },
  botDescription: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  successRateContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successRate: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 56,
    color: '#4BC41E',
    textShadowColor: 'rgba(75, 196, 30, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  successRateLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  timePeriodTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timePeriodTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
  },
  timePeriodTabActive: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
  },
  timePeriodTabText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  timePeriodTabTextActive: {
    fontFamily: typography.fonts.ui.semibold,
    color: '#4BC41E',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultsCount: {
    fontFamily: typography.fonts.mono.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  botsScroll: {
    flexDirection: 'row',
  },
  otherBotCard: {
    marginRight: spacing.md,
    width: 120,
  },
  otherBotIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  otherBotName: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.small,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  otherBotStats: {
    alignItems: 'center',
  },
  otherBotRate: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 20,
    color: '#4BC41E',
  },
  otherBotLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterTabActive: {
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
  predictionsContainer: {
    gap: spacing.md,
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

export default BotDetailScreen;
