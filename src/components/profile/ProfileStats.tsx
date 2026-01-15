/**
 * ProfileStats Component
 * Displays user statistics and achievements
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

export interface UserStats {
  totalPredictions: number;
  correctPredictions: number;
  winRate: number; // percentage 0-100
  currentStreak: number;
  longestStreak: number;
  favoriteLeague?: string;
  totalMatchesWatched: number;
  totalBotInteractions: number;
}

export interface ProfileStatsProps {
  stats: UserStats;
}

// ============================================================================
// STAT ITEM COMPONENT
// ============================================================================

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, color = 'primary' }) => {
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
    <View style={styles.statItem}>
      {icon && <NeonText size="xl">{icon}</NeonText>}
      <View style={styles.statContent}>
        <NeonText size="2xl" style={{ color: getColor(), fontWeight: 'bold' }}>
          {value}
        </NeonText>
        <NeonText size="xs" style={{ color: theme.text.tertiary }}>
          {label}
        </NeonText>
      </View>
    </View>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const { theme } = useTheme();

  const getWinRateColor = (): 'success' | 'warning' | 'error' => {
    if (stats.winRate >= 70) return 'success';
    if (stats.winRate >= 50) return 'warning';
    return 'error';
  };

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <NeonText size="lg" color="primary" style={styles.sectionTitle}>
        İstatistiklerim
      </NeonText>

      {/* Main Stats */}
      <GlassCard intensity="light" style={styles.card}>
        <View style={styles.statsGrid}>
          <StatItem
            icon="🎯"
            label="Toplam Tahmin"
            value={stats.totalPredictions}
            color="primary"
          />
          <StatItem
            icon="✅"
            label="Doğru Tahmin"
            value={stats.correctPredictions}
            color="success"
          />
          <StatItem
            icon="📊"
            label="Başarı Oranı"
            value={`${stats.winRate.toFixed(1)}%`}
            color={getWinRateColor()}
          />
          <StatItem icon="🔥" label="Güncel Seri" value={stats.currentStreak} color="warning" />
        </View>
      </GlassCard>

      {/* Secondary Stats */}
      <GlassCard intensity="light" style={styles.card}>
        <View style={styles.secondaryStats}>
          {/* Longest Streak */}
          <View style={styles.secondaryItem}>
            <View style={styles.secondaryLabel}>
              <NeonText size="sm" style={{ color: theme.text.secondary }}>
                En Uzun Seri
              </NeonText>
            </View>
            <NeonText size="lg" color="primary" style={{ fontWeight: '600' }}>
              {stats.longestStreak} 🏆
            </NeonText>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border.primary }]} />

          {/* Favorite League */}
          {stats.favoriteLeague && (
            <>
              <View style={styles.secondaryItem}>
                <View style={styles.secondaryLabel}>
                  <NeonText size="sm" style={{ color: theme.text.secondary }}>
                    Favori Lig
                  </NeonText>
                </View>
                <NeonText size="lg" color="primary" style={{ fontWeight: '600' }}>
                  {stats.favoriteLeague} ⚽
                </NeonText>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border.primary }]} />
            </>
          )}

          {/* Total Matches Watched */}
          <View style={styles.secondaryItem}>
            <View style={styles.secondaryLabel}>
              <NeonText size="sm" style={{ color: theme.text.secondary }}>
                İzlenen Maç
              </NeonText>
            </View>
            <NeonText size="lg" color="primary" style={{ fontWeight: '600' }}>
              {stats.totalMatchesWatched} 📺
            </NeonText>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border.primary }]} />

          {/* Bot Interactions */}
          <View style={styles.secondaryItem}>
            <View style={styles.secondaryLabel}>
              <NeonText size="sm" style={{ color: theme.text.secondary }}>
                AI Bot Etkileşimi
              </NeonText>
            </View>
            <NeonText size="lg" color="primary" style={{ fontWeight: '600' }}>
              {stats.totalBotInteractions} 🤖
            </NeonText>
          </View>
        </View>
      </GlassCard>

      {/* Performance Summary */}
      <GlassCard intensity="light" style={styles.card}>
        <View style={styles.performanceSection}>
          <NeonText
            size="md"
            color="primary"
            style={{ fontWeight: '600', marginBottom: spacing[3] }}
          >
            Performans Özeti
          </NeonText>

          {/* Win Rate Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <NeonText size="sm" style={{ color: theme.text.secondary }}>
                Başarı Oranı
              </NeonText>
              <NeonText size="sm" color="primary" style={{ fontWeight: '600' }}>
                {stats.winRate.toFixed(1)}%
              </NeonText>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.background.elevated }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${stats.winRate}%`,
                    backgroundColor:
                      stats.winRate >= 70
                        ? theme.success.main
                        : stats.winRate >= 50
                          ? theme.warning.main
                          : theme.error.main,
                  },
                ]}
              />
            </View>
          </View>

          {/* Accuracy Details */}
          <View style={styles.accuracyDetails}>
            <View style={styles.accuracyItem}>
              <NeonText size="xs" style={{ color: theme.text.tertiary }}>
                Toplam
              </NeonText>
              <NeonText size="md" style={{ color: theme.text.primary, fontWeight: '600' }}>
                {stats.totalPredictions}
              </NeonText>
            </View>
            <View style={styles.accuracyItem}>
              <NeonText size="xs" style={{ color: theme.text.tertiary }}>
                Doğru
              </NeonText>
              <NeonText size="md" style={{ color: theme.success.main, fontWeight: '600' }}>
                {stats.correctPredictions}
              </NeonText>
            </View>
            <View style={styles.accuracyItem}>
              <NeonText size="xs" style={{ color: theme.text.tertiary }}>
                Yanlış
              </NeonText>
              <NeonText size="md" style={{ color: theme.error.main, fontWeight: '600' }}>
                {stats.totalPredictions - stats.correctPredictions}
              </NeonText>
            </View>
          </View>
        </View>
      </GlassCard>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[3],
    fontWeight: '600',
    paddingHorizontal: spacing.md,
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing[3],
    marginHorizontal: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  statContent: {
    flex: 1,
    gap: spacing[1],
  },
  secondaryStats: {
    gap: spacing[3],
  },
  secondaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryLabel: {
    flex: 1,
  },
  divider: {
    height: 1,
  },
  performanceSection: {
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
  accuracyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 196, 30, 0.1)',
  },
  accuracyItem: {
    alignItems: 'center',
    gap: spacing[1],
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default ProfileStats;
