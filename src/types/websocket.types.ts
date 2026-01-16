/**
 * WebSocket Types
 *
 * Type definitions for WebSocket events and messages
 */

export type WebSocketEventType =
  | 'match:update'
  | 'match:score'
  | 'match:status'
  | 'match:event'
  | 'match:stats'
  | 'prediction:update'
  | 'connection:status'
  | 'MINUTE_UPDATE'
  | 'PING'
  | 'ping'
  | 'pong';

export type MatchStatus =
  | 'upcoming'
  | 'live'
  | 'halftime'
  | 'finished'
  | 'cancelled'
  | 'postponed';

export type MatchEventType =
  | 'goal'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'penalty'
  | 'var'
  | 'kickoff'
  | 'halftime'
  | 'fulltime';

// ============================================================================
// WebSocket Message Types
// ============================================================================

export interface WebSocketMessage {
  type: WebSocketEventType;
  data: any;
  timestamp: string;
}

// ============================================================================
// Match Update Events
// ============================================================================

export interface MatchUpdateEvent {
  matchId: string | number;
  homeScore?: number;
  awayScore?: number;
  status?: MatchStatus;
  minute?: number;
  timestamp: string;
}

export interface MatchScoreEvent {
  matchId: string | number;
  homeScore: number;
  awayScore: number;
  minute: number;
  timestamp: string;
}

export interface MatchStatusEvent {
  matchId: string | number;
  status: MatchStatus;
  minute?: number;
  timestamp: string;
}

export interface MatchEventData {
  matchId: string | number;
  eventType: MatchEventType;
  team: 'home' | 'away';
  player?: string;
  minute: number;
  description?: string;
  timestamp: string;
}

export interface MatchStatsEvent {
  matchId: string | number;
  stats: {
    possession?: { home: number; away: number };
    shots?: { home: number; away: number };
    shotsOnTarget?: { home: number; away: number };
    corners?: { home: number; away: number };
    fouls?: { home: number; away: number };
    yellowCards?: { home: number; away: number };
    redCards?: { home: number; away: number };
  };
  timestamp: string;
}

export interface MinuteUpdateEvent {
  matchId: string | number;
  minute: number;
  timestamp: string;
}

// ============================================================================
// Prediction Update Events
// ============================================================================

export interface PredictionUpdateEvent {
  predictionId: string | number;
  result?: 'win' | 'lose' | 'pending';
  confidence?: number;
  timestamp: string;
}

// ============================================================================
// Connection Status
// ============================================================================

export interface ConnectionStatusEvent {
  connected: boolean;
  reconnecting?: boolean;
  error?: string;
  timestamp: string;
}

// ============================================================================
// WebSocket Event Handlers
// ============================================================================

export interface WebSocketEventHandlers {
  onMatchUpdate?: (event: MatchUpdateEvent) => void;
  onMatchScore?: (event: MatchScoreEvent) => void;
  onMatchStatus?: (event: MatchStatusEvent) => void;
  onMatchEvent?: (event: MatchEventData) => void;
  onMatchStats?: (event: MatchStatsEvent) => void;
  onMinuteUpdate?: (event: MinuteUpdateEvent) => void;
  onPredictionUpdate?: (event: PredictionUpdateEvent) => void;
  onConnectionChange?: (event: ConnectionStatusEvent) => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// WebSocket Configuration
// ============================================================================

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number; // ms
  maxReconnectAttempts?: number;
  heartbeatInterval?: number; // ms
  autoConnect?: boolean;
}
