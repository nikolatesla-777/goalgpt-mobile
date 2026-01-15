/**
 * Match Detail Service
 *
 * Handles match detail API calls: H2H, Lineup, Stats, Events, Trend
 */

import apiClient, { handleApiError } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';

// ============================================================================
// TYPES
// ============================================================================

export interface MatchDetailResponse {
  success: boolean;
  data: {
    match: MatchDetail;
  };
}

export interface MatchDetail {
  id: number;
  home_team: {
    id: number;
    name: string;
    logo_url?: string;
  };
  away_team: {
    id: number;
    name: string;
    logo_url?: string;
  };
  competition: {
    id: number;
    name: string;
    logo_url?: string;
  };
  home_score: number;
  away_score: number;
  status_id: number;
  minute?: number;
  minute_text?: string;
  start_time: string;
  stadium?: string;
  referee?: string;
}

export interface H2HResponse {
  success: boolean;
  data: {
    matches: Array<{
      id: number;
      date: string;
      home_team_name: string;
      away_team_name: string;
      home_score: number;
      away_score: number;
      competition_name: string;
    }>;
    stats: {
      total: number;
      home_wins: number;
      draws: number;
      away_wins: number;
    };
  };
}

export interface LineupResponse {
  success: boolean;
  data: {
    home_team_lineup: TeamLineup;
    away_team_lineup: TeamLineup;
  };
}

export interface TeamLineup {
  formation?: string;
  starting_xi: Array<{
    id: number;
    name: string;
    number: number;
    position: string;
    rating?: number;
  }>;
  substitutes: Array<{
    id: number;
    name: string;
    number: number;
    position: string;
  }>;
}

export interface LiveStatsResponse {
  success: boolean;
  data: {
    stats: Array<{
      name: string;
      home_value: number;
      away_value: number;
      percentage?: boolean;
    }>;
  };
}

export interface TrendDataResponse {
  success: boolean;
  data: {
    trend: Array<{
      minute: number;
      home_score: number;
      away_score: number;
      events: Array<{
        type: string;
        team: 'home' | 'away';
        player?: string;
      }>;
    }>;
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get match detail by ID
 */
export async function getMatchDetail(matchId: string | number): Promise<MatchDetail> {
  try {
    const response = await apiClient.get<any>(
      API_ENDPOINTS.MATCHES.DETAIL(String(matchId))
    );
    // Backend returns data directly, not wrapped in "match"
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch match detail:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Get Head-to-Head data for a match
 */
export async function getH2H(matchId: string | number): Promise<H2HResponse['data']> {
  try {
    const response = await apiClient.get<any>(
      API_ENDPOINTS.MATCHES.H2H(String(matchId))
    );
    // Backend might return data directly or wrapped
    return response.data.data || response.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch H2H data:', apiError.message);
    // Return empty data instead of throwing
    return { matches: [], stats: { total: 0, home_wins: 0, draws: 0, away_wins: 0 } };
  }
}

/**
 * Get match lineup (starting XI + substitutes)
 */
export async function getLineup(matchId: string | number): Promise<LineupResponse['data']> {
  try {
    const response = await apiClient.get<any>(
      API_ENDPOINTS.MATCHES.LINEUP(String(matchId))
    );
    return response.data.data || response.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch lineup:', apiError.message);
    // Return empty lineup instead of throwing
    return {
      home_team_lineup: { starting_xi: [], substitutes: [] },
      away_team_lineup: { starting_xi: [], substitutes: [] },
    };
  }
}

/**
 * Get live match statistics
 */
export async function getLiveStats(matchId: string | number): Promise<LiveStatsResponse['data']> {
  try {
    const response = await apiClient.get<any>(
      API_ENDPOINTS.MATCHES.LIVE_STATS(String(matchId))
    );
    return response.data.data || response.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch live stats:', apiError.message);
    // Return empty stats instead of throwing
    return { stats: [] };
  }
}

/**
 * Get minute-by-minute trend data
 */
export async function getTrendData(matchId: string | number): Promise<TrendDataResponse['data']> {
  try {
    const response = await apiClient.get<any>(
      API_ENDPOINTS.MATCHES.TREND(String(matchId))
    );
    return response.data.data || response.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch trend data:', apiError.message);
    // Return empty trend instead of throwing
    return { trend: [] };
  }
}
