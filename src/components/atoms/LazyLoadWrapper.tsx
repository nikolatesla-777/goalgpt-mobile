/**
 * LazyLoadWrapper Component
 * Wrapper for React.lazy() with Suspense fallback
 * Provides loading UI while lazy-loaded components load
 */

import React, { Suspense } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

interface LazyLoadWrapperProps {
  /** Child components */
  children: React.ReactNode;
  /** Custom fallback component */
  fallback?: React.ReactNode;
  /** Minimum loading time (ms) to prevent flash */
  minLoadingTime?: number;
}

// ============================================================================
// LOADING FALLBACK
// ============================================================================

/**
 * Default loading fallback
 */
export const LoadingFallback: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = false }) => {
  return (
    <View style={[styles.loadingContainer, fullScreen && styles.loadingFullScreen]}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
    </View>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * LazyLoadWrapper Component
 * Wraps children with Suspense for lazy loading
 */
export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallback,
  minLoadingTime = 0,
}) => {
  const [isMinTimeElapsed, setIsMinTimeElapsed] = React.useState(minLoadingTime === 0);

  // Enforce minimum loading time to prevent flash
  React.useEffect(() => {
    if (minLoadingTime > 0) {
      const timer = setTimeout(() => {
        setIsMinTimeElapsed(true);
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [minLoadingTime]);

  const fallbackComponent = fallback || <LoadingFallback />;

  return (
    <Suspense fallback={fallbackComponent}>
      {isMinTimeElapsed ? children : fallbackComponent}
    </Suspense>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFullScreen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a lazy-loaded component with default wrapper
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    fallback?: React.ReactNode;
    minLoadingTime?: number;
  } = {}
): React.FC<React.ComponentProps<T>> {
  const LazyComponent = React.lazy(importFn);

  return (props: React.ComponentProps<T>) => (
    <LazyLoadWrapper fallback={options.fallback} minLoadingTime={options.minLoadingTime}>
      <LazyComponent {...props} />
    </LazyLoadWrapper>
  );
}

/**
 * Preload a lazy component
 * Useful for preloading on user interaction (hover, focus, etc.)
 */
export function preloadLazyComponent<T>(importFn: () => Promise<{ default: T }>): void {
  // Call the import function to start loading
  importFn();
}

// ============================================================================
// EXPORT
// ============================================================================

export default LazyLoadWrapper;
