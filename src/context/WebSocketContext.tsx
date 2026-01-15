/**
 * WebSocket Context Provider
 * Manages global WebSocket connection state and provides hooks for components
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import websocketService, {
  WebSocketStatus,
  WebSocketEventHandler,
} from '../services/websocket.service';
import { useAuth } from './AuthContext';
import { TokenStorage } from '../api/client';
import { logger } from '../utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export interface WebSocketContextValue {
  // Connection status
  status: WebSocketStatus;
  isConnected: boolean;

  // Connection methods
  connect: () => void;
  disconnect: () => void;

  // Event subscriptions
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  on: (event: string, handler: WebSocketEventHandler) => () => void;

  // Send message
  send: (message: any) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface WebSocketProviderProps {
  children: ReactNode;
  /** Auto-connect on mount (default: true) */
  autoConnect?: boolean;
  /** Auto-connect only when authenticated (default: true) */
  requireAuth?: boolean;
}

export function WebSocketProvider({
  children,
  autoConnect = true,
  requireAuth = true,
}: WebSocketProviderProps): React.ReactElement {
  const { isAuthenticated, user } = useAuth();
  const [status, setStatus] = useState<WebSocketStatus>({
    connected: false,
    reconnecting: false,
    reconnectAttempts: 0,
    error: null,
  });

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(async () => {
    try {
      // Get auth token
      const token = await TokenStorage.getAccessToken();

      if (requireAuth && !token) {
        logger.warn('Cannot connect to WebSocket: no auth token');
        return;
      }

      // Connect with token
      websocketService.connect(token || undefined);
    } catch (error) {
      logger.error('Failed to connect to WebSocket', error);
    }
  }, [requireAuth]);

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  // ============================================================================
  // AUTO-CONNECTION
  // ============================================================================

  useEffect(() => {
    // Auto-connect when authenticated (if enabled)
    if (autoConnect && isAuthenticated && user) {
      logger.debug('Auto-connecting to WebSocket');
      connect();
    }

    // Auto-disconnect when logged out
    if (!isAuthenticated) {
      logger.debug('Disconnecting from WebSocket (logged out)');
      disconnect();
    }
  }, [autoConnect, isAuthenticated, user, connect, disconnect]);

  // ============================================================================
  // STATUS MONITORING
  // ============================================================================

  useEffect(() => {
    // Subscribe to status changes
    const unsubscribe = websocketService.onStatusChange((newStatus) => {
      setStatus(newStatus);
    });

    return () => unsubscribe();
  }, []);

  // ============================================================================
  // CLEANUP
  // ============================================================================

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // ============================================================================
  // EVENT SUBSCRIPTIONS
  // ============================================================================

  /**
   * Subscribe to a channel
   */
  const subscribe = useCallback((channel: string) => {
    websocketService.subscribe(channel);
  }, []);

  /**
   * Unsubscribe from a channel
   */
  const unsubscribe = useCallback((channel: string) => {
    websocketService.unsubscribe(channel);
  }, []);

  /**
   * Register event handler
   */
  const on = useCallback((event: string, handler: WebSocketEventHandler) => {
    return websocketService.on(event, handler);
  }, []);

  /**
   * Send message
   */
  const send = useCallback((message: any) => {
    websocketService.send(message);
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: WebSocketContextValue = {
    status,
    isConnected: status.connected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    on,
    send,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Use WebSocket context
 */
export function useWebSocket(): WebSocketContextValue {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }

  return context;
}

// ============================================================================
// EXPORT
// ============================================================================

export default WebSocketProvider;
