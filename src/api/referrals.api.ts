// src/api/referrals.api.ts
// GoalGPT Mobile App - Referrals API

import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface ReferralCode {
  code: string;
  totalReferrals: number;
  successfulReferrals: number;
}

export interface Referral {
  id: string;
  referredUserName: string;
  status: 'pending' | 'completed' | 'rewarded' | 'expired';
  tier: number;
  referrerRewardXP: number;
  referrerRewardCredits: number;
  createdAt: string;
  referredSubscribedAt: string | null;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  totalXPEarned: number;
  totalCreditsEarned: number;
}

export interface ApplyReferralResponse {
  success: boolean;
  message: string;
  rewardXP: number;
  rewardCredits: number;
}

// Get User's Referral Code
export async function getMyReferralCode(): Promise<ReferralCode> {
  try {
    const response = await apiClient.get<ApiResponse<ReferralCode>>(
      API_ENDPOINTS.REFERRALS.MY_CODE
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Apply Referral Code
export async function applyReferralCode(code: string): Promise<ApplyReferralResponse> {
  try {
    const response = await apiClient.post<ApiResponse<ApplyReferralResponse>>(
      API_ENDPOINTS.REFERRALS.APPLY_CODE,
      { code }
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get User's Referrals
export async function getMyReferrals(): Promise<Referral[]> {
  try {
    const response = await apiClient.get<ApiResponse<Referral[]>>(
      API_ENDPOINTS.REFERRALS.MY_REFERRALS
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Referral Stats
export async function getReferralStats(): Promise<ReferralStats> {
  try {
    const response = await apiClient.get<ApiResponse<ReferralStats>>(API_ENDPOINTS.REFERRALS.STATS);

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}
