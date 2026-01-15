/**
 * Analytics Configuration
 * Central configuration for analytics and tracking
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { AnalyticsConfig } from '../types/analytics.types';
import { isDev } from './env';

// ============================================================================
// ANALYTICS CONFIG
// ============================================================================

export const analyticsConfig: AnalyticsConfig = {
  // Enable/disable analytics globally
  enabled: !isDev, // Disable in development by default

  // Debug mode - logs all events to console
  debug: isDev,

  // Auto-tracking features
  trackScreenViews: true,
  trackUserProperties: true,
  trackPerformance: true,
  trackErrors: true,

  // Sample rate (0.0 to 1.0) - track all events in production
  sampleRate: isDev ? 0.1 : 1.0,

  // Feature flags
  features: {
    sessionTracking: true,
    navigationTracking: true,
    performanceMonitoring: true,
    errorTracking: true,
  },
};

// ============================================================================
// APP INFO
// ============================================================================

export const appInfo = {
  name: Constants.expoConfig?.name || 'GoalGPT',
  version: Constants.expoConfig?.version || '1.0.0',
  buildNumber: Constants.expoConfig?.ios?.buildNumber ||
                Constants.expoConfig?.android?.versionCode?.toString() || '1',
  bundleId: Constants.expoConfig?.ios?.bundleIdentifier ||
            Constants.expoConfig?.android?.package || 'com.wizardstech.goalgpt',
};

// ============================================================================
// DEVICE INFO
// ============================================================================

export const deviceInfo = {
  platform: Platform.OS,
  platformVersion: Platform.Version?.toString() || 'unknown',
  model: Constants.deviceName || 'unknown',
  brand: Constants.platform?.ios ? 'Apple' : 'unknown',
  isDevice: Constants.isDevice,
  isEmulator: !Constants.isDevice,
};

// ============================================================================
// TRACKING SETTINGS
// ============================================================================

/**
 * Events that should never be tracked (privacy-sensitive)
 */
export const BLOCKED_EVENTS: string[] = [
  // Add events that should never be tracked
];

/**
 * Parameters that should be sanitized/removed before tracking
 */
export const SENSITIVE_PARAMS: string[] = [
  'password',
  'email',
  'phone',
  'credit_card',
  'ssn',
  'api_key',
  'token',
  'secret',
];

/**
 * Maximum length for string parameters
 */
export const MAX_PARAM_LENGTH = 100;

/**
 * Maximum number of custom parameters per event
 */
export const MAX_PARAMS_PER_EVENT = 25;

/**
 * Debounce time for rapid-fire events (ms)
 */
export const EVENT_DEBOUNCE_MS = 500;

/**
 * Session timeout (ms) - 30 minutes
 */
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Performance tracking thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  // Screen load time (ms)
  SCREEN_LOAD_SLOW: 3000,
  SCREEN_LOAD_VERY_SLOW: 5000,

  // API call time (ms)
  API_SLOW: 2000,
  API_VERY_SLOW: 5000,

  // App startup time (ms)
  STARTUP_SLOW: 3000,
  STARTUP_VERY_SLOW: 5000,
};

// ============================================================================
// SANITIZATION
// ============================================================================

/**
 * Sanitize event parameters
 * - Remove sensitive data
 * - Truncate long strings
 * - Limit number of parameters
 */
export function sanitizeParams(params: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  let paramCount = 0;

  for (const [key, value] of Object.entries(params)) {
    // Skip if we've hit the limit
    if (paramCount >= MAX_PARAMS_PER_EVENT) {
      console.warn(`⚠️ Analytics: Maximum parameters (${MAX_PARAMS_PER_EVENT}) exceeded`);
      break;
    }

    // Skip sensitive parameters
    if (SENSITIVE_PARAMS.some(sensitive => key.toLowerCase().includes(sensitive))) {
      console.warn(`⚠️ Analytics: Skipping sensitive parameter: ${key}`);
      continue;
    }

    // Skip undefined/null
    if (value === undefined || value === null) {
      continue;
    }

    // Handle different value types
    if (typeof value === 'string') {
      // Truncate long strings
      sanitized[key] = value.length > MAX_PARAM_LENGTH
        ? value.substring(0, MAX_PARAM_LENGTH) + '...'
        : value;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (Array.isArray(value)) {
      // Convert arrays to comma-separated strings
      sanitized[key] = value.join(',');
    } else if (typeof value === 'object') {
      // Convert objects to JSON strings (truncated)
      const jsonStr = JSON.stringify(value);
      sanitized[key] = jsonStr.length > MAX_PARAM_LENGTH
        ? jsonStr.substring(0, MAX_PARAM_LENGTH) + '...'
        : jsonStr;
    }

    paramCount++;
  }

  return sanitized;
}

/**
 * Check if an event should be tracked
 */
export function shouldTrackEvent(eventName: string): boolean {
  // Check if analytics is enabled
  if (!analyticsConfig.enabled) {
    return false;
  }

  // Check if event is blocked
  if (BLOCKED_EVENTS.includes(eventName)) {
    return false;
  }

  // Apply sample rate
  if (analyticsConfig.sampleRate && analyticsConfig.sampleRate < 1.0) {
    return Math.random() < analyticsConfig.sampleRate;
  }

  return true;
}

/**
 * Add default parameters to all events
 */
export function addDefaultParams(params: Record<string, any> = {}): Record<string, any> {
  return {
    ...params,
    timestamp: Date.now(),
    app_version: appInfo.version,
    app_build: appInfo.buildNumber,
    platform: deviceInfo.platform,
    platform_version: deviceInfo.platformVersion,
    device_model: deviceInfo.model,
    is_emulator: deviceInfo.isEmulator,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  analyticsConfig,
  appInfo,
  deviceInfo,
  sanitizeParams,
  shouldTrackEvent,
  addDefaultParams,
  BLOCKED_EVENTS,
  SENSITIVE_PARAMS,
  PERFORMANCE_THRESHOLDS,
  SESSION_TIMEOUT_MS,
};
