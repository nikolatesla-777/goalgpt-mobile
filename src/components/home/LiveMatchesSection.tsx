/**
 * LiveMatchesSection Component
 * Displays live matches with real-time updates
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../constants/theme';
import { Match } from '../../api/matches.api';
import { NeonText } from '../atoms/NeonText';
import { MatchCard } from '../molecules/MatchCard';
import { NoMatchesFound } from '../templates/EmptyState';

// ============================================================================
// TYPES
// ============================================================================

export interface LiveMatchesSectionProps {
  /** List of live matches */
  matches: Match[];

  /** Called when a match is pressed */
  onMatchPress?: (matchId: number) => void;

  /** Show section title */
  showTitle?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LiveMatchesSection: React.FC<LiveMatchesSectionProps> = ({
  matches,
  onMatchPress,
  showTitle = true,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleMatchPress = (matchId: number) => {
    if (onMatchPress) {
      onMatchPress(matchId);
    } else {
      router.push(`/match/${matchId}`);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // Don't render section if no matches
  if (!matches || matches.length === 0) {
    return (
      <View style={styles.container}>
        {showTitle && (
          <View style={styles.header}>
            <NeonText size="lg" color="primary" glow="small">
              🔴 Canlı Maçlar
            </NeonText>
          </View>
        )}
        <NoMatchesFound size="small" actionText="Yenile" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.header}>
          <NeonText size="lg" color="primary" glow="small">
            🔴 Canlı Maçlar
          </NeonText>
          <View style={styles.badge}>
            <NeonText size="sm" color="success">
              {matches.length.toString()}
            </NeonText>
          </View>
        </View>
      )}

      <View style={styles.matchesList}>
        {matches.map((match) => (
          <View key={match.id} style={styles.matchCardWrapper}>
            <MatchCard
              matchId={match.id}
              homeTeam={{
                id: match.homeTeam.id,
                name: match.homeTeam.name,
                logoUrl: match.homeTeam.logo,
              }}
              awayTeam={{
                id: match.awayTeam.id,
                name: match.awayTeam.name,
                logoUrl: match.awayTeam.logo,
              }}
              league={{
                name: match.competition.name,
                logoUrl: match.competition.logo,
              }}
              homeScore={match.homeScore ?? 0}
              awayScore={match.awayScore ?? 0}
              status="live"
              dateTime={match.kickoffTime}
              onPress={() => handleMatchPress(match.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing[4],
  },
  badge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(75, 196, 30, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
  },
  matchesList: {
    gap: spacing[3],
  },
  matchCardWrapper: {
    paddingHorizontal: spacing.md,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default LiveMatchesSection;
