/**
 * StatsTab Component
 * Displays match statistics (possession, shots, etc.)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, borderRadius } from '../../../constants/theme';
import { GlassCard } from '../../atoms/GlassCard';
import { NeonText } from '../../atoms/NeonText';
import { NoDataAvailable } from '../../templates/EmptyState';

// ============================================================================
// TYPES
// ============================================================================

export interface MatchStats {
  possession?: { home: number; away: number };
  shots?: { home: number; away: number };
  shotsOnTarget?: { home: number; away: number };
  corners?: { home: number; away: number };
  fouls?: { home: number; away: number };
  yellowCards?: { home: number; away: number };
  redCards?: { home: number; away: number };
  offsides?: { home: number; away: number };
  passes?: { home: number; away: number };
  passAccuracy?: { home: number; away: number };
  tackles?: { home: number; away: number };
  saves?: { home: number; away: number };
}

export interface StatsTabProps {
  /** Match statistics */
  stats?: MatchStats;

  /** Home team name */
  homeTeamName: string;

  /** Away team name */
  awayTeamName: string;

  /** Loading state */
  loading?: boolean;
}

// ============================================================================
// STAT BAR COMPONENT
// ============================================================================

interface StatBarProps {
  label: string;
  homeValue: number;
  awayValue: number;
  homeLabel?: string;
  awayLabel?: string;
  isPercentage?: boolean;
}

const StatBar: React.FC<StatBarProps> = ({
  label,
  homeValue,
  awayValue,
  homeLabel,
  awayLabel,
  isPercentage = false,
}) => {
  const { theme } = useTheme();

  const total = homeValue + awayValue;
  const homePercent = total > 0 ? (homeValue / total) * 100 : 50;
  const awayPercent = total > 0 ? (awayValue / total) * 100 : 50;

  const formatValue = (value: number): string => {
    return isPercentage ? `${value}%` : value.toString();
  };

  return (
    <View style={styles.statContainer}>
      {/* Label */}
      <View style={styles.statLabel}>
        <NeonText size="sm" style={{ color: theme.text.secondary, textAlign: 'center' }}>
          {label}
        </NeonText>
      </View>

      {/* Values */}
      <View style={styles.statValues}>
        <NeonText
          size="md"
          color="primary"
          style={{ minWidth: 50, textAlign: 'center', fontWeight: '600' }}
        >
          {formatValue(homeValue)}
        </NeonText>

        {/* Progress Bar */}
        <View style={styles.barContainer}>
          <View
            style={[
              styles.homeBar,
              {
                width: `${homePercent}%`,
                backgroundColor: theme.primary[500],
              },
            ]}
          />
          <View
            style={[
              styles.awayBar,
              {
                width: `${awayPercent}%`,
                backgroundColor: theme.text.tertiary,
              },
            ]}
          />
        </View>

        <NeonText
          size="md"
          style={{
            minWidth: 50,
            textAlign: 'center',
            fontWeight: '600',
            color: theme.text.secondary,
          }}
        >
          {formatValue(awayValue)}
        </NeonText>
      </View>

      {/* Team Labels (optional) */}
      {(homeLabel || awayLabel) && (
        <View style={styles.teamLabels}>
          {homeLabel && (
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              {homeLabel}
            </NeonText>
          )}
          {awayLabel && (
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              {awayLabel}
            </NeonText>
          )}
        </View>
      )}
    </View>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const StatsTab: React.FC<StatsTabProps> = ({
  stats,
  homeTeamName,
  awayTeamName,
  loading = false,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <View style={styles.container}>
        <NoDataAvailable size="small" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <NoDataAvailable />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlassCard intensity="light" style={styles.card}>
        {/* Team Names Header */}
        <View style={styles.header}>
          <NeonText size="sm" color="primary" style={{ flex: 1, textAlign: 'center' }}>
            {homeTeamName}
          </NeonText>
          <NeonText size="sm" style={{ color: theme.text.secondary }}>
            İSTATİSTİKLER
          </NeonText>
          <NeonText size="sm" style={{ flex: 1, textAlign: 'center', color: theme.text.secondary }}>
            {awayTeamName}
          </NeonText>
        </View>

        {/* Stats List */}
        <View style={styles.statsList}>
          {/* Possession */}
          {stats.possession && (
            <StatBar
              label="Topa Sahip Olma"
              homeValue={stats.possession.home}
              awayValue={stats.possession.away}
              isPercentage={true}
            />
          )}

          {/* Shots */}
          {stats.shots && (
            <StatBar label="Şutlar" homeValue={stats.shots.home} awayValue={stats.shots.away} />
          )}

          {/* Shots on Target */}
          {stats.shotsOnTarget && (
            <StatBar
              label="İsabetli Şutlar"
              homeValue={stats.shotsOnTarget.home}
              awayValue={stats.shotsOnTarget.away}
            />
          )}

          {/* Corners */}
          {stats.corners && (
            <StatBar
              label="Kornerler"
              homeValue={stats.corners.home}
              awayValue={stats.corners.away}
            />
          )}

          {/* Pass Accuracy */}
          {stats.passAccuracy && (
            <StatBar
              label="Pas İsabeti"
              homeValue={stats.passAccuracy.home}
              awayValue={stats.passAccuracy.away}
              isPercentage={true}
            />
          )}

          {/* Fouls */}
          {stats.fouls && (
            <StatBar label="Fauller" homeValue={stats.fouls.home} awayValue={stats.fouls.away} />
          )}

          {/* Yellow Cards */}
          {stats.yellowCards && (
            <StatBar
              label="Sarı Kartlar"
              homeValue={stats.yellowCards.home}
              awayValue={stats.yellowCards.away}
            />
          )}

          {/* Red Cards */}
          {stats.redCards && (
            <StatBar
              label="Kırmızı Kartlar"
              homeValue={stats.redCards.home}
              awayValue={stats.redCards.away}
            />
          )}

          {/* Offsides */}
          {stats.offsides && (
            <StatBar
              label="Ofsaytlar"
              homeValue={stats.offsides.home}
              awayValue={stats.offsides.away}
            />
          )}

          {/* Saves */}
          {stats.saves && (
            <StatBar
              label="Kurtarışlar"
              homeValue={stats.saves.home}
              awayValue={stats.saves.away}
            />
          )}
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
    flex: 1,
    padding: spacing.md,
  },
  card: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.2)',
  },
  statsList: {
    gap: spacing[5],
  },
  statContainer: {
    marginBottom: spacing[2],
  },
  statLabel: {
    marginBottom: spacing[2],
  },
  statValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  barContainer: {
    flex: 1,
    height: 8,
    flexDirection: 'row',
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  homeBar: {
    height: '100%',
  },
  awayBar: {
    height: '100%',
  },
  teamLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[1],
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default StatsTab;
