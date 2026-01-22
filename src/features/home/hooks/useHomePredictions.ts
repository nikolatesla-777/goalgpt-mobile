/**
 * useHomePredictions Hook
 * 
 * Handles data fetching and state management for the HomeScreen.
 * Extracted from HomeScreen for better separation of concerns.
 * 
 * @module features/home/hooks/useHomePredictions
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import apiClient from '../../../api/client';
import { getBotStats, BotStat } from '../../../services/botStats.service';
import { AIPrediction } from '../../../services/predictions.service';
import { logger } from '../../../utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export interface UseHomePredictionsReturn {
    /** Raw predictions from API */
    predictions: AIPrediction[];
    /** Bot statistics for win rate display */
    botStats: BotStat[];
    /** Map of bot name to stats for quick lookup */
    botStatsMap: Record<string, BotStat>;
    /** Loading state for initial fetch */
    isLoading: boolean;
    /** Refreshing state for pull-to-refresh */
    isRefreshing: boolean;
    /** Error message if fetch failed */
    error: string | null;
    /** Function to manually refetch data */
    refetch: () => Promise<void>;
    /** Function to trigger pull-to-refresh */
    onRefresh: () => Promise<void>;
}

// ============================================================================
// MOCK DATA (Development Only)
// ============================================================================

const MOCK_PREDICTIONS: AIPrediction[] = [
    {
        id: 'mock-1',
        match_id: 'mock-match-1',
        home_team_name: 'Manchester City',
        home_team_logo: 'https://media.api-sports.io/football/teams/50.png',
        away_team_name: 'Liverpool',
        away_team_logo: 'https://media.api-sports.io/football/teams/40.png',
        league_name: 'PREMIER LEAGUE',
        country_name: 'ENGLAND',
        country_logo: 'https://media.api-sports.io/flags/gb.svg',
        created_at: new Date().toISOString(),
        prediction: 'MS 1',
        minute_at_prediction: 12,
        score_at_prediction: '0-0',
        live_match_status: 2, // Live 1H
        live_match_minute: 34,
        home_score_display: 2,
        away_score_display: 1,
        canonical_bot_name: 'BOT 10',
        result: 'pending',
        access_type: 'VIP'
    },
    {
        id: 'mock-2',
        match_id: 'mock-match-2',
        home_team_name: 'Real Madrid',
        home_team_logo: 'https://media.api-sports.io/football/teams/541.png',
        away_team_name: 'Barcelona',
        away_team_logo: 'https://media.api-sports.io/football/teams/529.png',
        league_name: 'LA LIGA',
        country_name: 'SPAIN',
        country_logo: 'https://media.api-sports.io/flags/es.svg',
        created_at: new Date().toISOString(),
        prediction: 'KG VAR',
        minute_at_prediction: 0,
        score_at_prediction: '0-0',
        live_match_status: 8, // FT
        live_match_minute: 90,
        home_score_display: 3,
        away_score_display: 1,
        final_score: '3-1',
        canonical_bot_name: 'BOT 5',
        result: 'won',
        access_type: 'FREE'
    }
] as any;

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useHomePredictions(): UseHomePredictionsReturn {
    const [predictions, setPredictions] = useState<AIPrediction[]>([]);
    const [botStats, setBotStats] = useState<BotStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Build a lookup map for bot stats by name
     */
    const botStatsMap = useMemo(() => {
        return botStats.reduce((acc, bot) => {
            acc[bot.bot_name] = bot;
            acc[bot.bot_name.toLowerCase()] = bot;
            return acc;
        }, {} as Record<string, BotStat>);
    }, [botStats]);

    /**
     * Fetch predictions and bot stats from API
     */
    const fetchData = useCallback(async () => {
        try {
            const [predictionsResponse, stats] = await Promise.all([
                apiClient.get<any>('/predictions/matched'),
                getBotStats(),
            ]);

            const rawPreds =
                predictionsResponse.data.data?.predictions ||
                predictionsResponse.data.predictions ||
                [];

            setPredictions(rawPreds);
            setBotStats(stats);
            setError(null);

            logger.debug('Home data fetched successfully', {
                predictionsCount: rawPreds.length,
                botsCount: stats.length
            });

        } catch (err) {
            logger.error('Failed to fetch home data', err as Error);
            setError('Veriler yüklenemedi. Lütfen tekrar deneyin.');

            // Only use mock data in development mode
            if (__DEV__) {
                logger.warn('Using mock data for development');
                setPredictions(MOCK_PREDICTIONS);
            } else {
                setPredictions([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Handle pull-to-refresh
     */
    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchData();
        setIsRefreshing(false);
    }, [fetchData]);

    // Initial load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        predictions,
        botStats,
        botStatsMap,
        isLoading,
        isRefreshing,
        error,
        refetch: fetchData,
        onRefresh,
    };
}
