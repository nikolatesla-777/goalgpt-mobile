/**
 * Production-Safe Logger Utility
 *
 * Provides structured logging with automatic Sentry integration
 * and environment-aware behavior.
 */

import * as Sentry from '@sentry/react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = __DEV__;
    this.isProduction = process.env.EXPO_PUBLIC_ENVIRONMENT === 'production';
  }

  /**
   * Debug logs - only in development
   */
  debug(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Info logs - development and staging
   */
  info(message: string, ...args: any[]): void {
    if (!this.isProduction) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Warning logs - all environments, sent to Sentry in production
   */
  warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);

    if (this.isProduction) {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: args.length > 0 ? { data: args } : undefined,
      });
    }
  }

  /**
   * Error logs - all environments, always sent to Sentry
   */
  error(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${message}`, ...args);

    // Find the first Error object in args, or create a new one
    const errorObj = args.find((arg) => arg instanceof Error) || new Error(message);

    Sentry.captureException(errorObj, {
      extra: {
        message,
        data: args.filter((arg) => !(arg instanceof Error)),
      },
    });
  }

  /**
   * Log API calls - debug only
   */
  api(method: string, url: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`[API] ${method} ${url}`, data || '');
    }
  }

  /**
   * Log navigation events - debug only
   */
  navigation(screen: string, params?: any): void {
    if (this.isDevelopment) {
      console.log(`[NAV] → ${screen}`, params || '');
    }
  }

  /**
   * Log WebSocket events - debug only
   */
  websocket(event: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`[WS] ${event}`, data || '');
    }
  }

  /**
   * Log performance metrics - development and staging
   */
  performance(operation: string, duration: number): void {
    if (!this.isProduction) {
      console.log(`[PERF] ${operation}: ${duration}ms`);
    }
  }

  /**
   * Generic log method with level
   */
  log(level: LogLevel, message: string, context?: LogContext): void {
    switch (level) {
      case 'debug':
        this.debug(message, context);
        break;
      case 'info':
        this.info(message, context);
        break;
      case 'warn':
        this.warn(message, context);
        break;
      case 'error':
        this.error(message, undefined, context);
        break;
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger };

// Default export is the singleton instance
export default logger;
