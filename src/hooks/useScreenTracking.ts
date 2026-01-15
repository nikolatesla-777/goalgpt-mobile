/**
 * useScreenTracking Hook
 * Automatic screen view tracking for React Navigation
 */

import { useEffect, useRef } from 'react';
import { useNavigationState, useRoute, RouteProp } from '@react-navigation/native';
import analyticsService from '../services/analytics.service';
import { analyticsConfig } from '../config/analytics.config';

// ============================================================================
// TYPES
// ============================================================================

export interface ScreenTrackingOptions {
  /**
   * Custom screen name (defaults to route name)
   */
  screenName?: string;

  /**
   * Additional parameters to track with screen view
   */
  params?: Record<string, any>;

  /**
   * Whether to track this screen (default: true)
   */
  enabled?: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * useScreenTracking
 * Automatically tracks screen views when component mounts
 *
 * @example
 * ```tsx
 * function MyScreen() {
 *   useScreenTracking('MyScreen');
 *   // or
 *   useScreenTracking('MyScreen', { custom_param: 'value' });
 *   // or
 *   useScreenTracking({ screenName: 'MyScreen', params: { ... } });
 * }
 * ```
 */
export function useScreenTracking(
  screenNameOrOptions?: string | ScreenTrackingOptions,
  additionalParams?: Record<string, any>
): void {
  const route = useRoute();
  const hasTracked = useRef(false);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    // Only track once per mount
    if (hasTracked.current) return;

    // Parse options
    let options: ScreenTrackingOptions;
    if (typeof screenNameOrOptions === 'string') {
      options = {
        screenName: screenNameOrOptions,
        params: additionalParams,
        enabled: true,
      };
    } else if (screenNameOrOptions) {
      options = screenNameOrOptions;
    } else {
      options = { enabled: true };
    }

    // Check if tracking is enabled
    if (!analyticsConfig.trackScreenViews || options.enabled === false) {
      return;
    }

    // Get screen name
    const screenName = options.screenName || route.name;

    // Track screen view
    analyticsService.trackScreenView(screenName, {
      ...options.params,
      // Include route params as context
      ...(route.params as Record<string, any>),
    });

    hasTracked.current = true;

    if (analyticsConfig.debug) {
      console.log(`📱 Screen tracked: ${screenName}`);
    }

    // Track screen duration on unmount
    return () => {
      const duration = Date.now() - mountTime.current;
      if (analyticsConfig.debug) {
        console.log(`📱 Screen duration: ${screenName} - ${duration}ms`);
      }
    };
  }, [route.name, route.params, screenNameOrOptions, additionalParams]);
}

// ============================================================================
// NAVIGATION STATE TRACKING
// ============================================================================

/**
 * useNavigationTracking
 * Tracks navigation state changes globally
 * Should be used at the root NavigationContainer level
 */
export function useNavigationTracking(): void {
  const previousRoute = useRef<string | null>(null);

  // Get current route name from navigation state
  const currentRouteName = useNavigationState((state) => {
    if (!state) return null;

    // Get the current route from the navigation state
    const route = state.routes[state.index];
    if (!route) return null;

    // Handle nested navigators
    if (route.state) {
      const nestedRoute = route.state.routes[route.state.index];
      return nestedRoute?.name || route.name;
    }

    return route.name;
  });

  useEffect(() => {
    if (!currentRouteName) return;

    // Track navigation if route changed
    if (previousRoute.current && previousRoute.current !== currentRouteName) {
      analyticsService.trackNavigation({
        from_screen: previousRoute.current,
        to_screen: currentRouteName,
        method: 'stack', // Default method, can be enhanced
      });

      if (analyticsConfig.debug) {
        console.log(`🧭 Navigation: ${previousRoute.current} → ${currentRouteName}`);
      }
    }

    previousRoute.current = currentRouteName;
  }, [currentRouteName]);
}

// ============================================================================
// SCREEN LOAD PERFORMANCE TRACKING
// ============================================================================

/**
 * useScreenLoadTracking
 * Tracks screen load performance
 * Measures time from mount to when screen is ready
 */
export function useScreenLoadTracking(
  screenName: string,
  isReady: boolean = true
): void {
  const mountTime = useRef<number>(Date.now());
  const hasTracked = useRef<boolean>(false);

  useEffect(() => {
    if (!isReady || hasTracked.current) return;

    const loadDuration = Date.now() - mountTime.current;

    analyticsService.trackScreenLoad(screenName, loadDuration);

    hasTracked.current = true;

    if (analyticsConfig.debug) {
      console.log(`⏱️ Screen load: ${screenName} - ${loadDuration}ms`);
    }
  }, [screenName, isReady]);
}

// ============================================================================
// TAB TRACKING
// ============================================================================

/**
 * useTabTracking
 * Tracks tab changes in tab navigator
 */
export function useTabTracking(currentTab: string): void {
  const previousTab = useRef<string | null>(null);

  useEffect(() => {
    if (previousTab.current && previousTab.current !== currentTab) {
      analyticsService.trackTabChange(previousTab.current, currentTab);

      if (analyticsConfig.debug) {
        console.log(`📑 Tab changed: ${previousTab.current} → ${currentTab}`);
      }
    }

    previousTab.current = currentTab;
  }, [currentTab]);
}

// ============================================================================
// EXPORT
// ============================================================================

export default useScreenTracking;
