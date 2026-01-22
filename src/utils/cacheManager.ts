/**
 * Cache Manager
 * Centralized cache invalidation logic for common scenarios
 */

import { cache, CacheKeys } from './cache';
import { AppState, AppStateStatus } from 'react-native';
import { logger } from './logger';

// ============================================================================
// CACHE MANAGER
// ============================================================================

export const cacheManager = {
  /**
   * Clear all user-specific cache
   * Call this when user logs out
   */
  clearUserCache: async (): Promise<void> => {
    try {
      logger.debug('[Cache] Clearing user cache...');

      await Promise.all([
        cache.remove(CacheKeys.USER_STATS),
        cache.remove(CacheKeys.USER_SETTINGS),
        cache.remove(CacheKeys.MATCHED_PREDICTIONS),
      ]);

      logger.debug('[Cache] User cache cleared');
    } catch (error) {
      logger.error('Failed to clear user cache:', error as Error);
    }
  },

  /**
   * Clear all match-related cache
   * Call this when you need to force refresh all match data
   */
  clearMatchCache: async (): Promise<void> => {
    try {
      logger.debug('[Cache] Clearing match cache...');

      await cache.remove(CacheKeys.LIVE_MATCHES);

      logger.debug('[Cache] Match cache cleared');
    } catch (error) {
      logger.error('Failed to clear match cache:', error as Error);
    }
  },

  /**
   * Clear all cache
   * Call this for a complete cache reset
   */
  clearAllCache: async (): Promise<void> => {
    try {
      logger.debug('[Cache] Clearing all cache...');

      await cache.clearAll();

      logger.debug('[Cache] All cache cleared');
    } catch (error) {
      logger.error('Failed to clear all cache:', error as Error);
    }
  },

  /**
   * Invalidate specific match cache by ID
   */
  invalidateMatchCache: async (matchId: string): Promise<void> => {
    try {
      await Promise.all([
        cache.remove(CacheKeys.MATCH_DETAIL(matchId)),
        cache.remove(CacheKeys.MATCH_H2H(matchId)),
        cache.remove(CacheKeys.MATCH_LINEUP(matchId)),
        cache.remove(CacheKeys.MATCH_STATS(matchId)),
        cache.remove(CacheKeys.MATCH_PREDICTIONS(matchId)),
      ]);

      logger.debug(`[Cache] Invalidated for match ${matchId}`);
    } catch (error) {
      logger.error(`Failed to invalidate match cache for ${matchId}:`, error as Error);
    }
  },

  /**
   * Invalidate team cache by ID
   */
  invalidateTeamCache: async (teamId: string): Promise<void> => {
    try {
      await Promise.all([
        cache.remove(CacheKeys.TEAM_DETAIL(teamId)),
        cache.remove(CacheKeys.TEAM_FIXTURES(teamId)),
        cache.remove(CacheKeys.TEAM_STANDINGS(teamId)),
      ]);

      logger.debug(`[Cache] Invalidated for team ${teamId}`);
    } catch (error) {
      logger.error(`Failed to invalidate team cache for ${teamId}:`, error as Error);
    }
  },

  /**
   * Invalidate league cache by ID
   */
  invalidateLeagueCache: async (leagueId: string): Promise<void> => {
    try {
      await Promise.all([
        cache.remove(CacheKeys.LEAGUE_DETAIL(leagueId)),
        cache.remove(CacheKeys.LEAGUE_FIXTURES(leagueId)),
        cache.remove(CacheKeys.LEAGUE_STANDINGS(leagueId)),
      ]);

      logger.debug(`[Cache] Invalidated for league ${leagueId}`);
    } catch (error) {
      logger.error(`Failed to invalidate league cache for ${leagueId}:`, error as Error);
    }
  },
};

// ============================================================================
// APP STATE LISTENER
// ============================================================================

/**
 * Setup app state listener to handle cache on app state changes
 * Call this once when the app initializes
 */
export const setupAppStateCacheListener = (onForeground?: () => void): (() => void) => {
  let previousState: AppStateStatus = AppState.currentState;

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    // App came to foreground
    if (previousState.match(/inactive|background/) && nextAppState === 'active') {
      logger.debug('[AppState] App came to foreground');

      // Optionally clear stale cache or trigger refresh
      // You can customize this behavior
      if (onForeground) {
        onForeground();
      }
    }

    // App went to background
    if (previousState === 'active' && nextAppState.match(/inactive|background/)) {
      logger.debug('[AppState] App went to background');
      // Optionally save state or pause operations
    }

    previousState = nextAppState;
  };

  // Subscribe to app state changes
  const subscription = AppState.addEventListener('change', handleAppStateChange);

  // Return cleanup function
  return () => {
    subscription.remove();
  };
};

// ============================================================================
// CACHE STATISTICS
// ============================================================================

export const getCacheStats = async (): Promise<{
  totalKeys: number;
  cacheKeys: string[];
}> => {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const allKeys = await AsyncStorage.getAllKeys();
    const cacheKeys = allKeys.filter((key) => key.startsWith('@cache_'));

    return {
      totalKeys: cacheKeys.length,
      cacheKeys,
    };
  } catch (error) {
    logger.error('Failed to get cache stats:', error as Error);
    return {
      totalKeys: 0,
      cacheKeys: [],
    };
  }
};
