import apiClient, { handleApiError } from '../api/client';

export interface BotStat {
    bot_id: number;
    bot_name: string;
    total_predictions: number;
    total_wins: number;
    total_losses: number;
    win_rate: number;
    last_updated: string;
}

export interface BotStatsResponse {
    success: boolean;
    bots: BotStat[];
}

// Simple in-memory cache
let statsCache: BotStat[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getBotStats = async (): Promise<BotStat[]> => {
    try {
        const now = Date.now();
        if (statsCache && (now - lastFetchTime < CACHE_DURATION)) {
            return statsCache;
        }

        // Endpoint might need adjustment based on real backend routes
        // Assuming /api/stats/bots exists based on web usage
        // Use the correct backend endpoint
        const response = await apiClient.get<BotStatsResponse>('/api/predictions/stats/bots');

        if (response.data && response.data.bots) {
            statsCache = response.data.bots;
            lastFetchTime = now;
            return response.data.bots;
        }

        return [];
    } catch (error) {
        console.error('Failed to fetch bot stats:', error);
        return statsCache || []; // Return cache if fail
    }
};
