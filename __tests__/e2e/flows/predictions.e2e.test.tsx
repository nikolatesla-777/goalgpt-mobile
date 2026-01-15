/**
 * Predictions E2E Test
 * Phase 12: Testing & QA - E2E Tests
 *
 * Tests the complete flow of viewing bot predictions and bot details
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../../App';
import { TokenStorage } from '../../../src/api/client';
import analyticsService from '../../../src/services/analytics.service';
import * as predictionsApi from '../../../src/api/predictions.api';

// Mock dependencies
jest.mock('../../../src/api/client');
jest.mock('../../../src/services/analytics.service');
jest.mock('../../../src/api/predictions.api');

// Mock data
const mockBots = [
  {
    id: 1,
    name: 'BOT 1',
    icon: '🤖',
    success_rate: 78.5,
    total_predictions: 450,
    stats: {
      today: { total: 12, wins: 9, rate: 75 },
      yesterday: { total: 15, wins: 11, rate: 73.3 },
      monthly: { total: 234, wins: 184, rate: 78.6 },
    },
  },
  {
    id: 2,
    name: 'BOT 2',
    icon: '🎯',
    success_rate: 82.3,
    total_predictions: 320,
    stats: {
      today: { total: 8, wins: 7, rate: 87.5 },
      yesterday: { total: 10, wins: 8, rate: 80 },
      monthly: { total: 198, wins: 163, rate: 82.3 },
    },
  },
];

const mockPredictions = [
  {
    id: 'pred1',
    bot_id: 1,
    match: {
      id: 'match1',
      home_team: 'Barcelona',
      away_team: 'Real Madrid',
      league: 'La Liga',
    },
    prediction: {
      type: 'Over 2.5 Goals',
      confidence: 85,
    },
    status: 'pending',
  },
  {
    id: 'pred2',
    bot_id: 1,
    match: {
      id: 'match2',
      home_team: 'Liverpool',
      away_team: 'Man City',
      league: 'Premier League',
    },
    prediction: {
      type: 'Home Win',
      confidence: 72,
    },
    status: 'won',
  },
];

describe('Predictions E2E Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Start with authenticated state
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');
    (predictionsApi.getBots as jest.Mock).mockResolvedValue(mockBots);
    (predictionsApi.getBotPredictions as jest.Mock).mockResolvedValue(mockPredictions);
  });

  /**
   * Test: View Predictions List
   * User Journey: Open app → Navigate to Predictions → See list of bots
   */
  it('should display list of prediction bots', async () => {
    const { getByTestId, getByText } = render(<App />);

    // Wait for home screen
    await waitFor(() => {
      expect(getByTestId('home-screen')).toBeTruthy();
    });

    // Navigate to Predictions tab
    const predictionsTab = getByTestId('predictions-tab');
    fireEvent.press(predictionsTab);

    // Wait for predictions screen
    await waitFor(() => {
      expect(getByTestId('predictions-screen')).toBeTruthy();
    });

    // Should fetch bots
    expect(predictionsApi.getBots).toHaveBeenCalled();

    // Should display bots
    await waitFor(() => {
      expect(getByText('BOT 1')).toBeTruthy();
      expect(getByText('BOT 2')).toBeTruthy();
      expect(getByText(/78.5%/)).toBeTruthy(); // Success rate
      expect(getByText(/82.3%/)).toBeTruthy();
    });

    // Should track screen view
    expect(analyticsService.trackScreenView).toHaveBeenCalledWith(
      'PredictionsScreen',
      expect.any(Object)
    );
  }, 15000);

  /**
   * Test: View Bot Details
   * User Journey: Predictions → Tap bot → See bot details and predictions
   */
  it('should navigate to bot details when tapping a bot', async () => {
    const { getByTestId, getByText } = render(<App />);

    // Navigate to Predictions
    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
    });

    await waitFor(() => {
      expect(getByTestId('predictions-screen')).toBeTruthy();
    });

    // Tap on first bot
    const botCard = getByTestId('bot-card-1');
    fireEvent.press(botCard);

    // Should navigate to bot detail screen
    await waitFor(() => {
      expect(getByTestId('bot-detail-screen')).toBeTruthy();
    });

    // Should fetch bot predictions
    expect(predictionsApi.getBotPredictions).toHaveBeenCalledWith(1);

    // Should display bot details
    await waitFor(() => {
      expect(getByText('BOT 1')).toBeTruthy();
      expect(getByText(/78.5%/)).toBeTruthy();
      expect(getByText(/450/)).toBeTruthy(); // Total predictions
    });

    // Should track bot view
    expect(analyticsService.trackEvent).toHaveBeenCalledWith(
      'bot_viewed',
      expect.objectContaining({
        bot_id: 1,
        bot_name: 'BOT 1',
      })
    );
  }, 15000);

  /**
   * Test: View Bot Predictions
   * User Journey: Bot details → See list of predictions → See match info
   */
  it('should display bot predictions list', async () => {
    const { getByTestId, getByText } = render(<App />);

    // Navigate to bot details
    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
      fireEvent.press(getByTestId('bot-card-1'));
    });

    await waitFor(() => {
      expect(getByTestId('bot-detail-screen')).toBeTruthy();
    });

    // Should display predictions
    await waitFor(() => {
      expect(getByText('Barcelona')).toBeTruthy();
      expect(getByText('Real Madrid')).toBeTruthy();
      expect(getByText('Over 2.5 Goals')).toBeTruthy();
      expect(getByText(/85%/)).toBeTruthy(); // Confidence
    });

    // Should display prediction status
    expect(getByText(/pending/i)).toBeTruthy();
    expect(getByText(/won/i)).toBeTruthy();
  }, 15000);

  /**
   * Test: Filter Predictions by Status
   * User Journey: Bot details → Filter by "Won" → See only winning predictions
   */
  it('should filter predictions by status', async () => {
    const { getByTestId, getByText, queryByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
      fireEvent.press(getByTestId('bot-card-1'));
    });

    await waitFor(() => {
      expect(getByTestId('bot-detail-screen')).toBeTruthy();
    });

    // Should see all predictions initially
    expect(getByText('Over 2.5 Goals')).toBeTruthy();
    expect(getByText('Home Win')).toBeTruthy();

    // Select "Won" filter
    const wonFilterButton = getByTestId('filter-won');
    fireEvent.press(wonFilterButton);

    // Should only show won predictions
    await waitFor(() => {
      expect(getByText('Home Win')).toBeTruthy(); // Won prediction
      expect(queryByText('Over 2.5 Goals')).toBeNull(); // Pending prediction
    });
  }, 15000);

  /**
   * Test: View Bot Statistics
   * User Journey: Bot details → Stats tab → See win rate, total predictions, etc.
   */
  it('should display bot statistics', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
      fireEvent.press(getByTestId('bot-card-1'));
    });

    await waitFor(() => {
      expect(getByTestId('bot-detail-screen')).toBeTruthy();
    });

    // Navigate to Stats tab
    const statsTab = getByTestId('stats-tab');
    fireEvent.press(statsTab);

    // Should display statistics
    await waitFor(() => {
      // Today's stats
      expect(getByText(/today/i)).toBeTruthy();
      expect(getByText('9')).toBeTruthy(); // 9 wins
      expect(getByText('12')).toBeTruthy(); // 12 total

      // Monthly stats
      expect(getByText(/month/i)).toBeTruthy();
      expect(getByText('184')).toBeTruthy(); // 184 wins
      expect(getByText('234')).toBeTruthy(); // 234 total
    });
  }, 15000);

  /**
   * Test: Tap Prediction to View Match
   * User Journey: Bot predictions → Tap prediction → Navigate to match details
   */
  it('should navigate to match details when tapping a prediction', async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
      fireEvent.press(getByTestId('bot-card-1'));
    });

    await waitFor(() => {
      expect(getByTestId('bot-detail-screen')).toBeTruthy();
    });

    // Tap on a prediction
    const predictionCard = getByTestId('prediction-card-pred1');
    fireEvent.press(predictionCard);

    // Should navigate to match detail screen
    await waitFor(() => {
      expect(getByTestId('match-detail-screen')).toBeTruthy();
    });

    // Should track prediction view
    expect(analyticsService.trackEvent).toHaveBeenCalledWith(
      'prediction_viewed',
      expect.objectContaining({
        prediction_id: 'pred1',
        bot_id: 1,
      })
    );
  }, 15000);

  /**
   * Test: Compare Multiple Bots
   * User Journey: Bot details → Tap "Compare" → See comparison view
   */
  it('should compare multiple bots', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
    });

    await waitFor(() => {
      expect(getByTestId('predictions-screen')).toBeTruthy();
    });

    // Select first bot for comparison
    const compareButton1 = getByTestId('compare-button-1');
    fireEvent.press(compareButton1);

    // Select second bot for comparison
    const compareButton2 = getByTestId('compare-button-2');
    fireEvent.press(compareButton2);

    // Tap "Compare Selected" button
    const compareSelectedButton = getByTestId('compare-selected-button');
    fireEvent.press(compareSelectedButton);

    // Should show comparison view
    await waitFor(() => {
      expect(getByTestId('bot-comparison-screen')).toBeTruthy();
    });

    // Should display both bots' stats
    await waitFor(() => {
      expect(getByText('BOT 1')).toBeTruthy();
      expect(getByText('BOT 2')).toBeTruthy();
      expect(getByText(/78.5%/)).toBeTruthy();
      expect(getByText(/82.3%/)).toBeTruthy();
    });
  }, 15000);

  /**
   * Test: Filter Predictions by League
   * User Journey: Bot details → Filter by league → See league-specific predictions
   */
  it('should filter predictions by league', async () => {
    const { getByTestId, getByText, queryByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
      fireEvent.press(getByTestId('bot-card-1'));
    });

    await waitFor(() => {
      expect(getByTestId('bot-detail-screen')).toBeTruthy();
    });

    // Open league filter
    const leagueFilterButton = getByTestId('league-filter-button');
    fireEvent.press(leagueFilterButton);

    // Select "La Liga"
    const laLigaOption = getByTestId('league-option-la-liga');
    fireEvent.press(laLigaOption);

    // Apply filter
    const applyButton = getByTestId('apply-filter-button');
    fireEvent.press(applyButton);

    // Should only show La Liga predictions
    await waitFor(() => {
      expect(getByText('Barcelona')).toBeTruthy();
      expect(queryByText('Liverpool')).toBeNull();
    });
  }, 15000);

  /**
   * Test: View Prediction History
   * User Journey: Bot details → History tab → See past predictions
   */
  it('should display prediction history', async () => {
    const mockHistory = [
      {
        id: 'hist1',
        date: '2026-01-14',
        result: 'won',
        prediction: 'Over 2.5',
        match: 'Barcelona vs Real Madrid',
      },
      {
        id: 'hist2',
        date: '2026-01-13',
        result: 'lost',
        prediction: 'Home Win',
        match: 'Liverpool vs Man City',
      },
    ];

    (predictionsApi.getBotHistory as jest.Mock).mockResolvedValue(mockHistory);

    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
      fireEvent.press(getByTestId('bot-card-1'));
    });

    await waitFor(() => {
      expect(getByTestId('bot-detail-screen')).toBeTruthy();
    });

    // Navigate to History tab
    const historyTab = getByTestId('history-tab');
    fireEvent.press(historyTab);

    // Should fetch history
    expect(predictionsApi.getBotHistory).toHaveBeenCalledWith(1);

    // Should display history
    await waitFor(() => {
      expect(getByText('2026-01-14')).toBeTruthy();
      expect(getByText('2026-01-13')).toBeTruthy();
      expect(getByText(/won/i)).toBeTruthy();
      expect(getByText(/lost/i)).toBeTruthy();
    });
  }, 15000);

  /**
   * Test: Switch Between Bots
   * User Journey: Bot 1 details → Swipe → See Bot 2 details
   */
  it('should allow swiping between bots', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
      fireEvent.press(getByTestId('bot-card-1'));
    });

    await waitFor(() => {
      expect(getByText('BOT 1')).toBeTruthy();
    });

    // Swipe left to next bot (or tap next button)
    const nextBotButton = getByTestId('next-bot-button');
    fireEvent.press(nextBotButton);

    // Should show Bot 2
    await waitFor(() => {
      expect(getByText('BOT 2')).toBeTruthy();
      expect(getByText(/82.3%/)).toBeTruthy();
    });

    // Should fetch Bot 2's predictions
    expect(predictionsApi.getBotPredictions).toHaveBeenCalledWith(2);
  }, 15000);
});

/**
 * Performance Tests
 */
describe('Predictions Performance', () => {
  beforeEach(() => {
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');
    (predictionsApi.getBots as jest.Mock).mockResolvedValue(mockBots);
    (predictionsApi.getBotPredictions as jest.Mock).mockResolvedValue(mockPredictions);
  });

  it('should load bots list within 2 seconds', async () => {
    const startTime = Date.now();

    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
    });

    await waitFor(() => {
      expect(getByText('BOT 1')).toBeTruthy();
    });

    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(2000);
  }, 10000);

  it('should load bot details within 1 second', async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
      fireEvent.press(getByTestId('bot-card-1'));
    });

    const startTime = Date.now();

    await waitFor(() => {
      expect(getByTestId('bot-detail-screen')).toBeTruthy();
    });

    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(1000);
  }, 10000);
});
