/**
 * useWebSocket Hook
 *
 * React hook for WebSocket real-time updates
 * Automatically manages connection lifecycle
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getWebSocketService, WebSocketService } from '../services/websocket.service';
import type {
  WebSocketEventHandlers,
  MatchUpdateEvent,
  MatchScoreEvent,
  MatchStatusEvent,
  MatchEventData,
  MinuteUpdateEvent,
  ConnectionStatusEvent,
} from '../types/websocket.types';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  handlers?: WebSocketEventHandlers;
  matchIds?: (string | number)[]; // Auto-subscribe to matches
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  isReconnecting: boolean;
  error: Error | null;
  send: (message: { type: string; data: any }) => void;
  subscribeToMatches: (matchIds: (string | number)[]) => void;
  unsubscribeFromMatches: (matchIds: (string | number)[]) => void;
  matchUpdates: Map<string | number, MatchUpdateEvent>;
  lastEvent: MatchEventData | null;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    autoConnect = true,
    handlers = {},
    matchIds = [],
  } = options;

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [matchUpdates, setMatchUpdates] = useState<Map<string | number, MatchUpdateEvent>>(
    new Map()
  );
  const [lastEvent, setLastEvent] = useState<MatchEventData | null>(null);

  // Ref for WebSocket service
  const wsServiceRef = useRef<WebSocketService | null>(null);

  // Initialize WebSocket service
  useEffect(() => {
    if (!autoConnect) return;

    const wsService = getWebSocketService();
    wsServiceRef.current = wsService;

    // Internal event handlers
    const internalHandlers: WebSocketEventHandlers = {
      onMatchUpdate: (event: MatchUpdateEvent) => {
        console.log('📊 Match update:', event.matchId);
        setMatchUpdates((prev) => {
          const updated = new Map(prev);
          updated.set(event.matchId, event);
          return updated;
        });
        handlers.onMatchUpdate?.(event);
      },

      onMatchScore: (event: MatchScoreEvent) => {
        console.log('⚽ Score update:', event.matchId, `${event.homeScore}-${event.awayScore}`);
        setMatchUpdates((prev) => {
          const updated = new Map(prev);
          const existing = updated.get(event.matchId);
          updated.set(event.matchId, {
            ...existing,
            matchId: event.matchId,
            homeScore: event.homeScore,
            awayScore: event.awayScore,
            minute: event.minute,
            timestamp: event.timestamp,
          });
          return updated;
        });
        handlers.onMatchScore?.(event);
      },

      onMatchStatus: (event: MatchStatusEvent) => {
        console.log('🔄 Status update:', event.matchId, event.status);
        setMatchUpdates((prev) => {
          const updated = new Map(prev);
          const existing = updated.get(event.matchId);
          updated.set(event.matchId, {
            ...existing,
            matchId: event.matchId,
            status: event.status,
            minute: event.minute,
            timestamp: event.timestamp,
          });
          return updated;
        });
        handlers.onMatchStatus?.(event);
      },

      onMatchEvent: (event: MatchEventData) => {
        console.log('🎯 Match event:', event.matchId, event.eventType);
        setLastEvent(event);
        handlers.onMatchEvent?.(event);
      },

      onMatchStats: (event) => {
        console.log('📈 Stats update:', event.matchId);
        handlers.onMatchStats?.(event);
      },

      onMinuteUpdate: (event: MinuteUpdateEvent) => {
        console.log('⏱️ Minute update:', event.matchId, `${event.minute}'`);
        setMatchUpdates((prev) => {
          const updated = new Map(prev);
          const existing = updated.get(event.matchId);
          updated.set(event.matchId, {
            ...existing,
            matchId: event.matchId,
            minute: event.minute,
            timestamp: event.timestamp,
          });
          return updated;
        });
        handlers.onMinuteUpdate?.(event);
      },

      onPredictionUpdate: (event) => {
        console.log('🤖 Prediction update:', event.predictionId);
        handlers.onPredictionUpdate?.(event);
      },

      onConnectionChange: (event: ConnectionStatusEvent) => {
        console.log('🔌 Connection status:', event.connected ? 'Connected' : 'Disconnected');
        setIsConnected(event.connected);
        setIsReconnecting(event.reconnecting || false);
        handlers.onConnectionChange?.(event);
      },

      onError: (err: Error) => {
        console.error('❌ WebSocket error:', err.message);
        setError(err);
        handlers.onError?.(err);
      },
    };

    // Register handlers
    wsService.on(internalHandlers);

    // Subscribe to initial matches
    if (matchIds.length > 0 && wsService.isConnected()) {
      wsService.subscribeToMatches(matchIds);
    }

    // Cleanup on unmount
    return () => {
      if (matchIds.length > 0) {
        wsService.unsubscribeFromMatches(matchIds);
      }
    };
  }, [autoConnect, matchIds, handlers]);

  // Send message
  const send = useCallback((message: { type: string; data: any }) => {
    wsServiceRef.current?.send(message);
  }, []);

  // Subscribe to matches
  const subscribeToMatches = useCallback((ids: (string | number)[]) => {
    console.log('📡 Subscribing to matches:', ids);
    wsServiceRef.current?.subscribeToMatches(ids);
  }, []);

  // Unsubscribe from matches
  const unsubscribeFromMatches = useCallback((ids: (string | number)[]) => {
    console.log('📡 Unsubscribing from matches:', ids);
    wsServiceRef.current?.unsubscribeFromMatches(ids);
  }, []);

  return {
    isConnected,
    isReconnecting,
    error,
    send,
    subscribeToMatches,
    unsubscribeFromMatches,
    matchUpdates,
    lastEvent,
  };
}
