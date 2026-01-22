/**
 * usePredictionStats Hook
 * 
 * Calculates prediction statistics from a filtered list.
 * Separated from HomeScreen for reusability and testability.
 * 
 * @module hooks/usePredictionStats
 */

import { useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface PredictionStatsInput {
    result?: 'won' | 'lost' | 'pending' | 'void' | string;
}

export interface PredictionStats {
    total: number;
    wins: number;
    losses: number;
    pending: number;
    winRate: string;
}

// ============================================================================
// UTILITY FUNCTIONS (Pure, testable)
// ============================================================================

/**
 * Calculate prediction statistics from an array of predictions
 * Pure function for easy unit testing
 */
export function calculatePredictionStats<T extends PredictionStatsInput>(
    predictions: T[]
): PredictionStats {
    const total = predictions.length;
    const wins = predictions.filter(p => p.result === 'won').length;
    const losses = predictions.filter(p => p.result === 'lost').length;
    const pending = predictions.filter(p => !p.result || p.result === 'pending').length;

    // Win rate is calculated from decided predictions only (wins + losses)
    const decidedCount = wins + losses;
    const winRate = decidedCount > 0
        ? ((wins / decidedCount) * 100).toFixed(1)
        : '0.0';

    return { total, wins, losses, pending, winRate };
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to calculate prediction statistics
 * Memoized to prevent unnecessary recalculations
 * 
 * @param predictions - Array of predictions with result field
 * @returns Statistics object with total, wins, losses, pending, winRate
 * 
 * @example
 * ```tsx
 * const { total, wins, winRate } = usePredictionStats(filteredPredictions);
 * ```
 */
export function usePredictionStats<T extends PredictionStatsInput>(
    predictions: T[]
): PredictionStats {
    return useMemo(() => {
        return calculatePredictionStats(predictions);
    }, [predictions]);
}

/**
 * Hook to calculate tab counts for filter tabs
 * Provides counts for each filter category
 * 
 * @param predictions - Array of predictions
 * @param favorites - Array of favorite prediction IDs
 * @returns Count object for each tab
 */
export function useTabCounts<T extends PredictionStatsInput & { id: string }>(
    predictions: T[],
    favorites: string[]
): {
    all: number;
    favorites: number;
    active: number;
    won: number;
    lost: number;
} {
    return useMemo(() => {
        return {
            all: predictions.length,
            favorites: predictions.filter(p => favorites.includes(p.id)).length,
            active: predictions.filter(p => !p.result || p.result === 'pending').length,
            won: predictions.filter(p => p.result === 'won').length,
            lost: predictions.filter(p => p.result === 'lost').length,
        };
    }, [predictions, favorites]);
}
