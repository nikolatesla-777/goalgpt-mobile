/**
 * Share Service
 * Provides share functionality for matches, teams, predictions, etc.
 * - Native share dialogs
 * - Deep link integration
 * - Analytics tracking
 * - Clipboard support
 */

import { Share, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  createMatchShareLink,
  createBotShareLink,
  createTeamShareLink,
  createLeagueShareLink,
} from './deepLinking.service';
import { addBreadcrumb } from '../config/sentry.config';
import { trackEvent } from './analytics.service';
import { isDev } from '../config/env';

// ============================================================================
// TYPES
// ============================================================================

export interface ShareOptions {
  title?: string;
  message: string;
  url: string;
}

export interface ShareResult {
  success: boolean;
  action?: 'shared' | 'dismissed' | 'copied';
  error?: string;
}

// ============================================================================
// SHARE SERVICE
// ============================================================================

class ShareService {
  /**
   * Share match details
   */
  async shareMatch(
    matchId: string | number,
    homeTeam: string,
    awayTeam: string,
    score?: { home: number; away: number },
    league?: string,
    status?: string
  ): Promise<ShareResult> {
    const url = createMatchShareLink(matchId);

    let message = score
      ? `⚽ ${homeTeam} ${score.home} - ${score.away} ${awayTeam}`
      : `⚽ ${homeTeam} vs ${awayTeam}`;

    if (league) {
      message += `\n🏆 ${league}`;
    }

    if (status && status !== 'Not Started') {
      message += `\n📍 ${status}`;
    }

    message += '\n\nWatch live on GoalGPT 🎯';

    // Add breadcrumb
    addBreadcrumb('Share match initiated', 'user', 'info', { matchId, homeTeam, awayTeam });

    const result = await this.share({
      title: `${homeTeam} vs ${awayTeam}`,
      message,
      url,
    });

    // Track analytics
    if (result.success) {
      trackEvent('share_match', {
        matchId,
        homeTeam,
        awayTeam,
        hasScore: !!score,
      });
    }

    return result;
  }

  /**
   * Share team details
   */
  async shareTeam(
    teamId: string | number,
    teamName: string,
    league?: string,
    country?: string
  ): Promise<ShareResult> {
    const url = createTeamShareLink(teamId);

    let message = `⚽ ${teamName}`;

    if (league) {
      message += `\n🏆 ${league}`;
    }

    if (country) {
      message += `\n🌍 ${country}`;
    }

    message += '\n\nFollow this team on GoalGPT!';

    // Add breadcrumb
    addBreadcrumb('Share team initiated', 'user', 'info', { teamId, teamName });

    const result = await this.share({
      title: teamName,
      message,
      url,
    });

    // Track analytics
    if (result.success) {
      trackEvent('share_team', { teamId, teamName });
    }

    return result;
  }

  /**
   * Share competition/league details
   */
  async shareCompetition(
    competitionId: string | number,
    competitionName: string,
    country?: string,
    season?: string
  ): Promise<ShareResult> {
    const url = createLeagueShareLink(competitionId);

    let message = `🏆 ${competitionName}`;

    if (country) {
      message += `\n🌍 ${country}`;
    }

    if (season) {
      message += `\n📅 ${season}`;
    }

    message += '\n\nFollow this league on GoalGPT!';

    // Add breadcrumb
    addBreadcrumb('Share competition initiated', 'user', 'info', {
      competitionId,
      competitionName,
    });

    const result = await this.share({
      title: competitionName,
      message,
      url,
    });

    // Track analytics
    if (result.success) {
      trackEvent('share_competition', { competitionId, competitionName });
    }

    return result;
  }

  /**
   * Share player details
   */
  async sharePlayer(
    playerId: string | number,
    playerName: string,
    teamName?: string
  ): Promise<ShareResult> {
    const url = generateDeepLink('player', { id: playerId });

    const teamText = teamName ? ` (${teamName})` : '';
    const message = `⚽ ${playerName}${teamText}\n\nCheck out ${playerName}'s stats on GoalGPT!`;

    return this.share({
      title: playerName,
      message,
      url,
    });
  }

  /**
   * Share AI prediction
   */
  async sharePrediction(
    matchId: string | number,
    homeTeam: string,
    awayTeam: string,
    prediction: string,
    confidence?: number,
    botName?: string
  ): Promise<ShareResult> {
    const url = createMatchShareLink(matchId);

    let message = `🎯 Prediction: ${prediction}`;

    if (botName) {
      message = `🤖 ${botName}'s Prediction:\n${prediction}`;
    }

    if (confidence) {
      message += `\n📊 Confidence: ${confidence}%`;
    }

    message += `\n\n⚽ ${homeTeam} vs ${awayTeam}`;
    message += '\n\nCheck out this prediction on GoalGPT!';

    // Add breadcrumb
    addBreadcrumb('Share prediction initiated', 'user', 'info', {
      matchId,
      homeTeam,
      awayTeam,
      prediction,
    });

    const result = await this.share({
      title: `Prediction: ${homeTeam} vs ${awayTeam}`,
      message,
      url,
    });

    // Track analytics
    if (result.success) {
      trackEvent('share_prediction', {
        matchId,
        homeTeam,
        awayTeam,
        hasBotName: !!botName,
        hasConfidence: !!confidence,
      });
    }

    return result;
  }

  /**
   * Share AI bot
   */
  async shareAIBot(
    botId: number,
    botName: string,
    successRate: number,
    totalPredictions?: number,
    tier?: string
  ): Promise<ShareResult> {
    const url = createBotShareLink(botId);

    let message = `🤖 ${botName}`;

    if (tier) {
      const tierEmoji = this.getTierEmoji(tier);
      message = `${tierEmoji} ${botName}`;
    }

    message += `\n📊 Success Rate: ${successRate.toFixed(1)}%`;

    if (totalPredictions) {
      message += `\n🎯 Total Predictions: ${totalPredictions}`;
    }

    message += '\n\nCheck out this AI prediction bot on GoalGPT!';

    // Add breadcrumb
    addBreadcrumb('Share bot initiated', 'user', 'info', { botId, botName });

    const result = await this.share({
      title: botName,
      message,
      url,
    });

    // Track analytics
    if (result.success) {
      trackEvent('share_bot', {
        botId,
        botName,
        successRate,
      });
    }

    return result;
  }

  /**
   * Share app invite
   */
  async shareAppInvite(): Promise<ShareResult> {
    const url = 'https://goalgpt.com';

    const message = `⚽ Join me on GoalGPT!\n\nLive scores, AI predictions, and more!\n\nDownload now:`;

    // Add breadcrumb
    addBreadcrumb('Share app invite initiated', 'user', 'info');

    const result = await this.share({
      title: 'Join GoalGPT',
      message,
      url,
    });

    // Track analytics
    if (result.success) {
      trackEvent('share_app_invite', {});
    }

    return result;
  }

  /**
   * Get tier emoji
   */
  private getTierEmoji(tier: string): string {
    switch (tier.toLowerCase()) {
      case 'diamond':
        return '💎';
      case 'platinum':
        return '⭐';
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
      default:
        return '🤖';
    }
  }

  /**
   * Generic share function
   */
  private async share(options: ShareOptions): Promise<ShareResult> {
    try {
      const shareContent = {
        title: options.title,
        message: Platform.OS === 'ios' ? options.message : `${options.message}\n\n${options.url}`,
        url: Platform.OS === 'ios' ? options.url : undefined,
      };

      const result = await Share.share(shareContent);

      if (result.action === Share.sharedAction) {
        if (isDev) {
          console.log('✅ Content shared successfully');
        }

        // Add breadcrumb
        addBreadcrumb('Share successful', 'user', 'info', {
          activityType: result.activityType,
        });

        return {
          success: true,
          action: 'shared',
        };
      } else if (result.action === Share.dismissedAction) {
        if (isDev) {
          console.log('ℹ️ Share dismissed');
        }

        // Track dismissal
        trackEvent('share_dismissed', {});

        return {
          success: false,
          action: 'dismissed',
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Share failed:', error);

      // Add breadcrumb
      addBreadcrumb('Share failed', 'error', 'error', {
        error: String(error),
      });

      // Track error
      trackEvent('share_error', {
        error: String(error),
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Copy link to clipboard
   */
  async copyToClipboard(url: string, message?: string): Promise<ShareResult> {
    try {
      await Clipboard.setStringAsync(url);

      if (isDev) {
        console.log('📋 Copied to clipboard:', url);
      }

      // Add breadcrumb
      addBreadcrumb('Link copied to clipboard', 'user', 'info', { url });

      // Track analytics
      trackEvent('link_copied', { url });

      return {
        success: true,
        action: 'copied',
      };
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);

      // Track error
      trackEvent('copy_error', {
        error: String(error),
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get shareable match link
   */
  getMatchLink(matchId: string | number): string {
    return createMatchShareLink(matchId);
  }

  /**
   * Get shareable team link
   */
  getTeamLink(teamId: string | number): string {
    return createTeamShareLink(teamId);
  }

  /**
   * Get shareable competition link
   */
  getCompetitionLink(competitionId: string | number): string {
    return createLeagueShareLink(competitionId);
  }

  /**
   * Get shareable AI bot link
   */
  getAIBotLink(botId: number): string {
    return createBotShareLink(botId);
  }

  /**
   * Check if sharing is available
   */
  async isAvailable(): Promise<boolean> {
    // Share API is available on all modern platforms
    return true;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const shareService = new ShareService();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format match for sharing
 */
export function formatMatchShare(match: {
  id: string | number;
  home_team_name: string;
  away_team_name: string;
  home_scores?: number;
  away_scores?: number;
  status_id: number;
}): {
  title: string;
  message: string;
  url: string;
} {
  const isLive = [2, 3, 4, 5, 7].includes(match.status_id);
  const hasScore = match.home_scores !== undefined && match.away_scores !== undefined;

  let message = `⚽ ${match.home_team_name} vs ${match.away_team_name}`;

  if (hasScore) {
    message += `\n${match.home_scores} - ${match.away_scores}`;
  }

  if (isLive) {
    message += '\n\n🔴 LIVE NOW on GoalGPT!';
  } else {
    message += '\n\nWatch on GoalGPT!';
  }

  return {
    title: `${match.home_team_name} vs ${match.away_team_name}`,
    message,
    url: createMatchShareLink(match.id),
  };
}

/**
 * Format team for sharing
 */
export function formatTeamShare(team: {
  id: string | number;
  name: string;
  logo?: string;
}): {
  title: string;
  message: string;
  url: string;
} {
  return {
    title: team.name,
    message: `🏆 ${team.name}\n\nFollow ${team.name} on GoalGPT for live updates, stats, and more!`,
    url: createTeamShareLink(team.id),
  };
}

/**
 * Create share message with UTM parameters
 */
export function createShareMessageWithUTM(
  baseMessage: string,
  url: string,
  source: string
): string {
  const urlWithUTM = `${url}?utm_source=${source}&utm_medium=share&utm_campaign=user_share`;
  return `${baseMessage}\n\n${urlWithUTM}`;
}

// ============================================================================
// EXPORT
// ============================================================================

export default shareService;
