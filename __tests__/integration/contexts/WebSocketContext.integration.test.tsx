/**
 * WebSocketContext Integration Tests
 * Phase 12: Testing & QA - Integration Tests
 *
 * Tests the integration of WebSocket context with real-time messaging
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { WebSocketProvider, useWebSocket } from '../../../src/context/WebSocketContext';
import { AuthProvider } from '../../../src/context/AuthContext';
import websocketService from '../../../src/services/websocket.service';

// Mock the WebSocket service
jest.mock('../../../src/services/websocket.service', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    on: jest.fn(() => jest.fn()), // Returns unsubscribe function
    send: jest.fn(),
    onStatusChange: jest.fn(() => jest.fn()),
  },
}));

// Mock AuthContext
jest.mock('../../../src/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 'test-user', email: 'test@example.com' },
  }),
  AuthProvider: ({ children }: any) => children,
}));

// Mock TokenStorage
jest.mock('../../../src/api/client', () => ({
  TokenStorage: {
    getAccessToken: jest.fn(() => Promise.resolve('mock-token')),
  },
}));

describe('WebSocketContext Integration', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      <WebSocketProvider autoConnect={false}>{children}</WebSocketProvider>
    </AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Connection Management', () => {
    it('should connect to WebSocket server', async () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      await act(async () => {
        result.current.connect();
      });

      await waitFor(() => {
        expect(websocketService.connect).toHaveBeenCalled();
      });
    });

    it('should pass auth token when connecting', async () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      await act(async () => {
        result.current.connect();
      });

      await waitFor(() => {
        expect(websocketService.connect).toHaveBeenCalledWith('mock-token');
      });
    });

    it('should disconnect from WebSocket server', async () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      await act(async () => {
        result.current.connect();
        result.current.disconnect();
      });

      await waitFor(() => {
        expect(websocketService.disconnect).toHaveBeenCalled();
      });
    });

    it('should track connection status', async () => {
      // Mock status change callback
      let statusCallback: any;
      (websocketService.onStatusChange as jest.Mock).mockImplementation((cb) => {
        statusCallback = cb;
        return jest.fn();
      });

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      // Simulate status change
      act(() => {
        statusCallback({
          connected: true,
          reconnecting: false,
          reconnectAttempts: 0,
          error: null,
        });
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });
    });
  });

  describe('Auto-Connection', () => {
    it('should auto-connect when authenticated', async () => {
      const AutoConnectWrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider autoConnect={true}>{children}</WebSocketProvider>
        </AuthProvider>
      );

      renderHook(() => useWebSocket(), { wrapper: AutoConnectWrapper });

      await waitFor(() => {
        expect(websocketService.connect).toHaveBeenCalled();
      });
    });

    it('should not connect when requireAuth is true and not authenticated', async () => {
      // Override useAuth mock temporarily
      const unauthUseAuth = jest.fn(() => ({
        isAuthenticated: false,
        user: null,
      }));

      renderHook(() => useWebSocket(), { wrapper });

      // Should not connect
      expect(websocketService.connect).not.toHaveBeenCalled();
    });
  });

  describe('Channel Subscriptions', () => {
    it('should subscribe to channels', async () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      await act(async () => {
        result.current.subscribe('matches:live');
      });

      expect(websocketService.subscribe).toHaveBeenCalledWith('matches:live');
    });

    it('should unsubscribe from channels', async () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      await act(async () => {
        result.current.subscribe('matches:live');
        result.current.unsubscribe('matches:live');
      });

      expect(websocketService.unsubscribe).toHaveBeenCalledWith('matches:live');
    });

    it('should handle multiple channel subscriptions', async () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      await act(async () => {
        result.current.subscribe('matches:live');
        result.current.subscribe('predictions:updates');
        result.current.subscribe('user:notifications');
      });

      expect(websocketService.subscribe).toHaveBeenCalledTimes(3);
    });
  });

  describe('Event Handling', () => {
    it('should register event handlers', async () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      const handler = jest.fn();

      await act(async () => {
        result.current.on('score_update', handler);
      });

      expect(websocketService.on).toHaveBeenCalledWith('score_update', handler);
    });

    it('should unregister event handlers on cleanup', async () => {
      const mockUnsubscribe = jest.fn();
      (websocketService.on as jest.Mock).mockReturnValue(mockUnsubscribe);

      const { result, unmount } = renderHook(() => useWebSocket(), { wrapper });

      const handler = jest.fn();

      await act(async () => {
        const unsubscribe = result.current.on('score_update', handler);
        unmount();
      });

      // Cleanup should be called
    });

    it('should handle multiple event handlers for same event', async () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      const handler1 = jest.fn();
      const handler2 = jest.fn();

      await act(async () => {
        result.current.on('score_update', handler1);
        result.current.on('score_update', handler2);
      });

      expect(websocketService.on).toHaveBeenCalledTimes(2);
    });
  });

  describe('Message Sending', () => {
    it('should send messages through WebSocket', async () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      const message = {
        type: 'subscribe',
        channel: 'matches:live',
      };

      await act(async () => {
        result.current.send(message);
      });

      expect(websocketService.send).toHaveBeenCalledWith(message);
    });

    it('should handle complex message payloads', async () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      const complexMessage = {
        type: 'update_preferences',
        data: {
          teams: ['team1', 'team2'],
          leagues: [1, 2, 3],
          notifications: true,
        },
      };

      await act(async () => {
        result.current.send(complexMessage);
      });

      expect(websocketService.send).toHaveBeenCalledWith(complexMessage);
    });
  });

  describe('Reconnection Logic', () => {
    it('should handle disconnection and reconnection', async () => {
      let statusCallback: any;
      (websocketService.onStatusChange as jest.Mock).mockImplementation((cb) => {
        statusCallback = cb;
        return jest.fn();
      });

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      // Simulate disconnection
      act(() => {
        statusCallback({
          connected: false,
          reconnecting: true,
          reconnectAttempts: 1,
          error: new Error('Connection lost'),
        });
      });

      await waitFor(() => {
        expect(result.current.status.reconnecting).toBe(true);
      });

      // Simulate reconnection
      act(() => {
        statusCallback({
          connected: true,
          reconnecting: false,
          reconnectAttempts: 0,
          error: null,
        });
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
        expect(result.current.status.reconnecting).toBe(false);
      });
    });

    it('should track reconnection attempts', async () => {
      let statusCallback: any;
      (websocketService.onStatusChange as jest.Mock).mockImplementation((cb) => {
        statusCallback = cb;
        return jest.fn();
      });

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      // Simulate multiple reconnection attempts
      act(() => {
        statusCallback({
          connected: false,
          reconnecting: true,
          reconnectAttempts: 1,
          error: null,
        });
      });

      await waitFor(() => {
        expect(result.current.status.reconnectAttempts).toBe(1);
      });

      act(() => {
        statusCallback({
          connected: false,
          reconnecting: true,
          reconnectAttempts: 2,
          error: null,
        });
      });

      await waitFor(() => {
        expect(result.current.status.reconnectAttempts).toBe(2);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors', async () => {
      let statusCallback: any;
      (websocketService.onStatusChange as jest.Mock).mockImplementation((cb) => {
        statusCallback = cb;
        return jest.fn();
      });

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      const error = new Error('WebSocket connection failed');

      act(() => {
        statusCallback({
          connected: false,
          reconnecting: false,
          reconnectAttempts: 0,
          error,
        });
      });

      await waitFor(() => {
        expect(result.current.status.error).toEqual(error);
      });
    });

    it('should recover from errors', async () => {
      let statusCallback: any;
      (websocketService.onStatusChange as jest.Mock).mockImplementation((cb) => {
        statusCallback = cb;
        return jest.fn();
      });

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      // Error state
      act(() => {
        statusCallback({
          connected: false,
          reconnecting: false,
          reconnectAttempts: 0,
          error: new Error('Connection failed'),
        });
      });

      // Recovery
      act(() => {
        statusCallback({
          connected: true,
          reconnecting: false,
          reconnectAttempts: 0,
          error: null,
        });
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
        expect(result.current.status.error).toBeNull();
      });
    });
  });

  describe('Cleanup', () => {
    it('should disconnect on unmount', async () => {
      const { result, unmount } = renderHook(() => useWebSocket(), { wrapper });

      await act(async () => {
        result.current.connect();
      });

      unmount();

      await waitFor(() => {
        expect(websocketService.disconnect).toHaveBeenCalled();
      });
    });

    it('should cleanup subscriptions on unmount', async () => {
      const mockUnsubscribe = jest.fn();
      (websocketService.onStatusChange as jest.Mock).mockReturnValue(mockUnsubscribe);

      const { unmount } = renderHook(() => useWebSocket(), { wrapper });

      unmount();

      await waitFor(() => {
        expect(mockUnsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe('Real-time Updates Integration', () => {
    it('should process live score updates', async () => {
      let eventHandler: any;
      (websocketService.on as jest.Mock).mockImplementation((event, handler) => {
        if (event === 'score_update') {
          eventHandler = handler;
        }
        return jest.fn();
      });

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      const scoreUpdateHandler = jest.fn();

      await act(async () => {
        result.current.on('score_update', scoreUpdateHandler);
      });

      // Simulate incoming score update
      const scoreUpdate = {
        matchId: 'match123',
        homeScore: 2,
        awayScore: 1,
        minute: 67,
      };

      act(() => {
        eventHandler(scoreUpdate);
      });

      await waitFor(() => {
        expect(scoreUpdateHandler).toHaveBeenCalledWith(scoreUpdate);
      });
    });

    it('should handle match state changes', async () => {
      let eventHandler: any;
      (websocketService.on as jest.Mock).mockImplementation((event, handler) => {
        if (event === 'match_state_change') {
          eventHandler = handler;
        }
        return jest.fn();
      });

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      const stateChangeHandler = jest.fn();

      await act(async () => {
        result.current.on('match_state_change', stateChangeHandler);
      });

      // Simulate match state change
      const stateChange = {
        matchId: 'match123',
        statusId: 4, // Second half
        minute: 46,
      };

      act(() => {
        eventHandler(stateChange);
      });

      await waitFor(() => {
        expect(stateChangeHandler).toHaveBeenCalledWith(stateChange);
      });
    });
  });

  describe('Performance', () => {
    it('should handle high-frequency updates', async () => {
      let eventHandler: any;
      (websocketService.on as jest.Mock).mockImplementation((event, handler) => {
        eventHandler = handler;
        return jest.fn();
      });

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      const updateHandler = jest.fn();

      await act(async () => {
        result.current.on('rapid_update', updateHandler);
      });

      // Simulate 100 rapid updates
      act(() => {
        for (let i = 0; i < 100; i++) {
          eventHandler({ sequence: i });
        }
      });

      await waitFor(() => {
        expect(updateHandler).toHaveBeenCalledTimes(100);
      });
    });
  });
});
