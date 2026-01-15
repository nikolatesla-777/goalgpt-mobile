// src/api/teams.api.ts
// GoalGPT Mobile App - Teams API

import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface Team {
  id: number;
  name: string;
  logo: string;
  country: string;
  founded: number;
  venue: string;
}

export interface TeamDetail extends Team {
  coach: string;
  website: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface TeamFixture {
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
  competition: {
    id: number;
    name: string;
    logo: string;
  };
  kickoffTime: string;
  statusId: number;
  statusName: string;
  homeScore: number | null;
  awayScore: number | null;
}

export interface TeamPlayer {
  id: number;
  name: string;
  photo: string;
  position: string;
  number: number;
  age: number;
  nationality: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
}

export interface TeamStanding {
  position: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  competition: {
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

// Get Team Detail
export async function getTeamDetail(teamId: string): Promise<TeamDetail> {
  try {
    const response = await apiClient.get<ApiResponse<TeamDetail>>(
      API_ENDPOINTS.TEAMS.DETAIL(teamId)
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Team Fixtures
export async function getTeamFixtures(teamId: string): Promise<TeamFixture[]> {
  try {
    const response = await apiClient.get<ApiResponse<TeamFixture[]>>(
      API_ENDPOINTS.TEAMS.FIXTURES(teamId)
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Team Players
export async function getTeamPlayers(teamId: string): Promise<TeamPlayer[]> {
  try {
    const response = await apiClient.get<ApiResponse<TeamPlayer[]>>(
      API_ENDPOINTS.TEAMS.PLAYERS(teamId)
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Team Standings
export async function getTeamStandings(teamId: string): Promise<TeamStanding[]> {
  try {
    const response = await apiClient.get<ApiResponse<TeamStanding[]>>(
      API_ENDPOINTS.TEAMS.STANDINGS(teamId)
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}
