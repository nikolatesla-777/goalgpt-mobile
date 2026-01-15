// src/api/matches.api.ts
// GoalGPT Mobile App - Matches API

import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface Match {
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
    country: string;
  };
  statusId: number;
  statusName: string;
  minute: number | null;
  kickoffTime: string;
  homeScore: number | null;
  awayScore: number | null;
  ended: boolean;
}

export interface MatchDetail extends Match {
  season: string;
  round: string;
  venue: string;
  referee: string;
  statistics?: any;
  events?: any[];
}

export interface H2HMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
}

export interface LineupPlayer {
  id: number;
  name: string;
  number: number;
  position: string;
  photo: string;
}

export interface Lineup {
  homeTeam: {
    formation: string;
    startingXI: LineupPlayer[];
    substitutes: LineupPlayer[];
  };
  awayTeam: {
    formation: string;
    startingXI: LineupPlayer[];
    substitutes: LineupPlayer[];
  };
}

export interface LiveStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
}

export interface TrendData {
  minute: number;
  homeScore: number;
  awayScore: number;
  events: string[];
}

// Get Live Matches
export async function getLiveMatches(): Promise<Match[]> {
  try {
    const response = await apiClient.get<ApiResponse<Match[]>>(API_ENDPOINTS.MATCHES.LIVE);

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Matches by Date (Diary)
export async function getMatchesByDate(date: string): Promise<Match[]> {
  try {
    const response = await apiClient.get<ApiResponse<Match[]>>(
      `${API_ENDPOINTS.MATCHES.DIARY}?date=${date}`
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Match Detail
export async function getMatchDetail(matchId: string): Promise<MatchDetail> {
  try {
    const response = await apiClient.get<ApiResponse<MatchDetail>>(
      API_ENDPOINTS.MATCHES.DETAIL(matchId)
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Head-to-Head
export async function getH2H(matchId: string): Promise<H2HMatch[]> {
  try {
    const response = await apiClient.get<ApiResponse<H2HMatch[]>>(
      API_ENDPOINTS.MATCHES.H2H(matchId)
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Match Lineup
export async function getMatchLineup(matchId: string): Promise<Lineup> {
  try {
    const response = await apiClient.get<ApiResponse<Lineup>>(
      API_ENDPOINTS.MATCHES.LINEUP(matchId)
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Live Stats
export async function getLiveStats(matchId: string): Promise<LiveStats> {
  try {
    const response = await apiClient.get<ApiResponse<LiveStats>>(
      API_ENDPOINTS.MATCHES.LIVE_STATS(matchId)
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Match Trend (minute-by-minute data)
export async function getMatchTrend(matchId: string): Promise<TrendData[]> {
  try {
    const response = await apiClient.get<ApiResponse<TrendData[]>>(
      API_ENDPOINTS.MATCHES.TREND(matchId)
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}
