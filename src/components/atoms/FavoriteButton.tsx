/**
 * FavoriteButton Component
 *
 * Heart icon button for adding/removing favorites
 * Supports matches, predictions, and teams
 */

import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFavorites } from '../../context/FavoritesContext';
import type { MatchFavorite, PredictionFavorite, TeamFavorite } from '../../types/favorites.types';

// ============================================================================
// TYPES
// ============================================================================

type FavoriteButtonSize = 'small' | 'medium' | 'large';

interface BaseFavoriteButtonProps {
  size?: FavoriteButtonSize;
  onToggle?: (isFavorited: boolean) => void;
}

// Match variant
interface MatchFavoriteButtonProps extends BaseFavoriteButtonProps {
  type: 'match';
  item: Omit<MatchFavorite, 'id' | 'type' | 'addedAt'>;
}

// Prediction variant
interface PredictionFavoriteButtonProps extends BaseFavoriteButtonProps {
  type: 'prediction';
  item: Omit<PredictionFavorite, 'id' | 'type' | 'addedAt'>;
}

// Team variant
interface TeamFavoriteButtonProps extends BaseFavoriteButtonProps {
  type: 'team';
  item: Omit<TeamFavorite, 'id' | 'type' | 'addedAt'>;
}

type FavoriteButtonProps =
  | MatchFavoriteButtonProps
  | PredictionFavoriteButtonProps
  | TeamFavoriteButtonProps;

// ============================================================================
// COMPONENT
// ============================================================================

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  type,
  item,
  size = 'medium',
  onToggle,
}) => {
  const favorites = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // CHECK IF FAVORITED
  // ============================================================================

  const isFavorited = (() => {
    switch (type) {
      case 'match':
        return favorites.isMatchFavorited((item as any).matchId);
      case 'prediction':
        return favorites.isPredictionFavorited((item as any).predictionId);
      case 'team':
        return favorites.isTeamFavorited((item as any).teamId);
      default:
        return false;
    }
  })();

  // ============================================================================
  // TOGGLE HANDLER
  // ============================================================================

  const handleToggle = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      switch (type) {
        case 'match':
          await favorites.toggleMatchFavorite(item as any);
          break;
        case 'prediction':
          await favorites.togglePredictionFavorite(item as any);
          break;
        case 'team':
          await favorites.toggleTeamFavorite(item as any);
          break;
      }

      onToggle?.(!isFavorited);
    } catch (error) {
      console.error('❌ Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const iconSize = (() => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  })();

  const containerSize = iconSize + 16;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
        },
        isFavorited && styles.containerActive,
      ]}
      onPress={handleToggle}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#4BC41E" />
      ) : (
        <Text style={[styles.icon, { fontSize: iconSize }]}>
          {isFavorited ? '❤️' : '🤍'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  containerActive: {
    backgroundColor: 'rgba(75, 196, 30, 0.15)',
    borderColor: 'rgba(75, 196, 30, 0.3)',
  },
  icon: {
    textAlign: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default FavoriteButton;
