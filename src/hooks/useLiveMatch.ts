/**
 * useLiveMatch Hook
 * Subscribe to real-time match updates via WebSocket
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';

// ============================================================================
// TYPES
// ============================================================================

export interface LiveMatchUpdate {
  matchId: string;
  type: 'score_change' | 'match_event' | 'live_stats' | 'status_change';
  timestamp: number;
  data: any;
}

export interface UseLiveMatchOptions {
  /** Auto-subscribe on mount (default: true) */
  autoSubscribe?: boolean;
  /** Callback when match data updates */
  onUpdate?: (update: LiveMatchUpdate) => void;
  /** Callback when score changes */
  onScoreChange?: (data: any) => void;
  /** Callback when match event occurs */
  onMatchEvent?: (data: any) => void;
}

export interface UseLiveMatchReturn {
  /** Whether subscribed to match updates */
  subscribed: boolean;
  /** Latest update received */
  latestUpdate: LiveMatchUpdate | null;
  /** Subscribe to match updates */
  subscribe: () => void;
  /** Unsubscribe from match updates */
  unsubscribe: () => void;
  /** Manually send a request for match data */
  requestUpdate: () => void;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Subscribe to live match updates via WebSocket
 */
export function useLiveMatch(
  matchId: string | null,
  options: UseLiveMatchOptions = {}
): UseLiveMatchReturn {
  const { isConnected, subscribe: subscribeChannel, unsubscribe: unsubscribeChannel, on, send } = useWebSocket();

  const [subscribed, setSubscribed] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState<LiveMatchUpdate | null>(null);

  // Store options in ref to avoid re-subscribing on option changes
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Channel name
  const channel = matchId ? `match:${matchId}` : null;

  // ============================================================================
  // SUBSCRIPTION MANAGEMENT
  // ============================================================================

  /**
   * Subscribe to match updates
   */
  const subscribe = useCallback(() => {
    if (!channel || !isConnected) {
      console.log('⚠️ Cannot subscribe: no channel or not connected');
      return;
    }

    console.log('📡 Subscribing to match updates:', channel);

    // Subscribe to channel
    subscribeChannel(channel);
    setSubscribed(true);
  }, [channel, isConnected, subscribeChannel]);

  /**
   * Unsubscribe from match updates
   */
  const unsubscribe = useCallback(() => {
    if (!channel) return;

    console.log('📡 Unsubscribing from match updates:', channel);

    // Unsubscribe from channel
    unsubscribeChannel(channel);
    setSubscribed(false);
  }, [channel, unsubscribeChannel]);

  /**
   * Request latest match data
   */
  const requestUpdate = useCallback(() => {
    if (!channel || !isConnected) return;

    console.log('📡 Requesting match update:', matchId);

    send({
      type: 'request_match_update',
      matchId,
      timestamp: Date.now(),
    });
  }, [channel, isConnected, matchId, send]);

  // ============================================================================
  // AUTO-SUBSCRIPTION
  // ============================================================================

  useEffect(() => {
    const { autoSubscribe = true } = optionsRef.current;

    if (autoSubscribe && matchId && isConnected) {
      subscribe();
    }

    // Cleanup: unsubscribe on unmount or match change
    return () => {
      if (subscribed) {
        unsubscribe();
      }
    };
  }, [matchId, isConnected, subscribe, unsubscribe, subscribed]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  useEffect(() => {
    if (!channel || !isConnected) return;

    // Subscribe to channel-specific events
    const unsubscribeChannelEvents = on(`channel:${channel}`, (data: any) => {
      const update: LiveMatchUpdate = {
        matchId: matchId!,
        type: data.type || 'live_stats',
        timestamp: data.timestamp || Date.now(),
        data,
      };

      setLatestUpdate(update);

      // Call generic update callback
      if (optionsRef.current.onUpdate) {
        optionsRef.current.onUpdate(update);
      }

      // Call specific event callbacks
      if (data.type === 'score_change' && optionsRef.current.onScoreChange) {
        optionsRef.current.onScoreChange(data);
      }

      if (data.type === 'match_event' && optionsRef.current.onMatchEvent) {
        optionsRef.current.onMatchEvent(data);
      }
    });

    // Subscribe to score change events
    const unsubscribeScoreChange = on('score_change', (data: any) => {
      if (data.matchId === matchId) {
        const update: LiveMatchUpdate = {
          matchId: matchId!,
          type: 'score_change',
          timestamp: data.timestamp || Date.now(),
          data,
        };

        setLatestUpdate(update);

        if (optionsRef.current.onScoreChange) {
          optionsRef.current.onScoreChange(data);
        }
      }
    });

    // Subscribe to match event
    const unsubscribeMatchEvent = on('match_event', (data: any) => {
      if (data.matchId === matchId) {
        const update: LiveMatchUpdate = {
          matchId: matchId!,
          type: 'match_event',
          timestamp: data.timestamp || Date.now(),
          data,
        };

        setLatestUpdate(update);

        if (optionsRef.current.onMatchEvent) {
          optionsRef.current.onMatchEvent(data);
        }
      }
    });

    // Cleanup: unsubscribe from events
    return () => {
      unsubscribeChannelEvents();
      unsubscribeScoreChange();
      unsubscribeMatchEvent();
    };
  }, [channel, isConnected, matchId, on]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    subscribed,
    latestUpdate,
    subscribe,
    unsubscribe,
    requestUpdate,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default useLiveMatch;
