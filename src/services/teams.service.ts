/**
 * Teams Service
 *
 * Handles team-related API calls
 */

import apiClient, { handleApiError } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';

// ============================================================================
// TYPES
// ============================================================================

export interface TeamDetail {
  id: number;
  name: string;
  logo_url?: string;
  country?: string;
  country_flag?: string;
  founded?: number;
  stadium?: string;
  stadium_capacity?: number;
  coach?: string;
}

export interface TeamFixture {
  id: number;
  date: string;
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
  home_score?: number;
  away_score?: number;
  status_id: number;
  minute?: number;
}

export interface TeamStanding {
  rank: number;
  team_id: number;
  team_name: string;
  team_logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  form?: string[];
}

export interface Player {
  id: number;
  name: string;
  number?: number;
  position: string;
  age?: number;
  nationality?: string;
  photo_url?: string;
  // Season stats
  appearances?: number;
  goals?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
  rating?: number;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get team detail by ID
 */
export async function getTeamDetail(teamId: string | number): Promise<TeamDetail> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TEAMS.DETAIL(String(teamId)));
    return response.data.data.team;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch team detail:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Get team fixtures (past and upcoming matches)
 */
export async function getTeamFixtures(
  teamId: string | number,
  limit: number = 20
): Promise<TeamFixture[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TEAMS.FIXTURES(String(teamId)), {
      params: { limit },
    });
    return response.data.data.fixtures;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch team fixtures:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Get team standings (league table position)
 */
export async function getTeamStandings(
  teamId: string | number
): Promise<{ standings: TeamStanding[]; competition_name: string }> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TEAMS.STANDINGS(String(teamId)));
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch team standings:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Get team players (squad)
 */
export async function getTeamPlayers(teamId: string | number): Promise<Player[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TEAMS.PLAYERS(String(teamId)));
    return response.data.data.players;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch team players:', apiError.message);
    throw new Error(apiError.message);
  }
}
