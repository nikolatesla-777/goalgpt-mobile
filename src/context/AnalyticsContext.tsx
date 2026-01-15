/**
 * AnalyticsContext
 * Provides analytics functionality throughout the app
 */

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import analyticsService from '../services/analytics.service';
import { analyticsConfig, appInfo, deviceInfo } from '../config/analytics.config';
import type { UserProperties } from '../types/analytics.types';

// ============================================================================
// TYPES
// ============================================================================

interface AnalyticsContextValue {
  /**
   * Track a custom event
   */
  trackEvent: typeof analyticsService.trackEvent;

  /**
   * Track screen view
   */
  trackScreenView: typeof analyticsService.trackScreenView;

  /**
   * Set user ID
   */
  setUserId: typeof analyticsService.setAnalyticsUserId;

  /**
   * Set user properties
   */
  setUserProperties: typeof analyticsService.setAnalyticsUserProperties;

  /**
   * Check if analytics is enabled
   */
  isEnabled: boolean;

  /**
   * Get current session ID
   */
  getSessionId: typeof analyticsService.getSessionId;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface AnalyticsProviderProps {
  children: ReactNode;
  userId?: string;
  userProperties?: Partial<UserProperties>;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  userId,
  userProperties,
}) => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const sessionStartTime = useRef<number>(Date.now());
  const hasInitialized = useRef<boolean>(false);

  // Initialize analytics on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (analyticsConfig.debug) {
      console.log('🎯 AnalyticsProvider initialized');
      console.log('App Info:', appInfo);
      console.log('Device Info:', deviceInfo);
    }

    // Start analytics session
    analyticsService.startSession();

    // Set initial user properties
    if (userId) {
      analyticsService.setAnalyticsUserId(userId);
    }

    if (userProperties) {
      analyticsService.setAnalyticsUserProperties({
        ...userProperties,
        app_version: appInfo.version,
        build_number: appInfo.buildNumber,
        device_model: deviceInfo.model,
        os_version: deviceInfo.platformVersion,
        os_name: deviceInfo.platform,
      });
    }

    // Track app startup
    const startupDuration = Date.now() - sessionStartTime.current;
    analyticsService.trackAppStartup(startupDuration, true);

    // Cleanup on unmount
    return () => {
      analyticsService.endSession();
    };
  }, [userId, userProperties]);

  // Update user ID when it changes
  useEffect(() => {
    if (userId) {
      analyticsService.setAnalyticsUserId(userId);
    }
  }, [userId]);

  // Update user properties when they change
  useEffect(() => {
    if (userProperties) {
      analyticsService.setAnalyticsUserProperties(userProperties);
    }
  }, [userProperties]);

  // Track app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        analyticsService.trackEvent('app_foreground', {});
        if (analyticsConfig.debug) {
          console.log('📱 App foregrounded');
        }
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        analyticsService.trackEvent('app_background', {});
        if (analyticsConfig.debug) {
          console.log('📱 App backgrounded');
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Context value
  const value: AnalyticsContextValue = {
    trackEvent: analyticsService.trackEvent,
    trackScreenView: analyticsService.trackScreenView,
    setUserId: analyticsService.setAnalyticsUserId,
    setUserProperties: analyticsService.setAnalyticsUserProperties,
    isEnabled: analyticsConfig.enabled,
    getSessionId: analyticsService.getSessionId,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * useAnalytics Hook
 * Access analytics functionality from any component
 */
export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);

  if (!context) {
    // Return no-op functions if provider is not available
    // This prevents crashes if analytics is not set up yet
    return {
      trackEvent: () => {},
      trackScreenView: () => {},
      setUserId: () => {},
      setUserProperties: () => {},
      isEnabled: false,
      getSessionId: () => null,
    };
  }

  return context;
}

// ============================================================================
// EXPORT
// ============================================================================

export default AnalyticsContext;
