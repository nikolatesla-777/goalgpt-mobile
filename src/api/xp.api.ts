// src/api/xp.api.ts
// GoalGPT Mobile App - XP System API

import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface XPProfile {
  xpPoints: number;
  level: string;
  levelProgress: number;
  totalEarned: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  nextLevelXP: number;
  achievementsCount: number;
  levelName: string;
}

export interface XPTransaction {
  id: string;
  xpAmount: number;
  transactionType: string;
  description: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string | null;
  xpPoints: number;
  level: string;
  streakDays: number;
}

export interface LoginStreakResponse {
  currentStreak: number;
  longestStreak: number;
  xpGranted: number;
}

// Get User's XP Profile
export async function getMyXP(): Promise<XPProfile> {
  try {
    const response = await apiClient.get<ApiResponse<XPProfile>>(API_ENDPOINTS.XP.ME);

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get XP Transaction History
export async function getXPTransactions(
  limit: number = 20,
  offset: number = 0
): Promise<XPTransaction[]> {
  try {
    const response = await apiClient.get<ApiResponse<XPTransaction[]>>(
      `${API_ENDPOINTS.XP.TRANSACTIONS}?limit=${limit}&offset=${offset}`
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Update Daily Login Streak
export async function updateLoginStreak(): Promise<LoginStreakResponse> {
  try {
    const response = await apiClient.post<ApiResponse<LoginStreakResponse>>(
      API_ENDPOINTS.XP.LOGIN_STREAK
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get XP Leaderboard
export async function getXPLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const response = await apiClient.get<ApiResponse<LeaderboardEntry[]>>(
      `${API_ENDPOINTS.XP.LEADERBOARD}?limit=${limit}`
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}
