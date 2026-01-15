/**
 * Sentry Configuration
 * Enhanced error tracking and performance monitoring setup
 */

import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { env, isDev } from './env';

// ============================================================================
// SENTRY INITIALIZATION
// ============================================================================

/**
 * Initialize Sentry error tracking
 * Call this once at app startup
 */
export function initSentry(): void {
  // Skip Sentry in development if DSN not provided
  if (isDev && !env.sentryDsn) {
    console.log('⚠️ Sentry DSN not configured - error tracking disabled in development');
    return;
  }

  // Skip if crash reporting is disabled
  if (!env.enableCrashReporting) {
    console.log('⚠️ Crash reporting disabled via feature flag');
    return;
  }

  // Require DSN in production
  if (!isDev && !env.sentryDsn) {
    console.error('❌ Sentry DSN is required in production!');
    return;
  }

  try {
    Sentry.init({
      // DSN from environment config
      dsn: env.sentryDsn,

      // Environment (development/staging/production)
      environment: env.sentryEnvironment || (isDev ? 'development' : 'production'),

      // Enable automatic session tracking
      enableAutoSessionTracking: true,

      // Performance monitoring sample rate
      // 1.0 = 100% of transactions sent to Sentry
      // Lower in production to reduce costs (e.g., 0.1 = 10%)
      tracesSampleRate: isDev ? 1.0 : 0.2,

      // Enable automatic breadcrumbs
      enableAutoPerformanceTracing: true,

      // Max breadcrumbs (navigation history for debugging)
      maxBreadcrumbs: 50,

      // Attach stack trace to all messages
      attachStacktrace: true,

      // Enable native crash reporting (iOS/Android)
      enableNative: true,

      // Enable native nagger (prompts for native crash reports)
      enableNativeNagger: isDev,

      // Debug mode (verbose logging)
      debug: isDev,

      // App version and release
      release: `goalgpt-mobile@${env.appVersion}`,
      dist: env.appVersion,

      // Before send hook - filter sensitive data
      beforeSend(event, hint) {
        // Filter out sensitive data
        if (event.request) {
          // Remove auth tokens from headers
          if (event.request.headers) {
            delete event.request.headers['Authorization'];
            delete event.request.headers['x-auth-token'];
          }

          // Remove query params that might contain sensitive data
          if (event.request.url) {
            event.request.url = event.request.url.split('?')[0];
          }
        }

        // Log error in development
        if (isDev) {
          console.error('🔴 Sentry captured error:', hint.originalException || hint.syntheticException);
        }

        return event;
      },

      // Before breadcrumb hook - filter sensitive breadcrumbs
      beforeBreadcrumb(breadcrumb, hint) {
        // Filter out sensitive navigation breadcrumbs
        if (breadcrumb.category === 'navigation' && breadcrumb.data?.to) {
          // Remove query params from navigation URLs
          breadcrumb.data.to = breadcrumb.data.to.split('?')[0];
        }

        // Filter out console.log breadcrumbs in production
        if (!isDev && breadcrumb.category === 'console' && breadcrumb.level === 'log') {
          return null;
        }

        return breadcrumb;
      },

      // Integrations
      integrations: [],
    });

    console.log('✅ Sentry initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Sentry:', error);
  }
}

// ============================================================================
// SENTRY HELPERS
// ============================================================================

/**
 * Capture an error manually
 */
export function captureError(error: Error, context?: Record<string, any>): void {
  if (!env.enableCrashReporting) return;

  Sentry.captureException(error, {
    contexts: context ? { extra: context } : undefined,
  });

  if (isDev) {
    console.error('🔴 Error captured by Sentry:', error, context);
  }
}

/**
 * Capture a message (non-error event)
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
): void {
  if (!env.enableCrashReporting) return;

  Sentry.captureMessage(message, {
    level,
    contexts: context ? { extra: context } : undefined,
  });

  if (isDev) {
    console.log(`🔵 Message captured by Sentry [${level}]:`, message, context);
  }
}

/**
 * Add breadcrumb (navigation history)
 */
export function addBreadcrumb(
  message: string,
  category: string = 'custom',
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
): void {
  if (!env.enableCrashReporting) return;

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Set user context
 */
export function setUser(user: {
  id: string;
  email?: string;
  username?: string;
  [key: string]: any;
}): void {
  if (!env.enableCrashReporting) return;

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  if (isDev) {
    console.log('👤 Sentry user context set:', user.id);
  }
}

/**
 * Clear user context (on logout)
 */
export function clearUser(): void {
  if (!env.enableCrashReporting) return;

  Sentry.setUser(null);

  if (isDev) {
    console.log('👤 Sentry user context cleared');
  }
}

/**
 * Set custom context (e.g., app state)
 */
export function setContext(key: string, context: Record<string, any>): void {
  if (!env.enableCrashReporting) return;

  Sentry.setContext(key, context);
}

/**
 * Set custom tag
 */
export function setTag(key: string, value: string): void {
  if (!env.enableCrashReporting) return;

  Sentry.setTag(key, value);
}

/**
 * Start a new performance transaction
 * Note: This feature requires additional setup with Sentry Performance Monitoring
 */
export function startTransaction(name: string, op: string): any {
  if (!env.enableCrashReporting) return null;

  // Performance transactions are automatically handled by Sentry in React Native
  // Manual transaction creation is optional and requires additional configuration
  if (isDev) {
    console.log('📊 Performance transaction:', name, op);
  }

  return null;
}

/**
 * Wrap async function with error tracking
 */
export function wrapAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, any>
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error as Error, {
        ...context,
        functionName: fn.name,
        arguments: args,
      });
      throw error;
    }
  }) as T;
}

// ============================================================================
// ENHANCED ERROR TRACKING
// ============================================================================

/**
 * Capture error with enhanced context and grouping
 */
export function captureEnhancedError(
  error: Error,
  options: {
    severity?: Sentry.SeverityLevel;
    tags?: Record<string, string>;
    context?: Record<string, any>;
    user?: { id: string; email?: string; username?: string };
    fingerprint?: string[];
  } = {}
): void {
  if (!env.enableCrashReporting) return;

  const { severity = 'error', tags, context, user, fingerprint } = options;

  Sentry.withScope((scope) => {
    // Set severity
    scope.setLevel(severity);

    // Set tags for grouping and filtering
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // Set custom context
    if (context) {
      scope.setContext('custom', context);
    }

    // Set user if provided
    if (user) {
      scope.setUser(user);
    }

    // Set fingerprint for custom grouping
    if (fingerprint) {
      scope.setFingerprint(fingerprint);
    }

    // Add device and app context
    scope.setContext('device', {
      platform: Platform.OS,
      version: Platform.Version,
      model: Constants.deviceName,
      isDevice: Constants.isDevice,
    });

    scope.setContext('app', {
      version: Constants.expoConfig?.version,
      buildNumber:
        Constants.expoConfig?.ios?.buildNumber ||
        Constants.expoConfig?.android?.versionCode,
    });

    // Capture the exception
    Sentry.captureException(error);
  });

  if (isDev) {
    console.error('🔴 Enhanced error captured:', error, options);
  }
}

/**
 * Capture API error with specific context
 */
export function captureAPIError(
  endpoint: string,
  method: string,
  statusCode: number,
  error: Error,
  requestData?: any
): void {
  captureEnhancedError(error, {
    severity: statusCode >= 500 ? 'error' : 'warning',
    tags: {
      api_endpoint: endpoint,
      http_method: method,
      http_status: String(statusCode),
      error_type: 'api_error',
    },
    context: {
      endpoint,
      method,
      statusCode,
      requestData: requestData ? JSON.stringify(requestData).substring(0, 200) : undefined,
    },
    fingerprint: ['api-error', endpoint, String(statusCode)],
  });
}

/**
 * Capture navigation error
 */
export function captureNavigationError(
  fromScreen: string,
  toScreen: string,
  error: Error
): void {
  captureEnhancedError(error, {
    severity: 'warning',
    tags: {
      error_type: 'navigation_error',
      from_screen: fromScreen,
      to_screen: toScreen,
    },
    context: {
      fromScreen,
      toScreen,
    },
    fingerprint: ['navigation-error', fromScreen, toScreen],
  });
}

/**
 * Capture render error (from ErrorBoundary)
 */
export function captureRenderError(
  componentName: string,
  error: Error,
  errorInfo: any
): void {
  captureEnhancedError(error, {
    severity: 'error',
    tags: {
      error_type: 'render_error',
      component: componentName,
    },
    context: {
      componentName,
      componentStack: errorInfo.componentStack,
    },
    fingerprint: ['render-error', componentName],
  });
}

/**
 * Alias for backward compatibility
 */
export const initializeSentry = initSentry;

// ============================================================================
// EXPORT
// ============================================================================

export default {
  // Initialization
  initSentry,
  initializeSentry,

  // Basic error tracking
  captureError,
  captureMessage,
  addBreadcrumb,

  // Enhanced error tracking
  captureEnhancedError,
  captureAPIError,
  captureNavigationError,
  captureRenderError,

  // User management
  setUser,
  clearUser,

  // Context and tags
  setContext,
  setTag,

  // Performance
  startTransaction,

  // Utilities
  wrapAsync,
};
