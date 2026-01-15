/**
 * Bots Service
 *
 * Handles AI bot statistics and data aggregation
 */

import apiClient, { handleApiError } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';
import { getMatchedPredictions } from './predictions.service';

// ============================================================================
// TYPES
// ============================================================================

export interface BotStats {
  today: {
    total: number;
    wins: number;
    losses: number;
    pending: number;
    rate: number;
  };
  yesterday: {
    total: number;
    wins: number;
    losses: number;
    rate: number;
  };
  monthly: {
    total: number;
    wins: number;
    losses: number;
    rate: number;
  };
  all: {
    total: number;
    wins: number;
    losses: number;
    rate: number;
  };
}

export interface Bot {
  id: number;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  totalPredictions: number;
  successRate: number;
  stats: BotStats;
  isActive: boolean;
  rank?: number;
  specialties?: string[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract bot ID from bot name (e.g., "BOT 10" -> 10)
 */
function extractBotId(botName: string): number {
  const match = botName.match(/BOT\s+(\d+)/i);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Get bot tier based on success rate
 */
function getBotTier(successRate: number): Bot['tier'] {
  if (successRate >= 80) return 'diamond';
  if (successRate >= 70) return 'platinum';
  if (successRate >= 60) return 'gold';
  if (successRate >= 50) return 'silver';
  return 'bronze';
}

/**
 * Get bot icon based on ID
 */
function getBotIcon(botId: number): string {
  const icons = ['🤖', '🦾', '🧠', '⚡', '🎯', '🔮', '🎲', '🏆', '⭐', '💎'];
  return icons[botId % icons.length];
}

/**
 * Get bot description
 */
function getBotDescription(botId: number): string {
  const descriptions = [
    'İlk yarı uzmanı',
    'Üst/Alt analiz botu',
    'Karşılıklı gol uzmanı',
    'Maç sonucu tahmini',
    'Korner analizi',
    'Canlı tahmin uzmanı',
    'İkinci yarı analizi',
    'Gol dakikası tahmini',
    'Handikap uzmanı',
    'Genel performans botu',
  ];
  return descriptions[botId % descriptions.length];
}

/**
 * Check if date is today
 */
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if date is this month
 */
function isThisMonth(date: Date): boolean {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get all AI bots with aggregated statistics
 */
export async function getAllBots(): Promise<Bot[]> {
  try {
    console.log('🤖 Fetching all bots...');

    // Fetch all predictions
    const predictions = await getMatchedPredictions();
    console.log('📊 Fetched', predictions.length, 'predictions for bot aggregation');

    // Group predictions by bot
    const botPredictionsMap = new Map<number, any[]>();

    predictions.forEach((pred) => {
      const botId = pred.bot.id;
      if (!botPredictionsMap.has(botId)) {
        botPredictionsMap.set(botId, []);
      }
      botPredictionsMap.get(botId)!.push(pred);
    });

    console.log('🤖 Found', botPredictionsMap.size, 'unique bots');

    // Create bot objects with stats
    const bots: Bot[] = [];

    botPredictionsMap.forEach((botPredictions, botId) => {
      // Calculate overall stats
      const totalPredictions = botPredictions.length;
      const wins = botPredictions.filter((p) => p.prediction.result === 'win').length;
      const losses = botPredictions.filter((p) => p.prediction.result === 'lose').length;
      const pending = botPredictions.filter((p) => p.prediction.result === 'pending').length;
      const successRate = totalPredictions > 0 ? Math.round((wins / (wins + losses)) * 100) || 0 : 0;

      // Calculate today stats
      const todayPredictions = botPredictions.filter((p) => {
        const createdAt = p.match.time; // This contains the time string
        // Since we don't have full date, we'll consider all as today for now
        // In production, you'd parse the full timestamp
        return true;
      });
      const todayWins = todayPredictions.filter((p) => p.prediction.result === 'win').length;
      const todayLosses = todayPredictions.filter((p) => p.prediction.result === 'lose').length;
      const todayPending = todayPredictions.filter((p) => p.prediction.result === 'pending').length;
      const todayRate = todayPredictions.length > 0
        ? Math.round((todayWins / (todayWins + todayLosses)) * 100) || 0
        : 0;

      // For demo, use same stats for yesterday, monthly
      // In production, you'd filter by actual dates
      const stats: BotStats = {
        today: {
          total: todayPredictions.length,
          wins: todayWins,
          losses: todayLosses,
          pending: todayPending,
          rate: todayRate,
        },
        yesterday: {
          total: Math.floor(totalPredictions * 0.3),
          wins: Math.floor(wins * 0.3),
          losses: Math.floor(losses * 0.3),
          rate: successRate,
        },
        monthly: {
          total: totalPredictions,
          wins,
          losses,
          rate: successRate,
        },
        all: {
          total: totalPredictions,
          wins,
          losses,
          rate: successRate,
        },
      };

      const bot: Bot = {
        id: botId,
        name: `BOT ${botId}`,
        displayName: `Bot ${botId}`,
        description: getBotDescription(botId),
        icon: getBotIcon(botId),
        tier: getBotTier(successRate),
        totalPredictions,
        successRate,
        stats,
        isActive: pending > 0, // Active if has pending predictions
        specialties: ['Premier League', 'Over/Under', 'Live Analysis'],
      };

      bots.push(bot);
    });

    // Sort by success rate
    bots.sort((a, b) => b.successRate - a.successRate);

    // Assign ranks
    bots.forEach((bot, index) => {
      bot.rank = index + 1;
    });

    console.log('✅ Aggregated', bots.length, 'bots with stats');

    return bots;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getAllBots error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get bot by ID
 */
export async function getBotById(botId: number): Promise<Bot | null> {
  try {
    const bots = await getAllBots();
    return bots.find((bot) => bot.id === botId) || null;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getBotById error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get top performing bots
 */
export async function getTopBots(limit: number = 10): Promise<Bot[]> {
  try {
    const bots = await getAllBots();
    return bots
      .filter((bot) => bot.totalPredictions >= 5) // Minimum 5 predictions
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, limit);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getTopBots error:', apiError.message);
    throw apiError;
  }
}

/**
 * Get active bots (with pending predictions)
 */
export async function getActiveBots(): Promise<Bot[]> {
  try {
    const bots = await getAllBots();
    return bots.filter((bot) => bot.isActive);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ getActiveBots error:', apiError.message);
    throw apiError;
  }
}
