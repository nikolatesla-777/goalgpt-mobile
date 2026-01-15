/**
 * useNetworkStatus Hook Tests
 * Tests for network connectivity detection
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';
import NetInfo from '@react-native-community/netinfo';

// ============================================================================
// SETUP
// ============================================================================

// Mock NetInfo
jest.mock('@react-native-community/netinfo');

describe('useNetworkStatus', () => {
  let mockEventListener: (state: any) => void;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock addEventListener to capture the listener
    (NetInfo.addEventListener as jest.Mock).mockImplementation((listener) => {
      mockEventListener = listener;
      return jest.fn(); // Return unsubscribe function
    });
  });

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  it('should initialize with default online state', () => {
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current).toEqual({
      isConnected: true,
      isInternetReachable: null,
      type: null,
      isOffline: false,
    });
  });

  it('should subscribe to NetInfo on mount', () => {
    renderHook(() => useNetworkStatus());

    expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1);
    expect(NetInfo.addEventListener).toHaveBeenCalledWith(expect.any(Function));
  });

  // ============================================================================
  // NETWORK STATE UPDATES
  // ============================================================================

  it('should update state when network goes offline', async () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Simulate network going offline
    mockEventListener({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        isConnected: false,
        isInternetReachable: false,
        type: 'none',
        isOffline: true,
      });
    });
  });

  it('should update state when network comes online with WiFi', async () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Simulate network coming online with WiFi
    mockEventListener({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        isConnected: true,
        isInternetReachable: true,
        type: 'wifi',
        isOffline: false,
      });
    });
  });

  it('should update state when network comes online with cellular', async () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Simulate network coming online with cellular
    mockEventListener({
      isConnected: true,
      isInternetReachable: true,
      type: 'cellular',
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        isConnected: true,
        isInternetReachable: true,
        type: 'cellular',
        isOffline: false,
      });
    });
  });

  it('should mark as offline when isInternetReachable is false', async () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Simulate connected but no internet
    mockEventListener({
      isConnected: true,
      isInternetReachable: false,
      type: 'wifi',
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        isConnected: true,
        isInternetReachable: false,
        type: 'wifi',
        isOffline: true,
      });
    });
  });

  it('should handle null isInternetReachable', async () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Simulate network state with null isInternetReachable
    mockEventListener({
      isConnected: true,
      isInternetReachable: null,
      type: 'wifi',
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        isConnected: true,
        isInternetReachable: null,
        type: 'wifi',
        isOffline: false,
      });
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  it('should handle undefined isConnected as false', async () => {
    const { result } = renderHook(() => useNetworkStatus());

    mockEventListener({
      isConnected: undefined,
      isInternetReachable: null,
      type: 'none',
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isOffline).toBe(true);
    });
  });

  it('should handle null isConnected as false', async () => {
    const { result } = renderHook(() => useNetworkStatus());

    mockEventListener({
      isConnected: null,
      isInternetReachable: null,
      type: 'none',
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isOffline).toBe(true);
    });
  });

  it('should handle multiple network state changes', async () => {
    const { result } = renderHook(() => useNetworkStatus());

    // First change: go offline
    mockEventListener({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
    });

    await waitFor(() => {
      expect(result.current.isOffline).toBe(true);
    });

    // Second change: come online
    mockEventListener({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    });

    await waitFor(() => {
      expect(result.current.isOffline).toBe(false);
      expect(result.current.type).toBe('wifi');
    });

    // Third change: switch to cellular
    mockEventListener({
      isConnected: true,
      isInternetReachable: true,
      type: 'cellular',
    });

    await waitFor(() => {
      expect(result.current.type).toBe('cellular');
    });
  });

  // ============================================================================
  // CLEANUP
  // ============================================================================

  it('should unsubscribe from NetInfo on unmount', () => {
    const unsubscribeMock = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockReturnValue(unsubscribeMock);

    const { unmount } = renderHook(() => useNetworkStatus());

    expect(unsubscribeMock).not.toHaveBeenCalled();

    unmount();

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  // ============================================================================
  // CONSOLE LOGGING
  // ============================================================================

  it('should log when going offline', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    renderHook(() => useNetworkStatus());

    mockEventListener({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('📵 Network: Offline');
    });

    consoleSpy.mockRestore();
  });

  it('should log when coming online', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    renderHook(() => useNetworkStatus());

    mockEventListener({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('📶 Network: Online', '(wifi)');
    });

    consoleSpy.mockRestore();
  });
});
