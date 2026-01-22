/**
 * Notification Service
 *
 * Service for managing push notifications using Expo Notifications
 * Handles: Permissions, Token generation, Local/Remote notifications
 *
 * NOTE: For TestFlight/Production, migrate to FCM (Firebase Cloud Messaging)
 * See documentation: FCM_MIGRATION_GUIDE.md
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import type {
  NotificationPayload,
  NotificationSettings,
  NotificationPermissionStatus,
  PushToken,
  NotificationType,
  NOTIFICATION_STORAGE_KEYS,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../types/notification.types';
import logger from '../utils/logger';

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEY_SETTINGS = '@goalgpt_notification_settings';
const STORAGE_KEY_TOKEN = '@goalgpt_push_token';
const STORAGE_KEY_PERMISSION_ASKED = '@goalgpt_notification_permission_asked';

// ============================================================================
// NOTIFICATION HANDLER CONFIG
// ============================================================================

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ============================================================================
// PERMISSIONS
// ============================================================================

/**
 * Request notification permissions
 */
export async function requestPermissions(): Promise<NotificationPermissionStatus> {
  try {
    // Check if physical device (not simulator)
    if (!Device.isDevice) {
      logger.warn('⚠️ Push notifications only work on physical devices');
      return 'denied';
    }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Mark as asked
    await AsyncStorage.setItem(STORAGE_KEY_PERMISSION_ASKED, 'true');

    // Map to our status type
    if (finalStatus === 'granted') {
      logger.debug('✅ Notification permissions granted');
      return 'granted';
    } else {
      logger.debug('❌ Notification permissions denied');
      return 'denied';
    }
  } catch (error) {
    logger.error('❌ Failed to request permissions:', error);
    return 'denied';
  }
}

/**
 * Check current permission status
 */
export async function getPermissionStatus(): Promise<NotificationPermissionStatus> {
  try {
    const { status } = await Notifications.getPermissionsAsync();

    if (status === 'granted') return 'granted';
    if (status === 'denied') return 'denied';

    // Check if we asked before
    const asked = await AsyncStorage.getItem(STORAGE_KEY_PERMISSION_ASKED);
    if (asked) return 'denied'; // Asked but not granted = denied

    return 'undetermined';
  } catch (error) {
    logger.error('❌ Failed to get permission status:', error);
    return 'undetermined';
  }
}

/**
 * Check if permissions have been asked before
 */
export async function hasAskedForPermissions(): Promise<boolean> {
  const asked = await AsyncStorage.getItem(STORAGE_KEY_PERMISSION_ASKED);
  return asked === 'true';
}

// ============================================================================
// PUSH TOKEN
// ============================================================================

/**
 * Send push token to backend
 */
async function sendTokenToBackend(token: string): Promise<void> {
  try {
    const deviceId = await Device.osInternalBuildId;
    const deviceName = Device.deviceName;
    const osVersion = Device.osVersion;

    // Get API base URL from environment
    const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'http://142.93.103.128:3000';

    const response = await fetch(`${apiUrl}/api/notifications/register-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        platform: Platform.OS,
        deviceId,
        deviceName,
        osVersion,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    logger.debug('✅ Token registered with backend');
  } catch (error) {
    logger.error('❌ Failed to register token with backend:', error);
    // Don't throw - token is still saved locally
  }
}

/**
 * Get Expo push token
 */
export async function getExpoPushToken(): Promise<string | null> {
  try {
    if (!Device.isDevice) {
      logger.warn('⚠️ Push tokens only work on physical devices');
      return null;
    }

    // Get project ID from constants
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId;

    if (!projectId) {
      logger.warn('⚠️ Expo project ID not configured');
      logger.warn('Add projectId to app.json under expo.extra.eas.projectId');
      return null;
    }

    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const token = tokenData.data;
    logger.debug('✅ Expo push token:', token);

    // Save token
    const pushToken: PushToken = {
      token,
      platform: Platform.OS as 'ios' | 'android',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify(pushToken));

    // Send token to backend
    await sendTokenToBackend(token);

    return token;
  } catch (error) {
    logger.error('❌ Failed to get push token:', error);
    return null;
  }
}

/**
 * Get stored push token
 */
export async function getStoredPushToken(): Promise<PushToken | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_TOKEN);
    if (!data) return null;

    const token: PushToken = JSON.parse(data);
    return token;
  } catch (error) {
    logger.error('❌ Failed to get stored token:', error);
    return null;
  }
}

/**
 * Clear stored push token
 */
export async function clearPushToken(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
}

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================

/**
 * Load notification settings
 */
export async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!data) {
      // Return default settings
      return {
        enabled: true,
        matchStart: true,
        goals: true,
        matchEnd: false,
        predictionResults: true,
        notifyFavorites: true,
        quietHoursEnabled: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
        sound: true,
        vibration: true,
      };
    }

    const settings: NotificationSettings = JSON.parse(data);
    return settings;
  } catch (error) {
    logger.error('❌ Failed to load notification settings:', error);
    return {
      enabled: true,
      matchStart: true,
      goals: true,
      matchEnd: false,
      predictionResults: true,
      notifyFavorites: true,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      sound: true,
      vibration: true,
    };
  }
}

/**
 * Save notification settings
 */
export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  try {
    const data = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, data);
    logger.debug('✅ Notification settings saved');
  } catch (error) {
    logger.error('❌ Failed to save notification settings:', error);
    throw error;
  }
}

/**
 * Update specific setting
 */
export async function updateNotificationSetting<K extends keyof NotificationSettings>(
  key: K,
  value: NotificationSettings[K]
): Promise<void> {
  const settings = await loadNotificationSettings();
  settings[key] = value;
  await saveNotificationSettings(settings);
}

// ============================================================================
// CHECK IF SHOULD NOTIFY
// ============================================================================

/**
 * Check if should send notification based on settings and quiet hours
 */
export async function shouldNotify(type: NotificationType): Promise<boolean> {
  const settings = await loadNotificationSettings();

  // Check if notifications enabled globally
  if (!settings.enabled) return false;

  // Check type-specific settings
  switch (type) {
    case 'match_start':
      if (!settings.matchStart) return false;
      break;
    case 'goal':
      if (!settings.goals) return false;
      break;
    case 'match_end':
      if (!settings.matchEnd) return false;
      break;
    case 'prediction_win':
    case 'prediction_lose':
      if (!settings.predictionResults) return false;
      break;
  }

  // Check quiet hours
  if (settings.quietHoursEnabled) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const start = settings.quietHoursStart;
    const end = settings.quietHoursEnd;

    // Check if current time is in quiet hours range
    if (start < end) {
      // Same day range (e.g., 22:00 - 08:00 next day doesn't work here, need special handling)
      if (currentTime >= start && currentTime < end) {
        logger.debug('⏰ Quiet hours active, notification suppressed');
        return false;
      }
    } else {
      // Overnight range (e.g., 22:00 - 08:00)
      if (currentTime >= start || currentTime < end) {
        logger.debug('⏰ Quiet hours active, notification suppressed');
        return false;
      }
    }
  }

  return true;
}

// ============================================================================
// SCHEDULE LOCAL NOTIFICATION
// ============================================================================

/**
 * Schedule a local notification
 */
export async function scheduleLocalNotification(
  payload: NotificationPayload,
  delaySeconds: number = 0
): Promise<string | null> {
  try {
    // Check if should notify
    const should = await shouldNotify(payload.data.type);
    if (!should) {
      logger.debug('⏭️ Notification skipped based on settings');
      return null;
    }

    const settings = await loadNotificationSettings();

    // Schedule notification
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data,
        sound: settings.sound ? 'default' : undefined,
        badge: payload.badge,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: delaySeconds > 0 ? { seconds: delaySeconds } : null,
    });

    logger.debug('✅ Local notification scheduled:', id);
    return id;
  } catch (error) {
    logger.error('❌ Failed to schedule notification:', error);
    return null;
  }
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    logger.debug('✅ Notification cancelled:', notificationId);
  } catch (error) {
    logger.error('❌ Failed to cancel notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    logger.debug('✅ All notifications cancelled');
  } catch (error) {
    logger.error('❌ Failed to cancel all notifications:', error);
  }
}

// ============================================================================
// NOTIFICATION TEMPLATES
// ============================================================================

/**
 * Create match start notification
 */
export function createMatchStartNotification(
  matchId: string | number,
  homeTeam: string,
  awayTeam: string,
  league?: string
): NotificationPayload {
  return {
    title: '⚽ Match Starting!',
    body: `${homeTeam} vs ${awayTeam}${league ? ` - ${league}` : ''}`,
    data: {
      type: 'match_start',
      matchId,
      homeTeam,
      awayTeam,
      league,
      timestamp: new Date().toISOString(),
      actionUrl: `/match/${matchId}`,
    },
    priority: 'high',
    sound: true,
    vibrate: true,
  };
}

/**
 * Create goal notification
 */
export function createGoalNotification(
  matchId: string | number,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  scoringTeam: string,
  minute: number
): NotificationPayload {
  return {
    title: '⚽ GOAL!',
    body: `${scoringTeam} scores! ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam} (${minute}')`,
    data: {
      type: 'goal',
      matchId,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      minute,
      timestamp: new Date().toISOString(),
      actionUrl: `/match/${matchId}`,
    },
    priority: 'max',
    sound: true,
    vibrate: true,
  };
}

/**
 * Create match end notification
 */
export function createMatchEndNotification(
  matchId: string | number,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number
): NotificationPayload {
  return {
    title: '🏁 Full Time',
    body: `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`,
    data: {
      type: 'match_end',
      matchId,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      timestamp: new Date().toISOString(),
      actionUrl: `/match/${matchId}`,
    },
    priority: 'default',
    sound: true,
    vibrate: false,
  };
}

/**
 * Create prediction result notification
 */
export function createPredictionResultNotification(
  predictionId: string | number,
  matchId: string | number,
  prediction: string,
  result: 'win' | 'lose',
  confidence?: number
): NotificationPayload {
  const isWin = result === 'win';

  return {
    title: isWin ? '🎉 Prediction Won!' : '❌ Prediction Lost',
    body: `${prediction}${confidence ? ` (${confidence}% confidence)` : ''} - ${isWin ? 'Correct!' : 'Incorrect'}`,
    data: {
      type: isWin ? 'prediction_win' : 'prediction_lose',
      predictionId,
      matchId,
      prediction,
      confidence,
      timestamp: new Date().toISOString(),
      actionUrl: `/prediction/${predictionId}`,
    },
    priority: isWin ? 'high' : 'default',
    sound: true,
    vibrate: isWin,
  };
}

// ============================================================================
// BADGE MANAGEMENT
// ============================================================================

/**
 * Set app badge count
 */
export async function setBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    logger.error('❌ Failed to set badge count:', error);
  }
}

/**
 * Clear app badge
 */
export async function clearBadge(): Promise<void> {
  await setBadgeCount(0);
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  // Permissions
  requestPermissions,
  getPermissionStatus,
  hasAskedForPermissions,

  // Token
  getExpoPushToken,
  getStoredPushToken,
  clearPushToken,

  // Settings
  loadNotificationSettings,
  saveNotificationSettings,
  updateNotificationSetting,
  shouldNotify,

  // Local notifications
  scheduleLocalNotification,
  cancelNotification,
  cancelAllNotifications,

  // Templates
  createMatchStartNotification,
  createGoalNotification,
  createMatchEndNotification,
  createPredictionResultNotification,

  // Badge
  setBadgeCount,
  clearBadge,
};
