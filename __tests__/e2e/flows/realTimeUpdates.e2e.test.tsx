/**
 * Real-Time Updates E2E Test
 * Phase 12: Testing & QA - E2E Tests
 *
 * Tests real-time WebSocket updates for live scores and match events
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import App from '../../../App';
import { TokenStorage } from '../../../src/api/client';
import websocketService from '../../../src/services/websocket.service';
import analyticsService from '../../../src/services/analytics.service';

// Mock dependencies
jest.mock('../../../src/api/client');
jest.mock('../../../src/services/websocket.service');
jest.mock('../../../src/services/analytics.service');

describe('Real-Time Updates E2E Flow', () => {
  let mockWebSocketHandlers: Record<string, Function> = {};

  beforeEach(() => {
    jest.clearAllMocks();
    mockWebSocketHandlers = {};

    // Start with authenticated state
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');

    // Mock WebSocket service
    (websocketService.connect as jest.Mock).mockImplementation(() => {
      return Promise.resolve();
    });

    (websocketService.on as jest.Mock).mockImplementation((event: string, handler: Function) => {
      mockWebSocketHandlers[event] = handler;
      return jest.fn(); // Unsubscribe function
    });

    (websocketService.onStatusChange as jest.Mock).mockImplementation((callback: Function) => {
      // Immediately set to connected
      callback({
        connected: true,
        reconnecting: false,
        reconnectAttempts: 0,
        error: null,
      });
      return jest.fn();
    });
  });

  /**
   * Test: Receive Live Score Update
   * User Journey: Viewing match → Score changes → See updated score immediately
   */
  it('should receive and display real-time score updates', async () => {
    const { getByTestId, getByText } = render(<App />);

    // Navigate to live matches
    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    await waitFor(() => {
      expect(getByTestId('live-matches-screen')).toBeTruthy();
    });

    // Initially shows match with score 2-1
    await waitFor(() => {
      expect(getByText('2')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
    });

    // Simulate WebSocket score update
    act(() => {
      const scoreUpdateHandler = mockWebSocketHandlers['score_update'];
      if (scoreUpdateHandler) {
        scoreUpdateHandler({
          type: 'score_update',
          matchId: 'match1',
          homeScore: 3,
          awayScore: 1,
          minute: 89,
          event: {
            type: 'goal',
            team: 'home',
            player: 'Messi',
            minute: 89,
          },
        });
      }
    });

    // Should update to new score 3-1
    await waitFor(() => {
      expect(getByText('3')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
    });

    // Should track real-time update
    expect(analyticsService.trackEvent).toHaveBeenCalledWith(
      'real_time_update',
      expect.objectContaining({
        type: 'score_update',
        match_id: 'match1',
      })
    );
  }, 15000);

  /**
   * Test: Receive Match State Change
   * User Journey: Viewing match → Match goes to half time → See updated status
   */
  it('should receive and display match state changes', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    await waitFor(() => {
      expect(getByTestId('live-matches-screen')).toBeTruthy();
    });

    // Initially shows "45'" (end of first half)
    await waitFor(() => {
      expect(getByText(/45'/)).toBeTruthy();
    });

    // Simulate match state change to half time
    act(() => {
      const stateChangeHandler = mockWebSocketHandlers['match_state_change'];
      if (stateChangeHandler) {
        stateChangeHandler({
          type: 'match_state_change',
          matchId: 'match1',
          statusId: 3, // Half time
          minute: 45,
        });
      }
    });

    // Should show "HT" (Half Time)
    await waitFor(() => {
      expect(getByText(/HT/i)).toBeTruthy();
    });
  }, 15000);

  /**
   * Test: Receive Goal Event
   * User Journey: Viewing match → Goal scored → See goal notification
   */
  it('should show notification for goal events', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    await waitFor(() => {
      expect(getByTestId('live-matches-screen')).toBeTruthy();
    });

    // Simulate goal event
    act(() => {
      const goalHandler = mockWebSocketHandlers['goal_event'];
      if (goalHandler) {
        goalHandler({
          type: 'goal_event',
          matchId: 'match1',
          minute: 67,
          team: 'home',
          player: 'Messi',
          homeScore: 3,
          awayScore: 1,
        });
      }
    });

    // Should show goal notification
    await waitFor(() => {
      expect(getByText(/GOAL!/i)).toBeTruthy();
      expect(getByText(/Messi/i)).toBeTruthy();
      expect(getByText(/67'/)).toBeTruthy();
    });

    // Notification should auto-dismiss after 5 seconds
    await waitFor(() => {
      expect(getByText(/GOAL!/i)).toBeUndefined();
    }, { timeout: 6000 });
  }, 15000);

  /**
   * Test: Receive Red Card Event
   * User Journey: Viewing match → Red card shown → See red card indicator
   */
  it('should display red card events', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
      fireEvent.press(getByTestId('match-card-match1'));
    });

    await waitFor(() => {
      expect(getByTestId('match-detail-screen')).toBeTruthy();
    });

    // Simulate red card event
    act(() => {
      const cardHandler = mockWebSocketHandlers['card_event'];
      if (cardHandler) {
        cardHandler({
          type: 'card_event',
          matchId: 'match1',
          cardType: 'red',
          minute: 78,
          team: 'away',
          player: 'Ramos',
        });
      }
    });

    // Should show red card indicator
    await waitFor(() => {
      expect(getByText(/🟥/)).toBeTruthy();
      expect(getByText(/Ramos/i)).toBeTruthy();
      expect(getByText(/78'/)).toBeTruthy();
    });
  }, 15000);

  /**
   * Test: WebSocket Reconnection
   * User Journey: Viewing match → Connection lost → Auto reconnect → Continue receiving updates
   */
  it('should handle WebSocket disconnection and reconnection', async () => {
    let statusCallback: Function;

    (websocketService.onStatusChange as jest.Mock).mockImplementation((callback: Function) => {
      statusCallback = callback;
      // Start connected
      callback({
        connected: true,
        reconnecting: false,
        reconnectAttempts: 0,
        error: null,
      });
      return jest.fn();
    });

    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    // Simulate disconnection
    act(() => {
      statusCallback({
        connected: false,
        reconnecting: true,
        reconnectAttempts: 1,
        error: new Error('Connection lost'),
      });
    });

    // Should show reconnecting indicator
    await waitFor(() => {
      expect(getByText(/reconnecting/i)).toBeTruthy();
    });

    // Simulate successful reconnection
    act(() => {
      statusCallback({
        connected: true,
        reconnecting: false,
        reconnectAttempts: 0,
        error: null,
      });
    });

    // Should hide reconnecting indicator
    await waitFor(() => {
      expect(getByText(/reconnecting/i)).toBeUndefined();
    });

    // Should continue receiving updates
    act(() => {
      const scoreUpdateHandler = mockWebSocketHandlers['score_update'];
      if (scoreUpdateHandler) {
        scoreUpdateHandler({
          type: 'score_update',
          matchId: 'match1',
          homeScore: 3,
          awayScore: 2,
        });
      }
    });

    await waitFor(() => {
      expect(getByText('3')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
    });
  }, 15000);

  /**
   * Test: Multiple Concurrent Updates
   * User Journey: Viewing matches → Multiple matches update → All updates shown
   */
  it('should handle multiple concurrent real-time updates', async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    await waitFor(() => {
      expect(getByTestId('live-matches-screen')).toBeTruthy();
    });

    // Simulate multiple simultaneous updates
    act(() => {
      const scoreUpdateHandler = mockWebSocketHandlers['score_update'];
      if (scoreUpdateHandler) {
        // Update match 1
        scoreUpdateHandler({
          type: 'score_update',
          matchId: 'match1',
          homeScore: 3,
          awayScore: 1,
        });

        // Update match 2
        scoreUpdateHandler({
          type: 'score_update',
          matchId: 'match2',
          homeScore: 2,
          awayScore: 2,
        });

        // Update match 3
        scoreUpdateHandler({
          type: 'score_update',
          matchId: 'match3',
          homeScore: 1,
          awayScore: 0,
        });
      }
    });

    // All updates should be reflected
    await waitFor(() => {
      const match1Card = getByTestId('match-card-match1');
      const match2Card = getByTestId('match-card-match2');
      const match3Card = getByTestId('match-card-match3');

      expect(match1Card).toBeTruthy();
      expect(match2Card).toBeTruthy();
      expect(match3Card).toBeTruthy();
    });
  }, 15000);

  /**
   * Test: Prediction Result Update
   * User Journey: Viewing predictions → Match ends → Prediction result updated
   */
  it('should update prediction results in real-time', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('predictions-tab'));
      fireEvent.press(getByTestId('bot-card-1'));
    });

    await waitFor(() => {
      expect(getByTestId('bot-detail-screen')).toBeTruthy();
    });

    // Initially shows "pending" prediction
    await waitFor(() => {
      expect(getByText(/pending/i)).toBeTruthy();
    });

    // Simulate prediction result update
    act(() => {
      const predictionResultHandler = mockWebSocketHandlers['prediction_result'];
      if (predictionResultHandler) {
        predictionResultHandler({
          type: 'prediction_result',
          predictionId: 'pred1',
          result: 'won',
          finalScore: '3-1',
        });
      }
    });

    // Should update to "won"
    await waitFor(() => {
      expect(getByText(/won/i)).toBeTruthy();
      expect(getByText('3-1')).toBeTruthy();
    });
  }, 15000);

  /**
   * Test: Match Finish Event
   * User Journey: Viewing live match → Match ends → See final score and status
   */
  it('should handle match finish event', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
      fireEvent.press(getByTestId('match-card-match1'));
    });

    await waitFor(() => {
      expect(getByTestId('match-detail-screen')).toBeTruthy();
    });

    // Simulate match finish
    act(() => {
      const matchFinishHandler = mockWebSocketHandlers['match_finish'];
      if (matchFinishHandler) {
        matchFinishHandler({
          type: 'match_finish',
          matchId: 'match1',
          statusId: 8, // Finished
          finalScore: {
            home: 3,
            away: 1,
          },
        });
      }
    });

    // Should show "FT" (Full Time)
    await waitFor(() => {
      expect(getByText(/FT/i)).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
    });

    // Match should move from live to finished matches
    fireEvent.press(getByTestId('back-button'));

    await waitFor(() => {
      // Should be in finished matches section
      const finishedTab = getByTestId('finished-tab');
      fireEvent.press(finishedTab);
    });

    await waitFor(() => {
      expect(getByText('Barcelona')).toBeTruthy();
      expect(getByText(/FT/i)).toBeTruthy();
    });
  }, 15000);

  /**
   * Test: High Frequency Updates
   * User Journey: Viewing match → Rapid updates (every second) → All updates processed
   */
  it('should handle high-frequency updates efficiently', async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    await waitFor(() => {
      expect(getByTestId('live-matches-screen')).toBeTruthy();
    });

    // Simulate 20 rapid updates
    act(() => {
      const minuteUpdateHandler = mockWebSocketHandlers['minute_update'];
      if (minuteUpdateHandler) {
        for (let i = 70; i <= 90; i++) {
          minuteUpdateHandler({
            type: 'minute_update',
            matchId: 'match1',
            minute: i,
          });
        }
      }
    });

    // Should show latest minute (90')
    await waitFor(() => {
      expect(getByTestId('match-minute-match1')).toHaveTextContent('90\'');
    });

    // Should not cause performance issues
    const fpsIndicator = getByTestId('fps-indicator');
    expect(parseInt(fpsIndicator.props.children)).toBeGreaterThan(55); // Above 55 FPS
  }, 15000);
});

/**
 * Performance Tests
 */
describe('Real-Time Updates Performance', () => {
  beforeEach(() => {
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');
  });

  it('should process score updates within 100ms', async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    const startTime = Date.now();

    // Simulate score update
    act(() => {
      const mockWebSocketHandlers: any = {};
      const scoreUpdateHandler = mockWebSocketHandlers['score_update'];
      if (scoreUpdateHandler) {
        scoreUpdateHandler({
          type: 'score_update',
          matchId: 'match1',
          homeScore: 3,
          awayScore: 1,
        });
      }
    });

    await waitFor(() => {
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100);
    });
  }, 10000);

  it('should maintain 60 FPS during real-time updates', async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      fireEvent.press(getByTestId('live-matches-tab'));
    });

    // Monitor FPS during updates
    const fpsMonitor = getByTestId('fps-monitor');

    // Simulate continuous updates for 5 seconds
    act(() => {
      const interval = setInterval(() => {
        const mockWebSocketHandlers: any = {};
        const handler = mockWebSocketHandlers['minute_update'];
        if (handler) {
          handler({ type: 'minute_update', matchId: 'match1', minute: 70 });
        }
      }, 1000);

      setTimeout(() => clearInterval(interval), 5000);
    });

    // FPS should remain above 55
    await waitFor(() => {
      const fps = parseInt(fpsMonitor.props.children);
      expect(fps).toBeGreaterThan(55);
    }, { timeout: 6000 });
  }, 10000);
});
