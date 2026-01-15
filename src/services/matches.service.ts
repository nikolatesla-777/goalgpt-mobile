/**
 * Matches Service
 *
 * Handles all match-related API calls
 */

import apiClient, { handleApiError } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';
import type { MatchItem } from '../components/organisms/LiveMatchesFeed';

export interface LiveMatchesResponse {
  success: boolean;
  data: {
    matches: MatchItem[];
    total: number;
  };
}

export interface MatchDiaryResponse {
  success: boolean;
  data: {
    matches: MatchItem[];
    date: string;
    total: number;
  };
}

/**
 * Transform backend match data to mobile app format
 */
function transformMatch(match: any): MatchItem {
  return {
    ...match,
    homeTeam: {
      id: match.home_team?.id || match.home_team_id,
      name: match.home_team?.name || match.home_team_name || 'Unknown',
      logo: match.home_team?.logo_url || match.home_team?.logo,
      score: match.home_score ?? 0,
    },
    awayTeam: {
      id: match.away_team?.id || match.away_team_id,
      name: match.away_team?.name || match.away_team_name || 'Unknown',
      logo: match.away_team?.logo_url || match.away_team?.logo,
      score: match.away_score ?? 0,
    },
    league: match.competition?.name || match.league || 'Unknown League',
    leagueLogo: match.competition?.logo_url || match.leagueLogo,
    status: match.status_id === 2 || match.status_id === 4 || match.status_id === 5 || match.status_id === 7
      ? 'live'
      : match.status_id === 3
      ? 'halftime'
      : match.status_id === 8
      ? 'finished'
      : 'scheduled',
    time: match.minute_text || match.time || '0\'',
    minute: match.minute,
  };
}

/**
 * Get live matches
 */
export async function getLiveMatches(): Promise<MatchItem[]> {
  try {
    const response = await apiClient.get<any>(API_ENDPOINTS.MATCHES.LIVE);
    // Support both 'matches' and 'results' keys for flexibility
    const matches = response.data.data?.matches || response.data.data?.results || response.data.matches || [];
    console.log('🔴 getLiveMatches returned:', matches.length, 'live matches');
    return matches.map(transformMatch);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getLiveMatches error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get matches for a specific date
 * @param date - Date in YYYY-MM-DD format
 */
export async function getMatchesByDate(date: string): Promise<MatchItem[]> {
  try {
    const response = await apiClient.get<any>(
      `${API_ENDPOINTS.MATCHES.DIARY}?date=${date}`
    );
    // Backend uses 'results' key for diary endpoint, not 'matches'
    const matches = response.data.data?.results || response.data.data?.matches || response.data.results || [];
    console.log('📅 getMatchesByDate returned:', matches.length, 'matches for', date);
    return matches.map(transformMatch);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getMatchesByDate error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get today's matches
 */
export async function getTodayMatches(): Promise<MatchItem[]> {
  const today = new Date().toISOString().split('T')[0];
  return getMatchesByDate(today);
}

/**
 * Get match detail
 */
export async function getMatchDetail(matchId: string | number) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.MATCHES.DETAIL(matchId.toString()));
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getMatchDetail error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get match H2H (head-to-head)
 */
export async function getMatchH2H(matchId: string | number) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.MATCHES.H2H(matchId.toString()));
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getMatchH2H error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get match lineup
 */
export async function getMatchLineup(matchId: string | number) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.MATCHES.LINEUP(matchId.toString()));
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getMatchLineup error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get match live stats
 */
export async function getMatchLiveStats(matchId: string | number) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.MATCHES.LIVE_STATS(matchId.toString()));
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getMatchLiveStats error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get match trend (minute-by-minute data)
 */
export async function getMatchTrend(matchId: string | number) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.MATCHES.TREND(matchId.toString()));
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getMatchTrend error:', apiError.message);
    throw apiError;
  }
}
