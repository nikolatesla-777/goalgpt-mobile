/**
 * LiveMatchCard Component
 * Displays live match with real-time score updates
 *
 * Phase 11: Optimized with React.memo and useCallback
 */

import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { GlassCard } from '../atoms/GlassCard';
import { NeonText } from '../atoms/NeonText';
import { TeamBadge } from '../molecules/TeamBadge';

// ============================================================================
// TYPES
// ============================================================================

export interface LiveMatch {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    logoUrl?: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logoUrl?: string;
  };
  homeScore: number;
  awayScore: number;
  statusId: number;
  minute?: number;
  league: {
    id: number;
    name: string;
    logoUrl?: string;
    country?: string;
  };
  hasRedCard?: boolean;
  hasPenalty?: boolean;
  recentEvents?: {
    type: 'goal' | 'red_card' | 'yellow_card';
    minute: number;
    team: 'home' | 'away';
  }[];
}

export interface LiveMatchCardProps {
  match: LiveMatch;
  compact?: boolean;
  showLeague?: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getStatusText = (statusId: number): string => {
  switch (statusId) {
    case 2:
      return 'İlk Yarı';
    case 3:
      return 'Devre Arası';
    case 4:
      return 'İkinci Yarı';
    case 5:
      return 'Uzatma';
    case 7:
      return 'Penaltılar';
    default:
      return 'Canlı';
  }
};

const getMinuteDisplay = (minute?: number, statusId?: number): string => {
  if (!minute) return '';
  if (statusId === 3) return 'HT'; // Half Time
  if (statusId === 5) return `${minute + 90}'`; // Extra Time
  return `${minute}'`;
};

// ============================================================================
// COMPONENT
// ============================================================================

export const LiveMatchCard: React.FC<LiveMatchCardProps> = memo(({
  match,
  compact = false,
  showLeague = true,
}) => {
  const { theme } = useTheme();
  const router = useRouter();

  // Memoize press handler to prevent re-renders
  const handlePress = useCallback(() => {
    router.push(`/match/${match.id}`);
  }, [match.id, router]);

  // Memoize status text to avoid recalculation
  const statusText = useMemo(() => getStatusText(match.statusId), [match.statusId]);
  const minuteDisplay = useMemo(
    () => getMinuteDisplay(match.minute, match.statusId),
    [match.minute, match.statusId]
  );

  // Memoize indicators visibility
  const hasIndicators = useMemo(
    () => match.hasRedCard || match.hasPenalty || (match.recentEvents && match.recentEvents.length > 0),
    [match.hasRedCard, match.hasPenalty, match.recentEvents]
  );

  // ============================================================================
  // COMPACT VERSION
  // ============================================================================

  if (compact) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <GlassCard intensity="light" style={styles.compactCard}>
          <View style={styles.compactContent}>
            {/* Live Indicator */}
            <View style={styles.compactLiveSection}>
              <View style={[styles.liveDot, { backgroundColor: theme.live.indicator }]} />
              <NeonText size="small" style={{ color: theme.live.text, fontWeight: '600' }}>
                {minuteDisplay}
              </NeonText>
            </View>

            {/* Teams */}
            <View style={styles.compactTeams}>
              <View style={styles.compactTeam}>
                <TeamBadge
                  name={match.homeTeam.name}
                  logoUrl={match.homeTeam.logoUrl}
                  size="small"
                  showFullName={false}
                />
                <NeonText size="sm" style={{ color: theme.text.primary }} numberOfLines={1}>
                  {match.homeTeam.name}
                </NeonText>
              </View>
              <View style={styles.compactTeam}>
                <TeamBadge
                  name={match.awayTeam.name}
                  logoUrl={match.awayTeam.logoUrl}
                  size="small"
                  showFullName={false}
                />
                <NeonText size="sm" style={{ color: theme.text.primary }} numberOfLines={1}>
                  {match.awayTeam.name}
                </NeonText>
              </View>
            </View>

            {/* Score */}
            <View style={styles.compactScore}>
              <NeonText size="xl" color="primary" style={{ fontWeight: 'bold' }}>
                {match.homeScore}
              </NeonText>
              <NeonText size="sm" style={{ color: theme.text.tertiary }}>
                -
              </NeonText>
              <NeonText size="xl" color="primary" style={{ fontWeight: 'bold' }}>
                {match.awayScore}
              </NeonText>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  }

  // ============================================================================
  // FULL VERSION
  // ============================================================================

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <GlassCard intensity="light" style={styles.card}>
        {/* League Info */}
        {showLeague && (
          <View style={styles.leagueSection}>
            {match.league.logoUrl && (
              <TeamBadge
                name={match.league.name}
                logoUrl={match.league.logoUrl}
                size="small"
                showFullName={false}
              />
            )}
            <NeonText size="xs" style={{ color: theme.text.tertiary }}>
              {match.league.name}
            </NeonText>
            {match.league.country && (
              <NeonText size="xs" style={{ color: theme.text.tertiary }}>
                • {match.league.country}
              </NeonText>
            )}
          </View>
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Live Status */}
          <View style={styles.liveSection}>
            <View style={[styles.liveBadge, { backgroundColor: theme.live.background }]}>
              <View style={[styles.liveDotLarge, { backgroundColor: theme.live.indicator }]} />
              <NeonText size="sm" style={{ color: theme.live.text, fontWeight: '600' }}>
                CANLI
              </NeonText>
            </View>

            <View style={styles.minuteSection}>
              <NeonText size="lg" color="primary" style={{ fontWeight: 'bold' }}>
                {minuteDisplay}
              </NeonText>
              <NeonText size="small" style={{ color: theme.text.tertiary }}>
                {statusText}
              </NeonText>
            </View>
          </View>

          {/* Teams & Score */}
          <View style={styles.teamsSection}>
            {/* Home Team */}
            <View style={styles.teamRow}>
              <View style={styles.teamInfo}>
                <TeamBadge
                  name={match.homeTeam.name}
                  logoUrl={match.homeTeam.logoUrl}
                  size="medium"
                  showFullName={false}
                />
                <NeonText size="md" style={{ color: theme.text.primary, fontWeight: '600' }}>
                  {match.homeTeam.name}
                </NeonText>
              </View>
              <NeonText size="2xl" color="primary" style={{ fontWeight: 'bold' }}>
                {match.homeScore}
              </NeonText>
            </View>

            {/* Away Team */}
            <View style={styles.teamRow}>
              <View style={styles.teamInfo}>
                <TeamBadge
                  name={match.awayTeam.name}
                  logoUrl={match.awayTeam.logoUrl}
                  size="medium"
                  showFullName={false}
                />
                <NeonText size="md" style={{ color: theme.text.primary, fontWeight: '600' }}>
                  {match.awayTeam.name}
                </NeonText>
              </View>
              <NeonText size="2xl" color="primary" style={{ fontWeight: 'bold' }}>
                {match.awayScore}
              </NeonText>
            </View>
          </View>

          {/* Indicators */}
          {hasIndicators && (
            <View style={styles.indicatorsSection}>
              {match.hasRedCard && (
                <View style={[styles.indicator, { backgroundColor: theme.error.bg }]}>
                  <NeonText size="small" style={{ color: theme.error.main }}>
                    🟥 Kırmızı Kart
                  </NeonText>
                </View>
              )}
              {match.hasPenalty && (
                <View style={[styles.indicator, { backgroundColor: theme.warning.bg }]}>
                  <NeonText size="small" style={{ color: theme.warning.main }}>
                    ⚽ Penaltı
                  </NeonText>
                </View>
              )}
              {match.recentEvents && match.recentEvents.length > 0 && (
                <View style={[styles.indicator, { backgroundColor: theme.primary[500] + '20' }]}>
                  <NeonText size="small" style={{ color: theme.primary[500] }}>
                    ⚡ {match.recentEvents[0].type === 'goal' ? 'GOL!' : 'OLAY!'}
                  </NeonText>
                </View>
              )}
            </View>
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  // Only re-render if these specific fields change
  return (
    prevProps.match.id === nextProps.match.id &&
    prevProps.match.homeScore === nextProps.match.homeScore &&
    prevProps.match.awayScore === nextProps.match.awayScore &&
    prevProps.match.minute === nextProps.match.minute &&
    prevProps.match.statusId === nextProps.match.statusId &&
    prevProps.match.hasRedCard === nextProps.match.hasRedCard &&
    prevProps.match.hasPenalty === nextProps.match.hasPenalty &&
    prevProps.compact === nextProps.compact &&
    prevProps.showLeague === nextProps.showLeague
  );
});

LiveMatchCard.displayName = 'LiveMatchCard';

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Full Card
  card: {
    padding: spacing.lg,
    marginBottom: spacing[3],
  },
  leagueSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.1)',
  },
  mainContent: {
    gap: spacing[3],
  },
  liveSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  liveDotLarge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  minuteSection: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  teamsSection: {
    gap: spacing[3],
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  indicatorsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  indicator: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },

  // Compact Card
  compactCard: {
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  compactLiveSection: {
    alignItems: 'center',
    gap: spacing[1],
    width: 50,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  compactTeams: {
    flex: 1,
    gap: spacing[2],
  },
  compactTeam: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  compactScore: {
    alignItems: 'center',
    gap: spacing[1],
    minWidth: 60,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default LiveMatchCard;
