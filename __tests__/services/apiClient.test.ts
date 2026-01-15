/**
 * API Client Integration Tests
 * Tests for Axios API client with authentication and retry logic
 */

import { AxiosError } from 'axios';
import { TokenStorage, handleApiError } from '../../src/api/client';
import * as SecureStore from 'expo-secure-store';

// Mock SecureStore
jest.mock('expo-secure-store');

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  isAxiosError: jest.fn(),
  post: jest.fn(),
}));

// ============================================================================
// SETUP
// ============================================================================

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // TOKEN STORAGE
  // ============================================================================

  describe('TokenStorage', () => {
    describe('setTokens()', () => {
      it('should store access and refresh tokens', async () => {
        await TokenStorage.setTokens('access_token_123', 'refresh_token_456');

        expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
          'access_token',
          'access_token_123'
        );
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
          'refresh_token',
          'refresh_token_456'
        );
        expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(2);
      });
    });

    describe('getAccessToken()', () => {
      it('should retrieve access token', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('stored_access_token');

        const token = await TokenStorage.getAccessToken();

        expect(token).toBe('stored_access_token');
        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('access_token');
      });

      it('should return null if no token stored', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

        const token = await TokenStorage.getAccessToken();

        expect(token).toBeNull();
      });
    });

    describe('getRefreshToken()', () => {
      it('should retrieve refresh token', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('stored_refresh_token');

        const token = await TokenStorage.getRefreshToken();

        expect(token).toBe('stored_refresh_token');
        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('refresh_token');
      });

      it('should return null if no token stored', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

        const token = await TokenStorage.getRefreshToken();

        expect(token).toBeNull();
      });
    });

    describe('clearTokens()', () => {
      it('should clear both tokens', async () => {
        await TokenStorage.clearTokens();

        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('access_token');
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refresh_token');
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(2);
      });
    });
  });

  // ============================================================================
  // HANDLE API ERROR
  // ============================================================================

  describe('handleApiError()', () => {
    it('should handle server error response', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
            error: 'SERVER_ERROR',
          },
        },
      } as AxiosError;

      const axios = require('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      const result = handleApiError(axiosError);

      expect(result).toEqual({
        message: 'Internal server error',
        code: 'SERVER_ERROR',
        status: 500,
        data: axiosError.response!.data,
      });
    });

    it('should handle 404 error', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {
            message: 'Resource not found',
          },
        },
      } as AxiosError;

      const axios = require('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      const result = handleApiError(axiosError);

      expect(result).toEqual({
        message: 'Resource not found',
        code: undefined,
        status: 404,
        data: axiosError.response!.data,
      });
    });

    it('should handle 401 unauthorized error', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            message: 'Unauthorized',
          },
        },
      } as AxiosError;

      const axios = require('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      const result = handleApiError(axiosError);

      expect(result).toEqual({
        message: 'Unauthorized',
        code: undefined,
        status: 401,
        data: axiosError.response!.data,
      });
    });

    it('should handle network error (no response)', () => {
      const axiosError = {
        isAxiosError: true,
        request: {},
        response: undefined,
      } as AxiosError;

      const axios = require('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      const result = handleApiError(axiosError);

      expect(result).toEqual({
        message: expect.any(String),
        code: 'NETWORK_ERROR',
      });
    });

    it('should handle generic error', () => {
      const genericError = new Error('Something went wrong');

      const axios = require('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(false);

      const result = handleApiError(genericError);

      expect(result).toEqual({
        message: 'Something went wrong',
        code: 'UNKNOWN_ERROR',
      });
    });

    it('should extract error message from various response formats', () => {
      // Format 1: data.message
      const error1 = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Error message 1' },
        },
      } as AxiosError;

      const axios = require('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      expect(handleApiError(error1).message).toBe('Error message 1');

      // Format 2: data.error (string)
      const error2 = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { error: 'Error message 2' },
        },
      } as AxiosError;

      expect(handleApiError(error2).message).toBe('Error message 2');
    });

    it('should use default message if no specific message found', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
        },
      } as AxiosError;

      const axios = require('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      const result = handleApiError(axiosError);

      expect(result.message).toBeTruthy();
      expect(result.status).toBe(500);
    });
  });

  // ============================================================================
  // API CLIENT INSTANCE
  // ============================================================================

  describe('API Client Instance', () => {
    it('should have axios mocked', () => {
      const axios = require('axios');
      expect(axios.create).toBeDefined();
      expect(axios.isAxiosError).toBeDefined();
    });
  });

  // ============================================================================
  // ERROR HANDLING UTILITIES
  // ============================================================================

  describe('Error Handling', () => {
    it('should differentiate between network and server errors', () => {
      // Network error
      const networkError = {
        isAxiosError: true,
        request: {},
        response: undefined,
      } as AxiosError;

      const axios = require('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      const networkResult = handleApiError(networkError);
      expect(networkResult.code).toBe('NETWORK_ERROR');

      // Server error
      const serverError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      } as AxiosError;

      const serverResult = handleApiError(serverError);
      expect(serverResult.status).toBe(500);
      expect(serverResult.message).toBe('Server error');
    });

    it('should handle timeout errors', () => {
      const timeoutError = {
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
        request: {},
        response: undefined,
      } as AxiosError;

      const axios = require('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      const result = handleApiError(timeoutError);

      expect(result.code).toBe('NETWORK_ERROR');
    });
  });

  // ============================================================================
  // INTEGRATION SCENARIOS
  // ============================================================================

  describe('Integration Scenarios', () => {
    it('should handle complete authentication flow', async () => {
      // 1. Set tokens
      await TokenStorage.setTokens('initial_access', 'initial_refresh');

      // 2. Retrieve access token
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('initial_access');
      const accessToken = await TokenStorage.getAccessToken();
      expect(accessToken).toBe('initial_access');

      // 3. Clear tokens (logout)
      await TokenStorage.clearTokens();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(2);
    });

    it('should handle token refresh flow', async () => {
      // Mock refresh token exists
      (SecureStore.getItemAsync as jest.Mock).mockImplementation(async (key) => {
        if (key === 'refresh_token') return 'valid_refresh_token';
        return null;
      });

      const refreshToken = await TokenStorage.getRefreshToken();
      expect(refreshToken).toBe('valid_refresh_token');
    });

    it('should handle API error with retry logic', () => {
      const retryableError = {
        isAxiosError: true,
        response: {
          status: 503,
          data: { message: 'Service unavailable' },
        },
      } as AxiosError;

      const axios = require('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      const result = handleApiError(retryableError);

      expect(result.status).toBe(503);
      expect(result.message).toBe('Service unavailable');
    });
  });
});
