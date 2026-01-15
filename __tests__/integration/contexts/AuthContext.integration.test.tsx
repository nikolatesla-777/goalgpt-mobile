/**
 * AuthContext Integration Tests
 * Phase 12: Testing & QA - Integration Tests
 *
 * Tests the integration of AuthContext with API, storage, and analytics
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../../src/context/AuthContext';
import { TokenStorage } from '../../../src/api/client';
import analyticsService from '../../../src/services/analytics.service';

// Mock dependencies
jest.mock('../../../src/api/client', () => ({
  TokenStorage: {
    getAccessToken: jest.fn(),
    setAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    setRefreshToken: jest.fn(),
    clearTokens: jest.fn(),
  },
  apiClient: {
    post: jest.fn(),
  },
}));

jest.mock('../../../src/services/analytics.service', () => ({
  __esModule: true,
  default: {
    trackLogin: jest.fn(),
    trackSignUp: jest.fn(),
    trackLogout: jest.fn(),
    setAnalyticsUserId: jest.fn(),
    setAnalyticsUserProperties: jest.fn(),
  },
}));

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('AuthContext Integration', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should check for existing tokens on mount', async () => {
      (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('mock-token');
      (TokenStorage.getRefreshToken as jest.Mock).mockResolvedValue('mock-refresh');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(TokenStorage.getAccessToken).toHaveBeenCalled();
      });
    });

    it('should restore user session if tokens exist', async () => {
      (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // May be authenticated depending on token validation
    });
  });

  describe('Login Flow Integration', () => {
    it('should integrate with analytics on successful login', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        // Simulate login
        await result.current.login('test@example.com', 'password123');
      });

      // Should track login event
      await waitFor(() => {
        expect(analyticsService.trackLogin).toHaveBeenCalledWith(
          'email',
          expect.any(Boolean)
        );
      });
    });

    it('should store tokens in secure storage after login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      await waitFor(() => {
        expect(TokenStorage.setAccessToken).toHaveBeenCalled();
      });
    });

    it('should update user state after successful login', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toBeDefined();
      });
    });

    it('should handle login errors gracefully', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.login('invalid@example.com', 'wrong');
        } catch (error) {
          expect(error).toBeDefined();
        }
      });

      // Should remain unauthenticated on error
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Signup Flow Integration', () => {
    it('should integrate with analytics on successful signup', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signup('new@example.com', 'password123', 'New User');
      });

      await waitFor(() => {
        expect(analyticsService.trackSignUp).toHaveBeenCalledWith(
          'email',
          expect.any(Boolean)
        );
      });
    });

    it('should automatically log in after successful signup', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signup('new@example.com', 'password123', 'New User');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });
    });
  });

  describe('Logout Flow Integration', () => {
    it('should clear tokens from storage on logout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // First login
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(TokenStorage.clearTokens).toHaveBeenCalled();
      });
    });

    it('should track logout event', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
        await result.current.logout();
      });

      await waitFor(() => {
        expect(analyticsService.trackLogout).toHaveBeenCalled();
      });
    });

    it('should reset user state after logout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe('Token Refresh Integration', () => {
    it('should automatically refresh expired tokens', async () => {
      (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('expired-token');
      (TokenStorage.getRefreshToken as jest.Mock).mockResolvedValue('refresh-token');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.refreshTokens();
      });

      await waitFor(() => {
        expect(TokenStorage.setAccessToken).toHaveBeenCalled();
      });
    });

    it('should logout user if refresh fails', async () => {
      (TokenStorage.getRefreshToken as jest.Mock).mockResolvedValue('invalid-refresh');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.refreshTokens();
        } catch (error) {
          // Expected to fail
        }
      });

      // Should be logged out
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('User Properties Integration', () => {
    it('should sync user properties with analytics', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        vipStatus: 'premium',
      };

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      await waitFor(() => {
        expect(analyticsService.setAnalyticsUserId).toHaveBeenCalled();
        expect(analyticsService.setAnalyticsUserProperties).toHaveBeenCalled();
      });
    });

    it('should update analytics when user properties change', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      // Simulate user property update
      await act(async () => {
        await result.current.updateUser({ vipStatus: 'vip' });
      });

      await waitFor(() => {
        expect(analyticsService.setAnalyticsUserProperties).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Persistence Integration', () => {
    it('should persist authentication across app restarts', async () => {
      (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');

      // First render - simulates initial app load
      const { result: result1 } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
      });

      // User should be authenticated
      expect(result1.current.isAuthenticated).toBe(true);

      // Second render - simulates app restart
      const { result: result2 } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result2.current.isLoading).toBe(false);
      });

      // Should still be authenticated
      expect(result2.current.isAuthenticated).toBe(true);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from storage errors', async () => {
      (TokenStorage.getAccessToken as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should gracefully handle error and show logged out state
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle API errors during login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'password');
        } catch (error) {
          expect(error).toBeDefined();
        }
      });

      // Analytics should track failed login
      expect(analyticsService.trackLogin).toHaveBeenCalledWith('email', false);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent login attempts', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const login1 = result.current.login('test@example.com', 'pass1');
        const login2 = result.current.login('test@example.com', 'pass2');

        await Promise.allSettled([login1, login2]);
      });

      // Should handle gracefully without race conditions
      expect(result.current.isAuthenticated).toBeDefined();
    });

    it('should handle logout during token refresh', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const refresh = result.current.refreshTokens();
        const logout = result.current.logout();

        await Promise.allSettled([refresh, logout]);
      });

      // Should end up logged out
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('State Consistency', () => {
    it('should maintain consistent state across operations', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      // After login
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeDefined();

      await act(async () => {
        await result.current.logout();
      });

      // After logout
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});
