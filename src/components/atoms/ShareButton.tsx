/**
 * ShareButton Component
 * Reusable share button with customizable appearance
 */

import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shareService, ShareResult } from '../../services/share.service';

// ============================================================================
// TYPES
// ============================================================================

export interface ShareButtonProps {
  // Share type
  type: 'match' | 'team' | 'competition' | 'player' | 'ai-bot' | 'prediction' | 'app-invite';

  // Data for each type
  matchData?: {
    id: string | number;
    homeTeam: string;
    awayTeam: string;
    score?: { home: number; away: number };
  };

  teamData?: {
    id: string | number;
    name: string;
  };

  competitionData?: {
    id: string | number;
    name: string;
  };

  playerData?: {
    id: string | number;
    name: string;
    team?: string;
  };

  aiBotData?: {
    name: string;
    winRate: number;
  };

  predictionData?: {
    matchId: string | number;
    homeTeam: string;
    awayTeam: string;
    prediction: string;
    confidence: number;
  };

  // Appearance
  size?: number;
  color?: string;
  showLabel?: boolean;
  iconOnly?: boolean;

  // Callbacks
  onShareSuccess?: (result: ShareResult) => void;
  onShareError?: (error: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ShareButton: React.FC<ShareButtonProps> = ({
  type,
  matchData,
  teamData,
  competitionData,
  playerData,
  aiBotData,
  predictionData,
  size = 24,
  color = '#2196F3',
  iconOnly = false,
  onShareSuccess,
  onShareError,
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;

    setIsSharing(true);

    try {
      let result: ShareResult;

      switch (type) {
        case 'match':
          if (!matchData) throw new Error('Match data is required');
          result = await shareService.shareMatch(
            matchData.id,
            matchData.homeTeam,
            matchData.awayTeam,
            matchData.score
          );
          break;

        case 'team':
          if (!teamData) throw new Error('Team data is required');
          result = await shareService.shareTeam(teamData.id, teamData.name);
          break;

        case 'competition':
          if (!competitionData) throw new Error('Competition data is required');
          result = await shareService.shareCompetition(competitionData.id, competitionData.name);
          break;

        case 'player':
          if (!playerData) throw new Error('Player data is required');
          result = await shareService.sharePlayer(
            playerData.id,
            playerData.name,
            playerData.team
          );
          break;

        case 'ai-bot':
          if (!aiBotData) throw new Error('AI bot data is required');
          result = await shareService.shareAIBot(aiBotData.name, aiBotData.winRate);
          break;

        case 'prediction':
          if (!predictionData) throw new Error('Prediction data is required');
          result = await shareService.sharePrediction(
            predictionData.matchId,
            predictionData.homeTeam,
            predictionData.awayTeam,
            predictionData.prediction,
            predictionData.confidence
          );
          break;

        case 'app-invite':
          result = await shareService.shareAppInvite();
          break;

        default:
          throw new Error('Invalid share type');
      }

      if (result.success) {
        onShareSuccess?.(result);
      } else if (result.error) {
        onShareError?.(result.error);
        Alert.alert('Share Failed', result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share';
      onShareError?.(errorMessage);
      Alert.alert('Share Failed', errorMessage);
    } finally {
      setIsSharing(false);
    }
  };

  if (iconOnly) {
    return (
      <TouchableOpacity
        onPress={handleShare}
        disabled={isSharing}
        style={styles.iconButton}
        activeOpacity={0.7}
      >
        {isSharing ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <Ionicons name="share-outline" size={size} color={color} />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleShare}
      disabled={isSharing}
      style={[styles.button, { borderColor: color }]}
      activeOpacity={0.7}
    >
      {isSharing ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons name="share-outline" size={size} color={color} />
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  iconButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShareButton;
