/**
 * API Cache Service
 *
 * Implements intelligent caching for API requests with:
 * - In-memory cache with TTL
 * - Stale-while-revalidate pattern
 * - Request deduplication
 * - Cache invalidation
 * - Memory management
 *
 * Phase 11: Performance Optimization
 */

// ============================================================================
// TYPES
// ============================================================================

export interface CacheOptions {
  /** Time to live in milliseconds */
  ttl?: number;

  /** Use stale-while-revalidate (return stale data, fetch in background) */
  staleWhileRevalidate?: boolean;

  /** Cache key (auto-generated if not provided) */
  cacheKey?: string;

  /** Force refresh (bypass cache) */
  forceRefresh?: boolean;

  /** Cache response even if it fails */
  cacheErrors?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  isStale: boolean;
}

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Maximum number of cached entries
const STALE_THRESHOLD = 0.8; // Consider stale after 80% of TTL

// ============================================================================
// CACHE SERVICE
// ============================================================================

class APICacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, PendingRequest<any>> = new Map();
  private accessOrder: string[] = []; // LRU tracking

  /**
   * Get cached data or fetch new data
   *
   * @param key - Cache key
   * @param fetcher - Function to fetch data if not cached
   * @param options - Cache options
   * @returns Cached or fresh data
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const {
      ttl = DEFAULT_TTL,
      staleWhileRevalidate = true,
      forceRefresh = false,
    } = options;

    // Force refresh bypasses cache
    if (forceRefresh) {
      console.log(`🔄 Force refresh: ${key}`);
      return this.fetchAndCache(key, fetcher, ttl);
    }

    // Check for pending request (deduplication)
    const pending = this.pendingRequests.get(key);
    if (pending) {
      console.log(`⏳ Deduplicating request: ${key}`);
      return pending.promise;
    }

    // Check cache
    const cached = this.cache.get(key);

    if (cached) {
      const age = Date.now() - cached.timestamp;
      const isExpired = age > cached.ttl;
      const isStale = age > cached.ttl * STALE_THRESHOLD;

      // Update access order (LRU)
      this.updateAccessOrder(key);

      // Cache hit - fresh data
      if (!isExpired && !isStale) {
        console.log(`✅ Cache hit (fresh): ${key}`);
        return cached.data;
      }

      // Cache hit - stale data
      if (!isExpired && isStale && staleWhileRevalidate) {
        console.log(`🔄 Cache hit (stale, revalidating): ${key}`);
        // Return stale data immediately, fetch in background
        this.fetchAndCache(key, fetcher, ttl).catch(err => {
          console.error(`❌ Background revalidation failed: ${key}`, err);
        });
        return cached.data;
      }

      // Cache hit - expired
      if (isExpired) {
        console.log(`⏰ Cache expired: ${key}`);
      }
    }

    // Cache miss or expired - fetch new data
    console.log(`❌ Cache miss: ${key}`);
    return this.fetchAndCache(key, fetcher, ttl);
  }

  /**
   * Fetch data and store in cache
   *
   * @param key - Cache key
   * @param fetcher - Function to fetch data
   * @param ttl - Time to live
   * @returns Fetched data
   */
  private async fetchAndCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    try {
      // Create pending request to prevent duplicates
      const promise = fetcher();
      this.pendingRequests.set(key, { promise, timestamp: Date.now() });

      // Fetch data
      const data = await promise;

      // Store in cache
      this.set(key, data, ttl);

      // Remove from pending
      this.pendingRequests.delete(key);

      return data;
    } catch (error) {
      // Remove from pending
      this.pendingRequests.delete(key);
      throw error;
    }
  }

  /**
   * Manually set cache entry
   *
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live
   */
  set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    // Check cache size and evict if needed
    if (this.cache.size >= MAX_CACHE_SIZE) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      isStale: false,
    });

    this.updateAccessOrder(key);

    console.log(`💾 Cached: ${key} (TTL: ${ttl}ms)`);
  }

  /**
   * Get cached data without fetching
   *
   * @param key - Cache key
   * @returns Cached data or undefined
   */
  getCached<T>(key: string): T | undefined {
    const cached = this.cache.get(key);

    if (!cached) {
      return undefined;
    }

    const age = Date.now() - cached.timestamp;
    const isExpired = age > cached.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return undefined;
    }

    this.updateAccessOrder(key);
    return cached.data;
  }

  /**
   * Check if key is cached and valid
   *
   * @param key - Cache key
   * @returns True if cached and not expired
   */
  has(key: string): boolean {
    const cached = this.cache.get(key);

    if (!cached) {
      return false;
    }

    const age = Date.now() - cached.timestamp;
    const isExpired = age > cached.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Invalidate cache entry
   *
   * @param key - Cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    this.pendingRequests.delete(key);
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    console.log(`🗑️  Invalidated cache: ${key}`);
  }

  /**
   * Invalidate all cache entries matching pattern
   *
   * @param pattern - Regular expression or string pattern
   */
  invalidatePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const keysToInvalidate: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToInvalidate.push(key);
      }
    }

    keysToInvalidate.forEach(key => this.invalidate(key));

    console.log(`🗑️  Invalidated ${keysToInvalidate.length} cache entries matching: ${pattern}`);
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
    this.accessOrder = [];
    console.log('🗑️  Cleared entire cache');
  }

  /**
   * Get cache statistics
   *
   * @returns Cache stats
   */
  getStats() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();

    const stats = {
      totalEntries: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      memoryUsage: this.estimateMemoryUsage(),
      entries: entries.map(([key, entry]) => ({
        key,
        age: now - entry.timestamp,
        ttl: entry.ttl,
        isStale: now - entry.timestamp > entry.ttl * STALE_THRESHOLD,
        isExpired: now - entry.timestamp > entry.ttl,
      })),
    };

    return stats;
  }

  /**
   * Update LRU access order
   *
   * @param key - Cache key
   */
  private updateAccessOrder(key: string): void {
    // Remove key if it exists
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    // Add to end (most recently used)
    this.accessOrder.push(key);
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    if (this.accessOrder.length === 0) {
      return;
    }

    const lruKey = this.accessOrder[0];
    this.invalidate(lruKey);
    console.log(`🗑️  Evicted LRU entry: ${lruKey}`);
  }

  /**
   * Estimate memory usage (rough estimate)
   *
   * @returns Estimated memory in KB
   */
  private estimateMemoryUsage(): string {
    let totalSize = 0;

    for (const [key, entry] of this.cache.entries()) {
      // Rough estimate: key size + JSON size
      totalSize += key.length * 2; // UTF-16
      totalSize += JSON.stringify(entry.data).length * 2;
    }

    const kb = totalSize / 1024;
    return kb < 1024 ? `${kb.toFixed(2)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.invalidate(key));

    if (keysToDelete.length > 0) {
      console.log(`🧹 Cleaned up ${keysToDelete.length} expired cache entries`);
    }
  }

  /**
   * Generate cache key from URL and params
   *
   * @param url - API URL
   * @param params - Request parameters
   * @returns Cache key
   */
  generateKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}:${paramString}`;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const cacheService = new APICacheService();

// Auto cleanup every 5 minutes
setInterval(() => {
  cacheService.cleanup();
}, 5 * 60 * 1000);

// ============================================================================
// EXPORT
// ============================================================================

export default cacheService;

/**
 * Usage Example:
 *
 * import cacheService from './cache.service';
 *
 * // With auto-generated key
 * const data = await cacheService.get(
 *   'matches:live',
 *   () => apiClient.get('/matches/live'),
 *   { ttl: 30000, staleWhileRevalidate: true }
 * );
 *
 * // Manual cache management
 * cacheService.set('user:123', userData, 60000);
 * const cachedUser = cacheService.getCached('user:123');
 * cacheService.invalidate('user:123');
 * cacheService.invalidatePattern(/^user:/);
 * cacheService.clear();
 *
 * // Check cache stats
 * const stats = cacheService.getStats();
 * console.log('Cache stats:', stats);
 */
