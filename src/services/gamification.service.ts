/**
 * Gamification Service
 *
 * Handles XP, Credits, Badges, Daily Rewards, Referrals
 */

import apiClient, { handleApiError } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';

// ============================================================================
// XP SYSTEM
// ============================================================================

export interface XPData {
  total_xp: number;
  level: string;
  level_progress: number;
  next_level_xp: number;
}

export interface XPTransaction {
  id: number;
  amount: number;
  reason: string;
  created_at: string;
}

export interface LoginStreak {
  current_streak: number;
  longest_streak: number;
  last_login: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  avatar?: string;
  total_xp: number;
  level: string;
}

export async function getMyXP(): Promise<XPData> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.XP.ME);
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getXPTransactions(limit: number = 50): Promise<XPTransaction[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.XP.TRANSACTIONS, {
      params: { limit },
    });
    return response.data.data.transactions;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getLoginStreak(): Promise<LoginStreak> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.XP.LOGIN_STREAK);
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getXPLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.XP.LEADERBOARD, {
      params: { limit },
    });
    return response.data.data.leaderboard;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

// ============================================================================
// CREDITS SYSTEM
// ============================================================================

export interface CreditsData {
  balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
}

export interface CreditTransaction {
  id: number;
  amount: number;
  type: 'earn' | 'spend' | 'refund';
  reason: string;
  created_at: string;
}

export interface DailyCreditsStats {
  ads_watched_today: number;
  max_ads_per_day: number;
  credits_earned_today: number;
  max_daily_credits: number;
}

export async function getMyCredits(): Promise<CreditsData> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CREDITS.ME);
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getCreditTransactions(limit: number = 50): Promise<CreditTransaction[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CREDITS.TRANSACTIONS, {
      params: { limit },
    });
    return response.data.data.transactions;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getDailyCreditsStats(): Promise<DailyCreditsStats> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CREDITS.DAILY_STATS);
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function claimAdReward(adType: string = 'rewarded'): Promise<{ credits_earned: number }> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CREDITS.AD_REWARD, {
      ad_type: adType,
    });
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function purchasePrediction(predictionId: number): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CREDITS.PURCHASE_PREDICTION, {
      prediction_id: predictionId,
    });
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

// ============================================================================
// BADGES SYSTEM
// ============================================================================

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward_credits: number;
  reward_xp: number;
  condition_type: string;
  condition_value: number;
}

export interface UserBadge extends Badge {
  earned_at: string;
  claimed: boolean;
  claimed_at?: string;
}

export async function getAllBadges(): Promise<Badge[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.BADGES.ALL);
    return response.data.data.badges;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getMyBadges(): Promise<UserBadge[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.BADGES.MY_BADGES);
    return response.data.data.badges;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getUnclaimedBadges(): Promise<UserBadge[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.BADGES.UNCLAIMED);
    return response.data.data.badges;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function claimBadge(badgeId: number): Promise<{ credits_earned: number; xp_earned: number }> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.BADGES.CLAIM, {
      badge_id: badgeId,
    });
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

// ============================================================================
// DAILY REWARDS
// ============================================================================

export interface DailyRewardStatus {
  current_day: number;
  total_days: number;
  can_claim_today: boolean;
  next_reward: {
    day: number;
    credits: number;
    xp: number;
    type: string;
  };
  last_claimed_at?: string;
  streak_count: number;
}

export interface DailyRewardHistory {
  id: number;
  day: number;
  credits: number;
  xp: number;
  claimed_at: string;
}

export async function getDailyRewardStatus(): Promise<DailyRewardStatus> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DAILY_REWARDS.STATUS);
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function claimDailyReward(): Promise<{ credits_earned: number; xp_earned: number }> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.DAILY_REWARDS.CLAIM);
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getDailyRewardHistory(): Promise<DailyRewardHistory[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DAILY_REWARDS.HISTORY);
    return response.data.data.history;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

// ============================================================================
// REFERRALS
// ============================================================================

export interface ReferralCode {
  code: string;
  uses: number;
  max_uses: number;
}

export interface ReferralStats {
  total_referrals: number;
  active_referrals: number;
  total_credits_earned: number;
}

export interface Referral {
  id: number;
  referred_user_id: number;
  referred_username?: string;
  status: 'pending' | 'active' | 'completed';
  credits_earned: number;
  created_at: string;
}

export async function getMyReferralCode(): Promise<ReferralCode> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.REFERRALS.MY_CODE);
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function applyReferralCode(code: string): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.REFERRALS.APPLY_CODE, {
      code,
    });
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getMyReferrals(): Promise<Referral[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.REFERRALS.MY_REFERRALS);
    return response.data.data.referrals;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getReferralStats(): Promise<ReferralStats> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.REFERRALS.STATS);
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}
