/**
 * Cache Utility
 * AsyncStorage-based caching with TTL support
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TYPES
// ============================================================================

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  prefix?: string; // Cache key prefix (default: '@cache_')
}

interface CacheData<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_PREFIX = '@cache_';

// ============================================================================
// CACHE UTILITY
// ============================================================================

export const cache = {
  /**
   * Get data from cache
   * Returns null if not found or expired
   */
  get: async <T>(key: string, options: CacheOptions = {}): Promise<T | null> => {
    try {
      const prefix = options.prefix || DEFAULT_PREFIX;
      const cacheKey = `${prefix}${key}`;

      const cached = await AsyncStorage.getItem(cacheKey);
      if (!cached) {
        return null;
      }

      const cacheData: CacheData<T> = JSON.parse(cached);
      const age = Date.now() - cacheData.timestamp;

      // Check if expired
      if (age > cacheData.ttl) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error('❌ Cache get error:', error);
      return null;
    }
  },

  /**
   * Set data in cache
   */
  set: async <T>(key: string, data: T, options: CacheOptions = {}): Promise<void> => {
    try {
      const prefix = options.prefix || DEFAULT_PREFIX;
      const ttl = options.ttl || DEFAULT_TTL;
      const cacheKey = `${prefix}${key}`;

      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('❌ Cache set error:', error);
    }
  },

  /**
   * Remove data from cache
   */
  remove: async (key: string, options: CacheOptions = {}): Promise<void> => {
    try {
      const prefix = options.prefix || DEFAULT_PREFIX;
      const cacheKey = `${prefix}${key}`;

      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('❌ Cache remove error:', error);
    }
  },

  /**
   * Clear all cache with specific prefix
   */
  clearAll: async (options: CacheOptions = {}): Promise<void> => {
    try {
      const prefix = options.prefix || DEFAULT_PREFIX;
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith(prefix));

      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('❌ Cache clearAll error:', error);
    }
  },

  /**
   * Check if cache exists and is valid
   */
  has: async (key: string, options: CacheOptions = {}): Promise<boolean> => {
    const data = await cache.get(key, options);
    return data !== null;
  },

  /**
   * Get cache age in milliseconds
   * Returns null if not found
   */
  getAge: async (key: string, options: CacheOptions = {}): Promise<number | null> => {
    try {
      const prefix = options.prefix || DEFAULT_PREFIX;
      const cacheKey = `${prefix}${key}`;

      const cached = await AsyncStorage.getItem(cacheKey);
      if (!cached) {
        return null;
      }

      const cacheData: CacheData<any> = JSON.parse(cached);
      return Date.now() - cacheData.timestamp;
    } catch (error) {
      console.error('❌ Cache getAge error:', error);
      return null;
    }
  },
};

// ============================================================================
// CACHE KEYS
// ============================================================================

export const CacheKeys = {
  // Matches
  LIVE_MATCHES: 'live_matches',
  MATCH_DETAIL: (id: string) => `match_${id}`,
  MATCH_H2H: (id: string) => `match_h2h_${id}`,
  MATCH_LINEUP: (id: string) => `match_lineup_${id}`,
  MATCH_STATS: (id: string) => `match_stats_${id}`,

  // User
  USER_STATS: 'user_stats',
  USER_SETTINGS: 'user_settings',

  // Predictions
  MATCHED_PREDICTIONS: 'matched_predictions',
  MATCH_PREDICTIONS: (id: string) => `match_predictions_${id}`,

  // Teams
  TEAM_DETAIL: (id: string) => `team_${id}`,
  TEAM_FIXTURES: (id: string) => `team_fixtures_${id}`,
  TEAM_STANDINGS: (id: string) => `team_standings_${id}`,

  // Leagues
  LEAGUE_DETAIL: (id: string) => `league_${id}`,
  LEAGUE_FIXTURES: (id: string) => `league_fixtures_${id}`,
  LEAGUE_STANDINGS: (id: string) => `league_standings_${id}`,

  // News
  NEWS_LIST: 'news_list',
  NEWS_DETAIL: (id: string) => `news_${id}`,
} as const;

// ============================================================================
// CACHE TTL PRESETS
// ============================================================================

export const CacheTTL = {
  ONE_MINUTE: 1 * 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;
