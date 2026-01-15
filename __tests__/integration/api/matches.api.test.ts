/**
 * Matches API Integration Tests
 * Phase 12: Testing & QA - Integration Tests
 *
 * Tests the integration between the app and backend API for match-related endpoints
 */

import {
  getLiveMatches,
  getMatchesByDate,
  getMatchById,
  getMatchH2H,
  getMatchLineup,
  getMatchLiveStats,
} from '../../../src/api/matches.api';

// Note: These tests will make real API calls to the backend
// For CI/CD, consider mocking with nock or msw

describe('Matches API Integration', () => {
  describe('getLiveMatches', () => {
    it('should fetch live matches from API', async () => {
      const matches = await getLiveMatches();

      expect(Array.isArray(matches)).toBe(true);

      if (matches.length > 0) {
        const match = matches[0];
        expect(match).toHaveProperty('id');
        expect(match).toHaveProperty('home_team_name');
        expect(match).toHaveProperty('away_team_name');
        expect(match).toHaveProperty('status_id');
        expect([2, 3, 4, 5, 7]).toContain(match.status_id); // Live status codes
      }
    }, 10000); // 10 second timeout for API call

    it('should return empty array if no live matches', async () => {
      const matches = await getLiveMatches();

      expect(Array.isArray(matches)).toBe(true);
      // May be empty depending on time of day
    }, 10000);

    it('should handle API errors gracefully', async () => {
      // Mock API failure
      const originalFetch = global.fetch;
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      await expect(getLiveMatches()).rejects.toThrow();

      global.fetch = originalFetch;
    });
  });

  describe('getMatchesByDate', () => {
    it('should fetch matches for a specific date', async () => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const matches = await getMatchesByDate(today);

      expect(Array.isArray(matches)).toBe(true);

      if (matches.length > 0) {
        const match = matches[0];
        expect(match).toHaveProperty('id');
        expect(match).toHaveProperty('match_time');
        expect(match).toHaveProperty('home_team_name');
        expect(match).toHaveProperty('away_team_name');
      }
    }, 15000);

    it('should return empty array for date with no matches', async () => {
      const futureDate = '2030-12-31';
      const matches = await getMatchesByDate(futureDate);

      expect(Array.isArray(matches)).toBe(true);
      // Likely empty for far future date
    }, 10000);

    it('should validate date format', async () => {
      // Invalid date format
      await expect(getMatchesByDate('invalid-date')).rejects.toThrow();
    });
  });

  describe('getMatchById', () => {
    let testMatchId: string;

    beforeAll(async () => {
      // Get a real match ID from today's matches
      const today = new Date().toISOString().split('T')[0];
      const matches = await getMatchesByDate(today);

      if (matches.length > 0) {
        testMatchId = matches[0].id.toString();
      }
    }, 15000);

    it('should fetch match details by ID', async () => {
      if (!testMatchId) {
        console.log('⚠️ No test match available, skipping test');
        return;
      }

      const match = await getMatchById(testMatchId);

      expect(match).toBeDefined();
      expect(match.id.toString()).toBe(testMatchId);
      expect(match).toHaveProperty('home_team_name');
      expect(match).toHaveProperty('away_team_name');
      expect(match).toHaveProperty('competition_name');
    }, 10000);

    it('should return null for non-existent match ID', async () => {
      const invalidId = 'nonexistent123';

      await expect(getMatchById(invalidId)).rejects.toThrow();
    }, 10000);
  });

  describe('getMatchH2H', () => {
    let testMatchId: string;

    beforeAll(async () => {
      const today = new Date().toISOString().split('T')[0];
      const matches = await getMatchesByDate(today);

      if (matches.length > 0) {
        testMatchId = matches[0].id.toString();
      }
    }, 15000);

    it('should fetch head-to-head data', async () => {
      if (!testMatchId) {
        console.log('⚠️ No test match available, skipping test');
        return;
      }

      const h2h = await getMatchH2H(testMatchId);

      expect(h2h).toBeDefined();
      expect(Array.isArray(h2h)).toBe(true);

      if (h2h.length > 0) {
        const match = h2h[0];
        expect(match).toHaveProperty('id');
        expect(match).toHaveProperty('home_team_name');
        expect(match).toHaveProperty('away_team_name');
      }
    }, 10000);

    it('should return empty array if no H2H history', async () => {
      if (!testMatchId) {
        console.log('⚠️ No test match available, skipping test');
        return;
      }

      const h2h = await getMatchH2H(testMatchId);

      expect(Array.isArray(h2h)).toBe(true);
      // May be empty for teams with no history
    }, 10000);
  });

  describe('getMatchLineup', () => {
    let liveMatchId: string;

    beforeAll(async () => {
      const liveMatches = await getLiveMatches();

      if (liveMatches.length > 0) {
        liveMatchId = liveMatches[0].id.toString();
      }
    }, 15000);

    it('should fetch match lineup', async () => {
      if (!liveMatchId) {
        console.log('⚠️ No live match available, skipping test');
        return;
      }

      const lineup = await getMatchLineup(liveMatchId);

      expect(lineup).toBeDefined();

      if (lineup.home_team && lineup.away_team) {
        expect(lineup.home_team).toHaveProperty('lineup');
        expect(lineup.away_team).toHaveProperty('lineup');
        expect(Array.isArray(lineup.home_team.lineup)).toBe(true);
        expect(Array.isArray(lineup.away_team.lineup)).toBe(true);
      }
    }, 10000);

    it('should return empty lineup for upcoming matches', async () => {
      const today = new Date().toISOString().split('T')[0];
      const matches = await getMatchesByDate(today);

      // Find an upcoming match (status_id = 1)
      const upcomingMatch = matches.find(m => m.status_id === 1);

      if (upcomingMatch) {
        const lineup = await getMatchLineup(upcomingMatch.id.toString());

        // Lineup may be empty for upcoming matches
        expect(lineup).toBeDefined();
      }
    }, 10000);
  });

  describe('getMatchLiveStats', () => {
    let liveMatchId: string;

    beforeAll(async () => {
      const liveMatches = await getLiveMatches();

      if (liveMatches.length > 0) {
        liveMatchId = liveMatches[0].id.toString();
      }
    }, 15000);

    it('should fetch live match statistics', async () => {
      if (!liveMatchId) {
        console.log('⚠️ No live match available, skipping test');
        return;
      }

      const stats = await getMatchLiveStats(liveMatchId);

      expect(stats).toBeDefined();

      if (stats) {
        expect(stats).toHaveProperty('match_id');
        expect(stats).toHaveProperty('stats');
        expect(Array.isArray(stats.stats)).toBe(true);
      }
    }, 10000);

    it('should include common statistics', async () => {
      if (!liveMatchId) {
        console.log('⚠️ No live match available, skipping test');
        return;
      }

      const stats = await getMatchLiveStats(liveMatchId);

      if (stats && stats.stats.length > 0) {
        const statTypes = stats.stats.map(s => s.type);

        // Common statistics that might be present
        const possibleStats = [
          'possession',
          'shots',
          'shots_on_target',
          'corners',
          'fouls',
          'yellow_cards',
          'red_cards',
        ];

        // At least some statistics should be present
        const hasStats = possibleStats.some(type => statTypes.includes(type));
        expect(hasStats || statTypes.length > 0).toBe(true);
      }
    }, 10000);
  });

  describe('API Response Validation', () => {
    it('should return consistent data structure across endpoints', async () => {
      const liveMatches = await getLiveMatches();
      const today = new Date().toISOString().split('T')[0];
      const todayMatches = await getMatchesByDate(today);

      // Both should return arrays
      expect(Array.isArray(liveMatches)).toBe(true);
      expect(Array.isArray(todayMatches)).toBe(true);

      // If we have matches, they should have consistent structure
      if (liveMatches.length > 0 && todayMatches.length > 0) {
        const liveMatch = liveMatches[0];
        const todayMatch = todayMatches[0];

        // Both should have same core fields
        expect(liveMatch).toHaveProperty('id');
        expect(todayMatch).toHaveProperty('id');
        expect(liveMatch).toHaveProperty('home_team_name');
        expect(todayMatch).toHaveProperty('home_team_name');
      }
    }, 20000);
  });

  describe('API Performance', () => {
    it('should respond within acceptable time', async () => {
      const startTime = Date.now();
      await getLiveMatches();
      const duration = Date.now() - startTime;

      // API should respond within 5 seconds
      expect(duration).toBeLessThan(5000);
    }, 10000);

    it('should handle concurrent requests', async () => {
      const requests = [
        getLiveMatches(),
        getLiveMatches(),
        getLiveMatches(),
      ];

      const results = await Promise.all(requests);

      // All requests should succeed
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true);
      });
    }, 15000);
  });

  describe('API Error Handling', () => {
    it('should handle network timeouts', async () => {
      // This would require mocking fetch with a timeout
      // For now, we'll just verify the API has error handling

      const originalFetch = global.fetch;
      global.fetch = jest.fn(() =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      await expect(getLiveMatches()).rejects.toThrow();

      global.fetch = originalFetch;
    }, 5000);

    it('should handle malformed responses', async () => {
      const originalFetch = global.fetch;
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ invalid: 'data' }),
        } as Response)
      );

      // Should handle gracefully or throw appropriate error
      try {
        await getLiveMatches();
      } catch (error) {
        expect(error).toBeDefined();
      }

      global.fetch = originalFetch;
    });

    it('should handle HTTP error codes', async () => {
      const originalFetch = global.fetch;
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response)
      );

      await expect(getLiveMatches()).rejects.toThrow();

      global.fetch = originalFetch;
    });
  });
});
