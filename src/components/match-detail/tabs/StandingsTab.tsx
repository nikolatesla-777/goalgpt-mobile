/**
 * StandingsTab Component
 * Displays league standings table
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

export interface StandingTeam {
  position: number;
  teamId: number;
  teamName: string;
  teamLogo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string; // e.g., "WWDLW"
}

export interface StandingsTabProps {
  /** League standings */
  standings?: StandingTeam[];

  /** Current home team ID */
  homeTeamId?: number;

  /** Current away team ID */
  awayTeamId?: number;

  /** Loading state */
  loading?: boolean;
}

// ============================================================================
// TABLE HEADER COMPONENT
// ============================================================================

const TableHeader: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.tableHeader}>
      <NeonText size="xs" style={{ ...styles.posCol, color: theme.text.tertiary }}>
        #
      </NeonText>
      <NeonText size="xs" style={{ ...styles.teamCol, color: theme.text.tertiary }}>
        Takım
      </NeonText>
      <NeonText size="xs" style={{ ...styles.statCol, color: theme.text.tertiary }}>
        O
      </NeonText>
      <NeonText size="xs" style={{ ...styles.statCol, color: theme.text.tertiary }}>
        G
      </NeonText>
      <NeonText size="xs" style={{ ...styles.statCol, color: theme.text.tertiary }}>
        B
      </NeonText>
      <NeonText size="xs" style={{ ...styles.statCol, color: theme.text.tertiary }}>
        M
      </NeonText>
      <NeonText size="xs" style={{ ...styles.statCol, color: theme.text.tertiary }}>
        A
      </NeonText>
      <NeonText size="xs" style={{ ...styles.statCol, color: theme.text.tertiary }}>
        P
      </NeonText>
    </View>
  );
};

// ============================================================================
// TABLE ROW COMPONENT
// ============================================================================

interface TableRowProps {
  team: StandingTeam;
  isHighlighted: boolean;
}

const TableRow: React.FC<TableRowProps> = ({ team, isHighlighted }) => {
  const { theme } = useTheme();

  const getPositionColor = (position: number): string => {
    if (position <= 4) return theme.primary[500]; // Champions League
    if (position <= 6) return theme.text.primary; // Europa League
    if (position >= 18) return theme.error.main; // Relegation
    return theme.text.secondary;
  };

  return (
    <View
      style={[
        styles.tableRow,
        {
          backgroundColor: isHighlighted ? 'rgba(75, 196, 30, 0.1)' : 'transparent',
        },
      ]}
    >
      {/* Position */}
      <NeonText
        size="sm"
        style={{
          ...styles.posCol,
          color: getPositionColor(team.position),
          fontWeight: isHighlighted ? '600' : '400',
        }}
      >
        {team.position}
      </NeonText>

      {/* Team Name */}
      <NeonText
        size="sm"
        color={isHighlighted ? 'primary' : undefined}
        style={{
          ...styles.teamCol,
          fontWeight: isHighlighted ? '600' : '400',
          color: isHighlighted ? theme.primary[500] : theme.text.primary,
        }}
        numberOfLines={1}
      >
        {team.teamName}
      </NeonText>

      {/* Stats */}
      <NeonText
        size="sm"
        style={{
          ...styles.statCol,
          color: isHighlighted ? theme.text.primary : theme.text.secondary,
        }}
      >
        {team.played}
      </NeonText>
      <NeonText
        size="sm"
        style={{
          ...styles.statCol,
          color: isHighlighted ? theme.text.primary : theme.text.secondary,
        }}
      >
        {team.won}
      </NeonText>
      <NeonText
        size="sm"
        style={{
          ...styles.statCol,
          color: isHighlighted ? theme.text.primary : theme.text.secondary,
        }}
      >
        {team.drawn}
      </NeonText>
      <NeonText
        size="sm"
        style={{
          ...styles.statCol,
          color: isHighlighted ? theme.text.primary : theme.text.secondary,
        }}
      >
        {team.lost}
      </NeonText>
      <NeonText
        size="sm"
        style={{
          ...styles.statCol,
          color: isHighlighted ? theme.text.primary : theme.text.secondary,
        }}
      >
        {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
      </NeonText>

      {/* Points */}
      <NeonText
        size="sm"
        color={isHighlighted ? 'primary' : undefined}
        style={{
          ...styles.statCol,
          fontWeight: '600',
          color: isHighlighted ? theme.primary[500] : theme.text.primary,
        }}
      >
        {team.points}
      </NeonText>
    </View>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const StandingsTab: React.FC<StandingsTabProps> = ({
  standings,
  homeTeamId,
  awayTeamId,
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

  if (!standings || standings.length === 0) {
    return (
      <View style={styles.container}>
        <NoDataAvailable />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GlassCard intensity="light" style={styles.card}>
        {/* Title */}
        <View style={styles.header}>
          <NeonText size="md" color="primary">
            Puan Durumu
          </NeonText>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.primary[500] }]} />
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              Şampiyonlar Ligi
            </NeonText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.error.main }]} />
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              Küme Düşme
            </NeonText>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <TableHeader />

          {standings.map((team) => (
            <TableRow
              key={team.teamId}
              team={team}
              isHighlighted={team.teamId === homeTeamId || team.teamId === awayTeamId}
            />
          ))}
        </View>

        {/* Column Legend */}
        <View style={styles.columnLegend}>
          <NeonText size="xs" style={{ color: theme.text.tertiary }}>
            O: Oynanan | G: Galibiyet | B: Beraberlik | M: Mağlubiyet | A: Averaj | P: Puan
          </NeonText>
        </View>
      </GlassCard>
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
  card: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing[4],
  },
  legend: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  table: {
    marginTop: spacing[2],
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: spacing[2],
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(75, 196, 30, 0.2)',
    marginBottom: spacing[2],
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing[3],
    borderRadius: borderRadius.sm,
    marginBottom: spacing[1],
  },
  posCol: {
    width: 30,
    textAlign: 'center',
  },
  teamCol: {
    flex: 1,
    paddingHorizontal: spacing[2],
  },
  statCol: {
    width: 35,
    textAlign: 'center',
  },
  columnLegend: {
    marginTop: spacing[4],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 196, 30, 0.1)',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default StandingsTab;
