/**
 * PredictionCard Component
 *
 * Molecule component for AI bot predictions
 * Combines: MatchCard + Bot Info + Prediction Details
 * Master Plan v1.0 compliant
 */

import React, { useRef } from 'react';
import { View, Pressable, StyleSheet, Animated, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../atoms/GlassCard';
import { NeonText, ScoreText } from '../atoms/NeonText';
import { FavoriteButton } from '../atoms/FavoriteButton';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, typography } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export type PredictionResult = 'win' | 'lose' | 'pending';
export type PredictionTier = 'free' | 'premium' | 'vip';

export interface PredictionCardProps {
  /** Prediction ID */
  predictionId?: string | number;

  /** Match ID */
  matchId?: string | number;

  /** Bot info */
  bot: {
    id: number;
    name: string;
    stats?: string; // e.g., "Beaten Draw +5C4.2"
  };

  /** Match info */
  match: {
    country?: string;
    countryFlag?: string;
    league: string;
    homeTeam: { name: string; logo?: string };
    awayTeam: { name: string; logo?: string };
    homeScore?: number;
    awayScore?: number;
    status: string; // FT, HT, LIVE, etc.
    minute?: number; // Match minute (for LIVE badge)
    time: string; // Time since prediction created (e.g., "88'", "2h")
  };

  /** Prediction details */
  prediction: {
    type: string; // e.g., "IY Ö.5 ÜST"
    confidence?: number; // Confidence percentage
    minute?: string; // e.g., "10'"
    score?: string; // e.g., "0-0"
    result: PredictionResult;
  };

  /** Tier */
  tier?: PredictionTier;

  /** Press handler */
  onPress?: () => void;

  /** Show favorite button */
  showFavorite?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const PredictionCard: React.FC<PredictionCardProps> = ({
  predictionId,
  matchId,
  bot,
  match,
  prediction,
  tier = 'free',
  onPress,
  showFavorite = true,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  const renderTierBadge = () => {
    const tierConfig = {
      free: { text: 'FREE', color: '#8E8E93' },
      premium: { text: 'PREMIUM', color: '#FFD700' },
      vip: { text: 'VIP', color: '#FFA500' },
    };

    const config = tierConfig[tier];

    return (
      <View style={[styles.tierBadge, { borderColor: config.color }]}>
        <Text style={[styles.tierText, { color: config.color }]}>
          {config.text}
        </Text>
      </View>
    );
  };

  const renderResultBadge = () => {
    const resultConfig = {
      win: { text: 'WIN', bg: '#34C759', color: '#000000' },
      lose: { text: 'LOSE', bg: '#FF3B30', color: '#FFFFFF' },
      pending: { text: 'PENDING', bg: '#FFD60A', color: '#000000' },
    };

    const config = resultConfig[prediction.result];

    return (
      <View style={[styles.resultBadge, { backgroundColor: config.bg }]}>
        <Text style={[styles.resultText, { color: config.color }]}>
          {config.text}
        </Text>
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const content = (
    <GlassCard intensity="default" padding={spacing.md}>
      {/* Header: Bot Info */}
      <View style={styles.header}>
        <View style={styles.botInfo}>
          <View style={styles.botIdContainer}>
            <Text style={styles.botIdText}>BOT {bot.id}</Text>
          </View>
          <View style={styles.botDetails}>
            <Text style={styles.botName}>{bot.name}</Text>
            {bot.stats && <Text style={styles.botStats}>{bot.stats}</Text>}
          </View>
        </View>

        <View style={styles.headerRight}>
          {renderTierBadge()}
          {showFavorite && predictionId && matchId && (
            <FavoriteButton
              type="prediction"
              item={{
                predictionId,
                matchId,
                market: 'AI Prediction',
                prediction: prediction.type,
                confidence: prediction.confidence,
                tier,
                result: prediction.result,
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
              }}
              size="small"
            />
          )}
        </View>
      </View>

      {/* League Info */}
      <View style={styles.leagueRow}>
        {match.countryFlag && (
          <Image
            source={{ uri: match.countryFlag }}
            style={styles.countryFlagImage}
            resizeMode="contain"
          />
        )}
        <Text style={styles.countryText}>
          {match.country ? `${match.country}  ` : ''}
          {match.league}
        </Text>
        <Text style={styles.timeText}>{match.time}</Text>
      </View>

      {/* Match Display */}
      <View style={styles.matchRow}>
        {/* Home Team */}
        <View style={styles.teamContainer}>
          {match.homeTeam.logo && (
            <Image
              source={{ uri: match.homeTeam.logo }}
              style={styles.teamLogoImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.teamName} numberOfLines={1}>
            {match.homeTeam.name}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          {match.homeScore !== undefined && match.awayScore !== undefined ? (
            <>
              <Text style={styles.scoreText}>
                {match.homeScore} - {match.awayScore}
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {match.status}
                  {match.status === 'LIVE' && match.minute ? ` ${match.minute}'` : ''}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.vsText}>VS</Text>
          )}
        </View>

        {/* Away Team */}
        <View style={styles.teamContainer}>
          {match.awayTeam.logo && (
            <Image
              source={{ uri: match.awayTeam.logo }}
              style={styles.teamLogoImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.teamName} numberOfLines={1}>
            {match.awayTeam.name}
          </Text>
        </View>
      </View>

      {/* Prediction Details */}
      <View style={styles.predictionRow}>
        {/* Robot Icon */}
        <View style={styles.robotIcon}>
          <Ionicons name="sparkles" size={20} color="#4BC41E" />
        </View>

        {/* Prediction Info */}
        <View style={styles.predictionInfo}>
          <Text style={styles.predictionLabel}>AI TAHMIN</Text>
          <Text style={styles.predictionType}>{prediction.type}</Text>
        </View>

        {/* Minute & Score Badge */}
        {(prediction.minute || prediction.score) && (
          <View style={styles.minuteScoreBadge}>
            <Text style={styles.minuteScoreText}>
              {prediction.minute && `🕐 ${prediction.minute}`}
              {prediction.minute && prediction.score && ' | '}
              {prediction.score}
            </Text>
          </View>
        )}

        {/* Result Badge */}
        <View style={styles.resultBadgeContainer}>{renderResultBadge()}</View>
      </View>
    </GlassCard>
  );

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  botInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  botIdContainer: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: spacing.xs,
  },
  botIdText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 11,
    color: '#4BC41E',
  },
  botDetails: {
    flex: 1,
  },
  botName: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.small,
    color: '#FFFFFF',
  },
  botStats: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: spacing.xs,
  },
  tierText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 10,
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  countryFlag: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  countryFlagImage: {
    width: 16,
    height: 16,
    marginRight: spacing.xs,
  },
  countryText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: '#FFFFFF',
    flex: 1,
  },
  timeText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: '#8E8E93',
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
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
    fontSize: typography.fontSize.button.small,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  scoreText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  vsText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 20,
    color: '#8E8E93',
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  robotIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotEmoji: {
    fontSize: 24,
  },
  predictionInfo: {
    flex: 1,
  },
  predictionLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 2,
  },
  predictionType: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  minuteScoreBadge: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  minuteScoreText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 13,
    color: '#FF3B30',
  },
  resultBadgeContainer: {
    marginLeft: 'auto',
  },
  resultBadge: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 13,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default PredictionCard;
