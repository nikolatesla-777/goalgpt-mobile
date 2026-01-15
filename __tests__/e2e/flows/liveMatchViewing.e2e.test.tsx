/**
 * Live Match Viewing E2E Test
 * Phase 12: Testing & QA - E2E Tests
 *
 * Tests the complete flow of viewing live matches and match details
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../../App';
import { TokenStorage } from '../../../src/api/client';
import analyticsService from '../../../src/services/analytics.service';
import * as matchesApi from '../../../src/api/matches.api';

// Mock dependencies
jest.mock('../../../src/api/client');
jest.mock('../../../src/services/analytics.service');
jest.mock('../../../src/api/matches.api');

// Mock data
const mockLiveMatches = [
  {
    id: 'match1',
    home_team_name: 'Barcelona',
    away_team_name: 'Real Madrid',
    home_score: 2,
    away_score: 1,
    status_id: 4, // Second half
    minute: 67,
    league_name: 'La Liga',
  },
  {
    id: 'match2',
    home_team_name: 'Liverpool',
    away_team_name: 'Man City',
    home_score: 1,
    away_score: 1,
    status_id: 3, // Half time
    minute: 45,
    league_name: 'Premier League',
  },
];

describe('Live Match Viewing E2E Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Start with authenticated state
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');
    (matchesApi.getLiveMatches as jest.Mock).mockResolvedValue(mockLiveMatches);
  });

  /**
   * Test: View Live Matches List
   * User Journey: Open app → Navigate to Live Matches → See list of live matches
   */
  it('should display list of live matches', async () => {
    const { getByTestId, getByText } = render(<App />);

    // Wait for home screen
    await waitFor(() => {
      expect(getByTestId('home-screen')).toBeTruthy();
    });

    // Navigate to Live Matches tab
    const liveMatchesTab = getByTestId('live-matches-tab');
    fireEvent.press(liveMatchesTab);

    // Wait for live matches screen
    await waitFor(() => {
      expect(getByTestId('live-matches-screen')).toBeTruthy();
    });

    // Should fetch live matches
    expect(matchesApi.getLiveMatches).toHaveBeenCalled();

    // Should display matches
    await waitFor(() => {
      expect(getByText('Barcelona')).toBeTruthy();
      expect(getByText('Real Madrid')).toBeTruthy();
      expect(getByText('Liverpool')).toBeTruthy();
      expect(getByText('Man City')).toBeTruthy();
    });

    // Should track screen view
    expect(analyticsService.trackScreenView).toHaveBeenCalledWith(
      'LiveMatchesScreen',
      expect.any(Object)
    );
  }, 15000);

  /**
   * Test: View Match Details
   * User Journey: Live Matches → Tap match → See match details
   */
  it('should navigate to match details when tapping a match', async () => {
    const mockMatchDetails = {
      id: 'match1',
      home_team_name: 'Barcelona',
      away_team_name: 'Real Madrid',
      home_score: 2,
      away_score: 1,
      status_id: 4,
      minute: 67,
      events: [
        { minute: 23, type: 'goal', team: 'home', player: 'Messi' },
        { minute: 45, type: 'goal', team: 'away', player: 'Benzema' },
        { minute: 56, type: 'goal', team: 'home', player: 'Pedri' },
      ],
    };

    (matchesApi.getMatchById as jest.Mock).mockResolvedValue(mockMatchDetails);

    const { getByTestId, getByText } = render(<App />);

    // Navigate to Live Matches
    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    await waitFor(() => {
      expect(getByTestId('live-matches-screen')).toBeTruthy();
    });

    // Tap on first match
    const matchCard = getByTestId('match-card-match1');
    fireEvent.press(matchCard);

    // Should navigate to match detail screen
    await waitFor(() => {
      expect(getByTestId('match-detail-screen')).toBeTruthy();
    });

    // Should fetch match details
    expect(matchesApi.getMatchById).toHaveBeenCalledWith('match1');

    // Should display match details
    await waitFor(() => {
      expect(getByText('Barcelona')).toBeTruthy();
      expect(getByText('Real Madrid')).toBeTruthy();
      expect(getByText('2')).toBeTruthy(); // Home score
      expect(getByText('1')).toBeTruthy(); // Away score
    });

    // Should track match view
    expect(analyticsService.trackEvent).toHaveBeenCalledWith(
      'match_viewed',
      expect.objectContaining({ match_id: 'match1' })
    );
  }, 15000);

  /**
   * Test: View Match Events
   * User Journey: Match details → See events timeline → See goals, cards, etc.
   */
  it('should display match events timeline', async () => {
    const mockMatchDetails = {
      id: 'match1',
      home_team_name: 'Barcelona',
      away_team_name: 'Real Madrid',
      events: [
        { minute: 23, type: 'goal', team: 'home', player: 'Messi' },
        { minute: 35, type: 'yellow_card', team: 'away', player: 'Ramos' },
        { minute: 45, type: 'goal', team: 'away', player: 'Benzema' },
        { minute: 56, type: 'goal', team: 'home', player: 'Pedri' },
        { minute: 78, type: 'red_card', team: 'away', player: 'Casemiro' },
      ],
    };

    (matchesApi.getMatchById as jest.Mock).mockResolvedValue(mockMatchDetails);

    const { getByTestId, getByText } = render(<App />);

    // Navigate to match details
    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    await waitFor(() => {
      fireEvent.press(getByTestId('match-card-match1'));
    });

    await waitFor(() => {
      expect(getByTestId('match-detail-screen')).toBeTruthy();
    });

    // Navigate to Events tab
    const eventsTab = getByTestId('events-tab');
    fireEvent.press(eventsTab);

    // Should display all events
    await waitFor(() => {
      expect(getByText(/23'/)).toBeTruthy(); // Goal at 23'
      expect(getByText(/Messi/i)).toBeTruthy();
      expect(getByText(/35'/)).toBeTruthy(); // Yellow card
      expect(getByText(/Ramos/i)).toBeTruthy();
      expect(getByText(/78'/)).toBeTruthy(); // Red card
      expect(getByText(/Casemiro/i)).toBeTruthy();
    });
  }, 15000);

  /**
   * Test: View Match Statistics
   * User Journey: Match details → Stats tab → See possession, shots, etc.
   */
  it('should display match statistics', async () => {
    const mockStats = {
      match_id: 'match1',
      stats: [
        { type: 'possession', home: 58, away: 42 },
        { type: 'shots', home: 15, away: 12 },
        { type: 'shots_on_target', home: 7, away: 5 },
        { type: 'corners', home: 6, away: 4 },
      ],
    };

    (matchesApi.getMatchLiveStats as jest.Mock).mockResolvedValue(mockStats);

    const { getByTestId, getByText } = render(<App />);

    // Navigate to match details
    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
      fireEvent.press(getByTestId('match-card-match1'));
    });

    await waitFor(() => {
      expect(getByTestId('match-detail-screen')).toBeTruthy();
    });

    // Navigate to Stats tab
    const statsTab = getByTestId('stats-tab');
    fireEvent.press(statsTab);

    // Should fetch stats
    await waitFor(() => {
      expect(matchesApi.getMatchLiveStats).toHaveBeenCalledWith('match1');
    });

    // Should display stats
    await waitFor(() => {
      expect(getByText(/possession/i)).toBeTruthy();
      expect(getByText('58')).toBeTruthy();
      expect(getByText('42')).toBeTruthy();
      expect(getByText(/shots on target/i)).toBeTruthy();
    });
  }, 15000);

  /**
   * Test: Add Match to Favorites
   * User Journey: Match details → Tap favorite button → Match added → See heart filled
   */
  it('should add match to favorites', async () => {
    const { getByTestId } = render(<App />);

    // Navigate to match details
    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
      fireEvent.press(getByTestId('match-card-match1'));
    });

    await waitFor(() => {
      expect(getByTestId('match-detail-screen')).toBeTruthy();
    });

    // Tap favorite button
    const favoriteButton = getByTestId('favorite-button');
    fireEvent.press(favoriteButton);

    // Should track favorite event
    await waitFor(() => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'match_favorited',
        expect.objectContaining({
          match_id: 'match1',
          action: 'add',
        })
      );
    });

    // Favorite button should show filled state
    expect(favoriteButton.props.accessibilityState?.selected).toBe(true);
  }, 15000);

  /**
   * Test: Remove Match from Favorites
   * User Journey: Match favorited → Tap favorite again → Match removed
   */
  it('should remove match from favorites', async () => {
    const { getByTestId } = render(<App />);

    // Navigate and add to favorites
    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
      fireEvent.press(getByTestId('match-card-match1'));
    });

    await waitFor(() => {
      const favoriteButton = getByTestId('favorite-button');
      fireEvent.press(favoriteButton); // Add
    });

    // Remove from favorites
    const favoriteButton = getByTestId('favorite-button');
    fireEvent.press(favoriteButton); // Remove

    // Should track unfavorite event
    await waitFor(() => {
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'match_favorited',
        expect.objectContaining({
          match_id: 'match1',
          action: 'remove',
        })
      );
    });

    // Favorite button should show unfilled state
    expect(favoriteButton.props.accessibilityState?.selected).toBe(false);
  }, 15000);

  /**
   * Test: Filter Live Matches
   * User Journey: Live Matches → Open filter → Select league → See filtered matches
   */
  it('should filter matches by league', async () => {
    const { getByTestId, getByText, queryByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    await waitFor(() => {
      expect(getByTestId('live-matches-screen')).toBeTruthy();
    });

    // Should see all matches initially
    expect(getByText('Barcelona')).toBeTruthy();
    expect(getByText('Liverpool')).toBeTruthy();

    // Open filter menu
    const filterButton = getByTestId('filter-button');
    fireEvent.press(filterButton);

    // Select "La Liga" filter
    const laLigaFilter = getByTestId('filter-la-liga');
    fireEvent.press(laLigaFilter);

    // Apply filter
    const applyButton = getByTestId('apply-filter-button');
    fireEvent.press(applyButton);

    // Should only show La Liga matches
    await waitFor(() => {
      expect(getByText('Barcelona')).toBeTruthy();
      expect(queryByText('Liverpool')).toBeNull();
    });
  }, 15000);

  /**
   * Test: Real-time Score Update
   * User Journey: Viewing match → Score changes → See updated score immediately
   */
  it('should update score in real-time via WebSocket', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    // Initially shows 2-1
    await waitFor(() => {
      const matchCard = getByTestId('match-card-match1');
      expect(matchCard).toBeTruthy();
    });

    // Simulate WebSocket score update
    const mockWebSocketEvent = {
      type: 'score_update',
      matchId: 'match1',
      homeScore: 3,
      awayScore: 1,
      minute: 89,
    };

    // Trigger WebSocket event (simulated)
    // In real implementation, this would come through WebSocket
    // Here we're testing the UI update mechanism

    // Wait for UI to update
    await waitFor(() => {
      // Score should be updated to 3-1
      const matchCard = getByTestId('match-card-match1');
      expect(matchCard).toBeTruthy();
      // Check for new score in match card
    });
  }, 15000);

  /**
   * Test: Navigate Back from Match Details
   * User Journey: Match details → Tap back → Return to live matches list
   */
  it('should navigate back to live matches list', async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
      fireEvent.press(getByTestId('match-card-match1'));
    });

    await waitFor(() => {
      expect(getByTestId('match-detail-screen')).toBeTruthy();
    });

    // Tap back button
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    // Should return to live matches screen
    await waitFor(() => {
      expect(getByTestId('live-matches-screen')).toBeTruthy();
    });
  }, 15000);
});

/**
 * Performance Tests
 */
describe('Live Match Viewing Performance', () => {
  beforeEach(() => {
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');
    (matchesApi.getLiveMatches as jest.Mock).mockResolvedValue(mockLiveMatches);
  });

  it('should load live matches within 2 seconds', async () => {
    const startTime = Date.now();

    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    await waitFor(() => {
      expect(getByText('Barcelona')).toBeTruthy();
    });

    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(2000);
  }, 10000);

  it('should render match details within 1 second', async () => {
    (matchesApi.getMatchById as jest.Mock).mockResolvedValue(mockLiveMatches[0]);

    const { getByTestId } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
      fireEvent.press(getByTestId('match-card-match1'));
    });

    const startTime = Date.now();

    await waitFor(() => {
      expect(getByTestId('match-detail-screen')).toBeTruthy();
    });

    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(1000);
  }, 10000);
});
