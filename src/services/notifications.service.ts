/**
 * Notifications Service
 * Push notification management with Expo Notifications & Firebase Cloud Messaging
 * Handles permissions, token management, local/remote notifications
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { env, isDev, isAndroid, isIOS } from '../config/env';
import apiClient from '../api/client';
import { API_ENDPOINTS } from '../constants/api';
import { addBreadcrumb } from '../config/sentry.config';
import { trackEvent } from './analytics.service';

// ============================================================================
// TYPES
// ============================================================================

export type NotificationType =
  | 'score_update'
  | 'match_start'
  | 'match_end'
  | 'prediction_result'
  | 'ai_alert'
  | 'credits_earned'
  | 'general';

export interface NotificationData {
  type: NotificationType;
  matchId?: string;
  teamId?: string;
  predictionId?: string;
  [key: string]: any;
}

export interface LocalNotificationOptions {
  title: string;
  body: string;
  data?: NotificationData;
  sound?: boolean;
  badge?: number;
  categoryIdentifier?: string;
}

export interface ScheduledNotificationOptions extends LocalNotificationOptions {
  trigger: Date | number; // Date or seconds from now
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Configure how notifications are handled when app is in foreground
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Show notification alert
    shouldPlaySound: true, // Play sound
    shouldSetBadge: true, // Update badge count
    shouldShowBanner: true, // Show notification banner (iOS)
    shouldShowList: true, // Show in notification list (iOS)
  }),
});

// ============================================================================
// PERMISSIONS
// ============================================================================

/**
 * Request push notification permissions
 */
export async function requestPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    // If permission not granted, request it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const granted = finalStatus === 'granted';

    // Log result
    if (isDev) {
      console.log('📱 Notification permissions:', finalStatus);
    }

    // Track analytics
    trackEvent('notification_permission', {
      status: finalStatus,
      granted,
    });

    // Add breadcrumb
    addBreadcrumb('Notification permission requested', 'notification', 'info', {
      status: finalStatus,
      granted,
    });

    return granted;
  } catch (error) {
    console.error('❌ Failed to request notification permissions:', error);
    return false;
  }
}

/**
 * Check if notification permissions are granted
 */
export async function checkPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('❌ Failed to check notification permissions:', error);
    return false;
  }
}

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

/**
 * Get Expo push notification token
 */
export async function getExpoPushToken(): Promise<string | null> {
  try {
    // Check permissions first
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      console.log('⚠️ No notification permissions, skipping token generation');
      return null;
    }

    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: env.firebaseProjectId, // From Firebase config
    });

    const token = tokenData.data;

    if (isDev) {
      console.log('📱 Expo Push Token:', token);
    }

    // Track analytics
    trackEvent('notification_token_generated', {
      tokenLength: token.length,
    });

    return token;
  } catch (error) {
    console.error('❌ Failed to get Expo push token:', error);
    return null;
  }
}

/**
 * Get device-specific push token (FCM for Android, APNs for iOS)
 */
export async function getDevicePushToken(): Promise<string | null> {
  try {
    // Get device push token (FCM or APNs)
    const tokenData = await Notifications.getDevicePushTokenAsync();

    const token = tokenData.data;

    if (isDev) {
      console.log('📱 Device Push Token:', token);
    }

    return token;
  } catch (error) {
    console.error('❌ Failed to get device push token:', error);
    return null;
  }
}

/**
 * Register push token with backend
 */
export async function registerPushToken(): Promise<boolean> {
  try {
    // Get Expo push token
    const expoPushToken = await getExpoPushToken();
    if (!expoPushToken) {
      console.log('⚠️ No push token to register');
      return false;
    }

    // Get device token (FCM/APNs)
    const deviceToken = await getDevicePushToken();

    // Register with backend
    await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.REGISTER_TOKEN, {
      expoPushToken,
      deviceToken,
      platform: Platform.OS,
      deviceInfo: {
        os: Platform.OS,
        osVersion: Platform.Version,
      },
    });

    if (isDev) {
      console.log('✅ Push token registered with backend');
    }

    // Add breadcrumb
    addBreadcrumb('Push token registered', 'notification', 'info');

    // Track analytics
    trackEvent('push_token_registered', {
      platform: Platform.OS,
    });

    return true;
  } catch (error) {
    console.error('❌ Failed to register push token:', error);
    return false;
  }
}

/**
 * Unregister push token from backend
 */
export async function unregisterPushToken(): Promise<boolean> {
  try {
    const expoPushToken = await getExpoPushToken();
    if (!expoPushToken) {
      return false;
    }

    await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.UNREGISTER_TOKEN, {
      expoPushToken,
    });

    if (isDev) {
      console.log('✅ Push token unregistered from backend');
    }

    // Add breadcrumb
    addBreadcrumb('Push token unregistered', 'notification', 'info');

    return true;
  } catch (error) {
    console.error('❌ Failed to unregister push token:', error);
    return false;
  }
}

// ============================================================================
// LOCAL NOTIFICATIONS
// ============================================================================

/**
 * Show local notification immediately
 */
export async function showLocalNotification(
  options: LocalNotificationOptions
): Promise<string | null> {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: options.title,
        body: options.body,
        data: options.data || {},
        sound: options.sound !== false,
        badge: options.badge,
        categoryIdentifier: options.categoryIdentifier,
      },
      trigger: null, // Show immediately
    });

    if (isDev) {
      console.log('📱 Local notification shown:', notificationId);
    }

    // Track analytics
    trackEvent('local_notification_shown', {
      type: options.data?.type || 'general',
    });

    return notificationId;
  } catch (error) {
    console.error('❌ Failed to show local notification:', error);
    return null;
  }
}

/**
 * Schedule local notification for later
 */
export async function scheduleLocalNotification(
  options: ScheduledNotificationOptions
): Promise<string | null> {
  try {
    // Convert trigger to appropriate format
    let trigger: Notifications.NotificationTriggerInput;

    if (options.trigger instanceof Date) {
      // Schedule for specific date/time
      trigger = {
        type: 'date',
        date: options.trigger,
      } as Notifications.DateTriggerInput;
    } else {
      // Schedule for X seconds from now
      trigger = {
        type: 'timeInterval',
        seconds: options.trigger,
        repeats: false,
      } as Notifications.TimeIntervalTriggerInput;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: options.title,
        body: options.body,
        data: options.data || {},
        sound: options.sound !== false,
        badge: options.badge,
        categoryIdentifier: options.categoryIdentifier,
      },
      trigger,
    });

    if (isDev) {
      console.log('📱 Notification scheduled:', notificationId);
    }

    // Track analytics
    trackEvent('local_notification_scheduled', {
      type: options.data?.type || 'general',
      triggerType: options.trigger instanceof Date ? 'date' : 'seconds',
    });

    return notificationId;
  } catch (error) {
    console.error('❌ Failed to schedule notification:', error);
    return null;
  }
}

/**
 * Cancel scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);

    if (isDev) {
      console.log('📱 Notification cancelled:', notificationId);
    }
  } catch (error) {
    console.error('❌ Failed to cancel notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (isDev) {
      console.log('📱 All notifications cancelled');
    }
  } catch (error) {
    console.error('❌ Failed to cancel all notifications:', error);
  }
}

// ============================================================================
// BADGE COUNT
// ============================================================================

/**
 * Set app badge count
 */
export async function setBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);

    if (isDev) {
      console.log('📱 Badge count set:', count);
    }
  } catch (error) {
    console.error('❌ Failed to set badge count:', error);
  }
}

/**
 * Get current badge count
 */
export async function getBadgeCount(): Promise<number> {
  try {
    const count = await Notifications.getBadgeCountAsync();
    return count;
  } catch (error) {
    console.error('❌ Failed to get badge count:', error);
    return 0;
  }
}

/**
 * Clear badge count
 */
export async function clearBadgeCount(): Promise<void> {
  await setBadgeCount(0);
}

// ============================================================================
// NOTIFICATION CATEGORIES
// ============================================================================

/**
 * Set up notification categories (action buttons)
 */
export async function setupNotificationCategories(): Promise<void> {
  try {
    // iOS only (Android uses different mechanism)
    if (!isIOS) return;

    await Notifications.setNotificationCategoryAsync('score_update', [
      {
        identifier: 'view_match',
        buttonTitle: 'View Match',
        options: {
          opensAppToForeground: true,
        },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('match_start', [
      {
        identifier: 'open_match',
        buttonTitle: 'Watch Live',
        options: {
          opensAppToForeground: true,
        },
      },
    ]);

    if (isDev) {
      console.log('📱 Notification categories set up');
    }
  } catch (error) {
    console.error('❌ Failed to setup notification categories:', error);
  }
}

// ============================================================================
// NOTIFICATION TEMPLATES
// ============================================================================

/**
 * Show score update notification
 */
export async function notifyScoreUpdate(
  matchId: string,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number
): Promise<void> {
  await showLocalNotification({
    title: '⚽ Goal Scored!',
    body: `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`,
    data: {
      type: 'score_update',
      matchId,
    },
    categoryIdentifier: 'score_update',
  });
}

/**
 * Show match starting notification
 */
export async function notifyMatchStarting(
  matchId: string,
  homeTeam: string,
  awayTeam: string,
  minutesUntilStart: number
): Promise<void> {
  await showLocalNotification({
    title: '⏰ Match Starting Soon',
    body: `${homeTeam} vs ${awayTeam} starts in ${minutesUntilStart} minutes`,
    data: {
      type: 'match_start',
      matchId,
    },
    categoryIdentifier: 'match_start',
  });
}

/**
 * Show prediction result notification
 */
export async function notifyPredictionResult(
  correct: boolean,
  points: number,
  matchTitle: string
): Promise<void> {
  await showLocalNotification({
    title: correct ? '🎉 Prediction Correct!' : '😔 Prediction Incorrect',
    body: correct
      ? `You earned ${points} points for ${matchTitle}`
      : `Better luck next time with ${matchTitle}`,
    data: {
      type: 'prediction_result',
    },
  });
}

/**
 * Show AI alert notification
 */
export async function notifyAIAlert(
  botName: string,
  prediction: string,
  confidence: number
): Promise<void> {
  await showLocalNotification({
    title: `🤖 ${botName} Alert`,
    body: `New high-confidence prediction: ${prediction} (${confidence}% confidence)`,
    data: {
      type: 'ai_alert',
    },
  });
}

/**
 * Show credits earned notification
 */
export async function notifyCreditsEarned(amount: number, source: string): Promise<void> {
  await showLocalNotification({
    title: '💰 Credits Earned!',
    body: `You earned ${amount} credits from ${source}`,
    data: {
      type: 'credits_earned',
    },
  });
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  // Permissions
  requestPermissions,
  checkPermissions,

  // Token management
  getExpoPushToken,
  getDevicePushToken,
  registerPushToken,
  unregisterPushToken,

  // Local notifications
  showLocalNotification,
  scheduleLocalNotification,
  cancelNotification,
  cancelAllNotifications,

  // Badge count
  setBadgeCount,
  getBadgeCount,
  clearBadgeCount,

  // Categories
  setupNotificationCategories,

  // Templates
  notifyScoreUpdate,
  notifyMatchStarting,
  notifyPredictionResult,
  notifyAIAlert,
  notifyCreditsEarned,
};
