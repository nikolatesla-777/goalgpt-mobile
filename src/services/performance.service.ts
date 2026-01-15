/**
 * Performance Monitoring Service
 * Tracks app performance metrics and identifies bottlenecks
 */

import { Platform, InteractionManager } from 'react-native';
import analyticsService from './analytics.service';
import { analyticsConfig, PERFORMANCE_THRESHOLDS } from '../config/analytics.config';
import { addBreadcrumb } from '../config/sentry.config';

// ============================================================================
// TYPES
// ============================================================================

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface APIPerformanceMetric {
  endpoint: string;
  method: string;
  duration: number;
  statusCode?: number;
  success: boolean;
  timestamp: number;
}

export interface ScreenPerformanceMetric {
  screenName: string;
  mountDuration: number;
  renderDuration?: number;
  interactionDelay?: number;
  timestamp: number;
}

// ============================================================================
// PERFORMANCE TRACKER
// ============================================================================

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private apiMetrics: APIPerformanceMetric[] = [];
  private screenMetrics: ScreenPerformanceMetric[] = [];
  private activeTimers: Map<string, number> = new Map();
  private maxMetrics = 100; // Keep last 100 metrics

  // ============================================================================
  // TIMER MANAGEMENT
  // ============================================================================

  /**
   * Start a performance timer
   */
  startTimer(timerName: string): void {
    this.activeTimers.set(timerName, Date.now());

    if (analyticsConfig.debug) {
      console.log(`⏱️ Timer started: ${timerName}`);
    }
  }

  /**
   * End a performance timer and record the duration
   */
  endTimer(timerName: string, metadata?: Record<string, any>): number | null {
    const startTime = this.activeTimers.get(timerName);

    if (!startTime) {
      console.warn(`⚠️ Timer "${timerName}" was not started`);
      return null;
    }

    const duration = Date.now() - startTime;
    this.activeTimers.delete(timerName);

    // Record metric
    this.recordMetric({
      name: timerName,
      duration,
      timestamp: Date.now(),
      metadata,
    });

    if (analyticsConfig.debug) {
      console.log(`⏱️ Timer ended: ${timerName} - ${duration}ms`);
    }

    return duration;
  }

  /**
   * Measure function execution time
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
        metadata: { ...metadata, success: true },
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
        metadata: { ...metadata, success: false, error: String(error) },
      });

      throw error;
    }
  }

  /**
   * Measure synchronous function execution time
   */
  measure<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    const startTime = Date.now();

    try {
      const result = fn();
      const duration = Date.now() - startTime;

      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
        metadata: { ...metadata, success: true },
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
        metadata: { ...metadata, success: false, error: String(error) },
      });

      throw error;
    }
  }

  // ============================================================================
  // METRIC RECORDING
  // ============================================================================

  /**
   * Record a performance metric
   */
  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Add Sentry breadcrumb for slow operations
    if (metric.duration > 1000) {
      addBreadcrumb('Slow Operation', 'performance', 'warning', {
        name: metric.name,
        duration: metric.duration,
        metadata: metric.metadata,
      });
    }
  }

  /**
   * Record API call performance
   */
  recordAPICall(metric: APIPerformanceMetric): void {
    this.apiMetrics.push(metric);

    // Keep only last N metrics
    if (this.apiMetrics.length > this.maxMetrics) {
      this.apiMetrics.shift();
    }

    // Track in analytics
    analyticsService.trackAPICall(
      metric.endpoint,
      metric.method,
      metric.duration,
      metric.statusCode,
      metric.success
    );

    // Log slow API calls
    if (metric.duration > PERFORMANCE_THRESHOLDS.API_VERY_SLOW) {
      console.warn(`🐌 Very slow API call: ${metric.endpoint} (${metric.duration}ms)`);

      addBreadcrumb('Slow API Call', 'performance', 'warning', {
        endpoint: metric.endpoint,
        duration: metric.duration,
        statusCode: metric.statusCode,
      });
    }
  }

  /**
   * Record screen performance
   */
  recordScreenPerformance(metric: ScreenPerformanceMetric): void {
    this.screenMetrics.push(metric);

    // Keep only last N metrics
    if (this.screenMetrics.length > this.maxMetrics) {
      this.screenMetrics.shift();
    }

    // Track in analytics
    analyticsService.trackScreenLoad(metric.screenName, metric.mountDuration);

    // Log slow screens
    if (metric.mountDuration > PERFORMANCE_THRESHOLDS.SCREEN_LOAD_VERY_SLOW) {
      console.warn(`🐌 Very slow screen load: ${metric.screenName} (${metric.mountDuration}ms)`);

      addBreadcrumb('Slow Screen Load', 'performance', 'warning', {
        screenName: metric.screenName,
        mountDuration: metric.mountDuration,
        renderDuration: metric.renderDuration,
      });
    }
  }

  // ============================================================================
  // API PERFORMANCE TRACKING
  // ============================================================================

  /**
   * Track API call performance
   * Wrapper for fetch/axios calls
   */
  async trackAPICall<T>(
    endpoint: string,
    method: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    let statusCode: number | undefined;
    let success = false;

    try {
      const result = await apiCall();
      success = true;

      // Try to extract status code from response
      if (result && typeof result === 'object' && 'status' in result) {
        statusCode = (result as any).status;
      } else {
        statusCode = 200; // Assume success
      }

      const duration = Date.now() - startTime;

      this.recordAPICall({
        endpoint,
        method,
        duration,
        statusCode,
        success,
        timestamp: Date.now(),
      });

      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;

      // Try to extract status code from error
      if (error && typeof error === 'object') {
        if ('status' in error) {
          statusCode = error.status;
        } else if ('response' in error && error.response?.status) {
          statusCode = error.response.status;
        }
      }

      this.recordAPICall({
        endpoint,
        method,
        duration,
        statusCode,
        success: false,
        timestamp: Date.now(),
      });

      // Track error in analytics
      analyticsService.trackAPIError(
        endpoint,
        statusCode || 0,
        error?.message || 'Unknown error'
      );

      throw error;
    }
  }

  // ============================================================================
  // SCREEN PERFORMANCE TRACKING
  // ============================================================================

  /**
   * Track screen mount performance
   */
  trackScreenMount(screenName: string): () => void {
    const mountStart = Date.now();

    return () => {
      const mountDuration = Date.now() - mountStart;

      this.recordScreenPerformance({
        screenName,
        mountDuration,
        timestamp: Date.now(),
      });
    };
  }

  /**
   * Track screen with interaction delay
   * Waits for all interactions to complete before considering screen ready
   */
  trackScreenWithInteractions(screenName: string): void {
    const mountStart = Date.now();

    InteractionManager.runAfterInteractions(() => {
      const interactionDelay = Date.now() - mountStart;

      this.recordScreenPerformance({
        screenName,
        mountDuration: interactionDelay,
        interactionDelay,
        timestamp: Date.now(),
      });
    });
  }

  // ============================================================================
  // METRICS RETRIEVAL
  // ============================================================================

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get API metrics
   */
  getAPIMetrics(): APIPerformanceMetric[] {
    return [...this.apiMetrics];
  }

  /**
   * Get screen metrics
   */
  getScreenMetrics(): ScreenPerformanceMetric[] {
    return [...this.screenMetrics];
  }

  /**
   * Get average metric duration by name
   */
  getAverageMetric(metricName: string): number | null {
    const filtered = this.metrics.filter(m => m.name === metricName);
    if (filtered.length === 0) return null;

    const total = filtered.reduce((sum, m) => sum + m.duration, 0);
    return total / filtered.length;
  }

  /**
   * Get average API call duration
   */
  getAverageAPICallDuration(endpoint?: string): number | null {
    const filtered = endpoint
      ? this.apiMetrics.filter(m => m.endpoint === endpoint)
      : this.apiMetrics;

    if (filtered.length === 0) return null;

    const total = filtered.reduce((sum, m) => sum + m.duration, 0);
    return total / filtered.length;
  }

  /**
   * Get slowest metrics
   */
  getSlowestMetrics(count: number = 10): PerformanceMetric[] {
    return [...this.metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, count);
  }

  /**
   * Get slowest API calls
   */
  getSlowestAPICalls(count: number = 10): APIPerformanceMetric[] {
    return [...this.apiMetrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, count);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.apiMetrics = [];
    this.screenMetrics = [];
    this.activeTimers.clear();

    if (analyticsConfig.debug) {
      console.log('🗑️ Performance metrics cleared');
    }
  }

  // ============================================================================
  // PERFORMANCE REPORT
  // ============================================================================

  /**
   * Generate performance report
   */
  generateReport(): {
    summary: {
      totalMetrics: number;
      totalAPICall: number;
      totalScreens: number;
      averageAPICallTime: number | null;
      slowestOperations: PerformanceMetric[];
      slowestAPICalls: APIPerformanceMetric[];
    };
    metrics: PerformanceMetric[];
    apiMetrics: APIPerformanceMetric[];
    screenMetrics: ScreenPerformanceMetric[];
  } {
    return {
      summary: {
        totalMetrics: this.metrics.length,
        totalAPICall: this.apiMetrics.length,
        totalScreens: this.screenMetrics.length,
        averageAPICallTime: this.getAverageAPICallDuration(),
        slowestOperations: this.getSlowestMetrics(5),
        slowestAPICalls: this.getSlowestAPICalls(5),
      },
      metrics: this.getMetrics(),
      apiMetrics: this.getAPIMetrics(),
      screenMetrics: this.getScreenMetrics(),
    };
  }

  /**
   * Log performance report to console
   */
  logReport(): void {
    const report = this.generateReport();

    console.log('📊 Performance Report');
    console.log('='.repeat(50));
    console.log(`Total Metrics: ${report.summary.totalMetrics}`);
    console.log(`Total API Calls: ${report.summary.totalAPICall}`);
    console.log(`Total Screens: ${report.summary.totalScreens}`);
    console.log(`Average API Call Time: ${report.summary.averageAPICallTime?.toFixed(2)}ms`);
    console.log('\nSlowest Operations:');
    report.summary.slowestOperations.forEach((m, i) => {
      console.log(`${i + 1}. ${m.name}: ${m.duration}ms`);
    });
    console.log('\nSlowest API Calls:');
    report.summary.slowestAPICalls.forEach((m, i) => {
      console.log(`${i + 1}. ${m.method} ${m.endpoint}: ${m.duration}ms`);
    });
    console.log('='.repeat(50));
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const performanceMonitor = new PerformanceMonitor();

// ============================================================================
// EXPORT
// ============================================================================

export default performanceMonitor;

export {
  performanceMonitor,
  PerformanceMonitor,
};
