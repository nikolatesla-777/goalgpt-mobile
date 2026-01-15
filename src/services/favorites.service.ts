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
    console.error('❌ Failed to load favorites:', error);
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
    console.log('✅ Favorites saved');
  } catch (error) {
    console.error('❌ Failed to save favorites:', error);
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
      console.log('⚠️ Match already favorited');
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

    console.log('✅ Match added to favorites:', match.matchId);
    return newFavorite;
  } catch (error) {
    console.error('❌ Failed to add match favorite:', error);
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

    console.log('✅ Match removed from favorites:', matchId);
  } catch (error) {
    console.error('❌ Failed to remove match favorite:', error);
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
    console.error('❌ Failed to check match favorite:', error);
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
    console.error('❌ Failed to get match favorites:', error);
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
      console.log('⚠️ Prediction already favorited');
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

    console.log('✅ Prediction added to favorites:', prediction.predictionId);
    return newFavorite;
  } catch (error) {
    console.error('❌ Failed to add prediction favorite:', error);
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

    console.log('✅ Prediction removed from favorites:', predictionId);
  } catch (error) {
    console.error('❌ Failed to remove prediction favorite:', error);
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
    console.error('❌ Failed to check prediction favorite:', error);
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
    console.error('❌ Failed to get prediction favorites:', error);
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
      console.log('⚠️ Team already favorited');
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

    console.log('✅ Team added to favorites:', team.teamId);
    return newFavorite;
  } catch (error) {
    console.error('❌ Failed to add team favorite:', error);
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

    console.log('✅ Team removed from favorites:', teamId);
  } catch (error) {
    console.error('❌ Failed to remove team favorite:', error);
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
    console.error('❌ Failed to check team favorite:', error);
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
    console.error('❌ Failed to get team favorites:', error);
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
    console.log('✅ All favorites cleared');
  } catch (error) {
    console.error('❌ Failed to clear favorites:', error);
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
    console.log('✅ Match favorites cleared');
  } catch (error) {
    console.error('❌ Failed to clear match favorites:', error);
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
    console.log('✅ Prediction favorites cleared');
  } catch (error) {
    console.error('❌ Failed to clear prediction favorites:', error);
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
    console.log('✅ Team favorites cleared');
  } catch (error) {
    console.error('❌ Failed to clear team favorites:', error);
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
