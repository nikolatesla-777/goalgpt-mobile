/**
 * useNotifications Hook
 * React hook for managing push notifications
 */

import { useEffect, useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import {
  requestPermissions,
  checkPermissions,
  registerPushToken,
  unregisterPushToken,
  setupNotificationCategories,
} from '../services/notifications.service';
import {
  handleNotificationTap,
  handleNotificationReceived,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  getLastNotificationResponse,
} from '../services/notificationHandler';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// TYPES
// ============================================================================

export interface UseNotificationsOptions {
  /** Auto-request permissions on mount (default: false) */
  autoRequest?: boolean;
  /** Auto-register token when authenticated (default: true) */
  autoRegister?: boolean;
  /** Setup notification categories (default: true) */
  setupCategories?: boolean;
}

export interface UseNotificationsReturn {
  /** Whether permissions are granted */
  hasPermission: boolean;
  /** Whether permissions are loading */
  loading: boolean;
  /** Push notification token */
  token: string | null;
  /** Request permissions */
  requestPermission: () => Promise<boolean>;
  /** Register token with backend */
  registerToken: () => Promise<boolean>;
  /** Unregister token from backend */
  unregisterToken: () => Promise<boolean>;
  /** Latest notification received */
  lastNotification: Notifications.Notification | null;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for managing push notifications
 */
export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const { isAuthenticated, user } = useAuth();

  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [lastNotification, setLastNotification] = useState<Notifications.Notification | null>(
    null
  );

  // Configuration
  const {
    autoRequest = false,
    autoRegister = true,
    setupCategories = true,
  } = options;

  // ============================================================================
  // PERMISSION MANAGEMENT
  // ============================================================================

  /**
   * Request notification permissions
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const granted = await requestPermissions();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('❌ Failed to request permissions:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check existing permissions
   */
  const checkExistingPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const granted = await checkPermissions();
      setHasPermission(granted);
    } catch (error) {
      console.error('❌ Failed to check permissions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // TOKEN MANAGEMENT
  // ============================================================================

  /**
   * Register push token with backend
   */
  const registerToken = useCallback(async (): Promise<boolean> => {
    try {
      const success = await registerPushToken();
      if (success) {
        // Update token state (optional: could fetch token again)
        console.log('✅ Token registered successfully');
      }
      return success;
    } catch (error) {
      console.error('❌ Failed to register token:', error);
      return false;
    }
  }, []);

  /**
   * Unregister push token from backend
   */
  const unregisterToken = useCallback(async (): Promise<boolean> => {
    try {
      const success = await unregisterPushToken();
      if (success) {
        setToken(null);
        console.log('✅ Token unregistered successfully');
      }
      return success;
    } catch (error) {
      console.error('❌ Failed to unregister token:', error);
      return false;
    }
  }, []);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    // Check existing permissions on mount
    checkExistingPermissions();
  }, [checkExistingPermissions]);

  useEffect(() => {
    // Auto-request permissions if enabled
    if (autoRequest && !hasPermission) {
      requestPermission();
    }
  }, [autoRequest, hasPermission, requestPermission]);

  useEffect(() => {
    // Setup notification categories
    if (setupCategories) {
      setupNotificationCategories();
    }
  }, [setupCategories]);

  useEffect(() => {
    // Auto-register token when authenticated and has permission
    if (autoRegister && isAuthenticated && hasPermission && user) {
      registerToken();
    }

    // Unregister token when logged out
    if (!isAuthenticated && token) {
      unregisterToken();
    }
  }, [autoRegister, isAuthenticated, hasPermission, user, token, registerToken, unregisterToken]);

  // ============================================================================
  // NOTIFICATION LISTENERS
  // ============================================================================

  useEffect(() => {
    // Listen for notifications received while app is open
    const receivedSubscription = addNotificationReceivedListener((notification) => {
      setLastNotification(notification);
      handleNotificationReceived(notification);
    });

    // Listen for notification taps
    const responseSubscription = addNotificationResponseListener((response) => {
      handleNotificationTap(response);
    });

    // Check if app was opened from a notification
    getLastNotificationResponse().then((response) => {
      if (response) {
        handleNotificationTap(response);
      }
    });

    // Cleanup
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    hasPermission,
    loading,
    token,
    requestPermission,
    registerToken,
    unregisterToken,
    lastNotification,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default useNotifications;
