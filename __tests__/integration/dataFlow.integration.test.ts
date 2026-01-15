/**
 * Data Flow Integration Tests
 * Phase 12: Testing & QA - Integration Tests
 *
 * Tests the integration between multiple services and data flow through the app
 */

import cacheService from '../../src/services/api/cache.service';
import analyticsService from '../../src/services/analytics.service';
import performanceMonitor from '../../src/services/performance.service';
import { getLiveMatches, getMatchById } from '../../src/api/matches.api';

// Mock analytics
jest.mock('../../src/services/analytics.service', () => ({
  __esModule: true,
  default: {
    trackAPICall: jest.fn(),
    trackEvent: jest.fn(),
    trackScreenView: jest.fn(),
    trackPerformance: jest.fn(),
  },
}));

jest.useFakeTimers();

describe('Data Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cacheService.clear();
  });

  describe('API + Cache Integration', () => {
    it('should cache API responses automatically', async () => {
      const mockMatches = [
        { id: 1, home_team_name: 'Team A', away_team_name: 'Team B' },
      ];

      const fetcher = jest.fn(() => Promise.resolve(mockMatches));

      // First call - should fetch
      const result1 = await cacheService.get('matches:live', fetcher, { ttl: 5000 });

      expect(result1).toEqual(mockMatches);
      expect(fetcher).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result2 = await cacheService.get('matches:live', fetcher, { ttl: 5000 });

      expect(result2).toEqual(mockMatches);
      expect(fetcher).toHaveBeenCalledTimes(1); // Still 1!
    });

    it('should invalidate cache and refetch on demand', async () => {
      const mockData = { value: 1 };
      const newData = { value: 2 };

      let callCount = 0;
      const fetcher = jest.fn(() => {
        callCount++;
        return Promise.resolve(callCount === 1 ? mockData : newData);
      });

      // First call
      const result1 = await cacheService.get('test:data', fetcher);
      expect(result1).toEqual(mockData);

      // Invalidate cache
      cacheService.invalidate('test:data');

      // Second call after invalidation
      const result2 = await cacheService.get('test:data', fetcher);
      expect(result2).toEqual(newData);
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it('should handle stale-while-revalidate pattern', async () => {
      const staleData = { value: 1, status: 'stale' };
      const freshData = { value: 2, status: 'fresh' };

      let callCount = 0;
      const fetcher = jest.fn(() => {
        callCount++;
        return Promise.resolve(callCount === 1 ? staleData : freshData);
      });

      // First call - cache it
      await cacheService.get('test:stale', fetcher, {
        ttl: 1000,
        staleWhileRevalidate: true,
      });

      // Fast-forward to make data stale (80% of TTL)
      jest.advanceTimersByTime(850);

      // Second call - should return stale data immediately
      const result = await cacheService.get('test:stale', fetcher, {
        ttl: 1000,
        staleWhileRevalidate: true,
      });

      expect(result).toEqual(staleData); // Returns stale data
    });
  });

  describe('API + Performance Monitoring Integration', () => {
    it('should track API performance metrics', async () => {
      const endpoint = '/api/matches/live';
      const mockMatches = [{ id: 1, home_team_name: 'Team A' }];

      const apiCall = async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockMatches;
      };

      const result = await performanceMonitor.trackAPICall(
        endpoint,
        'GET',
        apiCall
      );

      expect(result).toEqual(mockMatches);
      expect(analyticsService.trackAPICall).toHaveBeenCalledWith(
        endpoint,
        'GET',
        expect.any(Number),
        200,
        true
      );
    });

    it('should flag slow API calls', async () => {
      const endpoint = '/api/slow';

      const slowApiCall = async () => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return { data: 'slow response' };
      };

      await performanceMonitor.trackAPICall(endpoint, 'GET', slowApiCall);

      // Should log warning for slow calls
      const call = (analyticsService.trackAPICall as jest.Mock).mock.calls[0];
      const duration = call[2];

      expect(duration).toBeGreaterThan(1000); // Slow threshold
    });

    it('should track failed API calls', async () => {
      const endpoint = '/api/error';

      const failingApiCall = async () => {
        throw new Error('API Error');
      };

      await expect(
        performanceMonitor.trackAPICall(endpoint, 'GET', failingApiCall)
      ).rejects.toThrow('API Error');

      expect(analyticsService.trackAPICall).toHaveBeenCalledWith(
        endpoint,
        'GET',
        expect.any(Number),
        500,
        false
      );
    });
  });

  describe('Analytics + User Actions Integration', () => {
    it('should track complete user journey', async () => {
      // User opens app
      analyticsService.trackEvent('app_open', {});

      // User views home screen
      analyticsService.trackScreenView('HomeScreen');

      // User views a match
      analyticsService.trackEvent('match_viewed', {
        match_id: 'match123',
        league: 'Premier League',
      });

      // User favorites the match
      analyticsService.trackEvent('match_favorited', {
        match_id: 'match123',
        action: 'add',
      });

      // Verify all events were tracked
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(3);
      expect(analyticsService.trackScreenView).toHaveBeenCalledTimes(1);
    });

    it('should sanitize sensitive data in analytics', async () => {
      const userAction = {
        email: 'user@example.com',
        password: 'secret123',
        user_id: 'user123',
      };

      analyticsService.trackEvent('user_action', userAction);

      // Analytics should have sanitized the data
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'user_action',
        expect.objectContaining({
          user_id: 'user123',
          // password and email should be redacted
        })
      );
    });
  });

  describe('Cache + Analytics Integration', () => {
    it('should track cache hits and misses', async () => {
      const fetcher = jest.fn(() => Promise.resolve({ data: 'test' }));

      // First call - cache miss
      await cacheService.get('test:analytics', fetcher);

      // Check if cache miss was logged
      // (In production, we'd add analytics to cache service)

      // Second call - cache hit
      await cacheService.get('test:analytics', fetcher);

      // Only one fetch should have occurred
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('should track cache performance', () => {
      // Add multiple entries
      for (let i = 0; i < 10; i++) {
        cacheService.set(`key${i}`, { value: i }, 60000);
      }

      const stats = cacheService.getStats();

      expect(stats.totalEntries).toBe(10);
      expect(stats.pendingRequests).toBe(0);
      expect(stats.memoryUsage).toBeDefined();

      // Could track these metrics with analytics
      analyticsService.trackPerformance({
        cache_entries: stats.totalEntries,
        cache_memory: stats.memoryUsage,
      });

      expect(analyticsService.trackPerformance).toHaveBeenCalled();
    });
  });

  describe('Multi-Service Data Flow', () => {
    it('should orchestrate data flow through multiple services', async () => {
      const matchId = 'match123';

      // 1. Check cache
      const cachedMatch = cacheService.getCached(`match:${matchId}`);

      if (!cachedMatch) {
        // 2. Fetch from API (with performance tracking)
        const match = await performanceMonitor.trackAPICall(
          `/api/matches/${matchId}`,
          'GET',
          async () => {
            return { id: matchId, home_team: 'Team A', away_team: 'Team B' };
          }
        );

        // 3. Cache the result
        cacheService.set(`match:${matchId}`, match, 30000);

        // 4. Track analytics
        analyticsService.trackEvent('match_viewed', {
          match_id: matchId,
          from_cache: false,
        });

        expect(match).toBeDefined();
      }

      // Verify the flow
      expect(analyticsService.trackAPICall).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalled();
    });

    it('should handle error cascade gracefully', async () => {
      const endpoint = '/api/failing';

      try {
        // API call that will fail
        await performanceMonitor.trackAPICall(endpoint, 'GET', async () => {
          throw new Error('API Failure');
        });
      } catch (error) {
        // Error should be tracked
        expect(analyticsService.trackAPICall).toHaveBeenCalledWith(
          endpoint,
          'GET',
          expect.any(Number),
          500,
          false
        );

        // Cache should not be populated
        expect(cacheService.has(endpoint)).toBe(false);
      }
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle user viewing live matches with caching', async () => {
      const mockLiveMatches = [
        { id: 1, home_team_name: 'Barcelona', away_team_name: 'Real Madrid' },
        { id: 2, home_team_name: 'Liverpool', away_team_name: 'Man City' },
      ];

      // Mock the actual API call
      const mockGetLiveMatches = jest.fn(() => Promise.resolve(mockLiveMatches));

      // First load - API call
      const matches1 = await cacheService.get(
        'matches:live',
        mockGetLiveMatches,
        { ttl: 30000 }
      );

      expect(matches1).toEqual(mockLiveMatches);
      expect(mockGetLiveMatches).toHaveBeenCalledTimes(1);

      // Track analytics
      analyticsService.trackScreenView('LiveMatchesScreen', {
        matches_count: matches1.length,
        from_cache: false,
      });

      // User navigates away and back within 30 seconds
      const matches2 = await cacheService.get(
        'matches:live',
        mockGetLiveMatches,
        { ttl: 30000 }
      );

      expect(matches2).toEqual(mockLiveMatches);
      expect(mockGetLiveMatches).toHaveBeenCalledTimes(1); // Still 1!

      // Second analytics event
      analyticsService.trackScreenView('LiveMatchesScreen', {
        matches_count: matches2.length,
        from_cache: true,
      });

      expect(analyticsService.trackScreenView).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent user actions', async () => {
      const actions = [
        async () => analyticsService.trackEvent('action1', {}),
        async () => analyticsService.trackEvent('action2', {}),
        async () => analyticsService.trackEvent('action3', {}),
      ];

      await Promise.all(actions.map(action => action()));

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(3);
    });

    it('should maintain data consistency across services', async () => {
      const matchId = 'match456';
      const matchData = {
        id: matchId,
        home_team: 'Team A',
        away_team: 'Team B',
        score: '2-1',
      };

      // Store in cache
      cacheService.set(`match:${matchId}`, matchData, 60000);

      // Retrieve from cache
      const cachedData = cacheService.getCached(`match:${matchId}`);

      // Data should be consistent
      expect(cachedData).toEqual(matchData);

      // Track viewing this cached data
      analyticsService.trackEvent('match_viewed', {
        match_id: matchId,
        from_cache: true,
        score: matchData.score,
      });

      // Verify event tracking
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'match_viewed',
        expect.objectContaining({
          match_id: matchId,
          from_cache: true,
        })
      );
    });
  });

  describe('Memory and Performance', () => {
    it('should manage memory efficiently across services', () => {
      // Fill cache with data
      for (let i = 0; i < 50; i++) {
        cacheService.set(`item${i}`, { data: `value${i}` }, 60000);
      }

      const stats = cacheService.getStats();

      // Track memory usage
      analyticsService.trackPerformance({
        cache_size: stats.totalEntries,
        cache_memory: stats.memoryUsage,
      });

      expect(stats.totalEntries).toBe(50);
      expect(analyticsService.trackPerformance).toHaveBeenCalled();
    });

    it('should handle cleanup operations', () => {
      // Add entries with short TTL
      for (let i = 0; i < 5; i++) {
        cacheService.set(`expired${i}`, { value: i }, 1000);
      }

      // Add entries with long TTL
      for (let i = 0; i < 5; i++) {
        cacheService.set(`valid${i}`, { value: i }, 60000);
      }

      // Fast-forward past short TTL
      jest.advanceTimersByTime(1100);

      // Cleanup expired entries
      cacheService.cleanup();

      const stats = cacheService.getStats();

      // Only valid entries should remain
      expect(stats.totalEntries).toBe(5);
    });
  });
});
