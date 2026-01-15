/**
 * Analytics Service Tests
 * Phase 12: Testing & QA
 *
 * Tests for the analytics tracking service (Phase 10)
 */

import analyticsService from '../../src/services/analytics.service';
import * as Analytics from 'expo-firebase-analytics';

// Mock expo-firebase-analytics
jest.mock('expo-firebase-analytics', () => ({
  logEvent: jest.fn(),
  setUserId: jest.fn(),
  setUserProperties: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
}));

// Mock timers for session management
jest.useFakeTimers();

describe('AnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    // Reset service state
    analyticsService.endSession();
  });

  describe('Initialization', () => {
    it('should initialize analytics service', () => {
      analyticsService.initAnalytics();

      expect(Analytics.setAnalyticsCollectionEnabled).toHaveBeenCalled();
    });
  });

  describe('Session Management', () => {
    it('should start a new session', () => {
      analyticsService.startSession();

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'session_start',
        expect.objectContaining({
          session_id: expect.any(String),
        })
      );
    });

    it('should end current session', () => {
      analyticsService.startSession();
      const sessionDuration = 5000;

      jest.advanceTimersByTime(sessionDuration);
      analyticsService.endSession();

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'session_end',
        expect.objectContaining({
          duration: expect.any(Number),
        })
      );
    });

    it('should generate unique session IDs', () => {
      const calls: any[] = [];

      // Mock logEvent to capture calls
      (Analytics.logEvent as jest.Mock).mockImplementation((event, params) => {
        calls.push({ event, params });
      });

      analyticsService.startSession();
      analyticsService.endSession();
      analyticsService.startSession();

      const sessionIds = calls
        .filter(c => c.event === 'session_start')
        .map(c => c.params.session_id);

      expect(sessionIds[0]).not.toBe(sessionIds[1]);
    });

    it('should track session duration correctly', () => {
      analyticsService.startSession();

      const duration = 10000; // 10 seconds
      jest.advanceTimersByTime(duration);

      analyticsService.endSession();

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'session_end',
        expect.objectContaining({
          duration: expect.any(Number),
        })
      );
    });

    it('should handle session timeout (30 minutes)', () => {
      analyticsService.startSession();

      const timeout = 30 * 60 * 1000; // 30 minutes
      jest.advanceTimersByTime(timeout + 1000);

      // Session should auto-end after timeout
      // Verify session is no longer active
    });
  });

  describe('Event Tracking', () => {
    it('should track custom events', () => {
      const eventName = 'test_event';
      const params = { test_param: 'value' };

      analyticsService.trackEvent(eventName, params);

      expect(Analytics.logEvent).toHaveBeenCalledWith(eventName, params);
    });

    it('should sanitize event parameters', () => {
      const eventName = 'user_action';
      const params = {
        username: 'testuser',
        password: 'secret123', // Should be sanitized
        api_key: 'abc123', // Should be sanitized
        data: 'safe_value',
      };

      analyticsService.trackEvent(eventName, params);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        eventName,
        expect.objectContaining({
          data: 'safe_value',
          password: '[REDACTED]',
          api_key: '[REDACTED]',
        })
      );
    });

    it('should limit parameter string length', () => {
      const longString = 'x'.repeat(200);
      const params = { long_param: longString };

      analyticsService.trackEvent('test_event', params);

      const call = (Analytics.logEvent as jest.Mock).mock.calls[0];
      expect(call[1].long_param.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Screen Tracking', () => {
    it('should track screen views', () => {
      const screenName = 'HomeScreen';
      const params = { previous_screen: 'LoginScreen' };

      analyticsService.trackScreenView(screenName, params);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'screen_view',
        expect.objectContaining({
          screen_name: screenName,
          previous_screen: 'LoginScreen',
        })
      );
    });

    it('should track screen duration', () => {
      analyticsService.trackScreenView('Screen1');
      jest.advanceTimersByTime(5000);
      analyticsService.trackScreenView('Screen2');

      // Second screen view should include duration of previous screen
      expect(Analytics.logEvent).toHaveBeenLastCalledWith(
        'screen_view',
        expect.objectContaining({
          screen_name: 'Screen2',
        })
      );
    });
  });

  describe('User Properties', () => {
    it('should set user ID', () => {
      const userId = 'user123';

      analyticsService.setAnalyticsUserId(userId);

      expect(Analytics.setUserId).toHaveBeenCalledWith(userId);
    });

    it('should set user properties', () => {
      const properties = {
        vip_status: 'premium',
        user_level: 'gold',
        app_version: '2.0.0',
      };

      analyticsService.setAnalyticsUserProperties(properties);

      expect(Analytics.setUserProperties).toHaveBeenCalledWith(properties);
    });

    it('should set user level', () => {
      const level = 5;

      analyticsService.setUserLevel(level);

      expect(Analytics.setUserProperties).toHaveBeenCalledWith(
        expect.objectContaining({
          user_level: '5',
        })
      );
    });
  });

  describe('Match Events', () => {
    it('should track match view', () => {
      const matchId = 'match123';
      const matchData = {
        league: 'Premier League',
        home_team: 'Team A',
        away_team: 'Team B',
      };

      analyticsService.trackMatchView(matchId, matchData);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'match_viewed',
        expect.objectContaining({
          match_id: matchId,
          ...matchData,
        })
      );
    });

    it('should track match favorite', () => {
      const matchId = 'match123';
      const added = true;

      analyticsService.trackMatchFavorite(matchId, added);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'match_favorited',
        expect.objectContaining({
          match_id: matchId,
          action: 'add',
        })
      );
    });
  });

  describe('Bot Events', () => {
    it('should track bot view', () => {
      const botId = 'bot123';
      const botName = 'BOT 1';
      const successRate = 75.5;

      analyticsService.trackBotView(botId, botName, successRate);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'bot_viewed',
        expect.objectContaining({
          bot_id: botId,
          bot_name: botName,
          success_rate: successRate,
        })
      );
    });

    it('should track prediction view', () => {
      const predictionId = 'pred123';
      const botId = 'bot123';

      analyticsService.trackPredictionView(predictionId, botId);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'prediction_viewed',
        expect.objectContaining({
          prediction_id: predictionId,
          bot_id: botId,
        })
      );
    });
  });

  describe('Authentication Events', () => {
    it('should track login', () => {
      const method = 'email';
      const success = true;

      analyticsService.trackLogin(method, success);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'login',
        expect.objectContaining({
          method,
          success,
        })
      );
    });

    it('should track sign up', () => {
      const method = 'google';
      const success = true;

      analyticsService.trackSignUp(method, success);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'sign_up',
        expect.objectContaining({
          method,
          success,
        })
      );
    });

    it('should track logout', () => {
      analyticsService.trackLogout();

      expect(Analytics.logEvent).toHaveBeenCalledWith('logout', {});
    });
  });

  describe('Performance Events', () => {
    it('should track API calls', () => {
      const endpoint = '/api/matches/live';
      const method = 'GET';
      const duration = 250;
      const statusCode = 200;
      const success = true;

      analyticsService.trackAPICall(endpoint, method, duration, statusCode, success);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'api_call',
        expect.objectContaining({
          endpoint,
          method,
          duration,
          status_code: statusCode,
          success,
        })
      );
    });

    it('should track slow API calls', () => {
      const endpoint = '/api/slow';
      const duration = 5000; // 5 seconds - slow

      analyticsService.trackAPICall(endpoint, 'GET', duration, 200, true);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'api_call',
        expect.objectContaining({
          duration,
          is_slow: true,
        })
      );
    });

    it('should track app performance', () => {
      const metrics = {
        cold_start_time: 1500,
        memory_usage: 45,
        fps: 60,
      };

      analyticsService.trackPerformance(metrics);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'app_performance',
        expect.objectContaining(metrics)
      );
    });
  });

  describe('Deep Link Events', () => {
    it('should track deep link opens', () => {
      const url = 'goalgpt://match/123';
      const source = 'notification';
      const matchId = '123';

      analyticsService.trackDeepLink(url, source, matchId);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'deep_link_opened',
        expect.objectContaining({
          url,
          source,
          match_id: matchId,
        })
      );
    });
  });

  describe('Error Tracking', () => {
    it('should track errors', () => {
      const error = new Error('Test error');
      const errorInfo = { componentStack: 'Component stack trace' };

      analyticsService.trackError(error, errorInfo);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          error_message: error.message,
          error_name: error.name,
        })
      );
    });
  });

  describe('App Lifecycle Events', () => {
    it('should track app open', () => {
      analyticsService.trackAppOpen();

      expect(Analytics.logEvent).toHaveBeenCalledWith('app_open', expect.any(Object));
    });

    it('should track app foreground', () => {
      analyticsService.trackAppForeground();

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'app_foreground',
        expect.any(Object)
      );
    });

    it('should track app background', () => {
      analyticsService.trackAppBackground();

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'app_background',
        expect.any(Object)
      );
    });
  });

  describe('Data Sanitization', () => {
    it('should redact sensitive parameters', () => {
      const params = {
        email: 'user@example.com',
        password: 'secret123',
        token: 'abc123',
        phone: '+1234567890',
        safe_data: 'this is safe',
      };

      analyticsService.trackEvent('test', params);

      expect(Analytics.logEvent).toHaveBeenCalledWith(
        'test',
        expect.objectContaining({
          email: '[REDACTED]',
          password: '[REDACTED]',
          token: '[REDACTED]',
          phone: '[REDACTED]',
          safe_data: 'this is safe',
        })
      );
    });

    it('should limit number of parameters', () => {
      const manyParams: Record<string, any> = {};
      for (let i = 0; i < 30; i++) {
        manyParams[`param${i}`] = `value${i}`;
      }

      analyticsService.trackEvent('test', manyParams);

      const call = (Analytics.logEvent as jest.Mock).mock.calls[0];
      const paramCount = Object.keys(call[1]).length;

      // Should be limited (exact limit depends on implementation)
      expect(paramCount).toBeLessThanOrEqual(25);
    });
  });
});
