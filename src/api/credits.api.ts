// src/api/credits.api.ts
// GoalGPT Mobile App - Credits System API

import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface CreditBalance {
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  transactionType: string;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface DailyStats {
  earnedToday: number;
  spentToday: number;
  adsWatchedToday: number;
  adsRemainingToday: number;
}

export interface AdRewardResponse {
  success: boolean;
  credits: number;
  message: string;
}

export interface PurchasePredictionResponse {
  success: boolean;
  creditsSpent: number;
}

// Get Credit Balance
export async function getMyCreditBalance(): Promise<CreditBalance> {
  try {
    const response = await apiClient.get<ApiResponse<CreditBalance>>(API_ENDPOINTS.CREDITS.ME);

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Credit Transaction History
export async function getCreditTransactions(
  limit: number = 20,
  offset: number = 0
): Promise<CreditTransaction[]> {
  try {
    const response = await apiClient.get<ApiResponse<CreditTransaction[]>>(
      `${API_ENDPOINTS.CREDITS.TRANSACTIONS}?limit=${limit}&offset=${offset}`
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Process Rewarded Ad
export async function processAdReward(
  adNetwork: 'admob' | 'facebook' | 'unity',
  adUnitId: string,
  adType: 'rewarded_video' | 'rewarded_interstitial',
  deviceId: string
): Promise<AdRewardResponse> {
  try {
    const response = await apiClient.post<ApiResponse<AdRewardResponse>>(
      API_ENDPOINTS.CREDITS.AD_REWARD,
      {
        adNetwork,
        adUnitId,
        adType,
        deviceId,
      }
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Purchase VIP Prediction with Credits
export async function purchaseVIPPrediction(
  predictionId: string
): Promise<PurchasePredictionResponse> {
  try {
    const response = await apiClient.post<ApiResponse<PurchasePredictionResponse>>(
      API_ENDPOINTS.CREDITS.PURCHASE_PREDICTION,
      {
        predictionId,
      }
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Daily Credit Stats
export async function getDailyStats(): Promise<DailyStats> {
  try {
    const response = await apiClient.get<ApiResponse<DailyStats>>(
      API_ENDPOINTS.CREDITS.DAILY_STATS
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}
