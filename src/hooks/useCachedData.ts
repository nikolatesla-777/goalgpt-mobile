/**
 * useCachedData Hook
 * Fetches data with caching support
 */

import { useState, useEffect, useCallback } from 'react';
import { cache, CacheOptions } from '../utils/cache';
import { useNetworkStatus } from './useNetworkStatus';

// ============================================================================
// TYPES
// ============================================================================

export interface UseCachedDataOptions<T> extends CacheOptions {
  cacheKey: string;
  fetchFn: () => Promise<T>;
  enabled?: boolean; // Whether to auto-fetch on mount (default: true)
  refetchOnMount?: boolean; // Whether to refetch even if cache exists (default: false)
  refetchOnReconnect?: boolean; // Whether to refetch when back online (default: true)
}

export interface UseCachedDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isFromCache: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

export function useCachedData<T>({
  cacheKey,
  fetchFn,
  enabled = true,
  refetchOnMount = false,
  refetchOnReconnect = true,
  ...cacheOptions
}: UseCachedDataOptions<T>): UseCachedDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);
  const { isOffline } = useNetworkStatus();

  const fetchData = useCallback(
    async (force: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        // Try to get from cache first
        if (!force) {
          const cachedData = await cache.get<T>(cacheKey, cacheOptions);
          if (cachedData) {
            setData(cachedData);
            setIsFromCache(true);
            setLoading(false);

            // If offline, stop here and use cache
            if (isOffline) {
              console.log(`✅ Using cached data for ${cacheKey} (offline)`);
              return;
            }

            // If refetchOnMount is false, stop here
            if (!refetchOnMount) {
              console.log(`✅ Using cached data for ${cacheKey}`);
              return;
            }
          }
        }

        // If offline and no cache, show error
        if (isOffline) {
          setError('İnternet bağlantısı yok');
          setLoading(false);
          return;
        }

        // Fetch from API
        console.log(`🌐 Fetching data for ${cacheKey}`);
        const freshData = await fetchFn();

        // Save to cache
        await cache.set(cacheKey, freshData, cacheOptions);

        setData(freshData);
        setIsFromCache(false);
        setLoading(false);
      } catch (err) {
        console.error(`❌ Fetch error for ${cacheKey}:`, err);
        setError(err instanceof Error ? err.message : 'Veri yüklenemedi');
        setLoading(false);

        // If we have cache, keep showing it despite error
        if (data) {
          console.log(`⚠️ Using stale cache for ${cacheKey} due to error`);
        }
      }
    },
    [cacheKey, fetchFn, cacheOptions, isOffline, refetchOnMount, data]
  );

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  // Refetch when back online
  useEffect(() => {
    if (!isOffline && refetchOnReconnect && data) {
      console.log(`🔄 Refetching ${cacheKey} after reconnect`);
      fetchData(true);
    }
  }, [isOffline]);

  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    isFromCache,
  };
}
