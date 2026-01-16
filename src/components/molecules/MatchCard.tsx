/**
 * MatchCard Component
 *
 * Molecule component for displaying match information
 * Combines: GlassCard + NeonText + LiveIndicator + Press animation
 * Master Plan v1.0 compliant
 */

import React, { useRef } from 'react';
import { View, Pressable, StyleSheet, Animated, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../atoms/GlassCard';
import { NeonText, LiveIndicator, ScoreText } from '../atoms/NeonText';
import { FavoriteButton } from '../atoms/FavoriteButton';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, typography } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export type MatchStatus = 'live' | 'finished' | 'upcoming' | 'halftime';

export interface MatchCardProps {
  /** Match ID */
  matchId?: string | number;

  /** Home team info */
  homeTeam: {
    id?: string | number;
    name: string;
    logo?: string;
    score?: number;
  };

  /** Away team info */
  awayTeam: {
    id?: string | number;
    name: string;
    logo?: string;
    score?: number;
  };

  /** Match status */
  status: MatchStatus;

  /** Time/minute display (e.g., "45'", "FT", "19:00") */
  time: string;

  /** League name */
  league?: string;

  /** Match date */
  date?: string;

  /** Current minute (for live matches) */
  minute?: number;

  /** Press handler */
  onPress?: () => void;

  /** Disable press */
  disabled?: boolean;

  /** Show favorite button */
  showFavorite?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const MatchCard: React.FC<MatchCardProps> = ({
  matchId,
  homeTeam,
  awayTeam,
  status,
  time,
  league,
  date,
  minute,
  onPress,
  disabled = false,
  showFavorite = true,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isLive = status === 'live';
  const isFinished = status === 'finished';
  const isHalftime = status === 'halftime';

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderStatusBadge = () => {
    if (isLive) {
      return <LiveIndicator />;
    }

    if (isHalftime) {
      return (
        <NeonText color="vip" glow="medium" size="small" weight="bold">
          HT
        </NeonText>
      );
    }

    if (isFinished) {
      return (
        <NeonText color="white" glow="small" size="small" weight="semibold">
          FT
        </NeonText>
      );
    }

    // Upcoming - show time
    return (
      <NeonText color="white" glow="small" size="small" weight="semibold">
        {time}
      </NeonText>
    );
  };

  const renderScore = (score?: number) => {
    if (score === undefined) return null;
    
    return (
      <ScoreText color={isLive ? 'brand' : 'white'}>
        {score}
      </ScoreText>
    );
  };

  const renderMinute = () => {
    if (!isLive || !minute) return null;

    return (
      <NeonText color="live" glow="medium" size="small" weight="bold">
        {minute}'
      </NeonText>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const intensity = isLive ? 'intense' : 'default';

  const content = (
    <GlassCard intensity={intensity} padding={spacing.md}>
      {/* League & Favorite */}
      <View style={styles.headerRow}>
        {league && (
          <View style={styles.leagueRow}>
            <Ionicons name="football-outline" size={14} color="rgba(255, 255, 255, 0.6)" style={{ marginRight: 4 }} />
            <Text style={styles.leagueText}>{league}</Text>
          </View>
        )}
        {showFavorite && matchId && (
          <FavoriteButton
            type="match"
            item={{
              matchId,
              homeTeam: {
                id: homeTeam.id || 0,
                name: homeTeam.name,
                logo: homeTeam.logo,
              },
              awayTeam: {
                id: awayTeam.id || 0,
                name: awayTeam.name,
                logo: awayTeam.logo,
              },
              league,
              date,
              status,
              homeScore: homeTeam.score,
              awayScore: awayTeam.score,
            }}
            size="small"
          />
        )}
      </View>

      {/* Match Info */}
      <View style={styles.matchRow}>
        {/* Home Team */}
        <View style={styles.teamContainer}>
          {homeTeam.logo && (
            <Image
              source={{ uri: homeTeam.logo }}
              style={styles.teamLogoImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.teamName} numberOfLines={1}>
            {homeTeam.name}
          </Text>
          {renderScore(homeTeam.score)}
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          {renderStatusBadge()}
          {renderMinute()}
        </View>

        {/* Away Team */}
        <View style={styles.teamContainer}>
          {awayTeam.logo && (
            <Image
              source={{ uri: awayTeam.logo }}
              style={styles.teamLogoImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.teamName} numberOfLines={1}>
            {awayTeam.name}
          </Text>
          {renderScore(awayTeam.score)}
        </View>
      </View>
    </GlassCard>
  );

  if (onPress && !disabled) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {content}
        </Pressable>
      </Animated.View>
    );
  }

  return content;
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  leagueRow: {
    flex: 1,
  },
  leagueText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: '#FFFFFF',
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogoImage: {
    width: 32,
    height: 32,
    marginBottom: spacing.xs,
  },
  teamName: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default MatchCard;
