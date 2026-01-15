/**
 * LineupTab Component
 * Displays team lineups with formations
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

export interface Player {
  id: number;
  name: string;
  number: number;
  position: string; // GK, DF, MF, FW
  photo?: string;
}

export interface TeamLineup {
  formation: string; // e.g., "4-4-2"
  startingXI: Player[];
  substitutes: Player[];
  coach?: string;
}

export interface LineupTabProps {
  /** Home team lineup */
  homeLineup?: TeamLineup;

  /** Away team lineup */
  awayLineup?: TeamLineup;

  /** Home team name */
  homeTeamName: string;

  /** Away team name */
  awayTeamName: string;

  /** Loading state */
  loading?: boolean;
}

// ============================================================================
// PLAYER CARD COMPONENT
// ============================================================================

interface PlayerCardProps {
  player: Player;
  compact?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, compact = false }) => {
  const { theme } = useTheme();

  if (compact) {
    return (
      <View style={styles.compactPlayer}>
        <View style={[styles.playerNumber, { backgroundColor: theme.primary[500] }]}>
          <NeonText size="xs" style={{ color: theme.text.inverse, fontWeight: '600' }}>
            {player.number}
          </NeonText>
        </View>
        <NeonText size="xs" style={{ color: theme.text.primary }} numberOfLines={1}>
          {player.name}
        </NeonText>
      </View>
    );
  }

  return (
    <View style={styles.playerCard}>
      <View style={[styles.playerBadge, { backgroundColor: theme.primary[500] }]}>
        <NeonText size="sm" style={{ color: theme.text.inverse, fontWeight: 'bold' }}>
          {player.number}
        </NeonText>
      </View>
      <NeonText
        size="sm"
        style={{ color: theme.text.primary, textAlign: 'center', marginTop: spacing[1] }}
        numberOfLines={2}
      >
        {player.name}
      </NeonText>
      <NeonText size="xs" style={{ color: theme.text.tertiary, textAlign: 'center' }}>
        {player.position}
      </NeonText>
    </View>
  );
};

// ============================================================================
// FORMATION DISPLAY COMPONENT
// ============================================================================

interface FormationDisplayProps {
  lineup: TeamLineup;
  teamName: string;
}

const FormationDisplay: React.FC<FormationDisplayProps> = ({ lineup, teamName }) => {
  const { theme } = useTheme();

  // Group players by position
  const groupPlayersByPosition = () => {
    const groups: { [key: string]: Player[] } = {
      GK: [],
      DF: [],
      MF: [],
      FW: [],
    };

    lineup.startingXI.forEach((player) => {
      const pos = player.position.toUpperCase();
      if (groups[pos]) {
        groups[pos].push(player);
      }
    });

    return groups;
  };

  const playerGroups = groupPlayersByPosition();

  return (
    <View style={styles.formationContainer}>
      {/* Team Name & Formation */}
      <View style={styles.formationHeader}>
        <NeonText size="md" color="primary">
          {teamName}
        </NeonText>
        <View style={[styles.formationBadge, { backgroundColor: theme.background.elevated }]}>
          <NeonText size="sm" color="primary">
            {lineup.formation}
          </NeonText>
        </View>
      </View>

      {/* Formation Field */}
      <View style={[styles.field, { borderColor: theme.border.primary }]}>
        {/* Forwards */}
        {playerGroups.FW.length > 0 && (
          <View style={styles.positionRow}>
            {playerGroups.FW.map((player) => (
              <PlayerCard key={player.id} player={player} compact />
            ))}
          </View>
        )}

        {/* Midfielders */}
        {playerGroups.MF.length > 0 && (
          <View style={styles.positionRow}>
            {playerGroups.MF.map((player) => (
              <PlayerCard key={player.id} player={player} compact />
            ))}
          </View>
        )}

        {/* Defenders */}
        {playerGroups.DF.length > 0 && (
          <View style={styles.positionRow}>
            {playerGroups.DF.map((player) => (
              <PlayerCard key={player.id} player={player} compact />
            ))}
          </View>
        )}

        {/* Goalkeeper */}
        {playerGroups.GK.length > 0 && (
          <View style={styles.positionRow}>
            {playerGroups.GK.map((player) => (
              <PlayerCard key={player.id} player={player} compact />
            ))}
          </View>
        )}
      </View>

      {/* Coach */}
      {lineup.coach && (
        <View style={styles.coachInfo}>
          <NeonText size="xs" style={{ color: theme.text.tertiary }}>
            Teknik Direktör: {lineup.coach}
          </NeonText>
        </View>
      )}
    </View>
  );
};

// ============================================================================
// SUBSTITUTES LIST COMPONENT
// ============================================================================

interface SubstitutesListProps {
  substitutes: Player[];
  teamName: string;
}

const SubstitutesList: React.FC<SubstitutesListProps> = ({ substitutes, teamName }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.substitutesContainer}>
      <NeonText size="sm" color="primary" style={styles.subsTitle}>
        Yedekler - {teamName}
      </NeonText>

      <View style={styles.subsList}>
        {substitutes.map((player) => (
          <View
            key={player.id}
            style={[
              styles.subsItem,
              {
                backgroundColor: theme.background.tertiary,
                borderColor: theme.border.primary,
              },
            ]}
          >
            <View style={[styles.subsNumber, { backgroundColor: theme.background.elevated }]}>
              <NeonText size="xs" style={{ color: theme.text.secondary }}>
                {player.number}
              </NeonText>
            </View>
            <NeonText size="sm" style={{ flex: 1, color: theme.text.primary }}>
              {player.name}
            </NeonText>
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              {player.position}
            </NeonText>
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const LineupTab: React.FC<LineupTabProps> = ({
  homeLineup,
  awayLineup,
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

  if (!homeLineup && !awayLineup) {
    return (
      <View style={styles.container}>
        <NoDataAvailable />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Home Team Lineup */}
      {homeLineup && (
        <GlassCard intensity="light" style={styles.card}>
          <FormationDisplay lineup={homeLineup} teamName={homeTeamName} />

          {homeLineup.substitutes.length > 0 && <View style={styles.separator} />}

          {homeLineup.substitutes.length > 0 && (
            <SubstitutesList substitutes={homeLineup.substitutes} teamName={homeTeamName} />
          )}
        </GlassCard>
      )}

      {/* Away Team Lineup */}
      {awayLineup && (
        <GlassCard intensity="light" style={styles.card}>
          <FormationDisplay lineup={awayLineup} teamName={awayTeamName} />

          {awayLineup.substitutes.length > 0 && <View style={styles.separator} />}

          {awayLineup.substitutes.length > 0 && (
            <SubstitutesList substitutes={awayLineup.substitutes} teamName={awayTeamName} />
          )}
        </GlassCard>
      )}
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
    gap: spacing[4],
  },
  card: {
    padding: spacing.lg,
  },
  formationContainer: {
    marginBottom: spacing[4],
  },
  formationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  formationBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  field: {
    borderWidth: 2,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    minHeight: 300,
    justifyContent: 'space-around',
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  playerCard: {
    alignItems: 'center',
    width: 80,
  },
  playerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    maxWidth: 120,
  },
  playerNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachInfo: {
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 196, 30, 0.1)',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(75, 196, 30, 0.1)',
    marginVertical: spacing[4],
  },
  substitutesContainer: {
    marginTop: spacing[2],
  },
  subsTitle: {
    marginBottom: spacing[3],
    fontWeight: '600',
  },
  subsList: {
    gap: spacing[2],
  },
  subsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing[3],
  },
  subsNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default LineupTab;
