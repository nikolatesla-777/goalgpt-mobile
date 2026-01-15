// src/api/predictions.api.ts
// GoalGPT Mobile App - Predictions API

import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface Prediction {
  id: string;
  matchId: number;
  type: 'winner' | 'score' | 'both_score' | 'over_under' | 'handicap';
  prediction: string;
  confidence: number; // 0-100
  odds: number;
  analysis: string;
  isPremium: boolean;
  createdAt: string;
}

export interface MatchPrediction {
  matchId: number;
  match: {
    id: number;
    homeTeam: {
      name: string;
      logo: string;
    };
    awayTeam: {
      name: string;
      logo: string;
    };
    kickoffTime: string;
    competition: {
      name: string;
      logo: string;
    };
  };
  predictions: Prediction[];
  summary: {
    homeWinProbability: number;
    drawProbability: number;
    awayWinProbability: number;
    predictedScore: {
      home: number;
      away: number;
    };
  };
}

export interface UserPredictionHistory {
  id: string;
  matchId: number;
  userPrediction: string;
  actualResult: string;
  isCorrect: boolean;
  points: number;
  createdAt: string;
}

// Get Matched Predictions (predictions for upcoming matches)
export async function getMatchedPredictions(): Promise<MatchPrediction[]> {
  try {
    const response = await apiClient.get<ApiResponse<MatchPrediction[]>>(
      API_ENDPOINTS.PREDICTIONS.MATCHED
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Predictions for Specific Match
export async function getMatchPredictions(matchId: string): Promise<MatchPrediction> {
  try {
    const response = await apiClient.get<ApiResponse<MatchPrediction>>(
      API_ENDPOINTS.PREDICTIONS.FOR_MATCH(matchId)
    );

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Purchase Premium Prediction
export async function purchasePremiumPrediction(
  predictionId: string
): Promise<{ success: boolean; prediction: Prediction }> {
  try {
    const response = await apiClient.post<
      ApiResponse<{ success: boolean; prediction: Prediction }>
    >(`${API_ENDPOINTS.CREDITS.PURCHASE_PREDICTION}/${predictionId}`);

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get User Prediction History
export async function getUserPredictionHistory(
  page: number = 1,
  limit: number = 20
): Promise<{ predictions: UserPredictionHistory[]; total: number; hasMore: boolean }> {
  try {
    const url = `${API_ENDPOINTS.PREDICTIONS.MATCHED}/history?page=${page}&limit=${limit}`;

    const response =
      await apiClient.get<
        ApiResponse<{ predictions: UserPredictionHistory[]; total: number; hasMore: boolean }>
      >(url);

    return (
      response.data.data || {
        predictions: [],
        total: 0,
        hasMore: false,
      }
    );
  } catch (error) {
    throw handleApiError(error);
  }
}
