// src/constants/api.ts
// GoalGPT Mobile App - API Endpoints

import Constants from 'expo-constants';

// Get WebSocket URL from environment
const WS_URL = Constants.expoConfig?.extra?.wsUrl || 'ws://142.93.103.128:3000/ws';

console.log('🔌 WebSocket URL configured:', WS_URL);

// API endpoints are now relative paths (baseURL is set in apiClient)
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    GOOGLE_SIGNIN: '/api/auth/google/signin',
    APPLE_SIGNIN: '/api/auth/apple/signin',
    PHONE_LOGIN: '/api/auth/phone/login',
    REFRESH_TOKEN: '/api/auth/refresh',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
  },

  // XP System
  XP: {
    ME: '/api/xp/me',
    TRANSACTIONS: '/api/xp/transactions',
    LEADERBOARD: '/api/xp/leaderboard',
    LOGIN_STREAK: '/api/xp/login-streak',
    GRANT: '/api/xp/grant',
  },

  // Credits
  CREDITS: {
    ME: '/api/credits/me',
    TRANSACTIONS: '/api/credits/transactions',
    AD_REWARD: '/api/credits/ad-reward',
    PURCHASE_PREDICTION: '/api/credits/purchase-prediction',
    DAILY_STATS: '/api/credits/daily-stats',
    GRANT: '/api/credits/grant',
    SPEND: '/api/credits/spend',
    REFUND: '/api/credits/refund',
  },

  // Badges
  BADGES: {
    ALL: '/api/badges',
    MY_BADGES: '/api/badges/my-badges',
    CLAIM: '/api/badges/claim',
    UNCLAIMED: '/api/badges/unclaimed',
  },

  // Referrals
  REFERRALS: {
    MY_CODE: '/api/referrals/my-code',
    APPLY_CODE: '/api/referrals/apply',
    MY_REFERRALS: '/api/referrals/my-referrals',
    STATS: '/api/referrals/stats',
  },

  // Daily Rewards
  DAILY_REWARDS: {
    STATUS: '/api/daily-rewards/status',
    CLAIM: '/api/daily-rewards/claim',
    HISTORY: '/api/daily-rewards/history',
  },

  // Matches (existing endpoints)
  MATCHES: {
    LIVE: '/api/matches/live',
    DIARY: '/api/matches/diary',
    DETAIL: (id: string) => `/api/matches/${id}`,
    H2H: (id: string) => `/api/matches/${id}/h2h`,
    LINEUP: (id: string) => `/api/matches/${id}/lineup`,
    LIVE_STATS: (id: string) => `/api/matches/${id}/live-stats`,
    TREND: (id: string) => `/api/matches/${id}/trend`,
  },

  // Teams
  TEAMS: {
    DETAIL: (id: string) => `/api/teams/${id}`,
    FIXTURES: (id: string) => `/api/teams/${id}/fixtures`,
    STANDINGS: (id: string) => `/api/teams/${id}/standings`,
    PLAYERS: (id: string) => `/api/teams/${id}/players`,
  },

  // Competitions
  COMPETITIONS: {
    DETAIL: (id: string) => `/api/leagues/${id}`,
    FIXTURES: (id: string) => `/api/leagues/${id}/fixtures`,
    STANDINGS: (id: string) => `/api/leagues/${id}/standings`,
  },

  // Predictions
  PREDICTIONS: {
    MATCHED: '/api/predictions/matched',
    FOR_MATCH: (matchId: string) => `/api/predictions/match/${matchId}`,
  },

  // Comments
  COMMENTS: {
    FOR_MATCH: (matchId: string) => `/api/comments/match/${matchId}`,
    CREATE: '/api/comments',
    UPDATE: (id: string) => `/api/comments/${id}`,
    DELETE: (id: string) => `/api/comments/${id}`,
    LIKE: (id: string) => `/api/comments/${id}/like`,
    UNLIKE: (id: string) => `/api/comments/${id}/unlike`,
    REPORT: (id: string) => `/api/comments/${id}/report`,
  },

  // Blog
  BLOG: {
    LIST: '/api/blog',
    DETAIL: (slug: string) => `/api/blog/${slug}`,
  },

  // Partners
  PARTNERS: {
    APPLY: '/api/partners/apply',
    DASHBOARD: '/api/partners/dashboard',
    ANALYTICS: '/api/partners/analytics',
  },

  // Notifications
  NOTIFICATIONS: {
    REGISTER_TOKEN: '/api/notifications/register-token',
    UNREGISTER_TOKEN: '/api/notifications/unregister-token',
    PREFERENCES: '/api/notifications/preferences',
    UPDATE_PREFERENCES: '/api/notifications/preferences',
    HISTORY: '/api/notifications/history',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
  },

  // WebSocket
  WS: WS_URL,
};

export default API_ENDPOINTS;
