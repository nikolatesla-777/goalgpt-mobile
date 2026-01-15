/**
 * useNetworkStatus Hook
 * Detects network connectivity status
 */

import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

// ============================================================================
// TYPES
// ============================================================================

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  isOffline: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: null,
    type: null,
    isOffline: false,
  });

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const isConnected = state.isConnected ?? false;
      const isInternetReachable = state.isInternetReachable ?? null;
      const type = state.type;
      const isOffline = !isConnected || isInternetReachable === false;

      setNetworkStatus({
        isConnected,
        isInternetReachable,
        type,
        isOffline,
      });

      // Log network changes
      if (isOffline) {
        console.log('📵 Network: Offline');
      } else {
        console.log('📶 Network: Online', `(${type})`);
      }
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  return networkStatus;
}
