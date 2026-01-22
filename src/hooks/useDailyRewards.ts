/**
 * Daily Rewards Hook
 * 
 * Manages daily rewards state and API calls
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

// Types
export interface DailyReward {
    day: number;
    credits: number;
    xp: number;
    type: 'credits' | 'special';
    isJackpot?: boolean;
}

export interface DailyRewardStatus {
    canClaim: boolean;
    currentDay: number;
    nextReward: DailyReward;
    lastClaimDate: string | null;
    streak: number;
    claimedToday: boolean;
}

export interface ClaimResult {
    success: boolean;
    reward: DailyReward;
    message: string;
}

// 7-day reward calendar (matches backend)
const REWARD_CALENDAR: DailyReward[] = [
    { day: 1, credits: 10, xp: 10, type: 'credits' },
    { day: 2, credits: 15, xp: 15, type: 'credits' },
    { day: 3, credits: 20, xp: 20, type: 'credits' },
    { day: 4, credits: 25, xp: 25, type: 'credits' },
    { day: 5, credits: 30, xp: 30, type: 'credits' },
    { day: 6, credits: 40, xp: 40, type: 'credits' },
    { day: 7, credits: 100, xp: 50, type: 'special', isJackpot: true },
];

// Total possible rewards
export const TOTAL_CREDITS = REWARD_CALENDAR.reduce((sum, r) => sum + r.credits, 0); // 240
export const TOTAL_XP = REWARD_CALENDAR.reduce((sum, r) => sum + r.xp, 0); // 190

export function useDailyRewards() {
    const [status, setStatus] = useState<DailyRewardStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isClaiming, setIsClaiming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);

    // Fetch reward status
    const fetchStatus = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await apiClient.get('/daily-rewards/status');

            if (response.data?.success) {
                setStatus(response.data.data);
            }
        } catch (err: any) {
            setError(err.message || 'Ödül durumu alınamadı');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Claim reward
    const claimReward = useCallback(async (): Promise<ClaimResult | null> => {
        if (!status?.canClaim) {
            return null;
        }

        try {
            setIsClaiming(true);
            setError(null);

            const response = await apiClient.post('/daily-rewards/claim');

            if (response.data?.success) {
                const result: ClaimResult = {
                    success: true,
                    reward: response.data.reward,
                    message: response.data.message,
                };

                setClaimResult(result);

                // Refresh status
                await fetchStatus();

                return result;
            }

            return null;
        } catch (err: any) {
            setError(err.message || 'Ödül alınamadı');
            return null;
        } finally {
            setIsClaiming(false);
        }
    }, [status?.canClaim, fetchStatus]);

    // Clear claim result
    const clearClaimResult = useCallback(() => {
        setClaimResult(null);
    }, []);

    // Get reward for specific day
    const getRewardForDay = useCallback((day: number): DailyReward => {
        return REWARD_CALENDAR[day - 1] || REWARD_CALENDAR[0];
    }, []);

    // Check if day is completed
    const isDayCompleted = useCallback((day: number): boolean => {
        if (!status) return false;

        if (status.claimedToday) {
            return day <= status.currentDay;
        }

        return day < status.currentDay;
    }, [status]);

    // Check if day is current
    const isCurrentDay = useCallback((day: number): boolean => {
        if (!status) return false;
        return day === status.currentDay;
    }, [status]);

    // Initial fetch
    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return {
        // State
        status,
        isLoading,
        isClaiming,
        error,
        claimResult,

        // Data
        calendar: REWARD_CALENDAR,
        totalCredits: TOTAL_CREDITS,
        totalXP: TOTAL_XP,

        // Actions
        fetchStatus,
        claimReward,
        clearClaimResult,

        // Helpers
        getRewardForDay,
        isDayCompleted,
        isCurrentDay,
    };
}
