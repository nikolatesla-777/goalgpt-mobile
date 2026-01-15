/**
 * BotStats Component
 * Displays aggregated AI bot statistics and performance metrics
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { GlassCard } from '../atoms/GlassCard';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export interface BotStatsData {
  totalBots: number;
  activeBots: number;
  totalPredictions: number;
  correctPredictions: number;
  overallWinRate: number; // percentage 0-100
  avgConfidence: number; // percentage 0-100
  bestBot: {
    name: string;
    winRate: number;
  };
  topLeague: {
    name: string;
    accuracy: number;
  };
}

export interface BotStatsProps {
  stats: BotStatsData;
  loading?: boolean;
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  color = 'primary',
  trend,
}) => {
  const { theme } = useTheme();

  const getColor = () => {
    switch (color) {
      case 'success':
        return theme.success.main;
      case 'warning':
        return theme.warning.main;
      case 'error':
        return theme.error.main;
      default:
        return theme.primary[500];
    }
  };

  return (
    <View style={styles.statCard}>
      <NeonText size="xs" style={{ color: theme.text.tertiary, marginBottom: spacing[1] }}>
        {label}
      </NeonText>
      <View style={styles.statValueRow}>
        <NeonText size="2xl" style={{ color: getColor(), fontWeight: 'bold' }}>
          {value}
        </NeonText>
        {trend && (
          <NeonText
            size="sm"
            style={{ color: trend === 'up' ? theme.success.main : theme.error.main }}
          >
            {trend === 'up' ? '↑' : '↓'}
          </NeonText>
        )}
      </View>
      {subValue && (
        <NeonText size="xs" style={{ color: theme.text.secondary }}>
          {subValue}
        </NeonText>
      )}
    </View>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const BotStats: React.FC<BotStatsProps> = ({ stats, loading = false }) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <GlassCard intensity="medium" style={styles.container}>
        <NeonText size="sm" style={{ color: theme.text.secondary, textAlign: 'center' }}>
          İstatistikler yükleniyor...
        </NeonText>
      </GlassCard>
    );
  }

  return (
    <GlassCard intensity="medium" style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <NeonText size="lg" color="primary" style={{ fontWeight: '600' }}>
          AI Bot İstatistikleri
        </NeonText>
      </View>

      {/* Main Stats Grid */}
      <View style={styles.mainStatsGrid}>
        <StatCard
          label="Toplam Bot"
          value={stats.totalBots}
          subValue={`${stats.activeBots} Aktif`}
          color="primary"
        />
        <StatCard
          label="Toplam Tahmin"
          value={stats.totalPredictions.toLocaleString('tr-TR')}
          color="primary"
        />
        <StatCard
          label="Başarı Oranı"
          value={`${stats.overallWinRate.toFixed(1)}%`}
          subValue={`${stats.correctPredictions} / ${stats.totalPredictions}`}
          color={
            stats.overallWinRate >= 60
              ? 'success'
              : stats.overallWinRate >= 50
                ? 'warning'
                : 'error'
          }
          trend={stats.overallWinRate >= 50 ? 'up' : 'down'}
        />
        <StatCard
          label="Ortalama Güven"
          value={`${stats.avgConfidence.toFixed(0)}%`}
          color="primary"
        />
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border.primary }]} />

      {/* Performance Details */}
      <View style={styles.detailsSection}>
        {/* Overall Win Rate Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <NeonText size="sm" style={{ color: theme.text.secondary }}>
              Genel Performans
            </NeonText>
            <NeonText size="sm" color="primary" style={{ fontWeight: '600' }}>
              {stats.overallWinRate.toFixed(1)}%
            </NeonText>
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.background.elevated }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${stats.overallWinRate}%`,
                  backgroundColor:
                    stats.overallWinRate >= 60
                      ? theme.success.main
                      : stats.overallWinRate >= 50
                        ? theme.warning.main
                        : theme.error.main,
                },
              ]}
            />
          </View>
        </View>

        {/* Best Bot */}
        <View style={styles.highlightRow}>
          <View style={styles.highlightItem}>
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              En İyi Bot
            </NeonText>
            <NeonText size="md" color="primary" style={{ fontWeight: '600' }}>
              {stats.bestBot.name}
            </NeonText>
            <NeonText size="sm" style={{ color: theme.success.main }}>
              {stats.bestBot.winRate.toFixed(1)}% Başarı
            </NeonText>
          </View>

          <View style={[styles.verticalDivider, { backgroundColor: theme.border.primary }]} />

          <View style={styles.highlightItem}>
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              En İyi Lig
            </NeonText>
            <NeonText size="md" color="primary" style={{ fontWeight: '600' }}>
              {stats.topLeague.name}
            </NeonText>
            <NeonText size="sm" style={{ color: theme.success.main }}>
              {stats.topLeague.accuracy.toFixed(1)}% Doğruluk
            </NeonText>
          </View>
        </View>
      </View>
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
  mainStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginBottom: spacing[1],
  },
  divider: {
    height: 1,
    marginVertical: spacing[4],
  },
  detailsSection: {
    gap: spacing[4],
  },
  progressSection: {
    gap: spacing[2],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 12,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  highlightRow: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  highlightItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[1],
  },
  verticalDivider: {
    width: 1,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default BotStats;
