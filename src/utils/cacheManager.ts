/**
 * Cache Manager
 * Centralized cache invalidation logic for common scenarios
 */

import { cache, CacheKeys } from './cache';
import { AppState, AppStateStatus } from 'react-native';

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
      console.log('🗑️ Clearing user cache...');

      await Promise.all([
        cache.remove(CacheKeys.USER_STATS),
        cache.remove(CacheKeys.USER_SETTINGS),
        cache.remove(CacheKeys.MATCHED_PREDICTIONS),
      ]);

      console.log('✅ User cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear user cache:', error);
    }
  },

  /**
   * Clear all match-related cache
   * Call this when you need to force refresh all match data
   */
  clearMatchCache: async (): Promise<void> => {
    try {
      console.log('🗑️ Clearing match cache...');

      await cache.remove(CacheKeys.LIVE_MATCHES);

      console.log('✅ Match cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear match cache:', error);
    }
  },

  /**
   * Clear all cache
   * Call this for a complete cache reset
   */
  clearAllCache: async (): Promise<void> => {
    try {
      console.log('🗑️ Clearing all cache...');

      await cache.clearAll();

      console.log('✅ All cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear all cache:', error);
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

      console.log(`✅ Cache invalidated for match ${matchId}`);
    } catch (error) {
      console.error(`❌ Failed to invalidate match cache for ${matchId}:`, error);
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

      console.log(`✅ Cache invalidated for team ${teamId}`);
    } catch (error) {
      console.error(`❌ Failed to invalidate team cache for ${teamId}:`, error);
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

      console.log(`✅ Cache invalidated for league ${leagueId}`);
    } catch (error) {
      console.error(`❌ Failed to invalidate league cache for ${leagueId}:`, error);
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
      console.log('📱 App came to foreground');

      // Optionally clear stale cache or trigger refresh
      // You can customize this behavior
      if (onForeground) {
        onForeground();
      }
    }

    // App went to background
    if (previousState === 'active' && nextAppState.match(/inactive|background/)) {
      console.log('📱 App went to background');
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
    console.error('❌ Failed to get cache stats:', error);
    return {
      totalKeys: 0,
      cacheKeys: [],
    };
  }
};
