/**
 * Predictions Service
 *
 * Handles all AI prediction-related API calls
 */

import apiClient, { handleApiError } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';
import type { PredictionItem } from '../components/organisms/PredictionsList';
import type { PredictionResult, PredictionTier } from '../components/molecules/PredictionCard';

// Raw Backend Interface (Matches Web)
export interface AIPrediction {
  id: string;
  external_id?: string;
  created_at: string;
  match_id?: string;

  // Bot Info
  bot_name?: string;
  canonical_bot_name: string;
  overall_confidence?: number;

  // Match Info
  country_name?: string;
  country_logo?: string;
  league_name?: string;
  home_team_name: string;
  away_team_name: string;
  home_team_logo?: string;
  away_team_logo?: string;

  // Scores & Status
  home_score_display?: number;
  away_score_display?: number;
  final_score?: string;
  live_match_status?: number; // 1:Sched, 2:Live, 3:HT, 8:FT
  live_match_minute?: number;
  match_minute?: number;
  match_status_id?: number;

  // Prediction
  prediction: string;
  score_at_prediction?: string;
  minute_at_prediction?: number;
  result?: 'won' | 'lost' | 'pending' | 'void';
  access_type?: 'VIP' | 'PREMIUM' | 'FREE';
}

export interface MatchedPredictionsResponse {
  success: boolean;
  data: {
    predictions: any[];
    total: number;
    stats?: {
      totalPredictions: number;
      wonPredictions: number;
      lostPredictions: number;
      pendingPredictions: number;
      winRate: number;
    };
  };
}

export interface MatchPredictionsResponse {
  success: boolean;
  data: {
    predictions: any[];
    matchId: string | number;
  };
}

/**
 * Transform backend prediction data to mobile app format
 */
function transformPrediction(pred: any): PredictionItem {
  // Map backend result to mobile app result
  const result: PredictionResult =
    pred.result === 'won' || pred.prediction_result === 'winner' ? 'win' :
      pred.result === 'lost' || pred.prediction_result === 'loser' ? 'lose' :
        'pending';

  // Map access_type to tier
  const tier: PredictionTier =
    pred.access_type === 'VIP' ? 'vip' :
      pred.access_type === 'PREMIUM' ? 'premium' :
        'free';

  // Determine match status
  const status_id = pred.match_status_id;
  const matchStatus =
    status_id === 8 ? 'FT' :
      status_id === 3 ? 'HT' :
        status_id === 2 || status_id === 4 || status_id === 5 || status_id === 7 ? 'LIVE' :
          'Scheduled';

  // Extract bot ID from bot_name (e.g., "BOT 71" → 71)
  let botId = 0;
  const botName = pred.bot_name || pred.canonical_bot_name || '';
  const botIdMatch = botName.match(/BOT\s+(\d+)/i);
  if (botIdMatch) {
    botId = parseInt(botIdMatch[1]);
  }

  // Format prediction creation time as HH:MM
  let timeFormatted = '';
  if (pred.created_at) {
    const createdAt = new Date(pred.created_at);
    const hours = createdAt.getHours().toString().padStart(2, '0');
    const minutes = createdAt.getMinutes().toString().padStart(2, '0');
    timeFormatted = `${hours}:${minutes}`;
  }

  return {
    id: pred.id || pred.external_id,
    predictionId: pred.id || pred.external_id,
    matchId: pred.match_id,
    bot: {
      id: botId,
      name: botName,
      stats: pred.overall_confidence ? `${pred.overall_confidence}% confidence` : undefined,
    },
    match: {
      country: pred.country_name,
      countryFlag: pred.country_logo,
      league: pred.competition_name || pred.league_name || 'Unknown League',
      homeTeam: {
        name: pred.home_team_db_name || pred.home_team_name || 'Home Team',
        logo: pred.home_team_logo || undefined,
      },
      awayTeam: {
        name: pred.away_team_db_name || pred.away_team_name || 'Away Team',
        logo: pred.away_team_logo || undefined,
      },
      homeScore: pred.home_score_display,
      awayScore: pred.away_score_display,
      status: matchStatus,
      minute: pred.match_minute, // For LIVE badge display
      time: timeFormatted, // Prediction creation time (HH:MM)
    },
    prediction: {
      type: pred.prediction || pred.prediction_value || pred.prediction_type || 'Unknown',
      confidence: pred.overall_confidence || 80,
      minute: pred.minute_at_prediction ? `${pred.minute_at_prediction}'` : undefined,
      score: pred.score_at_prediction,
      result,
    },
    tier,
  };
}

/**
 * Get all matched predictions (bot predictions with results)
 */
export async function getMatchedPredictions(): Promise<PredictionItem[]> {
  try {
    const response = await apiClient.get<MatchedPredictionsResponse>(
      API_ENDPOINTS.PREDICTIONS.MATCHED
    );
    const predictions = response.data.data?.predictions || response.data.predictions || [];
    console.log('📊 First prediction from backend:', predictions[0]);
    const transformed = predictions.map(transformPrediction);
    console.log('📊 First transformed prediction:', transformed[0]);
    return transformed;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getMatchedPredictions error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get predictions for a specific match
 * @param matchId - Match ID
 */
export async function getPredictionsForMatch(matchId: string | number): Promise<PredictionItem[]> {
  try {
    const response = await apiClient.get<MatchPredictionsResponse>(
      API_ENDPOINTS.PREDICTIONS.FOR_MATCH(matchId.toString())
    );
    const predictions = response.data.data?.predictions || response.data.predictions || [];
    return predictions.map(transformPrediction);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getPredictionsForMatch error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get top predictions (high confidence, high tier)
 * This filters matched predictions for premium/VIP bots with high confidence
 */
export async function getTopPredictions(limit: number = 10): Promise<PredictionItem[]> {
  try {
    const predictions = await getMatchedPredictions();

    // Filter for high-quality predictions
    const topPredictions = predictions
      .filter((p) => {
        // Filter: Premium or VIP tier
        const isHighTier = p.tier === 'premium' || p.tier === 'vip';

        // Filter: High confidence (>= 75%)
        const isHighConfidence = p.prediction.confidence && p.prediction.confidence >= 75;

        // Filter: Pending or won (not lost)
        const isRelevant = p.prediction.result === 'pending' || p.prediction.result === 'win';

        return isHighTier && isHighConfidence && isRelevant;
      })
      // Sort by confidence (descending)
      .sort((a, b) => (b.prediction.confidence || 0) - (a.prediction.confidence || 0))
      // Limit results
      .slice(0, limit);

    return topPredictions;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getTopPredictions error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get free predictions (accessible to all users)
 */
export async function getFreePredictions(limit: number = 5): Promise<PredictionItem[]> {
  try {
    const predictions = await getMatchedPredictions();

    // Filter for free tier predictions
    const freePredictions = predictions
      .filter((p) => p.tier === 'free')
      .sort((a, b) => (b.prediction.confidence || 0) - (a.prediction.confidence || 0))
      .slice(0, limit);

    return freePredictions;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getFreePredictions error:', apiError.message);
    throw apiError;
  }
}
