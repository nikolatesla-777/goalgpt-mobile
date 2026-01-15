/**
 * Notification Handler
 * Handles notification taps, deep linking, and navigation
 */

import * as Notifications from 'expo-notifications';
import { NotificationData, NotificationType } from './notifications.service';
import { addBreadcrumb } from '../config/sentry.config';
import { trackEvent } from './analytics.service';

// Navigation ref (will be set by AppNavigator)
let navigationRef: any = null;

/**
 * Set navigation reference for deep linking
 */
export function setNavigationRef(ref: any): void {
  navigationRef = ref;
}

// ============================================================================
// TYPES
// ============================================================================

export interface NotificationResponse {
  notification: Notifications.Notification;
  actionIdentifier: string;
}

export type NotificationTapHandler = (data: NotificationData) => void;

// ============================================================================
// HANDLERS
// ============================================================================

/**
 * Handle notification tap (when user taps notification)
 */
export function handleNotificationTap(response: NotificationResponse): void {
  const notification = response.notification;
  const data = notification.request.content.data as NotificationData;

  // Log to console
  console.log('📱 Notification tapped:', data);

  // Add breadcrumb
  addBreadcrumb('Notification tapped', 'notification', 'info', {
    type: data.type,
    actionIdentifier: response.actionIdentifier,
  });

  // Track analytics
  trackEvent('notification_tapped', {
    type: data.type,
    actionIdentifier: response.actionIdentifier,
  });

  // Navigate based on notification type
  navigateFromNotification(data);
}

/**
 * Handle notification received (when notification arrives while app is open)
 */
export function handleNotificationReceived(notification: Notifications.Notification): void {
  const data = notification.request.content.data as NotificationData;

  // Log to console
  console.log('📱 Notification received:', data);

  // Add breadcrumb
  addBreadcrumb('Notification received', 'notification', 'info', {
    type: data.type,
  });

  // Track analytics
  trackEvent('notification_received', {
    type: data.type,
  });

  // Optional: Show in-app notification banner or toast
  // This is handled automatically by Expo Notifications
}

// ============================================================================
// DEEP LINKING
// ============================================================================

/**
 * Navigate to appropriate screen based on notification data
 */
function navigateFromNotification(data: NotificationData): void {
  const { type, matchId, teamId, predictionId } = data;

  if (!navigationRef) {
    console.warn('⚠️ Navigation ref not set, cannot navigate from notification');
    return;
  }

  try {
    switch (type) {
      case 'score_update':
      case 'match_start':
      case 'match_end':
        // Navigate to match detail
        if (matchId) {
          navigationRef.navigate('MatchDetail', { matchId });
        }
        break;

      case 'prediction_result':
        // Navigate to predictions or match detail
        if (matchId) {
          navigationRef.navigate('MatchDetail', { matchId });
        } else {
          navigationRef.navigate('MainTabs', { screen: 'Predictions' });
        }
        break;

      case 'ai_alert':
        // Navigate to AI bots (Predictions tab)
        navigationRef.navigate('MainTabs', { screen: 'Predictions' });
        break;

      case 'credits_earned':
        // Navigate to profile screen
        navigationRef.navigate('MainTabs', { screen: 'Profile' });
        break;

      case 'general':
      default:
        // Navigate to home
        navigationRef.navigate('MainTabs', { screen: 'Home' });
        break;
    }

    // Track navigation
    trackEvent('notification_navigation', {
      type,
      destination: getNavigationDestination(type, data),
    });
  } catch (error) {
    console.error('❌ Failed to navigate from notification:', error);
  }
}

/**
 * Get navigation destination for tracking
 */
function getNavigationDestination(type: NotificationType, data: NotificationData): string {
  switch (type) {
    case 'score_update':
    case 'match_start':
    case 'match_end':
      return `match/${data.matchId || 'unknown'}`;
    case 'prediction_result':
      return data.matchId ? `match/${data.matchId}` : 'ai-bots';
    case 'ai_alert':
      return 'ai-bots';
    case 'credits_earned':
      return 'profile';
    default:
      return 'home';
  }
}

// ============================================================================
// LISTENERS
// ============================================================================

/**
 * Add notification received listener
 */
export function addNotificationReceivedListener(
  handler: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(handler);
}

/**
 * Add notification response listener (for taps)
 */
export function addNotificationResponseListener(
  handler: (response: NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(handler);
}

/**
 * Get last notification response (if app was opened from notification)
 */
export async function getLastNotificationResponse(): Promise<NotificationResponse | null> {
  try {
    const response = await Notifications.getLastNotificationResponseAsync();
    return response;
  } catch (error) {
    console.error('❌ Failed to get last notification response:', error);
    return null;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  handleNotificationTap,
  handleNotificationReceived,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  getLastNotificationResponse,
};
