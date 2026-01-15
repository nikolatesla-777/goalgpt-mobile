/**
 * Memoization Utilities
 * Helper functions for memoizing expensive computations
 * Improves performance by caching results
 */

// ============================================================================
// MEMOIZATION CACHE
// ============================================================================

/**
 * Simple in-memory memoization cache
 */
class MemoCache<T> {
  private cache: Map<string, { value: T; timestamp: number }> = new Map();
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds

  constructor(maxSize: number = 100, ttl: number = 60000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  /**
   * Get value from cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T): void {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value as string | undefined;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// ============================================================================
// MEMOIZE FUNCTION
// ============================================================================

/**
 * Memoize a function with custom key resolver
 */
export function memoize<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  options: {
    keyResolver?: (...args: TArgs) => string;
    maxSize?: number;
    ttl?: number;
  } = {}
): (...args: TArgs) => TResult {
  const { keyResolver = (...args) => JSON.stringify(args), maxSize = 100, ttl = 60000 } = options;

  const cache = new MemoCache<TResult>(maxSize, ttl);

  return (...args: TArgs): TResult => {
    const key = keyResolver(...args);

    // Try to get from cache
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    // Compute result
    const result = fn(...args);

    // Store in cache
    cache.set(key, result);

    return result;
  };
}

// ============================================================================
// SPECIALIZED MEMOIZATION FUNCTIONS
// ============================================================================

/**
 * Memoize async function
 */
export function memoizeAsync<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: {
    keyResolver?: (...args: TArgs) => string;
    maxSize?: number;
    ttl?: number;
  } = {}
): (...args: TArgs) => Promise<TResult> {
  const { keyResolver = (...args) => JSON.stringify(args), maxSize = 100, ttl = 60000 } = options;

  const cache = new MemoCache<Promise<TResult>>(maxSize, ttl);

  return async (...args: TArgs): Promise<TResult> => {
    const key = keyResolver(...args);

    // Try to get from cache
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    // Compute result
    const promise = fn(...args);

    // Store promise in cache
    cache.set(key, promise);

    return promise;
  };
}

/**
 * Debounced memoization - only cache after function hasn't been called for X ms
 */
export function memoizeDebounced<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  debounceMs: number = 300,
  options: {
    keyResolver?: (...args: TArgs) => string;
    maxSize?: number;
    ttl?: number;
  } = {}
): (...args: TArgs) => TResult {
  const { keyResolver = (...args) => JSON.stringify(args), maxSize = 100, ttl = 60000 } = options;

  const cache = new MemoCache<TResult>(maxSize, ttl);
  const timers: Map<string, NodeJS.Timeout> = new Map();

  return (...args: TArgs): TResult => {
    const key = keyResolver(...args);

    // Clear existing timer
    const existingTimer = timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Try to get from cache
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    // Compute result
    const result = fn(...args);

    // Set timer to cache result after debounce period
    const timer = setTimeout(() => {
      cache.set(key, result);
      timers.delete(key);
    }, debounceMs);

    timers.set(key, timer);

    return result;
  };
}

// ============================================================================
// COMMON USE CASES
// ============================================================================

/**
 * Memoize expensive array operations
 */
export const memoizeArrayOperation = <T, R>(
  fn: (arr: T[]) => R,
  keyFn: (arr: T[]) => string = (arr) => arr.map((item: any) => item?.id || item).join(',')
) => {
  return memoize(fn, {
    keyResolver: keyFn,
    maxSize: 50,
    ttl: 30000, // 30 seconds
  });
};

/**
 * Memoize object transformations
 */
export const memoizeObjectTransform = <T extends object, R>(
  fn: (obj: T) => R,
  keyFn: (obj: T) => string = (obj) => JSON.stringify(obj)
) => {
  return memoize(fn, {
    keyResolver: keyFn,
    maxSize: 100,
    ttl: 60000, // 1 minute
  });
};

/**
 * Memoize calculations
 */
export const memoizeCalculation = <TArgs extends any[], TResult extends number | string>(
  fn: (...args: TArgs) => TResult
) => {
  return memoize(fn, {
    keyResolver: (...args) => args.join('|'),
    maxSize: 200,
    ttl: 120000, // 2 minutes
  });
};

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * Example: Memoize expensive match filtering
 */
export const filterLiveMatches = memoizeArrayOperation((matches: any[]) => {
  return matches.filter((match) => [2, 3, 4, 5, 7].includes(match.status_id));
});

/**
 * Example: Memoize score calculation
 */
export const calculateMatchScore = memoizeCalculation(
  (homeScore: number, awayScore: number): string => {
    return `${homeScore} - ${awayScore}`;
  }
);

/**
 * Example: Memoize team stats calculation
 */
export const calculateTeamStats = memoizeObjectTransform((team: any) => {
  return {
    totalMatches: team.matches?.length || 0,
    wins: team.matches?.filter((m: any) => m.result === 'win').length || 0,
    losses: team.matches?.filter((m: any) => m.result === 'loss').length || 0,
    draws: team.matches?.filter((m: any) => m.result === 'draw').length || 0,
  };
});

// ============================================================================
// EXPORT
// ============================================================================

export default {
  memoize,
  memoizeAsync,
  memoizeDebounced,
  memoizeArrayOperation,
  memoizeObjectTransform,
  memoizeCalculation,
  // Examples
  filterLiveMatches,
  calculateMatchScore,
  calculateTeamStats,
};
