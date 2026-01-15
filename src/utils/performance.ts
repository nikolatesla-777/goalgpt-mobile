/**
 * Performance Monitoring Utilities
 * Tools for measuring and monitoring app performance
 * - Render time tracking
 * - Re-render detection
 * - Performance profiling
 * - Memory monitoring
 */

import { useEffect, useRef } from 'react';
import { isDev } from '../config/env';

// ============================================================================
// TYPES
// ============================================================================

interface PerformanceMetric {
  componentName: string;
  renderTime: number;
  renderCount: number;
  timestamp: number;
}

interface RenderInfo {
  count: number;
  lastRenderTime: number;
  totalRenderTime: number;
  averageRenderTime: number;
}

// ============================================================================
// PERFORMANCE TRACKER
// ============================================================================

class PerformanceTracker {
  private metrics: Map<string, RenderInfo> = new Map();
  private enabled: boolean = isDev;

  /**
   * Track a render
   */
  trackRender(componentName: string, renderTime: number): void {
    if (!this.enabled) return;

    const existing = this.metrics.get(componentName) || {
      count: 0,
      lastRenderTime: 0,
      totalRenderTime: 0,
      averageRenderTime: 0,
    };

    const newCount = existing.count + 1;
    const newTotalTime = existing.totalRenderTime + renderTime;

    this.metrics.set(componentName, {
      count: newCount,
      lastRenderTime: renderTime,
      totalRenderTime: newTotalTime,
      averageRenderTime: newTotalTime / newCount,
    });

    // Log slow renders (>16ms = below 60fps)
    if (renderTime > 16) {
      console.warn(
        `⚠️ Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`
      );
    }
  }

  /**
   * Get metrics for a component
   */
  getMetrics(componentName: string): RenderInfo | undefined {
    return this.metrics.get(componentName);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Map<string, RenderInfo> {
    return this.metrics;
  }

  /**
   * Print performance report
   */
  printReport(): void {
    if (!this.enabled) return;

    console.log('\n📊 Performance Report\n');
    console.log('Component'.padEnd(30), 'Renders', 'Avg Time', 'Last Time');
    console.log('='.repeat(70));

    const sortedMetrics = Array.from(this.metrics.entries()).sort(
      ([, a], [, b]) => b.averageRenderTime - a.averageRenderTime
    );

    sortedMetrics.forEach(([name, info]) => {
      console.log(
        name.padEnd(30),
        info.count.toString().padEnd(8),
        `${info.averageRenderTime.toFixed(2)}ms`.padEnd(10),
        `${info.lastRenderTime.toFixed(2)}ms`
      );
    });

    console.log('\n');
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics.clear();
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Global instance
export const performanceTracker = new PerformanceTracker();

// ============================================================================
// PERFORMANCE HOOKS
// ============================================================================

/**
 * Hook to measure component render time
 * Usage: useRenderPerformance('MyComponent')
 */
export function useRenderPerformance(componentName: string): void {
  const renderStartTime = useRef<number>(0);

  // Measure start time
  renderStartTime.current = performance.now();

  useEffect(() => {
    // Measure end time and calculate duration
    const renderEndTime = performance.now();
    const renderDuration = renderEndTime - renderStartTime.current;

    // Track the render
    performanceTracker.trackRender(componentName, renderDuration);
  });
}

/**
 * Hook to detect why a component re-rendered
 * Usage: useWhyDidYouUpdate('MyComponent', { prop1, prop2 })
 */
export function useWhyDidYouUpdate(componentName: string, props: Record<string, any>): void {
  const previousProps = useRef<Record<string, any> | undefined>(undefined);

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current && previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`🔄 ${componentName} re-rendered. Changed props:`, changedProps);
      }
    }

    previousProps.current = props;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }); // Run on every render to detect changes
}

/**
 * Hook to count renders
 * Usage: const renderCount = useRenderCount('MyComponent')
 */
export function useRenderCount(componentName: string): number {
  const renderCount = useRef(0);

  renderCount.current += 1;

  if (isDev && renderCount.current > 10) {
    console.warn(
      `⚠️ ${componentName} has rendered ${renderCount.current} times. Consider optimization.`
    );
  }

  return renderCount.current;
}

/**
 * Hook to detect mount/unmount
 * Usage: useMountEffect('MyComponent', onMount, onUnmount)
 */
export function useMountEffect(
  componentName: string,
  onMount?: () => void,
  onUnmount?: () => void
): void {
  useEffect(() => {
    const mountTime = performance.now();
    console.log(`🟢 ${componentName} mounted at ${mountTime.toFixed(2)}ms`);

    if (onMount) {
      onMount();
    }

    return () => {
      const unmountTime = performance.now();
      const lifetime = unmountTime - mountTime;
      console.log(`🔴 ${componentName} unmounted after ${lifetime.toFixed(2)}ms`);

      if (onUnmount) {
        onUnmount();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount/unmount
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Measure execution time of a function
 */
export function measureTime<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;

  if (isDev) {
    console.log(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
  }

  return result;
}

/**
 * Measure async execution time
 */
export async function measureTimeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;

  if (isDev) {
    console.log(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
  }

  return result;
}

/**
 * Create a performance mark
 */
export function mark(name: string): void {
  if (isDev) {
    performance.mark(name);
    console.log(`📍 Performance mark: ${name}`);
  }
}

/**
 * Measure between two marks
 */
export function measure(name: string, startMark: string, endMark: string): number | null {
  if (!isDev) return null;

  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0] as PerformanceMeasure;
    console.log(`📏 ${name}: ${measure.duration.toFixed(2)}ms`);
    return measure.duration;
  } catch (error) {
    console.error(`❌ Failed to measure ${name}:`, error);
    return null;
  }
}

/**
 * Clear performance marks and measures
 */
export function clearMarks(): void {
  performance.clearMarks();
  performance.clearMeasures();
}

// ============================================================================
// MEMORY MONITORING
// ============================================================================

/**
 * Log memory usage (if available)
 */
export function logMemoryUsage(): void {
  if (!isDev) return;

  // @ts-ignore - performance.memory is not standard but available in some environments
  if (performance.memory) {
    // @ts-ignore
    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
    const usedMB = (usedJSHeapSize / 1024 / 1024).toFixed(2);
    const totalMB = (totalJSHeapSize / 1024 / 1024).toFixed(2);
    const limitMB = (jsHeapSizeLimit / 1024 / 1024).toFixed(2);

    console.log(`💾 Memory: ${usedMB}MB / ${totalMB}MB (Limit: ${limitMB}MB)`);
  } else {
    console.log('💾 Memory API not available');
  }
}

// ============================================================================
// THROTTLE & DEBOUNCE
// ============================================================================

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  // Tracker
  performanceTracker,
  // Hooks
  useRenderPerformance,
  useWhyDidYouUpdate,
  useRenderCount,
  useMountEffect,
  // Utilities
  measureTime,
  measureTimeAsync,
  mark,
  measure,
  clearMarks,
  logMemoryUsage,
  throttle,
  debounce,
};
