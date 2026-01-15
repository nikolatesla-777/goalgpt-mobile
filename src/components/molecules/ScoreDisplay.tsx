/**
 * ScoreDisplay Component
 * Displays match scores with monospace typography and neon glow
 * Supports live updates, penalties, and aggregate scores
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NeonText } from '../atoms/NeonText';
import { typography, spacing } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export interface ScoreDisplayProps {
  /** Home team score */
  homeScore: number;

  /** Away team score */
  awayScore: number;

  /** Match is live */
  isLive?: boolean;

  /** Match status text (e.g., "HT", "FT", "45'") */
  statusText?: string;

  /** Show penalty scores */
  homePenalties?: number;
  awayPenalties?: number;

  /** Show aggregate scores */
  homeAggregate?: number;
  awayAggregate?: number;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Highlight winner */
  highlightWinner?: boolean;

  /** Custom container style */
  style?: ViewStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  homeScore,
  awayScore,
  isLive = false,
  statusText,
  homePenalties,
  awayPenalties,
  homeAggregate,
  awayAggregate,
  size = 'medium',
  highlightWinner = false,
  style,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // HELPERS
  // ============================================================================

  const isHomeWinning = homeScore > awayScore;
  const isAwayWinning = awayScore > homeScore;
  const isDraw = homeScore === awayScore;

  const hasPenalties = homePenalties !== undefined && awayPenalties !== undefined;
  const hasAggregate = homeAggregate !== undefined && awayAggregate !== undefined;

  // ============================================================================
  // SIZE CONFIGURATIONS
  // ============================================================================

  const sizeConfig = {
    small: {
      scoreSize: 'xl' as const,
      separatorSize: 'lg' as const,
      statusSize: 'sm' as const,
      penaltySize: 'sm' as const,
      aggregateSize: 'xs' as const,
    },
    medium: {
      scoreSize: '2xl' as const,
      separatorSize: 'xl' as const,
      statusSize: 'base' as const,
      penaltySize: 'base' as const,
      aggregateSize: 'sm' as const,
    },
    large: {
      scoreSize: '4xl' as const,
      separatorSize: '3xl' as const,
      statusSize: 'lg' as const,
      penaltySize: 'lg' as const,
      aggregateSize: 'base' as const,
    },
  };

  const config = sizeConfig[size];

  // ============================================================================
  // STYLES
  // ============================================================================

  const getScoreColor = (isWinning: boolean) => {
    if (!highlightWinner) return 'primary';
    if (isLive) {
      return isWinning ? 'success' : 'primary';
    }
    return isWinning ? 'primary' : 'primary';
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const scoreContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const separatorStyle: TextStyle = {
    marginHorizontal: spacing[3],
  };

  const statusContainerStyle: ViewStyle = {
    marginTop: spacing[1],
    alignItems: 'center',
  };

  const penaltyContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
  };

  const aggregateContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={[containerStyle, style]}>
      {/* Main Score Container */}
      <View>
        {/* Scores */}
        <View style={scoreContainerStyle}>
          {/* Home Score */}
          <NeonText
            type="data"
            color={getScoreColor(isHomeWinning)}
            glow={isLive ? 'medium' : 'small'}
            size={config.scoreSize}
            weight="bold"
          >
            {homeScore}
          </NeonText>

          {/* Separator */}
          <NeonText
            type="data"
            color="primary"
            glow="small"
            size={config.separatorSize}
            style={separatorStyle}
          >
            -
          </NeonText>

          {/* Away Score */}
          <NeonText
            type="data"
            color={getScoreColor(isAwayWinning)}
            glow={isLive ? 'medium' : 'small'}
            size={config.scoreSize}
            weight="bold"
          >
            {awayScore}
          </NeonText>
        </View>

        {/* Penalties */}
        {hasPenalties && (
          <View style={penaltyContainerStyle}>
            <Text
              style={{
                ...typography.dataCaption,
                fontSize: typography.sizes[config.penaltySize],
                color: theme.text.tertiary,
              }}
            >
              ({homePenalties} - {awayPenalties} Pen)
            </Text>
          </View>
        )}

        {/* Aggregate Score */}
        {hasAggregate && (
          <View style={aggregateContainerStyle}>
            <Text
              style={{
                ...typography.dataCaption,
                fontSize: typography.sizes[config.aggregateSize],
                color: theme.text.tertiary,
              }}
            >
              Agg: {homeAggregate} - {awayAggregate}
            </Text>
          </View>
        )}

        {/* Status Text (Time, HT, FT, etc.) */}
        {statusText && (
          <View style={statusContainerStyle}>
            <Text
              style={{
                ...typography.dataSmall,
                fontSize: typography.sizes[config.statusSize],
                color: isLive ? theme.success.main : theme.text.secondary,
                fontFamily: typography.fonts.monoBold,
              }}
            >
              {statusText}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * LiveScoreDisplay
 * Score display specifically for live matches with pulsing effect
 */
export const LiveScoreDisplay: React.FC<Omit<ScoreDisplayProps, 'isLive'>> = (props) => (
  <ScoreDisplay {...props} isLive={true} highlightWinner={true} />
);

/**
 * FinalScoreDisplay
 * Score display for ended matches
 */
export const FinalScoreDisplay: React.FC<Omit<ScoreDisplayProps, 'isLive' | 'statusText'>> = (
  props
) => <ScoreDisplay {...props} isLive={false} statusText="FT" highlightWinner={true} />;

/**
 * CompactScoreDisplay
 * Small score display for lists
 */
export const CompactScoreDisplay: React.FC<Omit<ScoreDisplayProps, 'size'>> = (props) => (
  <ScoreDisplay {...props} size="small" />
);

// ============================================================================
// EXPORT
// ============================================================================

export default ScoreDisplay;
