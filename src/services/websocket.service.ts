/**
 * WebSocket Service
 *
 * Manages WebSocket connection for real-time updates
 * Features:
 * - Auto-reconnect with exponential backoff
 * - Heartbeat/ping-pong
 * - Event subscription system
 * - Connection state management
 */

import { API_ENDPOINTS } from '../constants/api';
import type {
  WebSocketConfig,
  WebSocketMessage,
  WebSocketEventHandlers,
  WebSocketEventType,
} from '../types/websocket.types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private eventHandlers: WebSocketEventHandlers = {};
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private shouldReconnect = true;

  // Default configuration
  private static readonly DEFAULT_CONFIG: Required<WebSocketConfig> = {
    url: API_ENDPOINTS.WS,
    reconnectInterval: 3000, // 3 seconds
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000, // 30 seconds
    autoConnect: true,
  };

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = {
      ...WebSocketService.DEFAULT_CONFIG,
      ...config,
    };

    if (this.config.autoConnect) {
      this.connect();
    }
  }

  // ============================================================================
  // Connection Management
  // ============================================================================

  /**
   * Connect to WebSocket server
   */
  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      console.log('🔌 WebSocket already connected or connecting');
      return;
    }

    this.isConnecting = true;
    this.shouldReconnect = true;

    try {
      console.log('🔌 Connecting to WebSocket:', this.config.url);
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error('❌ WebSocket connection error:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    console.log('🔌 Disconnecting from WebSocket');
    this.shouldReconnect = false;
    this.clearTimers();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.notifyConnectionChange(false);
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Handle WebSocket open event
   */
  private handleOpen(): void {
    console.log('✅ WebSocket connected');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    this.notifyConnectionChange(true);
  }

  /**
   * Handle WebSocket message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log('📩 WebSocket message:', message.type);

      this.handleEventMessage(message);
    } catch (error) {
      console.error('❌ Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket error
   */
  private handleError(event: Event): void {
    console.error('❌ WebSocket error:', event);
    this.isConnecting = false;

    if (this.eventHandlers.onError) {
      this.eventHandlers.onError(new Error('WebSocket connection error'));
    }
  }

  /**
   * Handle WebSocket close
   */
  private handleClose(event: CloseEvent): void {
    console.log('🔌 WebSocket closed:', event.code, event.reason);
    this.isConnecting = false;
    this.clearTimers();
    this.notifyConnectionChange(false);

    if (this.shouldReconnect) {
      this.scheduleReconnect();
    }
  }

  // ============================================================================
  // Event Message Handling
  // ============================================================================

  /**
   * Handle typed event messages
   */
  private handleEventMessage(message: WebSocketMessage): void {
    const { type, data } = message;

    switch (type) {
      case 'match:update':
        this.eventHandlers.onMatchUpdate?.(data);
        break;

      case 'match:score':
        this.eventHandlers.onMatchScore?.(data);
        break;

      case 'match:status':
        this.eventHandlers.onMatchStatus?.(data);
        break;

      case 'match:event':
        this.eventHandlers.onMatchEvent?.(data);
        break;

      case 'match:stats':
        this.eventHandlers.onMatchStats?.(data);
        break;

      case 'prediction:update':
        this.eventHandlers.onPredictionUpdate?.(data);
        break;

      case 'connection:status':
        this.eventHandlers.onConnectionChange?.(data);
        break;

      default:
        console.warn('⚠️ Unknown WebSocket event type:', type);
    }
  }

  // ============================================================================
  // Reconnection Logic
  // ============================================================================

  /**
   * Schedule reconnection attempt with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('❌ Max reconnect attempts reached');
      this.notifyConnectionChange(false);
      return;
    }

    this.reconnectAttempts++;

    // Exponential backoff: 3s, 6s, 12s, 24s, etc.
    const delay = Math.min(
      this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    console.log(
      `🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // ============================================================================
  // Heartbeat
  // ============================================================================

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping', data: {} });
      }
    }, this.config.heartbeatInterval);
  }

  // ============================================================================
  // Message Sending
  // ============================================================================

  /**
   * Send message to WebSocket server
   */
  public send(message: { type: string; data: any }): void {
    if (!this.isConnected()) {
      console.warn('⚠️ WebSocket not connected, cannot send message');
      return;
    }

    try {
      this.ws?.send(JSON.stringify(message));
    } catch (error) {
      console.error('❌ Failed to send WebSocket message:', error);
    }
  }

  /**
   * Subscribe to specific matches
   */
  public subscribeToMatches(matchIds: (string | number)[]): void {
    this.send({
      type: 'subscribe:matches',
      data: { matchIds },
    });
  }

  /**
   * Unsubscribe from specific matches
   */
  public unsubscribeFromMatches(matchIds: (string | number)[]): void {
    this.send({
      type: 'unsubscribe:matches',
      data: { matchIds },
    });
  }

  // ============================================================================
  // Event Handler Registration
  // ============================================================================

  /**
   * Register event handlers
   */
  public on(handlers: WebSocketEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  /**
   * Remove event handlers
   */
  public off(eventTypes?: WebSocketEventType[]): void {
    if (!eventTypes) {
      this.eventHandlers = {};
      return;
    }

    // Clear specific handlers
    eventTypes.forEach((type) => {
      const handlerKey = this.getHandlerKey(type);
      if (handlerKey) {
        delete this.eventHandlers[handlerKey];
      }
    });
  }

  /**
   * Get handler key from event type
   */
  private getHandlerKey(eventType: WebSocketEventType): keyof WebSocketEventHandlers | null {
    const mapping: Record<string, keyof WebSocketEventHandlers> = {
      'match:update': 'onMatchUpdate',
      'match:score': 'onMatchScore',
      'match:status': 'onMatchStatus',
      'match:event': 'onMatchEvent',
      'match:stats': 'onMatchStats',
      'prediction:update': 'onPredictionUpdate',
      'connection:status': 'onConnectionChange',
    };

    return mapping[eventType] || null;
  }

  // ============================================================================
  // Connection Status Notification
  // ============================================================================

  /**
   * Notify connection change
   */
  private notifyConnectionChange(connected: boolean): void {
    this.eventHandlers.onConnectionChange?.({
      connected,
      reconnecting: !connected && this.shouldReconnect,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
let wsInstance: WebSocketService | null = null;

export function getWebSocketService(): WebSocketService {
  if (!wsInstance) {
    wsInstance = new WebSocketService();
  }
  return wsInstance;
}

export function closeWebSocketService(): void {
  if (wsInstance) {
    wsInstance.disconnect();
    wsInstance = null;
  }
}
