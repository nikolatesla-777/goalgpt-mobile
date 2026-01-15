// src/api/auth.api.ts
// GoalGPT Mobile App - Authentication API

import apiClient, { ApiResponse, handleApiError, TokenStorage } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  username: string | null;
  profilePhotoUrl: string | null;
  referralCode: string;
  createdAt: string;
  xp?: {
    xpPoints: number;
    level: string;
    levelProgress: number;
  };
  credits?: {
    balance: number;
    lifetimeEarned: number;
  };
  subscription?: {
    status: string;
    expiredAt: string | null;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface DeviceInfo {
  deviceId: string;
  platform: 'ios' | 'android';
  appVersion: string;
}

// Google Sign In
export async function signInWithGoogle(
  idToken: string,
  deviceInfo: DeviceInfo
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.GOOGLE_SIGNIN,
      {
        idToken,
        deviceInfo,
      }
    );

    const { user, tokens } = response.data.data!;

    // Store tokens
    await TokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);

    return { user, tokens };
  } catch (error) {
    throw handleApiError(error);
  }
}

// Apple Sign In
export async function signInWithApple(
  idToken: string,
  email?: string,
  name?: string,
  deviceInfo?: DeviceInfo
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.APPLE_SIGNIN,
      {
        idToken,
        email,
        name,
        deviceInfo,
      }
    );

    const { user, tokens } = response.data.data!;

    // Store tokens
    await TokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);

    return { user, tokens };
  } catch (error) {
    throw handleApiError(error);
  }
}

// Phone Login
export async function loginWithPhone(phone: string, deviceInfo: DeviceInfo): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.PHONE_LOGIN,
      {
        phone,
        deviceInfo,
      }
    );

    const { user, tokens } = response.data.data!;

    // Store tokens
    await TokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);

    return { user, tokens };
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Current User Profile
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(API_ENDPOINTS.AUTH.ME);

    return response.data.data!.user;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Logout
export async function logout(): Promise<void> {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    // Continue with local logout even if server request fails
    console.error('Logout error:', error);
  } finally {
    // Clear tokens from local storage
    await TokenStorage.clearTokens();
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const accessToken = await TokenStorage.getAccessToken();
  return accessToken !== null;
}
