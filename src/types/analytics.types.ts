/**
 * Analytics Type Definitions
 * Type-safe analytics events and parameters
 */

// ============================================================================
// EVENT NAMES
// ============================================================================

export const AnalyticsEvents = {
  // Screen Views
  SCREEN_VIEW: 'screen_view',

  // App Lifecycle
  APP_OPEN: 'app_open',
  APP_BACKGROUND: 'app_background',
  APP_FOREGROUND: 'app_foreground',
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',

  // Authentication
  LOGIN_INITIATED: 'login_initiated',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  SIGNUP_INITIATED: 'signup_initiated',
  SIGNUP_SUCCESS: 'signup_success',
  SIGNUP_FAILED: 'signup_failed',
  LOGOUT: 'logout',

  // Navigation
  TAB_CHANGED: 'tab_changed',
  NAVIGATION: 'navigation',
  DEEP_LINK_OPENED: 'deep_link_opened',

  // Match Events
  MATCH_VIEWED: 'match_viewed',
  MATCH_FAVORITED: 'match_favorited',
  MATCH_UNFAVORITED: 'match_unfavorited',
  MATCH_SHARED: 'match_shared',
  MATCH_PREDICTED: 'match_predicted',
  MATCH_FILTER_APPLIED: 'match_filter_applied',
  MATCH_SORTED: 'match_sorted',

  // Bot Events
  BOT_VIEWED: 'bot_viewed',
  BOT_SELECTED: 'bot_selected',
  BOT_SUBSCRIBED: 'bot_subscribed',
  BOT_UNSUBSCRIBED: 'bot_unsubscribed',
  BOT_SHARED: 'bot_shared',
  PREDICTION_VIEWED: 'prediction_viewed',
  PREDICTION_SHARED: 'prediction_shared',

  // Team Events
  TEAM_VIEWED: 'team_viewed',
  TEAM_FAVORITED: 'team_favorited',
  TEAM_UNFAVORITED: 'team_unfavorited',
  TEAM_SHARED: 'team_shared',

  // League Events
  LEAGUE_VIEWED: 'league_viewed',
  LEAGUE_FAVORITED: 'league_favorited',
  LEAGUE_UNFAVORITED: 'league_unfavorited',
  STANDINGS_VIEWED: 'standings_viewed',

  // User Actions
  BUTTON_PRESSED: 'button_pressed',
  SEARCH_INITIATED: 'search_initiated',
  SEARCH_COMPLETED: 'search_completed',
  FILTER_APPLIED: 'filter_applied',
  SORT_APPLIED: 'sort_applied',
  REFRESH_TRIGGERED: 'refresh_triggered',

  // Store Events
  STORE_VIEWED: 'store_viewed',
  PLAN_VIEWED: 'plan_viewed',
  PURCHASE_INITIATED: 'purchase_initiated',
  PURCHASE_COMPLETED: 'purchase_completed',
  PURCHASE_FAILED: 'purchase_failed',
  PURCHASE_RESTORED: 'purchase_restored',

  // Profile Events
  PROFILE_VIEWED: 'profile_viewed',
  PROFILE_EDITED: 'profile_edited',
  SETTINGS_OPENED: 'settings_opened',
  SETTINGS_CHANGED: 'settings_changed',

  // Notification Events
  NOTIFICATION_RECEIVED: 'notification_received',
  NOTIFICATION_OPENED: 'notification_opened',
  NOTIFICATION_DISMISSED: 'notification_dismissed',
  NOTIFICATION_PERMISSION_GRANTED: 'notification_permission_granted',
  NOTIFICATION_PERMISSION_DENIED: 'notification_permission_denied',

  // Share Events
  SHARE_INITIATED: 'share_initiated',
  SHARE_COMPLETED: 'share_completed',
  SHARE_CANCELLED: 'share_cancelled',
  SHARE_FAILED: 'share_failed',
  LINK_COPIED: 'link_copied',

  // Performance Events
  API_CALL_STARTED: 'api_call_started',
  API_CALL_COMPLETED: 'api_call_completed',
  API_CALL_FAILED: 'api_call_failed',
  SCREEN_LOAD_STARTED: 'screen_load_started',
  SCREEN_LOAD_COMPLETED: 'screen_load_completed',
  APP_STARTUP_COMPLETED: 'app_startup_completed',

  // Error Events
  ERROR_OCCURRED: 'error_occurred',
  ERROR_BOUNDARY_TRIGGERED: 'error_boundary_triggered',
  API_ERROR: 'api_error',
  NETWORK_ERROR: 'network_error',

  // Engagement Events
  TUTORIAL_STARTED: 'tutorial_started',
  TUTORIAL_COMPLETED: 'tutorial_completed',
  TUTORIAL_SKIPPED: 'tutorial_skipped',
  FEATURE_DISCOVERED: 'feature_discovered',
  HELP_VIEWED: 'help_viewed',

} as const;

export type AnalyticsEventName = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];

// ============================================================================
// EVENT PARAMETERS
// ============================================================================

export interface BaseEventParams {
  timestamp?: number;
  screen_name?: string;
  previous_screen?: string;
  user_id?: string;
}

export interface ScreenViewParams extends BaseEventParams {
  screen_name: string;
  screen_class?: string;
  previous_screen?: string;
  duration?: number;
  referrer?: string;
}

export interface NavigationParams extends BaseEventParams {
  from_screen: string;
  to_screen: string;
  method: 'tab' | 'stack' | 'deep_link' | 'back' | 'push';
  params?: Record<string, any>;
}

export interface TabChangeParams extends BaseEventParams {
  from_tab: string;
  to_tab: string;
}

export interface DeepLinkParams extends BaseEventParams {
  url: string;
  link_type: 'match' | 'bot' | 'team' | 'league' | 'tab' | 'unknown';
  link_id?: string;
  source?: 'notification' | 'share' | 'external';
}

export interface MatchEventParams extends BaseEventParams {
  match_id: string | number;
  home_team?: string;
  away_team?: string;
  league?: string;
  status?: string;
  is_live?: boolean;
  has_prediction?: boolean;
}

export interface BotEventParams extends BaseEventParams {
  bot_id: number;
  bot_name: string;
  success_rate?: number;
  total_predictions?: number;
}

export interface PredictionEventParams extends BaseEventParams {
  prediction_id: number;
  bot_id: number;
  match_id: string | number;
  prediction_type?: string;
  confidence?: number;
}

export interface TeamEventParams extends BaseEventParams {
  team_id: string | number;
  team_name: string;
  league?: string;
}

export interface LeagueEventParams extends BaseEventParams {
  league_id: string | number;
  league_name: string;
  country?: string;
}

export interface SearchParams extends BaseEventParams {
  query: string;
  results_count?: number;
  search_type?: 'match' | 'team' | 'league' | 'global';
  filters?: Record<string, any>;
}

export interface FilterParams extends BaseEventParams {
  filter_type: string;
  filter_value: any;
  filters_applied?: Record<string, any>;
}

export interface SortParams extends BaseEventParams {
  sort_type: string;
  sort_direction?: 'asc' | 'desc';
}

export interface ButtonPressParams extends BaseEventParams {
  button_name: string;
  button_type?: 'primary' | 'secondary' | 'icon' | 'text';
  context?: string;
}

export interface ShareParams extends BaseEventParams {
  content_type: 'match' | 'bot' | 'team' | 'league' | 'prediction' | 'app';
  content_id?: string | number;
  platform?: string;
  method?: 'share' | 'copy_link';
}

export interface PurchaseParams extends BaseEventParams {
  plan_id: string;
  plan_name: string;
  price: number;
  currency: string;
  duration?: string;
  trial?: boolean;
}

export interface NotificationParams extends BaseEventParams {
  notification_id?: string;
  notification_type: string;
  action?: string;
  deep_link?: string;
}

export interface APICallParams extends BaseEventParams {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  duration?: number;
  status_code?: number;
  success?: boolean;
  error_message?: string;
}

export interface PerformanceParams extends BaseEventParams {
  metric_name: string;
  duration: number;
  details?: Record<string, any>;
}

export interface ErrorParams extends BaseEventParams {
  error_type: string;
  error_message: string;
  error_stack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: string;
  user_impact?: 'none' | 'minor' | 'major' | 'blocking';
}

export interface SessionParams extends BaseEventParams {
  session_id: string;
  session_duration?: number;
  screens_viewed?: number;
  actions_taken?: number;
}

// ============================================================================
// USER PROPERTIES
// ============================================================================

export interface UserProperties {
  user_id?: string;
  email?: string;
  name?: string;
  vip_status: 'free' | 'premium' | 'vip';
  signup_date?: string;
  last_active?: string;
  app_version: string;
  build_number?: string;
  device_model: string;
  device_brand?: string;
  os_version: string;
  os_name: string;
  language: string;
  timezone?: string;
  country?: string;

  // App-specific properties
  favorite_teams?: string[];
  favorite_teams_count?: number;
  favorite_bots?: number[];
  favorite_bots_count?: number;
  favorite_matches_count?: number;

  // Engagement properties
  total_sessions?: number;
  total_screen_views?: number;
  total_predictions_viewed?: number;
  total_matches_viewed?: number;

  // Notification properties
  notification_enabled: boolean;
  push_token?: string;
  notification_preferences?: Record<string, boolean>;

  // Subscription properties
  subscription_plan?: string;
  subscription_start_date?: string;
  subscription_expiry_date?: string;
  is_trial?: boolean;

  // Feature usage
  has_viewed_tutorial?: boolean;
  has_shared_content?: boolean;
  has_made_prediction?: boolean;
  last_feature_used?: string;
}

// ============================================================================
// ANALYTICS CONFIG
// ============================================================================

export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  trackScreenViews: boolean;
  trackUserProperties: boolean;
  trackPerformance: boolean;
  trackErrors: boolean;
  sampleRate?: number;

  // Feature flags
  features?: {
    sessionTracking?: boolean;
    navigationTracking?: boolean;
    performanceMonitoring?: boolean;
    errorTracking?: boolean;
  };
}

// ============================================================================
// SCREEN NAMES
// ============================================================================

export const ScreenNames = {
  // Auth Screens
  SPLASH: 'Splash',
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',

  // Main Tab Screens
  HOME: 'Home',
  LIVE_MATCHES: 'LiveMatches',
  PREDICTIONS: 'Predictions',
  STORE: 'Store',
  PROFILE: 'Profile',

  // Detail Screens
  MATCH_DETAIL: 'MatchDetail',
  BOT_DETAIL: 'BotDetail',
  TEAM_DETAIL: 'TeamDetail',
  LEAGUE_DETAIL: 'LeagueDetail',

  // Settings Screens
  SETTINGS: 'Settings',
  NOTIFICATIONS_SETTINGS: 'NotificationsSettings',
  ACCOUNT_SETTINGS: 'AccountSettings',

  // Other Screens
  HELP: 'Help',
  ABOUT: 'About',
  TERMS: 'Terms',
  PRIVACY: 'Privacy',
} as const;

export type ScreenName = typeof ScreenNames[keyof typeof ScreenNames];

// ============================================================================
// EXPORT
// ============================================================================

export type EventParams =
  | ScreenViewParams
  | NavigationParams
  | TabChangeParams
  | DeepLinkParams
  | MatchEventParams
  | BotEventParams
  | PredictionEventParams
  | TeamEventParams
  | LeagueEventParams
  | SearchParams
  | FilterParams
  | SortParams
  | ButtonPressParams
  | ShareParams
  | PurchaseParams
  | NotificationParams
  | APICallParams
  | PerformanceParams
  | ErrorParams
  | SessionParams
  | BaseEventParams;
