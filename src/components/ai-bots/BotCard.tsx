/**
 * BotCard Component
 * Displays individual AI bot with stats and performance
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { GlassCard } from '../atoms/GlassCard';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export interface Bot {
  id: number;
  name: string;
  avatar: string;
  description: string;
  rank: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  stats: {
    totalPredictions: number;
    correctPredictions: number;
    winRate: number; // percentage 0-100
    avgConfidence: number; // percentage 0-100
    accuracy: number; // percentage 0-100
    streak: number; // current winning streak
  };
  specialties: string[]; // e.g., ["Premier League", "Over/Under"]
  isActive: boolean;
  lastPrediction?: string; // ISO date string
}

export interface BotCardProps {
  bot: Bot;
  onPress?: (bot: Bot) => void;
  showRank?: boolean;
  compact?: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getTierColor = (tier: Bot['tier'], theme: any): string => {
  switch (tier) {
    case 'bronze':
      return theme.levels.bronze.main;
    case 'silver':
      return theme.levels.silver.main;
    case 'gold':
      return theme.levels.gold.main;
    case 'platinum':
      return theme.levels.platinum.main;
    case 'diamond':
      return theme.levels.diamond.main;
    default:
      return theme.text.secondary;
  }
};

const getTierLabel = (tier: Bot['tier']): string => {
  const labels = {
    bronze: 'Bronz',
    silver: 'Gümüş',
    gold: 'Altın',
    platinum: 'Platin',
    diamond: 'Elmas',
  };
  return labels[tier];
};

const getWinRateColor = (winRate: number, theme: any): string => {
  if (winRate >= 70) return theme.success.main;
  if (winRate >= 50) return theme.warning.main;
  return theme.error.main;
};

// ============================================================================
// COMPONENT
// ============================================================================

export const BotCard: React.FC<BotCardProps> = ({
  bot,
  onPress,
  showRank = true,
  compact = false,
}) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (onPress) onPress(bot);
  };

  // ============================================================================
  // COMPACT VERSION
  // ============================================================================

  if (compact) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <GlassCard intensity="light" style={styles.compactCard}>
          <View style={styles.compactHeader}>
            {/* Avatar */}
            <View style={[styles.compactAvatar, { backgroundColor: theme.primary[500] }]}>
              <NeonText size="lg">{bot.avatar}</NeonText>
            </View>

            {/* Bot Info */}
            <View style={styles.compactInfo}>
              <NeonText size="sm" color="primary" style={{ fontWeight: '600' }}>
                {bot.name}
              </NeonText>
              <NeonText size="xs" style={{ color: theme.text.tertiary }}>
                {bot.stats.totalPredictions} Tahmin
              </NeonText>
            </View>

            {/* Win Rate */}
            <View style={styles.compactStats}>
              <NeonText
                size="lg"
                style={{
                  color: getWinRateColor(bot.stats.winRate, theme),
                  fontWeight: 'bold',
                }}
              >
                {bot.stats.winRate.toFixed(0)}%
              </NeonText>
              <NeonText size="xs" style={{ color: theme.text.tertiary }}>
                Başarı
              </NeonText>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  }

  // ============================================================================
  // FULL VERSION
  // ============================================================================

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <GlassCard intensity="light" style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          {/* Rank Badge */}
          {showRank && (
            <View style={[styles.rankBadge, { backgroundColor: theme.background.elevated }]}>
              <NeonText size="sm" color="primary" style={{ fontWeight: 'bold' }}>
                #{bot.rank}
              </NeonText>
            </View>
          )}

          {/* Avatar & Info */}
          <View style={styles.botInfo}>
            <View style={[styles.avatar, { backgroundColor: theme.primary[500] }]}>
              <NeonText size="2xl">{bot.avatar}</NeonText>
            </View>

            <View style={styles.nameSection}>
              <NeonText size="lg" color="primary" style={{ fontWeight: '600' }}>
                {bot.name}
              </NeonText>
              <View style={styles.tierBadge}>
                <View
                  style={[styles.tierDot, { backgroundColor: getTierColor(bot.tier, theme) }]}
                />
                <NeonText size="xs" style={{ color: getTierColor(bot.tier, theme) }}>
                  {getTierLabel(bot.tier)}
                </NeonText>
              </View>
            </View>
          </View>

          {/* Status */}
          {bot.isActive && (
            <View style={[styles.statusBadge, { backgroundColor: theme.live.background }]}>
              <View style={[styles.statusDot, { backgroundColor: theme.live.indicator }]} />
              <NeonText size="xs" style={{ color: theme.live.text }}>
                Aktif
              </NeonText>
            </View>
          )}
        </View>

        {/* Description */}
        <NeonText
          size="sm"
          style={{ color: theme.text.secondary, marginBottom: spacing[3] }}
          numberOfLines={2}
        >
          {bot.description}
        </NeonText>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              Başarı Oranı
            </NeonText>
            <NeonText
              size="xl"
              style={{
                color: getWinRateColor(bot.stats.winRate, theme),
                fontWeight: 'bold',
              }}
            >
              {bot.stats.winRate.toFixed(1)}%
            </NeonText>
          </View>

          <View style={styles.statItem}>
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              Doğruluk
            </NeonText>
            <NeonText size="xl" color="primary" style={{ fontWeight: 'bold' }}>
              {bot.stats.accuracy.toFixed(1)}%
            </NeonText>
          </View>

          <View style={styles.statItem}>
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              Ortalama Güven
            </NeonText>
            <NeonText size="xl" color="primary" style={{ fontWeight: 'bold' }}>
              {bot.stats.avgConfidence.toFixed(0)}%
            </NeonText>
          </View>

          <View style={styles.statItem}>
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              Seri
            </NeonText>
            <NeonText size="xl" style={{ color: theme.success.main, fontWeight: 'bold' }}>
              {bot.stats.streak}
            </NeonText>
          </View>
        </View>

        {/* Performance Bar */}
        <View style={styles.performanceSection}>
          <NeonText size="xs" style={{ color: theme.text.tertiary, marginBottom: spacing[2] }}>
            {bot.stats.correctPredictions} / {bot.stats.totalPredictions} Doğru Tahmin
          </NeonText>
          <View style={[styles.performanceBar, { backgroundColor: theme.background.elevated }]}>
            <View
              style={[
                styles.performanceFill,
                {
                  width: `${bot.stats.winRate}%`,
                  backgroundColor: getWinRateColor(bot.stats.winRate, theme),
                },
              ]}
            />
          </View>
        </View>

        {/* Specialties */}
        {bot.specialties.length > 0 && (
          <View style={styles.specialtiesSection}>
            <NeonText size="xs" style={{ color: theme.text.tertiary, marginBottom: spacing[2] }}>
              Uzmanlık Alanları:
            </NeonText>
            <View style={styles.specialtiesList}>
              {bot.specialties.slice(0, 3).map((specialty, index) => (
                <View
                  key={index}
                  style={[
                    styles.specialtyChip,
                    {
                      backgroundColor: theme.background.elevated,
                      borderColor: theme.border.primary,
                    },
                  ]}
                >
                  <NeonText size="xs" style={{ color: theme.text.secondary }}>
                    {specialty}
                  </NeonText>
                </View>
              ))}
            </View>
          </View>
        )}
      </GlassCard>
    </TouchableOpacity>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Full Card Styles
  card: {
    padding: spacing.lg,
    marginBottom: spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  rankBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    marginRight: spacing[2],
  },
  botInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameSection: {
    flex: 1,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  tierDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[1],
  },
  performanceSection: {
    marginBottom: spacing[3],
  },
  performanceBar: {
    height: 8,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  performanceFill: {
    height: '100%',
  },
  specialtiesSection: {
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 196, 30, 0.1)',
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  specialtyChip: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },

  // Compact Card Styles
  compactCard: {
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  compactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactInfo: {
    flex: 1,
  },
  compactStats: {
    alignItems: 'flex-end',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default BotCard;
