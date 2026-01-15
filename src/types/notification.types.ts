/**
 * Notification Types
 *
 * Type definitions for push notifications
 * Supports: Match start, Goal, Prediction win, General
 */

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType =
  | 'match_start'      // Match is starting
  | 'goal'             // Goal scored
  | 'match_end'        // Match ended
  | 'prediction_win'   // AI prediction won
  | 'prediction_lose'  // AI prediction lost
  | 'general';         // General announcement

// ============================================================================
// NOTIFICATION PRIORITY
// ============================================================================

export type NotificationPriority = 'low' | 'default' | 'high' | 'max';

// ============================================================================
// NOTIFICATION DATA
// ============================================================================

export interface NotificationData {
  type: NotificationType;

  // Match data (for match-related notifications)
  matchId?: string | number;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  minute?: number;
  league?: string;

  // Prediction data
  predictionId?: string | number;
  prediction?: string;
  confidence?: number;

  // General
  timestamp: string;
  actionUrl?: string; // Deep link URL
}

// ============================================================================
// NOTIFICATION PAYLOAD
// ============================================================================

export interface NotificationPayload {
  title: string;
  body: string;
  data: NotificationData;
  priority?: NotificationPriority;
  sound?: boolean;
  vibrate?: boolean;
  badge?: number;
}

// ============================================================================
// PUSH TOKEN
// ============================================================================

export interface PushToken {
  token: string;
  platform: 'ios' | 'android' | 'web';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================

export interface NotificationSettings {
  enabled: boolean;

  // Match notifications
  matchStart: boolean;           // Notify when match starts
  goals: boolean;                // Notify on goals
  matchEnd: boolean;             // Notify when match ends

  // Prediction notifications
  predictionResults: boolean;    // Notify on prediction results

  // Favorite notifications (only for favorited items)
  notifyFavorites: boolean;      // Only notify for favorites

  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart: string;       // HH:mm format (e.g., "22:00")
  quietHoursEnd: string;         // HH:mm format (e.g., "08:00")

  // Sound & vibration
  sound: boolean;
  vibration: boolean;
}

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,

  // Match notifications (all enabled by default)
  matchStart: true,
  goals: true,
  matchEnd: false, // Disabled by default (can be noisy)

  // Prediction notifications
  predictionResults: true,

  // Favorites (enabled by default - only notify for favorites)
  notifyFavorites: true,

  // Quiet hours (disabled by default)
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',

  // Sound & vibration
  sound: true,
  vibration: true,
};

// ============================================================================
// NOTIFICATION PERMISSION STATUS
// ============================================================================

export type NotificationPermissionStatus =
  | 'undetermined'   // Not asked yet
  | 'granted'        // Permission granted
  | 'denied';        // Permission denied

// ============================================================================
// NOTIFICATION RESPONSE (when user taps notification)
// ============================================================================

export interface NotificationResponse {
  notification: {
    request: {
      content: {
        title: string;
        body: string;
        data: NotificationData;
      };
    };
  };
  actionIdentifier: string; // e.g., "expo.modules.notifications.actions.DEFAULT"
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const NOTIFICATION_STORAGE_KEYS = {
  SETTINGS: '@goalgpt_notification_settings',
  PUSH_TOKEN: '@goalgpt_push_token',
  PERMISSION_ASKED: '@goalgpt_notification_permission_asked',
};

// ============================================================================
// NOTIFICATION CATEGORIES
// ============================================================================

export interface NotificationCategory {
  identifier: string;
  actions: NotificationAction[];
}

export interface NotificationAction {
  identifier: string;
  buttonTitle: string;
  options?: {
    opensAppToForeground?: boolean;
    isAuthenticationRequired?: boolean;
    isDestructive?: boolean;
  };
}

// Predefined categories
export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    identifier: 'match_start',
    actions: [
      {
        identifier: 'view_match',
        buttonTitle: 'View Match',
        options: { opensAppToForeground: true },
      },
    ],
  },
  {
    identifier: 'goal',
    actions: [
      {
        identifier: 'view_match',
        buttonTitle: 'View Details',
        options: { opensAppToForeground: true },
      },
    ],
  },
  {
    identifier: 'prediction_result',
    actions: [
      {
        identifier: 'view_prediction',
        buttonTitle: 'View Prediction',
        options: { opensAppToForeground: true },
      },
    ],
  },
];

// ============================================================================
// EXPORT
// ============================================================================

export default {
  DEFAULT_NOTIFICATION_SETTINGS,
  NOTIFICATION_STORAGE_KEYS,
  NOTIFICATION_CATEGORIES,
};
