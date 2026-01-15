// src/api/client.ts
// GoalGPT Mobile App - Axios API Client with Authentication

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { API_ENDPOINTS } from '../constants/api';
import { APP_CONFIG } from '../constants/config';
import { isRetryableError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

// Get API URL from environment
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  'http://localhost:3000';

logger.debug('API Client initialized', { baseURL: API_URL });

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Retry configuration
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000; // 1 second
const RETRY_DELAY_MULTIPLIER = 2; // Exponential backoff

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
export const TokenStorage = {
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};

// Track if token refresh is in progress to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh completion
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Notify all subscribers when token is refreshed
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// ============================================================================
// RETRY LOGIC
// ============================================================================

/**
 * Delay helper for retry logic
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry request with exponential backoff
 */
async function retryRequest(error: AxiosError, retryCount: number = 0): Promise<any> {
  const config = error.config as InternalAxiosRequestConfig & {
    __retryCount?: number;
  };

  if (!config) {
    return Promise.reject(error);
  }

  // Initialize retry count
  config.__retryCount = config.__retryCount || 0;

  // Check if we should retry
  if (config.__retryCount >= MAX_RETRY_ATTEMPTS || !isRetryableError(error)) {
    return Promise.reject(error);
  }

  // Increment retry count
  config.__retryCount += 1;

  // Calculate delay with exponential backoff
  const delayMs = RETRY_DELAY_MS * Math.pow(RETRY_DELAY_MULTIPLIER, config.__retryCount - 1);

  console.log(
    `🔄 Retrying request (attempt ${config.__retryCount}/${MAX_RETRY_ATTEMPTS}) after ${delayMs}ms`
  );

  // Wait before retrying
  await delay(delayMs);

  // Retry the request
  return apiClient(config);
}

// Refresh access token using refresh token
async function refreshAccessToken(): Promise<string> {
  const refreshToken = await TokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    // Use apiClient for refresh to ensure proper baseURL
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Store new tokens
    await TokenStorage.setTokens(accessToken, newRefreshToken);

    return accessToken;
  } catch (error) {
    // Refresh token is invalid, clear all tokens and force re-login
    await TokenStorage.clearTokens();
    throw new Error('REFRESH_TOKEN_EXPIRED');
  }
}

// Request interceptor: Add authorization header
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await TokenStorage.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors, token refresh, and retries
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      __retryCount?: number;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Token refresh is already in progress, wait for it
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        isRefreshing = false;

        // Notify all waiting requests
        onTokenRefreshed(newAccessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Refresh failed, redirect to login (handled by app)
        throw refreshError;
      }
    }

    // Try to retry the request if it's a retryable error
    if (isRetryableError(error)) {
      try {
        return await retryRequest(error);
      } catch (retryError) {
        // All retries failed, reject with original error
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  data?: any;
}

// Error handler utility
export function handleApiError(error: any): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // Server responded with error status
      return {
        message:
          (axiosError.response.data as any)?.message ||
          (axiosError.response.data as any)?.error ||
          APP_CONFIG.ERROR_MESSAGES.SERVER_ERROR,
        code: (axiosError.response.data as any)?.error,
        status: axiosError.response.status,
        data: axiosError.response.data,
      };
    } else if (axiosError.request) {
      // Request was made but no response received
      return {
        message: APP_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
        code: 'NETWORK_ERROR',
      };
    }
  }

  // Generic error
  return {
    message: error.message || APP_CONFIG.ERROR_MESSAGES.SERVER_ERROR,
    code: 'UNKNOWN_ERROR',
  };
}

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export default apiClient;
