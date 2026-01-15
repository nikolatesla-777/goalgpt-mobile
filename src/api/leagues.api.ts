// src/api/leagues.api.ts
// GoalGPT Mobile App - Leagues/Competitions API

import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface Competition {
  id: number;
  name: string;
  logo: string;
  country: string;
  type: string;
}

export interface CompetitionDetail extends Competition {
  season: string;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  totalMatchdays: number;
}

export interface Standing {
  position: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
}

export interface CompetitionFixture {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  kickoffTime: string;
  statusId: number;
  statusName: string;
  homeScore: number | null;
  awayScore: number | null;
  matchday: number;
}

// Get Competition Detail
export async function getCompetitionDetail(competitionId: string): Promise<CompetitionDetail> {
  try {
    const response = await apiClient.get<ApiResponse<CompetitionDetail>>(
      API_ENDPOINTS.COMPETITIONS.DETAIL(competitionId)
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Competition Standings
export async function getCompetitionStandings(competitionId: string): Promise<Standing[]> {
  try {
    const response = await apiClient.get<ApiResponse<Standing[]>>(
      API_ENDPOINTS.COMPETITIONS.STANDINGS(competitionId)
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Competition Fixtures
export async function getCompetitionFixtures(
  competitionId: string,
  matchday?: number
): Promise<CompetitionFixture[]> {
  try {
    const url = matchday
      ? `${API_ENDPOINTS.COMPETITIONS.FIXTURES(competitionId)}?matchday=${matchday}`
      : API_ENDPOINTS.COMPETITIONS.FIXTURES(competitionId);

    const response = await apiClient.get<ApiResponse<CompetitionFixture[]>>(url);

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}
