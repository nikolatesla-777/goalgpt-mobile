/**
 * Cache Utility Tests
 * Tests for AsyncStorage-based caching with TTL
 */

import { cache, CacheKeys, CacheTTL } from '../../src/utils/cache';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// SETUP
// ============================================================================

describe('Cache Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset AsyncStorage mock
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);
  });

  // ============================================================================
  // GET METHOD
  // ============================================================================

  describe('get()', () => {
    it('should return null for non-existent cache', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await cache.get('test_key');

      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@cache_test_key');
    });

    it('should return cached data if not expired', async () => {
      const testData = { id: 1, name: 'Test' };
      const cacheData = {
        data: testData,
        timestamp: Date.now(),
        ttl: 5 * 60 * 1000, // 5 minutes
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(cacheData));

      const result = await cache.get('test_key');

      expect(result).toEqual(testData);
    });

    it('should return null and remove expired cache', async () => {
      const testData = { id: 1, name: 'Test' };
      const cacheData = {
        data: testData,
        timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
        ttl: 5 * 60 * 1000, // 5 minute TTL (expired)
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(cacheData));

      const result = await cache.get('test_key');

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@cache_test_key');
    });

    it('should use custom prefix', async () => {
      await cache.get('test_key', { prefix: '@custom_' });

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@custom_test_key');
    });

    it('should handle JSON parse errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const result = await cache.get('test_key');

      expect(result).toBeNull();
    });

    it('should handle AsyncStorage errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await cache.get('test_key');

      expect(result).toBeNull();
    });
  });

  // ============================================================================
  // SET METHOD
  // ============================================================================

  describe('set()', () => {
    it('should cache data with default TTL', async () => {
      const testData = { id: 1, name: 'Test' };

      await cache.set('test_key', testData);

      expect(AsyncStorage.setItem).toHaveBeenCalled();
      const [[key, value]] = (AsyncStorage.setItem as jest.Mock).mock.calls;
      expect(key).toBe('@cache_test_key');

      const parsedValue = JSON.parse(value);
      expect(parsedValue.data).toEqual(testData);
      expect(parsedValue.ttl).toBe(5 * 60 * 1000); // Default 5 minutes
      expect(parsedValue.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('should cache data with custom TTL', async () => {
      const testData = { id: 1, name: 'Test' };
      const customTTL = 10 * 60 * 1000; // 10 minutes

      await cache.set('test_key', testData, { ttl: customTTL });

      const [[, value]] = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const parsedValue = JSON.parse(value);
      expect(parsedValue.ttl).toBe(customTTL);
    });

    it('should use custom prefix', async () => {
      const testData = { id: 1, name: 'Test' };

      await cache.set('test_key', testData, { prefix: '@custom_' });

      const [[key]] = (AsyncStorage.setItem as jest.Mock).mock.calls;
      expect(key).toBe('@custom_test_key');
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(cache.set('test_key', { data: 'test' })).resolves.not.toThrow();
    });

    it('should cache complex objects', async () => {
      const complexData = {
        id: 1,
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' },
        },
      };

      await cache.set('complex_key', complexData);

      const [[, value]] = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const parsedValue = JSON.parse(value);
      expect(parsedValue.data).toEqual(complexData);
    });
  });

  // ============================================================================
  // REMOVE METHOD
  // ============================================================================

  describe('remove()', () => {
    it('should remove cache by key', async () => {
      await cache.remove('test_key');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@cache_test_key');
    });

    it('should use custom prefix', async () => {
      await cache.remove('test_key', { prefix: '@custom_' });

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@custom_test_key');
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(cache.remove('test_key')).resolves.not.toThrow();
    });
  });

  // ============================================================================
  // CLEARALL METHOD
  // ============================================================================

  describe('clearAll()', () => {
    it('should clear all cache with default prefix', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        '@cache_key1',
        '@cache_key2',
        '@other_key',
      ]);

      await cache.clearAll();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['@cache_key1', '@cache_key2']);
    });

    it('should clear all cache with custom prefix', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        '@custom_key1',
        '@custom_key2',
        '@other_key',
      ]);

      await cache.clearAll({ prefix: '@custom_' });

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['@custom_key1', '@custom_key2']);
    });

    it('should not call multiRemove if no cache keys found', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(['@other_key']);

      await cache.clearAll();

      expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(cache.clearAll()).resolves.not.toThrow();
    });
  });

  // ============================================================================
  // HAS METHOD
  // ============================================================================

  describe('has()', () => {
    it('should return true if cache exists and is valid', async () => {
      const cacheData = {
        data: { test: 'data' },
        timestamp: Date.now(),
        ttl: 5 * 60 * 1000,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(cacheData));

      const result = await cache.has('test_key');

      expect(result).toBe(true);
    });

    it('should return false if cache does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await cache.has('test_key');

      expect(result).toBe(false);
    });

    it('should return false if cache is expired', async () => {
      const cacheData = {
        data: { test: 'data' },
        timestamp: Date.now() - 10 * 60 * 1000,
        ttl: 5 * 60 * 1000,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(cacheData));

      const result = await cache.has('test_key');

      expect(result).toBe(false);
    });
  });

  // ============================================================================
  // GETAGE METHOD
  // ============================================================================

  describe('getAge()', () => {
    it('should return cache age in milliseconds', async () => {
      const timestamp = Date.now() - 2 * 60 * 1000; // 2 minutes ago
      const cacheData = {
        data: { test: 'data' },
        timestamp,
        ttl: 5 * 60 * 1000,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(cacheData));

      const age = await cache.getAge('test_key');

      expect(age).toBeGreaterThanOrEqual(2 * 60 * 1000 - 100); // Allow 100ms tolerance
      expect(age).toBeLessThanOrEqual(2 * 60 * 1000 + 100);
    });

    it('should return null if cache does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const age = await cache.getAge('test_key');

      expect(age).toBeNull();
    });

    it('should handle AsyncStorage errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const age = await cache.getAge('test_key');

      expect(age).toBeNull();
    });
  });

  // ============================================================================
  // CACHE KEYS
  // ============================================================================

  describe('CacheKeys', () => {
    it('should have static keys', () => {
      expect(CacheKeys.LIVE_MATCHES).toBe('live_matches');
      expect(CacheKeys.USER_STATS).toBe('user_stats');
      expect(CacheKeys.MATCHED_PREDICTIONS).toBe('matched_predictions');
    });

    it('should generate dynamic keys', () => {
      expect(CacheKeys.MATCH_DETAIL('123')).toBe('match_123');
      expect(CacheKeys.MATCH_H2H('456')).toBe('match_h2h_456');
      expect(CacheKeys.TEAM_DETAIL('789')).toBe('team_789');
    });
  });

  // ============================================================================
  // CACHE TTL PRESETS
  // ============================================================================

  describe('CacheTTL', () => {
    it('should have correct TTL values', () => {
      expect(CacheTTL.ONE_MINUTE).toBe(60 * 1000);
      expect(CacheTTL.FIVE_MINUTES).toBe(5 * 60 * 1000);
      expect(CacheTTL.ONE_HOUR).toBe(60 * 60 * 1000);
      expect(CacheTTL.ONE_DAY).toBe(24 * 60 * 60 * 1000);
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration', () => {
    it('should set and get data correctly', async () => {
      const testData = { id: 1, name: 'Integration Test' };

      // Mock set
      let storedValue: string | null = null;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(async (key, value) => {
        storedValue = value;
      });

      // Mock get
      (AsyncStorage.getItem as jest.Mock).mockImplementation(async () => storedValue);

      // Set data
      await cache.set('integration_key', testData);

      // Get data
      const result = await cache.get('integration_key');

      expect(result).toEqual(testData);
    });

    it('should handle full cache lifecycle', async () => {
      const testData = { id: 1, name: 'Lifecycle Test' };
      let storedValue: string | null = null;

      (AsyncStorage.setItem as jest.Mock).mockImplementation(async (key, value) => {
        storedValue = value;
      });

      (AsyncStorage.getItem as jest.Mock).mockImplementation(async () => storedValue);

      (AsyncStorage.removeItem as jest.Mock).mockImplementation(async () => {
        storedValue = null;
      });

      // Set
      await cache.set('lifecycle_key', testData);
      expect(await cache.has('lifecycle_key')).toBe(true);

      // Get
      const result = await cache.get('lifecycle_key');
      expect(result).toEqual(testData);

      // Remove
      await cache.remove('lifecycle_key');
      expect(await cache.has('lifecycle_key')).toBe(false);
    });
  });
});
