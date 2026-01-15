/**
 * H2HTab Component
 * Displays head-to-head history between two teams
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, borderRadius } from '../../../constants/theme';
import { GlassCard } from '../../atoms/GlassCard';
import { NeonText } from '../../atoms/NeonText';
import { NoDataAvailable } from '../../templates/EmptyState';

// ============================================================================
// TYPES
// ============================================================================

export interface H2HMatch {
  id: string | number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
  winner?: 'home' | 'away' | 'draw';
}

export interface H2HStats {
  totalMatches: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  homeGoals: number;
  awayGoals: number;
}

export interface H2HTabProps {
  /** Previous matches */
  matches?: H2HMatch[];

  /** H2H statistics */
  stats?: H2HStats;

  /** Current home team name */
  homeTeamName: string;

  /** Current away team name */
  awayTeamName: string;

  /** Loading state */
  loading?: boolean;
}

// ============================================================================
// STATS SUMMARY COMPONENT
// ============================================================================

interface StatsSummaryProps {
  stats: H2HStats;
  homeTeamName: string;
  awayTeamName: string;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ stats, homeTeamName, awayTeamName }) => {
  const { theme } = useTheme();

  const homeWinPercent = stats.totalMatches > 0 ? (stats.homeWins / stats.totalMatches) * 100 : 0;
  const awayWinPercent = stats.totalMatches > 0 ? (stats.awayWins / stats.totalMatches) * 100 : 0;
  const drawPercent = stats.totalMatches > 0 ? (stats.draws / stats.totalMatches) * 100 : 0;

  return (
    <GlassCard intensity="medium" style={styles.statsCard}>
      <NeonText size="md" color="primary" style={styles.statsTitle}>
        Genel İstatistikler
      </NeonText>

      {/* Total Matches */}
      <View style={styles.statRow}>
        <NeonText size="sm" style={{ color: theme.text.secondary }}>
          Toplam Maç
        </NeonText>
        <NeonText size="lg" color="primary">
          {stats.totalMatches}
        </NeonText>
      </View>

      {/* Win Distribution */}
      <View style={styles.winDistribution}>
        <View style={styles.winColumn}>
          <NeonText size="2xl" color="success" style={styles.winCount}>
            {stats.homeWins}
          </NeonText>
          <NeonText size="xs" style={{ color: theme.text.tertiary, textAlign: 'center' }}>
            {homeTeamName} Galibiyet
          </NeonText>
        </View>

        <View style={styles.winColumn}>
          <NeonText size="2xl" style={{ color: theme.text.secondary }}>
            {stats.draws}
          </NeonText>
          <NeonText size="xs" style={{ color: theme.text.tertiary, textAlign: 'center' }}>
            Beraberlik
          </NeonText>
        </View>

        <View style={styles.winColumn}>
          <NeonText size="2xl" style={{ color: theme.text.secondary }}>
            {stats.awayWins}
          </NeonText>
          <NeonText size="xs" style={{ color: theme.text.tertiary, textAlign: 'center' }}>
            {awayTeamName} Galibiyet
          </NeonText>
        </View>
      </View>

      {/* Win Percentage Bar */}
      <View style={styles.percentageBar}>
        <View
          style={[
            styles.homeWinBar,
            {
              width: `${homeWinPercent}%`,
              backgroundColor: theme.primary[500],
            },
          ]}
        />
        <View
          style={[
            styles.drawBar,
            {
              width: `${drawPercent}%`,
              backgroundColor: theme.text.tertiary,
            },
          ]}
        />
        <View
          style={[
            styles.awayWinBar,
            {
              width: `${awayWinPercent}%`,
              backgroundColor: theme.background.elevated,
            },
          ]}
        />
      </View>

      {/* Goals */}
      <View style={styles.goalsRow}>
        <NeonText size="md" color="primary">
          {stats.homeGoals}
        </NeonText>
        <NeonText size="sm" style={{ color: theme.text.secondary }}>
          Toplam Gol
        </NeonText>
        <NeonText size="md" style={{ color: theme.text.secondary }}>
          {stats.awayGoals}
        </NeonText>
      </View>
    </GlassCard>
  );
};

// ============================================================================
// MATCH ITEM COMPONENT
// ============================================================================

interface MatchItemProps {
  match: H2HMatch;
  currentHomeTeam: string;
  currentAwayTeam: string;
}

const MatchItem: React.FC<MatchItemProps> = ({ match, currentHomeTeam, currentAwayTeam }) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getWinnerHighlight = (team: 'home' | 'away'): boolean => {
    return match.winner === team;
  };

  return (
    <GlassCard intensity="light" style={styles.matchCard}>
      {/* Date & Competition */}
      <View style={styles.matchHeader}>
        <NeonText size="xs" style={{ color: theme.text.tertiary }}>
          {formatDate(match.date)}
        </NeonText>
        <NeonText size="xs" color="primary">
          {match.competition}
        </NeonText>
      </View>

      {/* Teams & Score */}
      <View style={styles.matchContent}>
        <View style={styles.teamRow}>
          <NeonText
            size="sm"
            color={getWinnerHighlight('home') ? 'success' : undefined}
            style={{
              flex: 1,
              color: getWinnerHighlight('home') ? theme.primary[500] : theme.text.primary,
              fontWeight: getWinnerHighlight('home') ? '600' : '400',
            }}
          >
            {match.homeTeam}
          </NeonText>
          <NeonText
            size="md"
            color={getWinnerHighlight('home') ? 'success' : undefined}
            style={{
              fontWeight: '600',
              color: getWinnerHighlight('home') ? theme.primary[500] : theme.text.primary,
            }}
          >
            {match.homeScore}
          </NeonText>
        </View>

        <View style={styles.teamRow}>
          <NeonText
            size="sm"
            color={getWinnerHighlight('away') ? 'success' : undefined}
            style={{
              flex: 1,
              color: getWinnerHighlight('away') ? theme.primary[500] : theme.text.primary,
              fontWeight: getWinnerHighlight('away') ? '600' : '400',
            }}
          >
            {match.awayTeam}
          </NeonText>
          <NeonText
            size="md"
            color={getWinnerHighlight('away') ? 'success' : undefined}
            style={{
              fontWeight: '600',
              color: getWinnerHighlight('away') ? theme.primary[500] : theme.text.primary,
            }}
          >
            {match.awayScore}
          </NeonText>
        </View>
      </View>

      {/* Result Badge */}
      {match.winner && (
        <View style={styles.resultBadge}>
          <NeonText
            size="xs"
            color={match.winner !== 'draw' ? 'success' : undefined}
            style={{
              color: match.winner !== 'draw' ? theme.primary[500] : theme.text.secondary,
            }}
          >
            {match.winner === 'draw' ? 'Beraberlik' : 'Kazanan'}
          </NeonText>
        </View>
      )}
    </GlassCard>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const H2HTab: React.FC<H2HTabProps> = ({
  matches,
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

  if (!matches || matches.length === 0) {
    return (
      <View style={styles.container}>
        <NoDataAvailable />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Stats Summary */}
      {stats && (
        <StatsSummary stats={stats} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />
      )}

      {/* Previous Matches */}
      <View style={styles.matchesSection}>
        <NeonText size="md" color="primary" style={styles.sectionTitle}>
          Önceki Karşılaşmalar
        </NeonText>

        <View style={styles.matchesList}>
          {matches.map((match) => (
            <MatchItem
              key={match.id}
              match={match}
              currentHomeTeam={homeTeamName}
              currentAwayTeam={awayTeamName}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  statsCard: {
    padding: spacing.lg,
    marginBottom: spacing[6],
  },
  statsTitle: {
    marginBottom: spacing[4],
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  winDistribution: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing[4],
  },
  winColumn: {
    flex: 1,
    alignItems: 'center',
  },
  winCount: {
    fontWeight: 'bold',
    marginBottom: spacing[2],
  },
  percentageBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginVertical: spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  homeWinBar: {
    height: '100%',
  },
  drawBar: {
    height: '100%',
  },
  awayWinBar: {
    height: '100%',
  },
  goalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  matchesSection: {
    marginTop: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[4],
    fontWeight: '600',
  },
  matchesList: {
    gap: spacing[3],
  },
  matchCard: {
    padding: spacing[4],
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.1)',
  },
  matchContent: {
    gap: spacing[2],
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultBadge: {
    marginTop: spacing[2],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 196, 30, 0.1)',
    alignItems: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default H2HTab;
