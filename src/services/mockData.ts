/**
 * Mock Data Service
 *
 * Provides sample data for testing screens
 * In production, this will be replaced with real API calls
 */

import type { MatchItem } from '../components/organisms/LiveMatchesFeed';
import type { PredictionItem } from '../components/organisms/PredictionsList';
import type { MatchStat } from '../components/organisms/StatsList';
import type { MatchEvent } from '../components/organisms/MatchTimeline';

// ============================================================================
// MOCK MATCHES
// ============================================================================

export const mockMatches: MatchItem[] = [
  {
    id: 'match1',
    homeTeam: { name: 'Barcelona', logo: '🔵🔴', score: 2 },
    awayTeam: { name: 'Real Madrid', logo: '⚪', score: 1 },
    status: 'live',
    time: "67'",
    minute: 67,
    league: 'La Liga',
    leagueLogo: '⚽',
  },
  {
    id: 'match2',
    homeTeam: { name: 'Man United', logo: '🔴', score: 1 },
    awayTeam: { name: 'Liverpool', logo: '🔴', score: 1 },
    status: 'halftime',
    time: 'HT',
    league: 'Premier League',
    leagueLogo: '⚽',
  },
  {
    id: 'match3',
    homeTeam: { name: 'Bayern Munich', logo: '🔴⚪', score: 3 },
    awayTeam: { name: 'Dortmund', logo: '🟡⚫', score: 2 },
    status: 'live',
    time: "82'",
    minute: 82,
    league: 'Bundesliga',
    leagueLogo: '⚽',
  },
  {
    id: 'match4',
    homeTeam: { name: 'PSG', logo: '🔴🔵', score: 0 },
    awayTeam: { name: 'Marseille', logo: '⚪🔵', score: 0 },
    status: 'live',
    time: "12'",
    minute: 12,
    league: 'Ligue 1',
    leagueLogo: '⚽',
  },
  {
    id: 'match5',
    homeTeam: { name: 'Juventus', logo: '⚪⚫', score: undefined },
    awayTeam: { name: 'Inter Milan', logo: '🔵⚫', score: undefined },
    status: 'upcoming',
    time: '19:00',
    league: 'Serie A',
    leagueLogo: '⚽',
  },
];

// ============================================================================
// MOCK PREDICTIONS
// ============================================================================

export const mockPredictions: PredictionItem[] = [
  {
    id: 'pred1',
    bot: { id: 10, name: 'Beaten Draw', stats: '+5C4.2' },
    match: {
      country: 'BRAZIL',
      countryFlag: '🇧🇷',
      league: 'BRASIL COPA',
      homeTeam: { name: 'Sao Paulo', logo: '🔴' },
      awayTeam: { name: 'Portuguesa', logo: '🟢' },
      homeScore: 2,
      awayScore: 0,
      status: 'FT',
      time: '14:01 - 02:40',
    },
    prediction: {
      type: 'IY 0.5 ÜST',
      minute: "10'",
      score: '0-0',
      result: 'win',
    },
    tier: 'free',
    isFavorite: true,
  },
  {
    id: 'pred2',
    bot: { id: 25, name: 'Smart Striker', stats: '+8C6.1' },
    match: {
      country: 'ENGLAND',
      countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      league: 'PREMIER LEAGUE',
      homeTeam: { name: 'Arsenal', logo: '🔴⚪' },
      awayTeam: { name: 'Chelsea', logo: '🔵' },
      homeScore: 2,
      awayScore: 1,
      status: 'LIVE',
      time: '75',
    },
    prediction: {
      type: '2.5 ALT',
      minute: "20'",
      score: '1-0',
      result: 'pending',
    },
    tier: 'premium',
    isFavorite: false,
  },
  {
    id: 'pred3',
    bot: { id: 42, name: 'Goal Machine', stats: '+12C8.5' },
    match: {
      country: 'SPAIN',
      countryFlag: '🇪🇸',
      league: 'LA LIGA',
      homeTeam: { name: 'Barcelona', logo: '🔵🔴' },
      awayTeam: { name: 'Real Madrid', logo: '⚪' },
      homeScore: 1,
      awayScore: 2,
      status: 'FT',
      time: '19:30',
    },
    prediction: {
      type: '2.5 ÜST',
      minute: "15'",
      score: '0-1',
      result: 'lose',
    },
    tier: 'vip',
    isFavorite: true,
  },
  {
    id: 'pred4',
    bot: { id: 7, name: 'Corner King', stats: '+3C2.8' },
    match: {
      country: 'GERMANY',
      countryFlag: '🇩🇪',
      league: 'BUNDESLIGA',
      homeTeam: { name: 'Bayern', logo: '🔴⚪' },
      awayTeam: { name: 'Dortmund', logo: '🟡⚫' },
      homeScore: 2,
      awayScore: 2,
      status: 'LIVE',
      time: '68',
    },
    prediction: {
      type: 'KORNER 9.5 ÜST',
      minute: "35'",
      score: '1-1',
      result: 'pending',
    },
    tier: 'free',
    isFavorite: false,
  },
  {
    id: 'pred5',
    bot: { id: 33, name: 'Card Master', stats: '+6C5.3' },
    match: {
      country: 'ITALY',
      countryFlag: '🇮🇹',
      league: 'SERIE A',
      homeTeam: { name: 'Juventus', logo: '⚪⚫' },
      awayTeam: { name: 'Inter', logo: '🔵⚫' },
      homeScore: 0,
      awayScore: 1,
      status: 'FT',
      time: '15:00',
    },
    prediction: {
      type: 'KART 3.5 ÜST',
      minute: "25'",
      score: '0-0',
      result: 'win',
    },
    tier: 'premium',
    isFavorite: false,
  },
];

// ============================================================================
// MOCK STATS
// ============================================================================

export const mockStats: MatchStat[] = [
  {
    id: 'stat1',
    label: 'Possession',
    homeValue: 62,
    awayValue: 38,
    showProgress: true,
    highlightHigher: true,
  },
  {
    id: 'stat2',
    label: 'Shots',
    homeValue: 18,
    awayValue: 12,
    showProgress: true,
    highlightHigher: true,
  },
  {
    id: 'stat3',
    label: 'On Target',
    homeValue: 8,
    awayValue: 5,
    showProgress: true,
    highlightHigher: true,
  },
  {
    id: 'stat4',
    label: 'Corners',
    homeValue: 7,
    awayValue: 4,
    showProgress: true,
    highlightHigher: true,
  },
  {
    id: 'stat5',
    label: 'Fouls',
    homeValue: 9,
    awayValue: 14,
    showProgress: true,
    highlightHigher: true,
  },
  {
    id: 'stat6',
    label: 'Yellow Cards',
    homeValue: 2,
    awayValue: 4,
    showProgress: false,
    highlightHigher: false,
  },
  {
    id: 'stat7',
    label: 'Offsides',
    homeValue: 3,
    awayValue: 1,
    showProgress: true,
    highlightHigher: false,
  },
  {
    id: 'stat8',
    label: 'Pass Accuracy',
    homeValue: 87,
    awayValue: 79,
    showProgress: true,
    highlightHigher: true,
  },
];

// ============================================================================
// MOCK EVENTS
// ============================================================================

export const mockEvents: MatchEvent[] = [
  {
    id: 'evt1',
    type: 'kickoff',
    minute: 1,
    team: 'home',
    description: 'Match started',
  },
  {
    id: 'evt2',
    type: 'goal',
    minute: 12,
    team: 'home',
    playerName: 'Lionel Messi',
    description: 'Left foot shot from outside the box to the bottom right corner',
  },
  {
    id: 'evt3',
    type: 'yellow_card',
    minute: 23,
    team: 'away',
    playerName: 'Sergio Ramos',
    description: 'Tactical foul',
  },
  {
    id: 'evt4',
    type: 'goal',
    minute: 35,
    team: 'away',
    playerName: 'Karim Benzema',
    description: 'Header from the center of the box to the bottom left corner',
  },
  {
    id: 'evt5',
    type: 'substitution',
    minute: 45,
    minuteExtra: 2,
    team: 'home',
    playerName: 'Pedri',
    playerOut: 'Gavi',
  },
  {
    id: 'evt6',
    type: 'halftime',
    minute: 45,
    minuteExtra: 3,
    team: 'home',
    description: 'First half ended',
  },
  {
    id: 'evt7',
    type: 'goal',
    minute: 58,
    team: 'home',
    playerName: 'Robert Lewandowski',
    description: 'Right footed shot from very close range following a corner',
  },
  {
    id: 'evt8',
    type: 'var',
    minute: 62,
    team: 'away',
    description: 'VAR Decision: No penalty',
  },
  {
    id: 'evt9',
    type: 'yellow_card',
    minute: 65,
    team: 'away',
    playerName: 'Sergio Ramos',
    description: 'Second yellow card',
  },
  {
    id: 'evt10',
    type: 'red_card',
    minute: 65,
    team: 'away',
    playerName: 'Sergio Ramos',
    description: 'Sent off after second yellow card',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get match by ID
 */
export const getMatchById = (matchId: string | number): MatchItem | undefined => {
  return mockMatches.find((match) => match.id === matchId);
};

/**
 * Get predictions by match ID
 */
export const getPredictionsByMatchId = (matchId: string | number): PredictionItem[] => {
  // In real app, filter by matchId
  return mockPredictions;
};

/**
 * Get stats by match ID
 */
export const getStatsByMatchId = (matchId: string | number): MatchStat[] => {
  // In real app, fetch by matchId
  return mockStats;
};

/**
 * Get events by match ID
 */
export const getEventsByMatchId = (matchId: string | number): MatchEvent[] => {
  // In real app, fetch by matchId
  return mockEvents;
};

/**
 * Get live matches
 */
export const getLiveMatches = (): MatchItem[] => {
  return mockMatches.filter((match) => match.status === 'live' || match.status === 'halftime');
};

/**
 * Get upcoming matches
 */
export const getUpcomingMatches = (): MatchItem[] => {
  return mockMatches.filter((match) => match.status === 'upcoming');
};

/**
 * Get all predictions
 */
export const getAllPredictions = (): PredictionItem[] => {
  return mockPredictions;
};

/**
 * Get top predictions (highest win rate)
 */
export const getTopPredictions = (limit: number = 5): PredictionItem[] => {
  return mockPredictions.slice(0, limit);
};

/**
 * Simulate data refresh (returns new data after delay)
 */
export const refreshData = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Data refreshed');
      resolve();
    }, 1500);
  });
};
