/**
 * MatchDetailHeader Component
 *
 * Organism component for match detail page header
 * Full match display with teams, score, status, league info
 * Master Plan v1.0 compliant
 */

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { TeamHeader } from '../molecules/TeamHeader';
import { LiveBadge, type BadgeStatus } from '../molecules/LiveBadge';
import { typography, spacing, glassmorphism } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface Team {
  id: string | number;
  name: string;
  logo?: string;
  score?: number;
  countryFlag?: string;
}

export interface MatchDetailHeaderProps {
  /** Home team info */
  homeTeam: Team;

  /** Away team info */
  awayTeam: Team;

  /** Match status */
  status: BadgeStatus;

  /** Current minute (for live matches) */
  minute?: number;

  /** Match time or status text */
  time?: string;

  /** League name */
  league?: string;

  /** League logo */
  leagueLogo?: string;

  /** Match date */
  date?: string;

  /** Stadium name */
  stadium?: string;

  /** Referee name */
  referee?: string;

  /** On press callback */
  onPress?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const MatchDetailHeader: React.FC<MatchDetailHeaderProps> = ({
  homeTeam,
  awayTeam,
  status,
  minute,
  time,
  league,
  leagueLogo,
  date,
  stadium,
  referee,
  onPress,
}) => {
  // ============================================================================
  // RENDER SCORE
  // ============================================================================

  const renderScore = () => {
    const homeScore = homeTeam.score ?? 0;
    const awayScore = awayTeam.score ?? 0;

    // Different styling based on status
    const isLive = status === 'live';
    const isFinished = status === 'finished';

    return (
      <View style={styles.scoreContainer}>
        {/* Home Score */}
        <Text
          style={[
            styles.score,
            isLive && styles.scoreLive,
            isFinished && styles.scoreFinished,
          ]}
        >
          {homeScore}
        </Text>

        {/* Separator */}
        <Text style={styles.scoreSeparator}>-</Text>

        {/* Away Score */}
        <Text
          style={[
            styles.score,
            isLive && styles.scoreLive,
            isFinished && styles.scoreFinished,
          ]}
        >
          {awayScore}
        </Text>
      </View>
    );
  };

  // ============================================================================
  // RENDER MATCH INFO
  // ============================================================================

  const renderMatchInfo = () => {
    return (
      <View style={styles.matchInfoContainer}>
        {/* League */}
        {league && (
          <View style={styles.leagueRow}>
            {leagueLogo && (
              <Image
                source={{ uri: leagueLogo }}
                style={styles.leagueLogoImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.leagueText}>{league}</Text>
          </View>
        )}

        {/* Date */}
        {date && <Text style={styles.infoText}>{date}</Text>}

        {/* Stadium */}
        {stadium && (
          <Text style={styles.infoText}>
            🏟️ {stadium}
          </Text>
        )}

        {/* Referee */}
        {referee && (
          <Text style={styles.infoText}>
            👤 {referee}
          </Text>
        )}
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const Container = onPress ? Pressable : View;

  return (
    <Container
      style={styles.container}
      onPress={onPress}
      // @ts-ignore - Pressable props
      android_ripple={{ color: 'rgba(75, 196, 30, 0.1)' }}
    >
      {/* Glass Background */}
      <View style={styles.glassCard}>
        {/* Teams Section */}
        <View style={styles.teamsSection}>
          {/* Home Team */}
          <View style={styles.teamContainer}>
            <TeamHeader
              name={homeTeam.name}
              logo={homeTeam.logo}
              countryFlag={homeTeam.countryFlag}
              direction="vertical"
              size="large"
              align="center"
            />
          </View>

          {/* Center Section - Score + Status */}
          <View style={styles.centerSection}>
            {/* Status Badge */}
            <View style={styles.statusBadge}>
              <LiveBadge status={status} minute={minute} text={time} />
            </View>

            {/* Score */}
            {renderScore()}
          </View>

          {/* Away Team */}
          <View style={styles.teamContainer}>
            <TeamHeader
              name={awayTeam.name}
              logo={awayTeam.logo}
              countryFlag={awayTeam.countryFlag}
              direction="vertical"
              size="large"
              align="center"
            />
          </View>
        </View>

        {/* Match Info Section */}
        {(league || date || stadium || referee) && (
          <View style={styles.divider} />
        )}
        {renderMatchInfo()}
      </View>
    </Container>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  glassCard: {
    ...glassmorphism.default,
    borderRadius: 16,
    padding: spacing.lg,
  },
  teamsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  statusBadge: {
    marginBottom: spacing.sm,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 48,
    color: '#FFFFFF',
    textAlign: 'center',
    minWidth: 60,
  },
  scoreLive: {
    color: '#4BC41E',
    textShadowColor: 'rgba(75, 196, 30, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  scoreFinished: {
    color: '#FFFFFF',
  },
  scoreSeparator: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 36,
    color: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: spacing.md,
  },
  matchInfoContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  leagueLogoImage: {
    width: 20,
    height: 20,
  },
  leagueText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
  },
  infoText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default MatchDetailHeader;
