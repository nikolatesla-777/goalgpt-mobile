/**
 * UpcomingMatchesSection Component
 * Displays upcoming matches grouped by date
 */

import React, { useMemo } from 'react';
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

export interface UpcomingMatchesSectionProps {
  /** List of upcoming matches */
  matches: Match[];

  /** Called when a match is pressed */
  onMatchPress?: (matchId: number) => void;

  /** Show section title */
  showTitle?: boolean;

  /** Maximum number of matches to show */
  limit?: number;
}

interface GroupedMatches {
  [date: string]: Match[];
}

// ============================================================================
// COMPONENT
// ============================================================================

export const UpcomingMatchesSection: React.FC<UpcomingMatchesSectionProps> = ({
  matches,
  onMatchPress,
  showTitle = true,
  limit,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // GROUP MATCHES BY DATE
  // ============================================================================

  const groupedMatches = useMemo(() => {
    if (!matches || matches.length === 0) return {};

    const limitedMatches = limit ? matches.slice(0, limit) : matches;

    return limitedMatches.reduce<GroupedMatches>((groups, match) => {
      const date = new Date(match.kickoffTime).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
      });

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(match);
      return groups;
    }, {});
  }, [matches, limit]);

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
  // HELPERS
  // ============================================================================

  const getRelativeDate = (dateString: string): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    });

    const tomorrowStr = tomorrow.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    });

    if (dateString === todayStr) {
      return `Bugün - ${dateString}`;
    } else if (dateString === tomorrowStr) {
      return `Yarın - ${dateString}`;
    }

    return dateString;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!matches || matches.length === 0) {
    return (
      <View style={styles.container}>
        {showTitle && (
          <View style={styles.header}>
            <NeonText size="lg" color="primary">
              📅 Gelecek Maçlar
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
          <NeonText size="lg" color="primary">
            📅 Gelecek Maçlar
          </NeonText>
        </View>
      )}

      {Object.entries(groupedMatches).map(([date, dateMatches]) => (
        <View key={date} style={styles.dateGroup}>
          {/* Date Header */}
          <View style={styles.dateHeader}>
            <View style={styles.dateLine} />
            <NeonText size="sm" color="primary" style={styles.dateText}>
              {getRelativeDate(date)}
            </NeonText>
            <View style={styles.dateLine} />
          </View>

          {/* Matches for this date */}
          <View style={styles.matchesList}>
            {dateMatches.map((match) => (
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
                  status="upcoming"
                  dateTime={match.kickoffTime}
                  onPress={() => handleMatchPress(match.id)}
                />
              </View>
            ))}
          </View>
        </View>
      ))}
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
    paddingHorizontal: spacing.md,
    marginBottom: spacing[4],
  },
  dateGroup: {
    marginBottom: spacing[6],
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing[3],
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
  },
  dateText: {
    marginHorizontal: spacing[3],
    textTransform: 'capitalize',
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

export default UpcomingMatchesSection;
