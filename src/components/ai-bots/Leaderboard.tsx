/**
 * Leaderboard Component
 * Displays top AI bots ranked by performance
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { GlassCard } from '../atoms/GlassCard';
import { NeonText } from '../atoms/NeonText';
import type { Bot } from './BotCard';

// ============================================================================
// TYPES
// ============================================================================

export interface LeaderboardProps {
  bots: Bot[];
  topN?: number;
  sortBy?: 'winRate' | 'accuracy' | 'streak';
  showFullList?: boolean;
}

// ============================================================================
// LEADERBOARD ROW COMPONENT
// ============================================================================

interface LeaderboardRowProps {
  bot: Bot;
  rank: number;
  sortBy: 'winRate' | 'accuracy' | 'streak';
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ bot, rank, sortBy }) => {
  const { theme } = useTheme();

  const getRankColor = (rank: number): string => {
    if (rank === 1) return theme.levels.gold.main;
    if (rank === 2) return theme.levels.silver.main;
    if (rank === 3) return theme.levels.bronze.main;
    return theme.text.secondary;
  };

  const getRankIcon = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const getValue = (): string => {
    switch (sortBy) {
      case 'winRate':
        return `${bot.stats.winRate.toFixed(1)}%`;
      case 'accuracy':
        return `${bot.stats.accuracy.toFixed(1)}%`;
      case 'streak':
        return `${bot.stats.streak}`;
      default:
        return `${bot.stats.winRate.toFixed(1)}%`;
    }
  };

  const getValueColor = (): string => {
    if (sortBy === 'winRate' || sortBy === 'accuracy') {
      const value = sortBy === 'winRate' ? bot.stats.winRate : bot.stats.accuracy;
      if (value >= 70) return theme.success.main;
      if (value >= 50) return theme.warning.main;
      return theme.error.main;
    }
    return theme.success.main;
  };

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: rank <= 3 ? 'rgba(75, 196, 30, 0.05)' : 'transparent',
          borderColor: theme.border.primary,
        },
      ]}
    >
      {/* Rank */}
      <View style={styles.rankSection}>
        {rank <= 3 ? (
          <NeonText size="xl">{getRankIcon(rank)}</NeonText>
        ) : (
          <NeonText
            size="md"
            style={{
              color: getRankColor(rank),
              fontWeight: rank <= 3 ? 'bold' : '400',
            }}
          >
            {rank}
          </NeonText>
        )}
      </View>

      {/* Bot Info */}
      <View style={styles.botSection}>
        <View style={[styles.miniAvatar, { backgroundColor: theme.primary[500] }]}>
          <NeonText size="md">{bot.avatar}</NeonText>
        </View>
        <View style={styles.botInfo}>
          <NeonText
            size="sm"
            color={rank <= 3 ? 'primary' : undefined}
            style={{ fontWeight: rank <= 3 ? '600' : '400' }}
            numberOfLines={1}
          >
            {bot.name}
          </NeonText>
          <NeonText size="xs" style={{ color: theme.text.tertiary }}>
            {bot.stats.totalPredictions} Tahmin
          </NeonText>
        </View>
      </View>

      {/* Value */}
      <View style={styles.valueSection}>
        <NeonText
          size="lg"
          style={{
            color: getValueColor(),
            fontWeight: 'bold',
          }}
        >
          {getValue()}
        </NeonText>
      </View>
    </View>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Leaderboard: React.FC<LeaderboardProps> = ({
  bots,
  topN = 10,
  sortBy = 'winRate',
  showFullList = false,
}) => {
  const { theme } = useTheme();

  // Sort bots based on sortBy criteria
  const sortedBots = React.useMemo(() => {
    const sorted = [...bots].sort((a, b) => {
      switch (sortBy) {
        case 'winRate':
          return b.stats.winRate - a.stats.winRate;
        case 'accuracy':
          return b.stats.accuracy - a.stats.accuracy;
        case 'streak':
          return b.stats.streak - a.stats.streak;
        default:
          return b.stats.winRate - a.stats.winRate;
      }
    });

    return showFullList ? sorted : sorted.slice(0, topN);
  }, [bots, sortBy, topN, showFullList]);

  const getSortLabel = (): string => {
    switch (sortBy) {
      case 'winRate':
        return 'Başarı Oranı';
      case 'accuracy':
        return 'Doğruluk';
      case 'streak':
        return 'Seri';
      default:
        return 'Başarı Oranı';
    }
  };

  if (bots.length === 0) {
    return (
      <GlassCard intensity="light" style={styles.container}>
        <NeonText size="sm" style={{ color: theme.text.secondary, textAlign: 'center' }}>
          Henüz bot verisi bulunmuyor
        </NeonText>
      </GlassCard>
    );
  }

  return (
    <GlassCard intensity="light" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <NeonText size="lg" color="primary" style={{ fontWeight: '600' }}>
          🏆 Liderlik Tablosu
        </NeonText>
        <NeonText size="xs" style={{ color: theme.text.tertiary, marginTop: spacing[1] }}>
          {getSortLabel()} Sıralaması
        </NeonText>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={styles.rankSection}>
          <NeonText size="xs" style={{ color: theme.text.tertiary }}>
            Sıra
          </NeonText>
        </View>
        <View style={styles.botSection}>
          <NeonText size="xs" style={{ color: theme.text.tertiary }}>
            Bot
          </NeonText>
        </View>
        <View style={styles.valueSection}>
          <NeonText size="xs" style={{ color: theme.text.tertiary }}>
            {getSortLabel()}
          </NeonText>
        </View>
      </View>

      {/* Rows */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {sortedBots.map((bot, index) => (
          <LeaderboardRow key={bot.id} bot={bot} rank={index + 1} sortBy={sortBy} />
        ))}
      </ScrollView>

      {/* Footer */}
      {!showFullList && bots.length > topN && (
        <View style={[styles.footer, { borderTopColor: theme.border.primary }]}>
          <NeonText size="xs" style={{ color: theme.text.tertiary, textAlign: 'center' }}>
            {bots.length - topN} bot daha var
          </NeonText>
        </View>
      )}
    </GlassCard>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    marginBottom: spacing[4],
  },
  header: {
    marginBottom: spacing[4],
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    marginBottom: spacing[2],
  },
  scrollView: {
    maxHeight: 400,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    marginBottom: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  rankSection: {
    width: 50,
    alignItems: 'center',
  },
  botSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botInfo: {
    flex: 1,
  },
  valueSection: {
    width: 80,
    alignItems: 'flex-end',
  },
  footer: {
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: 1,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default Leaderboard;
