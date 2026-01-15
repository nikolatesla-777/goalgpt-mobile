/**
 * CompactMatchCard Component
 *
 * Compact match card design for LiveMatches screen
 * Follows the reference design with time, teams, scores, and favorite
 */

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Animated } from 'react-native';
import { spacing, typography } from '../../constants/tokens';
import { FavoriteButton } from '../atoms/FavoriteButton';

// ============================================================================
// TYPES
// ============================================================================

export interface CompactMatchCardProps {
  matchId: string | number;
  homeTeam: {
    id?: string | number;
    name: string;
    logo?: string;
    score?: number;
  };
  awayTeam: {
    id?: string | number;
    name: string;
    logo?: string;
    score?: number;
  };
  status: 'live' | 'halftime' | 'finished' | 'upcoming' | 'scheduled';
  time?: string; // Match time like "14:30"
  minute?: number; // Current minute for live matches
  onPress?: () => void;
  showFavorite?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CompactMatchCard: React.FC<CompactMatchCardProps> = ({
  matchId,
  homeTeam,
  awayTeam,
  status,
  time,
  minute,
  onPress,
  showFavorite = true,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // ============================================================================
  // HELPERS
  // ============================================================================

  const isLive = status === 'live' || status === 'halftime';
  const hasScore = homeTeam.score !== undefined && awayTeam.score !== undefined;

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const content = (
    <View style={styles.container}>
      {/* Left: Time & Minute */}
      <View style={styles.leftSection}>
        <Text style={styles.timeText}>{time || '--:--'}</Text>
        {isLive && minute !== undefined && (
          <Text style={styles.minuteText}>{minute}'</Text>
        )}
      </View>

      {/* Center: Teams */}
      <View style={styles.centerSection}>
        {/* Home Team */}
        <View style={styles.teamRow}>
          {homeTeam.logo && (
            <Image
              source={{ uri: homeTeam.logo }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
          )}
          <Text style={styles.teamName} numberOfLines={1}>
            {homeTeam.name}
          </Text>
        </View>

        {/* Away Team */}
        <View style={styles.teamRow}>
          {awayTeam.logo && (
            <Image
              source={{ uri: awayTeam.logo }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
          )}
          <Text style={styles.teamName} numberOfLines={1}>
            {awayTeam.name}
          </Text>
        </View>
      </View>

      {/* Right: Live Indicator & Scores */}
      <View style={styles.rightSection}>
        {/* Live Indicator */}
        {isLive && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveIconContainer}>
              <View style={styles.liveIcon} />
            </View>
          </View>
        )}

        {/* Scores */}
        {hasScore ? (
          <View style={styles.scoresColumn}>
            <Text style={styles.scoreText}>{homeTeam.score}</Text>
            <Text style={styles.scoreText}>{awayTeam.score}</Text>
          </View>
        ) : (
          <View style={styles.scoresColumn}>
            <Text style={styles.vsText}>VS</Text>
          </View>
        )}

        {/* Favorite Button */}
        {showFavorite && (
          <View style={styles.favoriteContainer}>
            <FavoriteButton
              type="match"
              item={{
                matchId,
                homeTeam: homeTeam.name,
                awayTeam: awayTeam.name,
              }}
              size="small"
            />
          </View>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.pressable}
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
  pressable: {
    borderRadius: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  leftSection: {
    width: 60,
    alignItems: 'flex-start',
  },
  timeText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
  },
  minuteText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 14,
    color: '#FF3B30',
  },
  centerSection: {
    flex: 1,
    gap: spacing.xs,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  teamLogo: {
    width: 20,
    height: 20,
  },
  teamName: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveIndicator: {
    width: 28,
    alignItems: 'center',
  },
  liveIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4BC41E',
  },
  scoresColumn: {
    width: 32,
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 20,
    color: '#FF3B30',
    lineHeight: 24,
  },
  vsText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  favoriteContainer: {
    width: 32,
    alignItems: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default CompactMatchCard;
