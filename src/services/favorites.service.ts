/**
 * Favorites Service
 *
 * Service for managing favorites using AsyncStorage
 * Supports matches, predictions, and teams
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  FavoritesStorage,
  MatchFavorite,
  PredictionFavorite,
  TeamFavorite,
  FAVORITES_STORAGE_KEY,
} from '../types/favorites.types';
import { logger } from '../utils/logger';

// ============================================================================
// STORAGE KEY
// ============================================================================

const STORAGE_KEY = '@goalgpt_favorites';

// ============================================================================
// DEFAULT STORAGE
// ============================================================================

const DEFAULT_STORAGE: FavoritesStorage = {
  matches: [],
  predictions: [],
  teams: [],
  lastUpdated: new Date().toISOString(),
};

// ============================================================================
// LOAD FAVORITES FROM STORAGE
// ============================================================================

export async function loadFavorites(): Promise<FavoritesStorage> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) {
      return DEFAULT_STORAGE;
    }

    const parsed: FavoritesStorage = JSON.parse(data);
    return parsed;
  } catch (error) {
    logger.error('Failed to load favorites:', error as Error);
    return DEFAULT_STORAGE;
  }
}

// ============================================================================
// SAVE FAVORITES TO STORAGE
// ============================================================================

export async function saveFavorites(favorites: FavoritesStorage): Promise<void> {
  try {
    const data = JSON.stringify({
      ...favorites,
      lastUpdated: new Date().toISOString(),
    });
    await AsyncStorage.setItem(STORAGE_KEY, data);
    logger.debug('[Favorites] Saved');
  } catch (error) {
    logger.error('Failed to save favorites:', error as Error);
    throw error;
  }
}

// ============================================================================
// MATCH FAVORITES
// ============================================================================

/**
 * Add a match to favorites
 */
export async function addMatchFavorite(
  match: Omit<MatchFavorite, 'id' | 'type' | 'addedAt'>
): Promise<MatchFavorite> {
  try {
    const favorites = await loadFavorites();

    // Check if already favorited
    const exists = favorites.matches.find((m) => m.matchId === match.matchId);
    if (exists) {
      logger.debug('[Favorites] Match already favorited');
      return exists;
    }

    // Create new favorite
    const newFavorite: MatchFavorite = {
      ...match,
      id: `match_${match.matchId}_${Date.now()}`,
      type: 'match',
      addedAt: new Date().toISOString(),
    };

    // Add to favorites
    favorites.matches.unshift(newFavorite); // Add to beginning

    // Save
    await saveFavorites(favorites);

    logger.debug('[Favorites] Match added:', { matchId: match.matchId });
    return newFavorite;
  } catch (error) {
    logger.error('Failed to add match favorite:', error as Error);
    throw error;
  }
}

/**
 * Remove a match from favorites
 */
export async function removeMatchFavorite(matchId: string | number): Promise<void> {
  try {
    const favorites = await loadFavorites();

    // Filter out the match
    favorites.matches = favorites.matches.filter((m) => m.matchId !== matchId);

    // Save
    await saveFavorites(favorites);

    logger.debug('[Favorites] Match removed:', { matchId });
  } catch (error) {
    logger.error('Failed to remove match favorite:', error as Error);
    throw error;
  }
}

/**
 * Check if a match is favorited
 */
export async function isMatchFavorited(matchId: string | number): Promise<boolean> {
  try {
    const favorites = await loadFavorites();
    return favorites.matches.some((m) => m.matchId === matchId);
  } catch (error) {
    logger.error('Failed to check match favorite:', error as Error);
    return false;
  }
}

/**
 * Get all match favorites
 */
export async function getMatchFavorites(): Promise<MatchFavorite[]> {
  try {
    const favorites = await loadFavorites();
    return favorites.matches;
  } catch (error) {
    logger.error('Failed to get match favorites:', error as Error);
    return [];
  }
}

// ============================================================================
// PREDICTION FAVORITES
// ============================================================================

/**
 * Add a prediction to favorites
 */
export async function addPredictionFavorite(
  prediction: Omit<PredictionFavorite, 'id' | 'type' | 'addedAt'>
): Promise<PredictionFavorite> {
  try {
    const favorites = await loadFavorites();

    // Check if already favorited
    const exists = favorites.predictions.find((p) => p.predictionId === prediction.predictionId);
    if (exists) {
      logger.debug('[Favorites] Prediction already favorited');
      return exists;
    }

    // Create new favorite
    const newFavorite: PredictionFavorite = {
      ...prediction,
      id: `prediction_${prediction.predictionId}_${Date.now()}`,
      type: 'prediction',
      addedAt: new Date().toISOString(),
    };

    // Add to favorites
    favorites.predictions.unshift(newFavorite);

    // Save
    await saveFavorites(favorites);

    logger.debug('[Favorites] Prediction added:', { predictionId: prediction.predictionId });
    return newFavorite;
  } catch (error) {
    logger.error('Failed to add prediction favorite:', error as Error);
    throw error;
  }
}

/**
 * Remove a prediction from favorites
 */
export async function removePredictionFavorite(predictionId: string | number): Promise<void> {
  try {
    const favorites = await loadFavorites();

    // Filter out the prediction
    favorites.predictions = favorites.predictions.filter((p) => p.predictionId !== predictionId);

    // Save
    await saveFavorites(favorites);

    logger.debug('[Favorites] Prediction removed:', { predictionId });
  } catch (error) {
    logger.error('Failed to remove prediction favorite:', error as Error);
    throw error;
  }
}

/**
 * Check if a prediction is favorited
 */
export async function isPredictionFavorited(predictionId: string | number): Promise<boolean> {
  try {
    const favorites = await loadFavorites();
    return favorites.predictions.some((p) => p.predictionId === predictionId);
  } catch (error) {
    logger.error('Failed to check prediction favorite:', error as Error);
    return false;
  }
}

/**
 * Get all prediction favorites
 */
export async function getPredictionFavorites(): Promise<PredictionFavorite[]> {
  try {
    const favorites = await loadFavorites();
    return favorites.predictions;
  } catch (error) {
    logger.error('Failed to get prediction favorites:', error as Error);
    return [];
  }
}

// ============================================================================
// TEAM FAVORITES
// ============================================================================

/**
 * Add a team to favorites
 */
export async function addTeamFavorite(
  team: Omit<TeamFavorite, 'id' | 'type' | 'addedAt'>
): Promise<TeamFavorite> {
  try {
    const favorites = await loadFavorites();

    // Check if already favorited
    const exists = favorites.teams.find((t) => t.teamId === team.teamId);
    if (exists) {
      logger.debug('[Favorites] Team already favorited');
      return exists;
    }

    // Create new favorite
    const newFavorite: TeamFavorite = {
      ...team,
      id: `team_${team.teamId}_${Date.now()}`,
      type: 'team',
      addedAt: new Date().toISOString(),
    };

    // Add to favorites
    favorites.teams.unshift(newFavorite);

    // Save
    await saveFavorites(favorites);

    logger.debug('[Favorites] Team added:', { teamId: team.teamId });
    return newFavorite;
  } catch (error) {
    logger.error('Failed to add team favorite:', error as Error);
    throw error;
  }
}

/**
 * Remove a team from favorites
 */
export async function removeTeamFavorite(teamId: string | number): Promise<void> {
  try {
    const favorites = await loadFavorites();

    // Filter out the team
    favorites.teams = favorites.teams.filter((t) => t.teamId !== teamId);

    // Save
    await saveFavorites(favorites);

    logger.debug('[Favorites] Team removed:', { teamId });
  } catch (error) {
    logger.error('Failed to remove team favorite:', error as Error);
    throw error;
  }
}

/**
 * Check if a team is favorited
 */
export async function isTeamFavorited(teamId: string | number): Promise<boolean> {
  try {
    const favorites = await loadFavorites();
    return favorites.teams.some((t) => t.teamId === teamId);
  } catch (error) {
    logger.error('Failed to check team favorite:', error as Error);
    return false;
  }
}

/**
 * Get all team favorites
 */
export async function getTeamFavorites(): Promise<TeamFavorite[]> {
  try {
    const favorites = await loadFavorites();
    return favorites.teams;
  } catch (error) {
    logger.error('Failed to get team favorites:', error as Error);
    return [];
  }
}

// ============================================================================
// CLEAR FAVORITES
// ============================================================================

/**
 * Clear all favorites
 */
export async function clearAllFavorites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    logger.debug('[Favorites] All cleared');
  } catch (error) {
    logger.error('Failed to clear favorites:', error as Error);
    throw error;
  }
}

/**
 * Clear match favorites only
 */
export async function clearMatchFavorites(): Promise<void> {
  try {
    const favorites = await loadFavorites();
    favorites.matches = [];
    await saveFavorites(favorites);
    logger.debug('[Favorites] Match favorites cleared');
  } catch (error) {
    logger.error('Failed to clear match favorites:', error as Error);
    throw error;
  }
}

/**
 * Clear prediction favorites only
 */
export async function clearPredictionFavorites(): Promise<void> {
  try {
    const favorites = await loadFavorites();
    favorites.predictions = [];
    await saveFavorites(favorites);
    logger.debug('[Favorites] Prediction favorites cleared');
  } catch (error) {
    logger.error('Failed to clear prediction favorites:', error as Error);
    throw error;
  }
}

/**
 * Clear team favorites only
 */
export async function clearTeamFavorites(): Promise<void> {
  try {
    const favorites = await loadFavorites();
    favorites.teams = [];
    await saveFavorites(favorites);
    logger.debug('[Favorites] Team favorites cleared');
  } catch (error) {
    logger.error('Failed to clear team favorites:', error as Error);
    throw error;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  // Load/Save
  loadFavorites,
  saveFavorites,

  // Matches
  addMatchFavorite,
  removeMatchFavorite,
  isMatchFavorited,
  getMatchFavorites,

  // Predictions
  addPredictionFavorite,
  removePredictionFavorite,
  isPredictionFavorited,
  getPredictionFavorites,

  // Teams
  addTeamFavorite,
  removeTeamFavorite,
  isTeamFavorited,
  getTeamFavorites,

  // Clear
  clearAllFavorites,
  clearMatchFavorites,
  clearPredictionFavorites,
  clearTeamFavorites,
};
