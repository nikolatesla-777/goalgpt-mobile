/**
 * useShare Hook
 *
 * Custom hook for sharing content
 * - Wraps share service with React state
 * - Provides loading and error states
 * - Toast notifications for feedback
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { shareService, ShareResult } from '../services/share.service';
import type {
  MatchShareData,
  BotShareData,
  TeamShareData,
  LeagueShareData,
  PredictionShareData,
} from '../services/share.service';

// ============================================================================
// TYPES
// ============================================================================

export interface UseShareReturn {
  // State
  isSharing: boolean;
  lastShareResult: ShareResult | null;

  // Match
  shareMatch: (
    matchId: string | number,
    homeTeam: string,
    awayTeam: string,
    score?: { home: number; away: number },
    league?: string,
    status?: string
  ) => Promise<void>;

  // Bot
  shareBot: (
    botId: number,
    botName: string,
    successRate: number,
    totalPredictions?: number,
    tier?: string
  ) => Promise<void>;

  // Team
  shareTeam: (
    teamId: string | number,
    teamName: string,
    league?: string,
    country?: string
  ) => Promise<void>;

  // League
  shareLeague: (
    leagueId: string | number,
    name: string,
    country?: string,
    season?: string
  ) => Promise<void>;

  // Prediction
  sharePrediction: (
    matchId: string | number,
    homeTeam: string,
    awayTeam: string,
    prediction: string,
    confidence?: number,
    botName?: string
  ) => Promise<void>;

  // App
  shareApp: () => Promise<void>;

  // Copy
  copyLink: (url: string) => Promise<void>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useShare(): UseShareReturn {
  const [isSharing, setIsSharing] = useState(false);
  const [lastShareResult, setLastShareResult] = useState<ShareResult | null>(null);

  /**
   * Share match
   */
  const shareMatch = useCallback(
    async (
      matchId: string | number,
      homeTeam: string,
      awayTeam: string,
      score?: { home: number; away: number },
      league?: string,
      status?: string
    ) => {
      setIsSharing(true);
      try {
        const result = await shareService.shareMatch(
          matchId,
          homeTeam,
          awayTeam,
          score,
          league,
          status
        );
        setLastShareResult(result);

        if (!result.success && result.error) {
          Alert.alert('Share Failed', result.error);
        }
      } catch (error) {
        console.error('Share match error:', error);
        Alert.alert('Share Failed', 'An unexpected error occurred');
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  /**
   * Share bot
   */
  const shareBot = useCallback(
    async (
      botId: number,
      botName: string,
      successRate: number,
      totalPredictions?: number,
      tier?: string
    ) => {
      setIsSharing(true);
      try {
        const result = await shareService.shareAIBot(
          botId,
          botName,
          successRate,
          totalPredictions,
          tier
        );
        setLastShareResult(result);

        if (!result.success && result.error) {
          Alert.alert('Share Failed', result.error);
        }
      } catch (error) {
        console.error('Share bot error:', error);
        Alert.alert('Share Failed', 'An unexpected error occurred');
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  /**
   * Share team
   */
  const shareTeam = useCallback(
    async (
      teamId: string | number,
      teamName: string,
      league?: string,
      country?: string
    ) => {
      setIsSharing(true);
      try {
        const result = await shareService.shareTeam(teamId, teamName, league, country);
        setLastShareResult(result);

        if (!result.success && result.error) {
          Alert.alert('Share Failed', result.error);
        }
      } catch (error) {
        console.error('Share team error:', error);
        Alert.alert('Share Failed', 'An unexpected error occurred');
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  /**
   * Share league
   */
  const shareLeague = useCallback(
    async (
      leagueId: string | number,
      name: string,
      country?: string,
      season?: string
    ) => {
      setIsSharing(true);
      try {
        const result = await shareService.shareCompetition(leagueId, name, country, season);
        setLastShareResult(result);

        if (!result.success && result.error) {
          Alert.alert('Share Failed', result.error);
        }
      } catch (error) {
        console.error('Share league error:', error);
        Alert.alert('Share Failed', 'An unexpected error occurred');
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  /**
   * Share prediction
   */
  const sharePrediction = useCallback(
    async (
      matchId: string | number,
      homeTeam: string,
      awayTeam: string,
      prediction: string,
      confidence?: number,
      botName?: string
    ) => {
      setIsSharing(true);
      try {
        const result = await shareService.sharePrediction(
          matchId,
          homeTeam,
          awayTeam,
          prediction,
          confidence,
          botName
        );
        setLastShareResult(result);

        if (!result.success && result.error) {
          Alert.alert('Share Failed', result.error);
        }
      } catch (error) {
        console.error('Share prediction error:', error);
        Alert.alert('Share Failed', 'An unexpected error occurred');
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  /**
   * Share app
   */
  const shareApp = useCallback(async () => {
    setIsSharing(true);
    try {
      const result = await shareService.shareAppInvite();
      setLastShareResult(result);

      if (!result.success && result.error) {
        Alert.alert('Share Failed', result.error);
      }
    } catch (error) {
      console.error('Share app error:', error);
      Alert.alert('Share Failed', 'An unexpected error occurred');
    } finally {
      setIsSharing(false);
    }
  }, []);

  /**
   * Copy link to clipboard
   */
  const copyLink = useCallback(async (url: string) => {
    try {
      const result = await shareService.copyToClipboard(url);
      setLastShareResult(result);

      if (result.success) {
        Alert.alert('Copied', 'Link copied to clipboard');
      } else if (result.error) {
        Alert.alert('Copy Failed', result.error);
      }
    } catch (error) {
      console.error('Copy link error:', error);
      Alert.alert('Copy Failed', 'An unexpected error occurred');
    }
  }, []);

  return {
    // State
    isSharing,
    lastShareResult,

    // Functions
    shareMatch,
    shareBot,
    shareTeam,
    shareLeague,
    sharePrediction,
    shareApp,
    copyLink,
  };
}

export default useShare;
