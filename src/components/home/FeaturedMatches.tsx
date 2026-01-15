/**
 * FeaturedMatches Component
 * Horizontal carousel of featured/highlighted matches
 */

import React from 'react';
import { View, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { Match } from '../../api/matches.api';
import { GlassCard } from '../atoms/GlassCard';
import { TeamBadge } from '../molecules/TeamBadge';
import { ScoreDisplay } from '../molecules/ScoreDisplay';
import { LiveTicker } from '../molecules/LiveTicker';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export interface FeaturedMatchesProps {
  /** List of featured matches */
  matches: Match[];

  /** Called when a match is pressed */
  onMatchPress?: (matchId: number) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_MARGIN = spacing[4];

// ============================================================================
// COMPONENT
// ============================================================================

export const FeaturedMatches: React.FC<FeaturedMatchesProps> = ({ matches, onMatchPress }) => {
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
  // HELPERS
  // ============================================================================

  const isLive = (statusId: number) => {
    return [2, 3, 4, 5, 7].includes(statusId);
  };

  const getPeriod = (
    statusId: number
  ): 'FIRST_HALF' | 'HALF_TIME' | 'SECOND_HALF' | 'EXTRA_TIME' | 'PENALTIES' | undefined => {
    switch (statusId) {
      case 2:
        return 'FIRST_HALF';
      case 3:
        return 'HALF_TIME';
      case 4:
        return 'SECOND_HALF';
      case 5:
        return 'EXTRA_TIME';
      case 7:
        return 'PENALTIES';
      default:
        return undefined;
    }
  };

  // ============================================================================
  // RENDER MATCH CARD
  // ============================================================================

  const renderMatchCard = ({ item: match }: { item: Match }) => {
    const live = isLive(match.statusId);
    const period = getPeriod(match.statusId);

    return (
      <Pressable
        onPress={() => handleMatchPress(match.id)}
        style={({ pressed }) => [styles.cardContainer, { opacity: pressed ? 0.7 : 1 }]}
      >
        <GlassCard intensity="medium" style={styles.card}>
          {/* Competition Badge */}
          <View style={styles.competitionBadge}>
            <NeonText size="sm" color="primary" style={styles.competitionText}>
              {match.competition.name}
            </NeonText>
          </View>

          {/* Teams */}
          <View style={styles.teamsContainer}>
            <TeamBadge
              logoUrl={match.homeTeam.logo}
              name={match.homeTeam.name}
              layout="vertical"
              size="large"
            />

            <View style={styles.vsContainer}>
              <NeonText size="md" color="primary" glow="small">
                VS
              </NeonText>
            </View>

            <TeamBadge
              logoUrl={match.awayTeam.logo}
              name={match.awayTeam.name}
              layout="vertical"
              size="large"
            />
          </View>

          {/* Score or Kickoff Time */}
          {live && match.homeScore !== null && match.awayScore !== null ? (
            <View style={styles.scoreContainer}>
              <ScoreDisplay
                homeScore={match.homeScore}
                awayScore={match.awayScore}
                size="large"
                isLive={true}
              />
            </View>
          ) : match.ended && match.homeScore !== null && match.awayScore !== null ? (
            <View style={styles.scoreContainer}>
              <ScoreDisplay
                homeScore={match.homeScore}
                awayScore={match.awayScore}
                size="large"
                isLive={false}
              />
            </View>
          ) : (
            <View style={styles.timeContainer}>
              <NeonText size="lg" color="primary">
                {new Date(match.kickoffTime).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </NeonText>
            </View>
          )}

          {/* Live Ticker */}
          {live && period && match.minute !== null && (
            <View style={styles.tickerContainer}>
              <LiveTicker period={period} minute={match.minute} size="medium" />
            </View>
          )}
        </GlassCard>
      </Pressable>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!matches || matches.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        renderItem={renderMatchCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        snapToAlignment="center"
      />
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
  listContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN / 2,
  },
  card: {
    padding: spacing.lg,
    minHeight: 320,
  },
  competitionBadge: {
    alignSelf: 'flex-start',
    marginBottom: spacing[4],
  },
  competitionText: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  vsContainer: {
    marginHorizontal: spacing[4],
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  tickerContainer: {
    alignItems: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default FeaturedMatches;
