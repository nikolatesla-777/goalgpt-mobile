/**
 * Favorites Context
 *
 * Global state management for favorites/bookmarks
 * Uses AsyncStorage for persistence
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type {
  FavoritesContextValue,
  FavoritesState,
  MatchFavorite,
  PredictionFavorite,
  TeamFavorite,
} from '../types/favorites.types';
import * as FavoritesService from '../services/favorites.service';

// ============================================================================
// CONTEXT
// ============================================================================

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER PROPS
// ============================================================================

interface FavoritesProviderProps {
  children: ReactNode;
}

// ============================================================================
// PROVIDER
// ============================================================================

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [state, setState] = useState<FavoritesState>({
    matches: [],
    predictions: [],
    teams: [],
    isLoading: true,
  });

  // ============================================================================
  // LOAD FAVORITES ON MOUNT
  // ============================================================================

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const favorites = await FavoritesService.loadFavorites();

      setState({
        matches: favorites.matches,
        predictions: favorites.predictions,
        teams: favorites.teams,
        isLoading: false,
      });

      console.log('✅ Favorites loaded:', {
        matches: favorites.matches.length,
        predictions: favorites.predictions.length,
        teams: favorites.teams.length,
      });
    } catch (error) {
      console.error('❌ Failed to load favorites:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // ============================================================================
  // MATCH FAVORITES
  // ============================================================================

  const addMatchFavorite = useCallback(
    async (match: Omit<MatchFavorite, 'id' | 'type' | 'addedAt'>) => {
      try {
        const newFavorite = await FavoritesService.addMatchFavorite(match);
        setState((prev) => ({
          ...prev,
          matches: [newFavorite, ...prev.matches],
        }));
      } catch (error) {
        console.error('❌ Failed to add match favorite:', error);
        throw error;
      }
    },
    []
  );

  const removeMatchFavorite = useCallback(async (matchId: string | number) => {
    try {
      await FavoritesService.removeMatchFavorite(matchId);
      setState((prev) => ({
        ...prev,
        matches: prev.matches.filter((m) => m.matchId !== matchId),
      }));
    } catch (error) {
      console.error('❌ Failed to remove match favorite:', error);
      throw error;
    }
  }, []);

  const toggleMatchFavorite = useCallback(
    async (match: Omit<MatchFavorite, 'id' | 'type' | 'addedAt'>) => {
      const isFavorited = state.matches.some((m) => m.matchId === match.matchId);

      if (isFavorited) {
        await removeMatchFavorite(match.matchId);
      } else {
        await addMatchFavorite(match);
      }
    },
    [state.matches, addMatchFavorite, removeMatchFavorite]
  );

  const isMatchFavorited = useCallback(
    (matchId: string | number): boolean => {
      return state.matches.some((m) => m.matchId === matchId);
    },
    [state.matches]
  );

  const getMatchFavorites = useCallback((): MatchFavorite[] => {
    return state.matches;
  }, [state.matches]);

  // ============================================================================
  // PREDICTION FAVORITES
  // ============================================================================

  const addPredictionFavorite = useCallback(
    async (prediction: Omit<PredictionFavorite, 'id' | 'type' | 'addedAt'>) => {
      try {
        const newFavorite = await FavoritesService.addPredictionFavorite(prediction);
        setState((prev) => ({
          ...prev,
          predictions: [newFavorite, ...prev.predictions],
        }));
      } catch (error) {
        console.error('❌ Failed to add prediction favorite:', error);
        throw error;
      }
    },
    []
  );

  const removePredictionFavorite = useCallback(async (predictionId: string | number) => {
    try {
      await FavoritesService.removePredictionFavorite(predictionId);
      setState((prev) => ({
        ...prev,
        predictions: prev.predictions.filter((p) => p.predictionId !== predictionId),
      }));
    } catch (error) {
      console.error('❌ Failed to remove prediction favorite:', error);
      throw error;
    }
  }, []);

  const togglePredictionFavorite = useCallback(
    async (prediction: Omit<PredictionFavorite, 'id' | 'type' | 'addedAt'>) => {
      const isFavorited = state.predictions.some((p) => p.predictionId === prediction.predictionId);

      if (isFavorited) {
        await removePredictionFavorite(prediction.predictionId);
      } else {
        await addPredictionFavorite(prediction);
      }
    },
    [state.predictions, addPredictionFavorite, removePredictionFavorite]
  );

  const isPredictionFavorited = useCallback(
    (predictionId: string | number): boolean => {
      return state.predictions.some((p) => p.predictionId === predictionId);
    },
    [state.predictions]
  );

  const getPredictionFavorites = useCallback((): PredictionFavorite[] => {
    return state.predictions;
  }, [state.predictions]);

  // ============================================================================
  // TEAM FAVORITES
  // ============================================================================

  const addTeamFavorite = useCallback(async (team: Omit<TeamFavorite, 'id' | 'type' | 'addedAt'>) => {
    try {
      const newFavorite = await FavoritesService.addTeamFavorite(team);
      setState((prev) => ({
        ...prev,
        teams: [newFavorite, ...prev.teams],
      }));
    } catch (error) {
      console.error('❌ Failed to add team favorite:', error);
      throw error;
    }
  }, []);

  const removeTeamFavorite = useCallback(async (teamId: string | number) => {
    try {
      await FavoritesService.removeTeamFavorite(teamId);
      setState((prev) => ({
        ...prev,
        teams: prev.teams.filter((t) => t.teamId !== teamId),
      }));
    } catch (error) {
      console.error('❌ Failed to remove team favorite:', error);
      throw error;
    }
  }, []);

  const toggleTeamFavorite = useCallback(
    async (team: Omit<TeamFavorite, 'id' | 'type' | 'addedAt'>) => {
      const isFavorited = state.teams.some((t) => t.teamId === team.teamId);

      if (isFavorited) {
        await removeTeamFavorite(team.teamId);
      } else {
        await addTeamFavorite(team);
      }
    },
    [state.teams, addTeamFavorite, removeTeamFavorite]
  );

  const isTeamFavorited = useCallback(
    (teamId: string | number): boolean => {
      return state.teams.some((t) => t.teamId === teamId);
    },
    [state.teams]
  );

  const getTeamFavorites = useCallback((): TeamFavorite[] => {
    return state.teams;
  }, [state.teams]);

  // ============================================================================
  // CLEAR FAVORITES
  // ============================================================================

  const clearAllFavorites = useCallback(async () => {
    try {
      await FavoritesService.clearAllFavorites();
      setState({
        matches: [],
        predictions: [],
        teams: [],
        isLoading: false,
      });
    } catch (error) {
      console.error('❌ Failed to clear all favorites:', error);
      throw error;
    }
  }, []);

  const clearMatchFavorites = useCallback(async () => {
    try {
      await FavoritesService.clearMatchFavorites();
      setState((prev) => ({
        ...prev,
        matches: [],
      }));
    } catch (error) {
      console.error('❌ Failed to clear match favorites:', error);
      throw error;
    }
  }, []);

  const clearPredictionFavorites = useCallback(async () => {
    try {
      await FavoritesService.clearPredictionFavorites();
      setState((prev) => ({
        ...prev,
        predictions: [],
      }));
    } catch (error) {
      console.error('❌ Failed to clear prediction favorites:', error);
      throw error;
    }
  }, []);

  const clearTeamFavorites = useCallback(async () => {
    try {
      await FavoritesService.clearTeamFavorites();
      setState((prev) => ({
        ...prev,
        teams: [],
      }));
    } catch (error) {
      console.error('❌ Failed to clear team favorites:', error);
      throw error;
    }
  }, []);

  // ============================================================================
  // REFRESH
  // ============================================================================

  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: FavoritesContextValue = {
    // State
    ...state,

    // Match actions
    addMatchFavorite,
    removeMatchFavorite,
    toggleMatchFavorite,
    isMatchFavorited,
    getMatchFavorites,

    // Prediction actions
    addPredictionFavorite,
    removePredictionFavorite,
    togglePredictionFavorite,
    isPredictionFavorited,
    getPredictionFavorites,

    // Team actions
    addTeamFavorite,
    removeTeamFavorite,
    toggleTeamFavorite,
    isTeamFavorited,
    getTeamFavorites,

    // Clear actions
    clearAllFavorites,
    clearMatchFavorites,
    clearPredictionFavorites,
    clearTeamFavorites,

    // Refresh
    refreshFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

// ============================================================================
// HOOK
// ============================================================================

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  return context;
}

// ============================================================================
// EXPORT
// ============================================================================

export default FavoritesContext;
