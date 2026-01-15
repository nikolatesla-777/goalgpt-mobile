/**
 * Analytics Service
 * Comprehensive analytics and tracking service
 * Supports Firebase Analytics (web) and console logging (native)
 */

import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { Platform } from 'react-native';
import { env, isDev } from '../config/env';
import {
  analyticsConfig,
  sanitizeParams,
  shouldTrackEvent,
  addDefaultParams,
  PERFORMANCE_THRESHOLDS,
  SESSION_TIMEOUT_MS,
} from '../config/analytics.config';
import {
  AnalyticsEvents,
  type AnalyticsEventName,
  type EventParams,
  type UserProperties,
  type ScreenViewParams,
  type NavigationParams,
  type MatchEventParams,
  type BotEventParams,
  type ErrorParams,
  type PerformanceParams,
  ScreenNames,
} from '../types/analytics.types';
import { addBreadcrumb } from '../config/sentry.config';

// ============================================================================
// ANALYTICS INSTANCE
// ============================================================================

let analytics: ReturnType<typeof getAnalytics> | null = null;

// Session tracking
let currentSessionId: string | null = null;
let sessionStartTime: number | null = null;
let lastActivityTime: number | null = null;
let screenViewCount = 0;
let eventCount = 0;

/**
 * Initialize Firebase Analytics
 * Should be called after Firebase app is initialized
 * NOTE: Firebase Analytics only works on web platform
 */
export function initAnalytics(firebaseApp: any): void {
  // Firebase Analytics is web-only - not supported on React Native
  if (Platform.OS !== 'web') {
    console.log('⚠️ Firebase Analytics not supported on native platforms');
    return;
  }

  if (!env.enableAnalytics) {
    console.log('⚠️ Analytics disabled via feature flag');
    return;
  }

  try {
    analytics = getAnalytics(firebaseApp);
    console.log('✅ Firebase Analytics initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Analytics:', error);
  }
}

// ============================================================================
// EVENT TRACKING
// ============================================================================

/**
 * Standard Events (Firebase predefined events)
 */
export const StandardEvents = {
  // App lifecycle
  APP_OPEN: 'app_open',
  FIRST_OPEN: 'first_open',

  // Authentication
  LOGIN: 'login',
  SIGN_UP: 'sign_up',

  // Content
  SELECT_CONTENT: 'select_content',
  VIEW_ITEM: 'view_item',
  SEARCH: 'search',

  // Engagement
  SHARE: 'share',
  SCREEN_VIEW: 'screen_view',

  // E-commerce
  PURCHASE: 'purchase',
  REFUND: 'refund',
} as const;

/**
 * Custom Events (App-specific events)
 */
export const CustomEvents = {
  // Match viewing
  MATCH_VIEW: 'match_view',
  MATCH_PREDICTION_VIEW: 'match_prediction_view',
  LIVE_MATCH_VIEW: 'live_match_view',
  MATCH_SHARE: 'match_share',

  // Team viewing
  TEAM_VIEW: 'team_view',
  TEAM_FOLLOW: 'team_follow',
  TEAM_UNFOLLOW: 'team_unfollow',

  // Competition viewing
  COMPETITION_VIEW: 'competition_view',
  STANDINGS_VIEW: 'standings_view',

  // AI Predictions
  AI_PREDICTION_VIEW: 'ai_prediction_view',
  AI_PREDICTION_SHARE: 'ai_prediction_share',
  AI_BOT_SELECT: 'ai_bot_select',

  // User engagement
  PROFILE_VIEW: 'profile_view',
  SETTINGS_CHANGE: 'settings_change',
  REFERRAL_SHARE: 'referral_share',
  REFERRAL_COPIED: 'referral_copied',

  // Credits & Rewards
  CREDITS_EARNED: 'credits_earned',
  CREDITS_SPENT: 'credits_spent',
  REWARD_AD_WATCHED: 'reward_ad_watched',
  REWARD_AD_COMPLETED: 'reward_ad_completed',

  // Subscription
  SUBSCRIPTION_START: 'subscription_start',
  SUBSCRIPTION_CANCEL: 'subscription_cancel',
  SUBSCRIPTION_RENEW: 'subscription_renew',

  // Errors
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
} as const;

/**
 * Log a custom event with comprehensive tracking
 */
export function trackEvent(eventName: AnalyticsEventName | string, params?: EventParams): void {
  try {
    // Check if event should be tracked
    if (!shouldTrackEvent(eventName)) {
      return;
    }

    // Update session activity
    updateSessionActivity();

    // Increment event counter
    eventCount++;

    // Add default parameters
    const enrichedParams = addDefaultParams(params);

    // Sanitize parameters
    const cleanParams = sanitizeParams(enrichedParams);

    // Add session info if enabled
    if (analyticsConfig.features?.sessionTracking && currentSessionId) {
      cleanParams.session_id = currentSessionId;
      cleanParams.session_event_count = eventCount;
    }

    // Log to Firebase (web only)
    if (Platform.OS === 'web' && analytics) {
      logEvent(analytics, eventName, cleanParams);
    }

    // Log to console in debug mode
    if (analyticsConfig.debug) {
      console.log('📊 Analytics Event:', eventName, cleanParams);
    }

    // Add Sentry breadcrumb
    addBreadcrumb('Analytics Event', 'user', 'info', {
      event: eventName,
      params: cleanParams,
    });

    // Future: Additional analytics providers (Amplitude, Segment) can be integrated
    // if (Platform.OS !== 'web') {
    //   // Log to native analytics service
    // }

  } catch (error) {
    console.error('❌ Failed to log event:', eventName, error);
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Start a new analytics session
 */
export function startSession(): void {
  currentSessionId = generateSessionId();
  sessionStartTime = Date.now();
  lastActivityTime = Date.now();
  screenViewCount = 0;
  eventCount = 0;

  trackEvent(AnalyticsEvents.SESSION_START, {
    session_id: currentSessionId,
    timestamp: sessionStartTime,
  });

  if (analyticsConfig.debug) {
    console.log('🎯 Session started:', currentSessionId);
  }
}

/**
 * End the current analytics session
 */
export function endSession(): void {
  if (!currentSessionId || !sessionStartTime) return;

  const sessionDuration = Date.now() - sessionStartTime;

  trackEvent(AnalyticsEvents.SESSION_END, {
    session_id: currentSessionId,
    session_duration: sessionDuration,
    screens_viewed: screenViewCount,
    actions_taken: eventCount,
  });

  if (analyticsConfig.debug) {
    console.log('🎯 Session ended:', currentSessionId, `Duration: ${sessionDuration}ms`);
  }

  currentSessionId = null;
  sessionStartTime = null;
  lastActivityTime = null;
  screenViewCount = 0;
  eventCount = 0;
}

/**
 * Update session activity (for timeout detection)
 */
function updateSessionActivity(): void {
  const now = Date.now();

  // Check if session has timed out
  if (lastActivityTime && (now - lastActivityTime) > SESSION_TIMEOUT_MS) {
    // Session timed out, end old session and start new one
    endSession();
    startSession();
  }

  lastActivityTime = now;
}

/**
 * Get current session ID
 */
export function getSessionId(): string | null {
  return currentSessionId;
}

// ============================================================================
// SCREEN TRACKING
// ============================================================================

let currentScreen: string | null = null;
let screenStartTime: number | null = null;

/**
 * Log screen view with automatic duration tracking
 */
export function trackScreenView(screenName: string, params?: Partial<ScreenViewParams>): void {
  // Calculate previous screen duration
  let previousScreenDuration: number | undefined;
  if (currentScreen && screenStartTime) {
    previousScreenDuration = Date.now() - screenStartTime;
  }

  // Track the screen view
  trackEvent(AnalyticsEvents.SCREEN_VIEW, {
    screen_name: screenName,
    screen_class: screenName,
    previous_screen: currentScreen || undefined,
    duration: previousScreenDuration,
    ...params,
  });

  // Increment screen view counter
  screenViewCount++;

  // Update current screen
  currentScreen = screenName;
  screenStartTime = Date.now();

  if (analyticsConfig.debug) {
    console.log(`📱 Screen viewed: ${screenName} (previous: ${currentScreen || 'none'})`);
  }
}

/**
 * Track navigation between screens
 */
export function trackNavigation(params: NavigationParams): void {
  trackEvent(AnalyticsEvents.NAVIGATION, params);
}

/**
 * Track tab change
 */
export function trackTabChange(fromTab: string, toTab: string): void {
  trackEvent(AnalyticsEvents.TAB_CHANGED, {
    from_tab: fromTab,
    to_tab: toTab,
  });
}

/**
 * Track deep link opened
 */
export function trackDeepLink(url: string, linkType: string, linkId?: string, source?: string): void {
  trackEvent(AnalyticsEvents.DEEP_LINK_OPENED, {
    url,
    link_type: linkType,
    link_id: linkId,
    source,
  });
}

// ============================================================================
// MATCH TRACKING
// ============================================================================

/**
 * Track match viewed
 */
export function trackMatchViewed(params: MatchEventParams): void {
  trackEvent(AnalyticsEvents.MATCH_VIEWED, params);
}

/**
 * Track match favorited
 */
export function trackMatchFavorited(matchId: string | number, action: 'add' | 'remove'): void {
  trackEvent(action === 'add' ? AnalyticsEvents.MATCH_FAVORITED : AnalyticsEvents.MATCH_UNFAVORITED, {
    match_id: matchId,
  });
}

/**
 * Track match shared
 */
export function trackMatchShared(params: MatchEventParams & { platform?: string }): void {
  trackEvent(AnalyticsEvents.MATCH_SHARED, params);
}

/**
 * Track match filter applied
 */
export function trackMatchFilter(filterType: string, filterValue: any): void {
  trackEvent(AnalyticsEvents.MATCH_FILTER_APPLIED, {
    filter_type: filterType,
    filter_value: filterValue,
  });
}

// ============================================================================
// BOT & PREDICTION TRACKING
// ============================================================================

/**
 * Track bot viewed
 */
export function trackBotViewed(params: BotEventParams): void {
  trackEvent(AnalyticsEvents.BOT_VIEWED, params);
}

/**
 * Track bot selected
 */
export function trackBotSelected(params: BotEventParams): void {
  trackEvent(AnalyticsEvents.BOT_SELECTED, params);
}

/**
 * Track bot shared
 */
export function trackBotShared(params: BotEventParams & { platform?: string }): void {
  trackEvent(AnalyticsEvents.BOT_SHARED, params);
}

/**
 * Track prediction viewed
 */
export function trackPredictionViewed(predictionId: number, botId: number, matchId: string | number): void {
  trackEvent(AnalyticsEvents.PREDICTION_VIEWED, {
    prediction_id: predictionId,
    bot_id: botId,
    match_id: matchId,
  });
}

// ============================================================================
// USER ACTION TRACKING
// ============================================================================

/**
 * Track button press
 */
export function trackButtonPress(buttonName: string, context?: string, buttonType?: string): void {
  trackEvent(AnalyticsEvents.BUTTON_PRESSED, {
    button_name: buttonName,
    button_type: buttonType,
    context,
  });
}

/**
 * Track search
 */
export function trackSearch(query: string, resultsCount?: number, searchType?: string): void {
  trackEvent(AnalyticsEvents.SEARCH_COMPLETED, {
    query,
    results_count: resultsCount,
    search_type: searchType,
  });
}

/**
 * Track filter applied
 */
export function trackFilter(filterType: string, filterValue: any): void {
  trackEvent(AnalyticsEvents.FILTER_APPLIED, {
    filter_type: filterType,
    filter_value: filterValue,
  });
}

/**
 * Track sort applied
 */
export function trackSort(sortType: string, sortDirection?: 'asc' | 'desc'): void {
  trackEvent(AnalyticsEvents.SORT_APPLIED, {
    sort_type: sortType,
    sort_direction: sortDirection,
  });
}

/**
 * Track share action
 */
export function trackShareAction(
  contentType: string,
  contentId?: string | number,
  platform?: string,
  method?: string
): void {
  trackEvent(AnalyticsEvents.SHARE_COMPLETED, {
    content_type: contentType,
    content_id: contentId,
    platform,
    method,
  });
}

// ============================================================================
// PERFORMANCE TRACKING
// ============================================================================

/**
 * Track API call performance
 */
export function trackAPICall(
  endpoint: string,
  method: string,
  duration: number,
  statusCode?: number,
  success?: boolean
): void {
  if (!analyticsConfig.features?.performanceMonitoring) return;

  const params: PerformanceParams = {
    metric_name: 'api_call',
    duration,
    details: {
      endpoint,
      method,
      status_code: statusCode,
      success,
      is_slow: duration > PERFORMANCE_THRESHOLDS.API_SLOW,
      is_very_slow: duration > PERFORMANCE_THRESHOLDS.API_VERY_SLOW,
    },
  };

  trackEvent(AnalyticsEvents.API_CALL_COMPLETED, params);

  // Log slow API calls
  if (duration > PERFORMANCE_THRESHOLDS.API_VERY_SLOW) {
    console.warn(`⚠️ Very slow API call: ${endpoint} (${duration}ms)`);
  }
}

/**
 * Track screen load performance
 */
export function trackScreenLoad(screenName: string, duration: number): void {
  if (!analyticsConfig.features?.performanceMonitoring) return;

  const params: PerformanceParams = {
    metric_name: 'screen_load',
    duration,
    details: {
      screen_name: screenName,
      is_slow: duration > PERFORMANCE_THRESHOLDS.SCREEN_LOAD_SLOW,
      is_very_slow: duration > PERFORMANCE_THRESHOLDS.SCREEN_LOAD_VERY_SLOW,
    },
  };

  trackEvent(AnalyticsEvents.SCREEN_LOAD_COMPLETED, params);

  if (duration > PERFORMANCE_THRESHOLDS.SCREEN_LOAD_VERY_SLOW) {
    console.warn(`⚠️ Very slow screen load: ${screenName} (${duration}ms)`);
  }
}

/**
 * Track app startup performance
 */
export function trackAppStartup(duration: number, coldStart: boolean): void {
  if (!analyticsConfig.features?.performanceMonitoring) return;

  const params: PerformanceParams = {
    metric_name: 'app_startup',
    duration,
    details: {
      cold_start: coldStart,
      is_slow: duration > PERFORMANCE_THRESHOLDS.STARTUP_SLOW,
      is_very_slow: duration > PERFORMANCE_THRESHOLDS.STARTUP_VERY_SLOW,
    },
  };

  trackEvent(AnalyticsEvents.APP_STARTUP_COMPLETED, params);

  if (duration > PERFORMANCE_THRESHOLDS.STARTUP_VERY_SLOW) {
    console.warn(`⚠️ Very slow app startup: ${duration}ms (cold: ${coldStart})`);
  }
}

// ============================================================================
// ERROR TRACKING
// ============================================================================

/**
 * Track error with comprehensive details
 */
export function trackErrorEvent(params: ErrorParams): void {
  if (!analyticsConfig.features?.errorTracking) return;

  trackEvent(AnalyticsEvents.ERROR_OCCURRED, params);

  // Also log to console in development
  if (isDev) {
    console.error('🚨 Error tracked:', params);
  }
}

/**
 * Track API error
 */
export function trackAPIError(endpoint: string, statusCode: number, errorMessage: string): void {
  trackErrorEvent({
    error_type: 'api_error',
    error_message: `${endpoint}: ${errorMessage}`,
    severity: statusCode >= 500 ? 'high' : 'medium',
    context: endpoint,
    user_impact: statusCode >= 500 ? 'major' : 'minor',
  });
}

/**
 * Track network error
 */
export function trackNetworkError(endpoint: string, errorMessage: string): void {
  trackErrorEvent({
    error_type: 'network_error',
    error_message: `${endpoint}: ${errorMessage}`,
    severity: 'high',
    context: endpoint,
    user_impact: 'major',
  });
}

// ============================================================================
// NOTIFICATION TRACKING
// ============================================================================

/**
 * Track notification received
 */
export function trackNotificationReceived(notificationType: string, notificationId?: string): void {
  trackEvent(AnalyticsEvents.NOTIFICATION_RECEIVED, {
    notification_type: notificationType,
    notification_id: notificationId,
  });
}

/**
 * Track notification opened
 */
export function trackNotificationOpened(notificationType: string, deepLink?: string): void {
  trackEvent(AnalyticsEvents.NOTIFICATION_OPENED, {
    notification_type: notificationType,
    deep_link: deepLink,
  });
}

/**
 * Track notification permission
 */
export function trackNotificationPermission(granted: boolean): void {
  trackEvent(
    granted
      ? AnalyticsEvents.NOTIFICATION_PERMISSION_GRANTED
      : AnalyticsEvents.NOTIFICATION_PERMISSION_DENIED,
    {}
  );
}

/**
 * Log login event
 */
export function trackLogin(method: 'google' | 'apple' | 'phone'): void {
  trackEvent(StandardEvents.LOGIN, {
    method,
  });
}

/**
 * Log sign up event
 */
export function trackSignUp(method: 'google' | 'apple' | 'phone'): void {
  trackEvent(StandardEvents.SIGN_UP, {
    method,
  });
}

/**
 * Log match view
 */
export function trackMatchView(matchId: string, matchName: string, isLive: boolean): void {
  trackEvent(isLive ? CustomEvents.LIVE_MATCH_VIEW : CustomEvents.MATCH_VIEW, {
    match_id: matchId,
    match_name: matchName,
    is_live: isLive,
  });
}

/**
 * Log team view
 */
export function trackTeamView(teamId: string, teamName: string): void {
  trackEvent(CustomEvents.TEAM_VIEW, {
    team_id: teamId,
    team_name: teamName,
  });
}

/**
 * Log competition view
 */
export function trackCompetitionView(competitionId: string, competitionName: string): void {
  trackEvent(CustomEvents.COMPETITION_VIEW, {
    competition_id: competitionId,
    competition_name: competitionName,
  });
}

/**
 * Log AI prediction view
 */
export function trackAIPredictionView(matchId: string, botName: string): void {
  trackEvent(CustomEvents.AI_PREDICTION_VIEW, {
    match_id: matchId,
    bot_name: botName,
  });
}

/**
 * Log share action
 */
export function trackShare(
  contentType: 'match' | 'prediction' | 'referral',
  contentId: string,
  method?: string
): void {
  trackEvent(StandardEvents.SHARE, {
    content_type: contentType,
    content_id: contentId,
    method: method || 'unknown',
  });
}

/**
 * Log credits earned
 */
export function trackCreditsEarned(amount: number, source: string): void {
  trackEvent(CustomEvents.CREDITS_EARNED, {
    value: amount,
    source,
  });
}

/**
 * Log credits spent
 */
export function trackCreditsSpent(amount: number, item: string): void {
  trackEvent(CustomEvents.CREDITS_SPENT, {
    value: amount,
    item,
  });
}

/**
 * Log subscription purchase
 */
export function trackSubscription(
  action: 'start' | 'cancel' | 'renew',
  plan: string,
  value?: number
): void {
  const eventName =
    action === 'start'
      ? CustomEvents.SUBSCRIPTION_START
      : action === 'cancel'
        ? CustomEvents.SUBSCRIPTION_CANCEL
        : CustomEvents.SUBSCRIPTION_RENEW;

  trackEvent(eventName, {
    plan,
    value,
    currency: 'USD',
  });
}

/**
 * Log error occurrence
 */
export function trackError(errorType: string, errorMessage: string, context?: string): void {
  trackEvent(CustomEvents.ERROR_OCCURRED, {
    error_type: errorType,
    error_message: errorMessage,
    context: context || 'unknown',
  });
}

// ============================================================================
// USER PROPERTIES
// ============================================================================

/**
 * Set user ID for analytics
 */
export function setAnalyticsUserId(userId: string): void {
  try {
    if (Platform.OS === 'web' && analytics) {
      setUserId(analytics, userId);
    }

    if (analyticsConfig.debug) {
      console.log('👤 Analytics User ID set:', userId);
    }
  } catch (error) {
    console.error('❌ Failed to set analytics user ID:', error);
  }
}

/**
 * Set comprehensive user properties
 */
export function setAnalyticsUserProperties(properties: Partial<UserProperties>): void {
  if (!analyticsConfig.trackUserProperties) return;

  try {
    // Sanitize properties
    const cleanProps = sanitizeParams(properties);

    if (Platform.OS === 'web' && analytics) {
      setUserProperties(analytics, cleanProps);
    }

    if (analyticsConfig.debug) {
      console.log('👤 Analytics User Properties set:', cleanProps);
    }

    // Add Sentry user context
    addBreadcrumb('User Properties Updated', 'user', 'info', { properties: cleanProps });

  } catch (error) {
    console.error('❌ Failed to set analytics user properties:', error);
  }
}

/**
 * Set user subscription status
 */
export function setUserSubscriptionStatus(status: 'free' | 'premium' | 'vip'): void {
  setAnalyticsUserProperties({
    vip_status: status,
  });
}

/**
 * Set user level
 */
export function setUserLevel(level: number | string): void {
  setAnalyticsUserProperties({
    user_level: String(level),
  });
}

/**
 * Track user engagement metrics
 */
export function updateUserEngagement(metrics: {
  totalSessions?: number;
  totalScreenViews?: number;
  totalPredictionsViewed?: number;
  totalMatchesViewed?: number;
}): void {
  setAnalyticsUserProperties(metrics);
}

/**
 * Set user favorites
 */
export function setUserFavorites(favorites: {
  teams?: string[];
  bots?: number[];
  matchesCount?: number;
}): void {
  setAnalyticsUserProperties({
    favorite_teams: favorites.teams,
    favorite_teams_count: favorites.teams?.length,
    favorite_bots: favorites.bots,
    favorite_bots_count: favorites.bots?.length,
    favorite_matches_count: favorites.matchesCount,
  });
}

/**
 * Set notification preferences
 */
export function setNotificationPreferences(enabled: boolean, pushToken?: string): void {
  setAnalyticsUserProperties({
    notification_enabled: enabled,
    push_token: pushToken,
  });
}


// ============================================================================
// EXPORT
// ============================================================================

export default {
  // Initialization
  initAnalytics,

  // Session management
  startSession,
  endSession,
  getSessionId,

  // Core tracking
  trackEvent,
  trackScreenView,
  trackNavigation,
  trackTabChange,
  trackDeepLink,

  // Match tracking
  trackMatchViewed,
  trackMatchFavorited,
  trackMatchShared,
  trackMatchFilter,

  // Bot & Prediction tracking
  trackBotViewed,
  trackBotSelected,
  trackBotShared,
  trackPredictionViewed,

  // User actions
  trackButtonPress,
  trackSearch,
  trackFilter,
  trackSort,
  trackShareAction,

  // Performance tracking
  trackAPICall,
  trackScreenLoad,
  trackAppStartup,

  // Error tracking
  trackErrorEvent,
  trackAPIError,
  trackNetworkError,

  // Notification tracking
  trackNotificationReceived,
  trackNotificationOpened,
  trackNotificationPermission,

  // User properties
  setAnalyticsUserId,
  setAnalyticsUserProperties,
  setUserSubscriptionStatus,
  setUserLevel,
  updateUserEngagement,
  setUserFavorites,
  setNotificationPreferences,

  // Constants
  AnalyticsEvents,
  StandardEvents,
  CustomEvents,
  ScreenNames,
};
