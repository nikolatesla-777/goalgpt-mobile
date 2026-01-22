/**
 * usePredictionUnlock Hook
 * 
 * Manages prediction unlock state for FREE users
 * - Check if user can access predictions
 * - Handle unlock with credits
 * - Track unlocked predictions
 */

import { useState, useCallback } from 'react';
import apiClient from '../api/client';

// ============================================================================
// CONSTANTS
// ============================================================================

export const UNLOCK_COST = 50;

// ============================================================================
// TYPES
// ============================================================================

export interface UnlockInfo {
    unlockCost: number;
    currentBalance: number;
    canAfford: boolean;
    predictionsCanUnlock: number;
}

export interface UnlockResult {
    success: boolean;
    message: string;
    newBalance?: number;
    error?: string;
}

// ============================================================================
// HOOK
// ============================================================================

export function usePredictionUnlock() {
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [unlockInfo, setUnlockInfo] = useState<UnlockInfo | null>(null);
    const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch unlock info (balance, cost, etc.)
     */
    const fetchUnlockInfo = useCallback(async () => {
        try {
            const response = await apiClient.get('/predictions/unlock-info');
            if (response.data?.success) {
                setUnlockInfo(response.data.data);
            }
        } catch (err: any) {
            console.warn('Failed to fetch unlock info:', err.message);
        }
    }, []);

    /**
     * Fetch list of unlocked prediction IDs
     */
    const fetchUnlockedPredictions = useCallback(async () => {
        try {
            const response = await apiClient.get('/predictions/unlocked');
            if (response.data?.success) {
                const ids = response.data.data.unlockedPredictionIds || [];
                setUnlockedIds(new Set(ids));
                setUnlockInfo({
                    unlockCost: response.data.data.unlockCost,
                    currentBalance: response.data.data.currentBalance,
                    canAfford: response.data.data.currentBalance >= response.data.data.unlockCost,
                    predictionsCanUnlock: Math.floor(response.data.data.currentBalance / response.data.data.unlockCost),
                });
            }
        } catch (err: any) {
            console.warn('Failed to fetch unlocked predictions:', err.message);
        }
    }, []);

    /**
     * Check if a prediction is unlocked
     */
    const isPredictionUnlocked = useCallback((predictionId: string): boolean => {
        return unlockedIds.has(predictionId);
    }, [unlockedIds]);

    /**
     * Unlock a prediction
     */
    const unlockPrediction = useCallback(async (predictionId: string): Promise<UnlockResult> => {
        setIsUnlocking(true);
        setError(null);

        try {
            const response = await apiClient.post(`/predictions/${predictionId}/unlock`);

            if (response.data?.success) {
                // Add to unlocked set
                setUnlockedIds(prev => new Set([...prev, predictionId]));

                // Update balance
                if (response.data.newBalance !== undefined) {
                    setUnlockInfo(prev => prev ? {
                        ...prev,
                        currentBalance: response.data.newBalance,
                        canAfford: response.data.newBalance >= UNLOCK_COST,
                        predictionsCanUnlock: Math.floor(response.data.newBalance / UNLOCK_COST),
                    } : null);
                }

                return {
                    success: true,
                    message: response.data.message || 'Tahmin açıldı!',
                    newBalance: response.data.newBalance,
                };
            }

            // Handle error response
            const errorMessage = response.data?.message || 'Kilit açılamadı';
            setError(errorMessage);
            return {
                success: false,
                message: errorMessage,
                error: response.data?.error,
                newBalance: response.data?.newBalance,
            };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Bir hata oluştu';
            setError(errorMessage);
            return {
                success: false,
                message: errorMessage,
                error: 'NETWORK_ERROR',
            };
        } finally {
            setIsUnlocking(false);
        }
    }, []);

    /**
     * Check if user can afford to unlock
     */
    const canAffordUnlock = useCallback((): boolean => {
        return unlockInfo?.canAfford ?? false;
    }, [unlockInfo]);

    return {
        // State
        isUnlocking,
        unlockInfo,
        unlockedIds,
        error,

        // Actions
        fetchUnlockInfo,
        fetchUnlockedPredictions,
        unlockPrediction,

        // Helpers
        isPredictionUnlocked,
        canAffordUnlock,

        // Constants
        UNLOCK_COST,
    };
}
