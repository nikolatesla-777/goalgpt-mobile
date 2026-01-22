/**
 * useWebSocket Hook
 *
 * React hook for WebSocket real-time updates
 * Automatically manages connection lifecycle
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getWebSocketService, WebSocketService } from '../services/websocket.service';
import { logger } from '../utils/logger';
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

  // ============================================================================
  // STABILITY FIX: Use refs for handlers to prevent infinite effect loops
  // ============================================================================
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  // Stable matchIds key for dependency comparison (prevents re-subscribe on every render)
  const matchIdsKey = useMemo(() =>
    [...matchIds].sort().join(','),
    [matchIds]
  );

  // Initialize WebSocket service
  useEffect(() => {
    if (!autoConnect) return;

    const wsService = getWebSocketService();
    wsServiceRef.current = wsService;

    // Internal event handlers - use handlersRef.current for stable reference
    const internalHandlers: WebSocketEventHandlers = {
      onMatchUpdate: (event: MatchUpdateEvent) => {
        if (!event || !event.matchId) {
          logger.warn('Invalid match update event', { event });
          return;
        }

        logger.websocket('Match update', { matchId: event.matchId });
        setMatchUpdates((prev) => {
          const updated = new Map(prev);
          updated.set(event.matchId, event);
          return updated;
        });
        handlersRef.current.onMatchUpdate?.(event);
      },

      onMatchScore: (event: MatchScoreEvent) => {
        if (!event || !event.matchId) {
          logger.warn('Invalid score update event', { event });
          return;
        }

        logger.websocket('Score update', { matchId: event.matchId, score: `${event.homeScore}-${event.awayScore}` });
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
        handlersRef.current.onMatchScore?.(event);
      },

      onMatchStatus: (event: MatchStatusEvent) => {
        if (!event || !event.matchId) {
          logger.warn('Invalid status update event', { event });
          return;
        }

        logger.websocket('Status update', { matchId: event.matchId, status: event.status });
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
        handlersRef.current.onMatchStatus?.(event);
      },

      onMatchEvent: (event: MatchEventData) => {
        if (!event || !event.matchId) {
          logger.warn('Invalid match event', { event });
          return;
        }

        logger.websocket('Match event', { matchId: event.matchId, eventType: event.eventType });
        setLastEvent(event);
        handlersRef.current.onMatchEvent?.(event);
      },

      onMatchStats: (event) => {
        if (!event || !event.matchId) {
          logger.warn('Invalid stats update event', { event });
          return;
        }

        logger.websocket('Stats update', { matchId: event.matchId });
        handlersRef.current.onMatchStats?.(event);
      },

      onMinuteUpdate: (event: MinuteUpdateEvent) => {
        if (!event || !event.matchId) {
          logger.warn('Invalid minute update event', { event });
          return;
        }

        logger.websocket('Minute update', { matchId: event.matchId, minute: event.minute });
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
        handlersRef.current.onMinuteUpdate?.(event);
      },

      onPredictionUpdate: (event) => {
        logger.websocket('Prediction update', { predictionId: event.predictionId });
        handlersRef.current.onPredictionUpdate?.(event);
      },

      onConnectionChange: (event: ConnectionStatusEvent) => {
        logger.websocket('Connection status', { connected: event.connected });
        setIsConnected(event.connected);
        setIsReconnecting(event.reconnecting || false);
        handlersRef.current.onConnectionChange?.(event);
      },

      onError: (err: Error) => {
        logger.error('WebSocket error', err);
        setError(err);
        handlersRef.current.onError?.(err);
      },
    };

    // Register handlers
    wsService.on(internalHandlers);

    // Subscribe to initial matches using stable key
    const currentMatchIds = matchIdsKey.split(',').filter(Boolean);
    if (currentMatchIds.length > 0 && wsService.isConnected()) {
      wsService.subscribeToMatches(currentMatchIds);
    }

    // Cleanup on unmount
    return () => {
      if (currentMatchIds.length > 0) {
        wsService.unsubscribeFromMatches(currentMatchIds);
      }
    };
  }, [autoConnect, matchIdsKey]); // ✅ FIXED: Removed 'handlers' from deps, using handlersRef instead


  // Send message
  const send = useCallback((message: { type: string; data: any }) => {
    wsServiceRef.current?.send(message);
  }, []);

  // Subscribe to matches
  const subscribeToMatches = useCallback((ids: (string | number)[]) => {
    logger.websocket('Subscribing to matches', { ids });
    wsServiceRef.current?.subscribeToMatches(ids);
  }, []);

  // Unsubscribe from matches
  const unsubscribeFromMatches = useCallback((ids: (string | number)[]) => {
    logger.websocket('Unsubscribing from matches', { ids });
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
