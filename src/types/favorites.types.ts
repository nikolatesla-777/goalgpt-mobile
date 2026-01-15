/**
 * Favorites Types
 *
 * Type definitions for favorites/bookmarks system
 * Supports matches, predictions, and teams
 */

// ============================================================================
// FAVORITE TYPES
// ============================================================================

export type FavoriteType = 'match' | 'prediction' | 'team';

// ============================================================================
// FAVORITE ITEM BASE
// ============================================================================

export interface FavoriteItemBase {
  id: string | number;
  type: FavoriteType;
  addedAt: string; // ISO timestamp
}

// ============================================================================
// MATCH FAVORITE
// ============================================================================

export interface MatchFavorite extends FavoriteItemBase {
  type: 'match';
  matchId: string | number;
  homeTeam: {
    id: string | number;
    name: string;
    logo?: string;
  };
  awayTeam: {
    id: string | number;
    name: string;
    logo?: string;
  };
  league?: string;
  date?: string;
  status?: string;
  homeScore?: number;
  awayScore?: number;
}

// ============================================================================
// PREDICTION FAVORITE
// ============================================================================

export interface PredictionFavorite extends FavoriteItemBase {
  type: 'prediction';
  predictionId: string | number;
  matchId: string | number;
  market: string;
  prediction: string;
  confidence?: number;
  tier?: 'free' | 'premium' | 'vip';
  result?: 'win' | 'lose' | 'pending';
  homeTeam?: string;
  awayTeam?: string;
}

// ============================================================================
// TEAM FAVORITE
// ============================================================================

export interface TeamFavorite extends FavoriteItemBase {
  type: 'team';
  teamId: string | number;
  name: string;
  logo?: string;
  league?: string;
}

// ============================================================================
// UNION TYPE
// ============================================================================

export type FavoriteItem = MatchFavorite | PredictionFavorite | TeamFavorite;

// ============================================================================
// FAVORITES STORAGE
// ============================================================================

export interface FavoritesStorage {
  matches: MatchFavorite[];
  predictions: PredictionFavorite[];
  teams: TeamFavorite[];
  lastUpdated: string; // ISO timestamp
}

// ============================================================================
// FAVORITES CONTEXT STATE
// ============================================================================

export interface FavoritesState {
  matches: MatchFavorite[];
  predictions: PredictionFavorite[];
  teams: TeamFavorite[];
  isLoading: boolean;
}

// ============================================================================
// FAVORITES CONTEXT ACTIONS
// ============================================================================

export interface FavoritesActions {
  // Add favorites
  addMatchFavorite: (match: Omit<MatchFavorite, 'id' | 'type' | 'addedAt'>) => Promise<void>;
  addPredictionFavorite: (prediction: Omit<PredictionFavorite, 'id' | 'type' | 'addedAt'>) => Promise<void>;
  addTeamFavorite: (team: Omit<TeamFavorite, 'id' | 'type' | 'addedAt'>) => Promise<void>;

  // Remove favorites
  removeMatchFavorite: (matchId: string | number) => Promise<void>;
  removePredictionFavorite: (predictionId: string | number) => Promise<void>;
  removeTeamFavorite: (teamId: string | number) => Promise<void>;

  // Toggle favorites
  toggleMatchFavorite: (match: Omit<MatchFavorite, 'id' | 'type' | 'addedAt'>) => Promise<void>;
  togglePredictionFavorite: (prediction: Omit<PredictionFavorite, 'id' | 'type' | 'addedAt'>) => Promise<void>;
  toggleTeamFavorite: (team: Omit<TeamFavorite, 'id' | 'type' | 'addedAt'>) => Promise<void>;

  // Check if favorited
  isMatchFavorited: (matchId: string | number) => boolean;
  isPredictionFavorited: (predictionId: string | number) => boolean;
  isTeamFavorited: (teamId: string | number) => boolean;

  // Get favorites
  getMatchFavorites: () => MatchFavorite[];
  getPredictionFavorites: () => PredictionFavorite[];
  getTeamFavorites: () => TeamFavorite[];

  // Clear all
  clearAllFavorites: () => Promise<void>;
  clearMatchFavorites: () => Promise<void>;
  clearPredictionFavorites: () => Promise<void>;
  clearTeamFavorites: () => Promise<void>;

  // Refresh from storage
  refreshFavorites: () => Promise<void>;
}

// ============================================================================
// FAVORITES CONTEXT
// ============================================================================

export interface FavoritesContextValue extends FavoritesState, FavoritesActions {}

// ============================================================================
// ASYNC STORAGE KEYS
// ============================================================================

export const FAVORITES_STORAGE_KEY = '@goalgpt_favorites';

// ============================================================================
// EXPORT
// ============================================================================

export default FavoritesContextValue;
