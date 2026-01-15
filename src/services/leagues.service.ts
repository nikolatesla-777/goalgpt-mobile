/**
 * Leagues Service
 *
 * Handles league/competition-related API calls
 */

import apiClient, { handleApiError } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';
import type { MatchItem } from '../components/organisms/LiveMatchesFeed';
import type { TeamStanding } from './teams.service';

// ============================================================================
// TYPES
// ============================================================================

export interface LeagueDetail {
  id: number;
  name: string;
  logo_url?: string;
  country?: string;
  country_flag?: string;
  type?: string;
  season?: string;
}

export interface LeagueFixture extends MatchItem {
  // Extends MatchItem with any league-specific properties if needed
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get league detail by ID
 */
export async function getLeagueDetail(leagueId: string | number): Promise<LeagueDetail> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.COMPETITIONS.DETAIL(String(leagueId)));
    return response.data.data.league || response.data.data.competition;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch league detail:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Get league fixtures (matches)
 */
export async function getLeagueFixtures(
  leagueId: string | number,
  limit: number = 50
): Promise<LeagueFixture[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.COMPETITIONS.FIXTURES(String(leagueId)), {
      params: { limit },
    });
    return response.data.data.fixtures || response.data.data.matches || [];
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch league fixtures:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Get league standings (table)
 */
export async function getLeagueStandings(
  leagueId: string | number
): Promise<TeamStanding[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.COMPETITIONS.STANDINGS(String(leagueId)));
    return response.data.data.standings || response.data.data || [];
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch league standings:', apiError.message);
    throw new Error(apiError.message);
  }
}
