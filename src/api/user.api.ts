// src/api/user.api.ts
// GoalGPT Mobile App - User Profile API

import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';
import { User } from './auth.api';

// Types
export interface UserStats {
  totalPredictions: number;
  correctPredictions: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  favoriteLeague?: string;
  totalMatchesWatched: number;
  totalBotInteractions: number;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  liveScoreNotifications: boolean;
  predictionReminders: boolean;
  autoPlayVideos: boolean;
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface UpdateProfileData {
  name?: string;
  username?: string;
  profilePhotoUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Get User Profile
export async function getUserProfile(): Promise<User> {
  try {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(API_ENDPOINTS.AUTH.ME);

    return response.data.data!.user;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get User Stats
export async function getUserStats(userId?: string): Promise<UserStats> {
  try {
    const url = userId ? `/api/user/${userId}/stats` : '/api/user/stats';

    const response = await apiClient.get<ApiResponse<UserStats>>(url);

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Update User Profile
export async function updateUserProfile(data: UpdateProfileData): Promise<User> {
  try {
    const response = await apiClient.put<ApiResponse<{ user: User }>>('/api/user/profile', data);

    return response.data.data!.user;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Upload Avatar
export async function uploadAvatar(imageUri: string): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      '/api/user/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get User Settings
export async function getUserSettings(): Promise<UserSettings> {
  try {
    const response = await apiClient.get<ApiResponse<UserSettings>>('/api/user/settings');

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Update User Settings
export async function updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  try {
    const response = await apiClient.put<ApiResponse<UserSettings>>('/api/user/settings', settings);

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Change Password
export async function changePassword(data: ChangePasswordData): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.put<ApiResponse<{ success: boolean }>>(
      '/api/user/password',
      data
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Delete Account
export async function deleteAccount(password: string): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
      '/api/user/account',
      {
        data: { password },
      }
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}
