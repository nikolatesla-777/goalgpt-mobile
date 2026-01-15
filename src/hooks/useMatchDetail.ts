/**
 * useMatchDetail Hook
 *
 * Fetch match detail data (match info, H2H, lineup, stats, trend)
 */

import { useState, useEffect } from 'react';
import {
  getMatchDetail,
  getH2H,
  getLineup,
  getLiveStats,
  getTrendData,
  type MatchDetail,
  type H2HResponse,
  type LineupResponse,
  type LiveStatsResponse,
  type TrendDataResponse,
} from '../services/matchDetail.service';

export interface UseMatchDetailResult {
  // Loading states
  isLoadingMatch: boolean;
  isLoadingH2H: boolean;
  isLoadingLineup: boolean;
  isLoadingStats: boolean;
  isLoadingTrend: boolean;

  // Error states
  matchError: string | null;
  h2hError: string | null;
  lineupError: string | null;
  statsError: string | null;
  trendError: string | null;

  // Data
  match: MatchDetail | null;
  h2h: H2HResponse['data'] | null;
  lineup: LineupResponse['data'] | null;
  stats: LiveStatsResponse['data'] | null;
  trend: TrendDataResponse['data'] | null;

  // Methods
  refetch: () => Promise<void>;
}

export function useMatchDetail(matchId: string | number): UseMatchDetailResult {
  // Loading states
  const [isLoadingMatch, setIsLoadingMatch] = useState(true);
  const [isLoadingH2H, setIsLoadingH2H] = useState(false);
  const [isLoadingLineup, setIsLoadingLineup] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingTrend, setIsLoadingTrend] = useState(false);

  // Error states
  const [matchError, setMatchError] = useState<string | null>(null);
  const [h2hError, setH2hError] = useState<string | null>(null);
  const [lineupError, setLineupError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [trendError, setTrendError] = useState<string | null>(null);

  // Data
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [h2h, setH2h] = useState<H2HResponse['data'] | null>(null);
  const [lineup, setLineup] = useState<LineupResponse['data'] | null>(null);
  const [stats, setStats] = useState<LiveStatsResponse['data'] | null>(null);
  const [trend, setTrend] = useState<TrendDataResponse['data'] | null>(null);

  // Fetch match detail
  const fetchMatch = async () => {
    try {
      setIsLoadingMatch(true);
      setMatchError(null);
      const data = await getMatchDetail(matchId);
      setMatch(data);
    } catch (error: any) {
      setMatchError(error.message);
    } finally {
      setIsLoadingMatch(false);
    }
  };

  // Fetch H2H data
  const fetchH2H = async () => {
    try {
      setIsLoadingH2H(true);
      setH2hError(null);
      const data = await getH2H(matchId);
      setH2h(data);
    } catch (error: any) {
      setH2hError(error.message);
    } finally {
      setIsLoadingH2H(false);
    }
  };

  // Fetch lineup
  const fetchLineup = async () => {
    try {
      setIsLoadingLineup(true);
      setLineupError(null);
      const data = await getLineup(matchId);
      setLineup(data);
    } catch (error: any) {
      setLineupError(error.message);
    } finally {
      setIsLoadingLineup(false);
    }
  };

  // Fetch live stats
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      setStatsError(null);
      const data = await getLiveStats(matchId);
      setStats(data);
    } catch (error: any) {
      setStatsError(error.message);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Fetch trend data
  const fetchTrend = async () => {
    try {
      setIsLoadingTrend(true);
      setTrendError(null);
      const data = await getTrendData(matchId);
      setTrend(data);
    } catch (error: any) {
      setTrendError(error.message);
    } finally {
      setIsLoadingTrend(false);
    }
  };

  // Refetch all data
  const refetch = async () => {
    await Promise.all([
      fetchMatch(),
      fetchH2H(),
      fetchLineup(),
      fetchStats(),
      fetchTrend(),
    ]);
  };

  // Initial fetch
  useEffect(() => {
    fetchMatch();
    // Fetch other data in parallel after 500ms (stagger to avoid rate limits)
    setTimeout(() => {
      Promise.all([
        fetchH2H(),
        fetchLineup(),
        fetchStats(),
        fetchTrend(),
      ]);
    }, 500);
  }, [matchId]);

  return {
    // Loading states
    isLoadingMatch,
    isLoadingH2H,
    isLoadingLineup,
    isLoadingStats,
    isLoadingTrend,

    // Error states
    matchError,
    h2hError,
    lineupError,
    statsError,
    trendError,

    // Data
    match,
    h2h,
    lineup,
    stats,
    trend,

    // Methods
    refetch,
  };
}
