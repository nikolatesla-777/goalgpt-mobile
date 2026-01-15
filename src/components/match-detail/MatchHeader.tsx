/**
 * MatchHeader Component
 * Displays match information at the top of match detail screen
 * Shows teams, score, status, and league info
 */

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { GlassCard } from '../atoms/GlassCard';
import { NeonText } from '../atoms/NeonText';
import { TeamBadge } from '../molecules/TeamBadge';
import { ScoreDisplay } from '../molecules/ScoreDisplay';
import { LiveTicker, MatchPeriod } from '../molecules/LiveTicker';

// ============================================================================
// TYPES
// ============================================================================

export interface MatchHeaderProps {
  /** Home team info */
  homeTeam: {
    id: string | number;
    name: string;
    logoUrl?: string;
    shortName?: string;
  };

  /** Away team info */
  awayTeam: {
    id: string | number;
    name: string;
    logoUrl?: string;
    shortName?: string;
  };

  /** League/Competition info */
  league?: {
    name: string;
    logoUrl?: string;
    country?: string;
  };

  /** Match status */
  status: 'live' | 'upcoming' | 'ended';

  /** Home score */
  homeScore?: number;

  /** Away score */
  awayScore?: number;

  /** Match date/time */
  dateTime: string | Date;

  /** Live match info */
  liveInfo?: {
    minute: number;
    period: MatchPeriod;
    additionalTime?: number;
  };

  /** Round/week info */
  round?: string;

  /** Venue */
  venue?: string;

  /** Referee */
  referee?: string;

  /** Penalty scores */
  penalties?: {
    home: number;
    away: number;
  };

  /** Aggregate scores */
  aggregate?: {
    home: number;
    away: number;
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export const MatchHeader: React.FC<MatchHeaderProps> = ({
  homeTeam,
  awayTeam,
  league,
  status,
  homeScore,
  awayScore,
  dateTime,
  liveInfo,
  round,
  venue,
  referee,
  penalties,
  aggregate,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // HELPERS
  // ============================================================================

  const formatDateTime = (dt: string | Date): string => {
    const date = typeof dt === 'string' ? new Date(dt) : dt;

    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (): string => {
    if (status === 'live') return 'CANLI';
    if (status === 'ended') return 'BİTTİ';
    return 'BAŞLAMAMIŞ';
  };

  const getStatusColor = (): 'primary' | 'success' | 'error' => {
    if (status === 'live') return 'success';
    if (status === 'ended') return 'primary';
    return 'primary';
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <GlassCard intensity="medium" style={styles.container}>
      {/* League Info */}
      {league && (
        <View style={styles.leagueSection}>
          {league.logoUrl && (
            <Image
              source={{ uri: league.logoUrl }}
              style={styles.leagueLogo}
              resizeMode="contain"
            />
          )}
          <View style={styles.leagueInfo}>
            <NeonText size="sm" color="primary">
              {league.name}
            </NeonText>
            {round && (
              <NeonText size="xs" style={{ color: theme.text.secondary, marginTop: spacing[1] }}>
                {round}
              </NeonText>
            )}
          </View>
        </View>
      )}

      {/* Status Badge */}
      <View style={styles.statusBadge}>
        <NeonText size="xs" color={getStatusColor()} glow="small">
          {getStatusText()}
        </NeonText>
      </View>

      {/* Teams Section */}
      <View style={styles.teamsSection}>
        {/* Home Team */}
        <View style={styles.teamColumn}>
          <TeamBadge
            name={homeTeam.name}
            logoUrl={homeTeam.logoUrl}
            shortName={homeTeam.shortName}
            layout="vertical"
            size="large"
            showFullName={false}
          />
        </View>

        {/* Score or Time */}
        <View style={styles.scoreColumn}>
          {status === 'live' || status === 'ended' ? (
            <>
              <ScoreDisplay
                homeScore={homeScore ?? 0}
                awayScore={awayScore ?? 0}
                size="large"
                isLive={status === 'live'}
                homePenalties={penalties?.home}
                awayPenalties={penalties?.away}
                homeAggregate={aggregate?.home}
                awayAggregate={aggregate?.away}
                highlightWinner={status === 'ended'}
              />

              {/* Live Ticker */}
              {status === 'live' && liveInfo && (
                <View style={styles.liveTicker}>
                  <LiveTicker
                    period={liveInfo.period}
                    minute={liveInfo.minute}
                    additionalTime={liveInfo.additionalTime}
                    size="medium"
                  />
                </View>
              )}
            </>
          ) : (
            <View style={styles.upcomingTime}>
              <NeonText size="md" color="primary">
                {new Date(dateTime).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </NeonText>
              <NeonText size="sm" style={{ color: theme.text.secondary, marginTop: spacing[1] }}>
                {new Date(dateTime).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'short',
                })}
              </NeonText>
            </View>
          )}
        </View>

        {/* Away Team */}
        <View style={styles.teamColumn}>
          <TeamBadge
            name={awayTeam.name}
            logoUrl={awayTeam.logoUrl}
            shortName={awayTeam.shortName}
            layout="vertical"
            size="large"
            showFullName={false}
          />
        </View>
      </View>

      {/* Additional Info */}
      {(venue || referee) && (
        <View style={styles.additionalInfo}>
          {venue && (
            <View style={styles.infoRow}>
              <NeonText size="xs" style={{ color: theme.text.tertiary }}>
                📍 {venue}
              </NeonText>
            </View>
          )}
          {referee && (
            <View style={styles.infoRow}>
              <NeonText size="xs" style={{ color: theme.text.tertiary }}>
                👤 {referee}
              </NeonText>
            </View>
          )}
        </View>
      )}
    </GlassCard>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  leagueSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.2)',
  },
  leagueLogo: {
    width: 24,
    height: 24,
    marginRight: spacing[3],
  },
  leagueInfo: {
    flex: 1,
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    backgroundColor: 'rgba(75, 196, 30, 0.1)',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.3)',
  },
  teamsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing[4],
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  scoreColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTicker: {
    marginTop: spacing[3],
  },
  upcomingTime: {
    alignItems: 'center',
  },
  additionalInfo: {
    marginTop: spacing[4],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 196, 30, 0.2)',
  },
  infoRow: {
    marginVertical: spacing[1],
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default MatchHeader;
