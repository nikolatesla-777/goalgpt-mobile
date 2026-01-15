// src/api/badges.api.ts
// GoalGPT Mobile App - Badges API

import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  rewardXP: number;
  rewardCredits: number;
  rewardVIPDays: number;
  isActive: boolean;
  totalUnlocks: number;
}

export interface UserBadge extends Badge {
  unlockedAt: string;
  claimedAt: string | null;
  isDisplayed: boolean;
}

export interface UnclaimedBadge {
  badgeId: string;
  badge: Badge;
  unlockedAt: string;
}

export interface ClaimBadgeResponse {
  success: boolean;
  xpGranted: number;
  creditsGranted: number;
  vipDaysGranted: number;
}

// Get All Available Badges
export async function getAllBadges(): Promise<Badge[]> {
  try {
    const response = await apiClient.get<ApiResponse<Badge[]>>(API_ENDPOINTS.BADGES.ALL);

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get User's Unlocked Badges
export async function getMyBadges(): Promise<UserBadge[]> {
  try {
    const response = await apiClient.get<ApiResponse<UserBadge[]>>(API_ENDPOINTS.BADGES.MY_BADGES);

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Unclaimed Badges
export async function getUnclaimedBadges(): Promise<UnclaimedBadge[]> {
  try {
    const response = await apiClient.get<ApiResponse<UnclaimedBadge[]>>(
      API_ENDPOINTS.BADGES.UNCLAIMED
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Claim Badge Reward
export async function claimBadge(badgeId: string): Promise<ClaimBadgeResponse> {
  try {
    const response = await apiClient.post<ApiResponse<ClaimBadgeResponse>>(
      API_ENDPOINTS.BADGES.CLAIM,
      { badgeId }
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}
