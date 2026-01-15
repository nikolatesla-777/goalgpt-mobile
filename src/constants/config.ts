// src/constants/config.ts
// GoalGPT Mobile App - Application Configuration

import Constants from 'expo-constants';

export const APP_CONFIG = {
  // App Identity
  APP_NAME: 'GoalGPT',
  APP_VERSION: Constants.expoConfig?.version || '2.0.0',
  APP_SLUG: 'goalgpt-mobile',

  // API Configuration
  API_TIMEOUT: 30000, // 30 seconds
  API_RETRY_ATTEMPTS: 3,
  API_RETRY_DELAY: 1000, // 1 second

  // Pagination
  PAGE_SIZE: 20,
  MATCHES_PAGE_SIZE: 50,
  COMMENTS_PAGE_SIZE: 20,
  TRANSACTIONS_PAGE_SIZE: 50,

  // Gamification - Ad Rewards
  MAX_ADS_PER_DAY: 10,
  AD_REWARD_AMOUNT: 5, // credits per ad
  MAX_DAILY_CREDITS_FROM_ADS: 50,

  // Gamification - XP System
  XP_LEVELS: {
    bronze: { min: 0, max: 499, name: 'Bronz', color: '#CD7F32' },
    silver: { min: 500, max: 1999, name: 'Gümüş', color: '#C0C0C0' },
    gold: { min: 2000, max: 4999, name: 'Altın', color: '#FFD700' },
    platinum: { min: 5000, max: 9999, name: 'Platin', color: '#E5E4E2' },
    diamond: { min: 10000, max: 24999, name: 'Elmas', color: '#B9F2FF' },
    vip_elite: { min: 25000, max: Infinity, name: 'VIP Elite', color: '#9C27B0' },
  },

  // Gamification - XP Rewards
  XP_REWARDS: {
    DAILY_LOGIN: 10,
    PREDICTION_CORRECT: 25,
    REFERRAL_SIGNUP: 50,
    BADGE_UNLOCK: 100,
    MATCH_COMMENT: 5,
    COMMENT_LIKE: 2,
    SUBSCRIPTION_PURCHASE: 500,
    AD_WATCH: 5,
    STREAK_BONUS_7: 100,
    STREAK_BONUS_30: 500,
  },

  // Gamification - Daily Rewards (7-day cycle)
  DAILY_REWARDS: [
    { day: 1, credits: 10, xp: 0, type: 'credits' },
    { day: 2, credits: 15, xp: 0, type: 'credits' },
    { day: 3, credits: 20, xp: 0, type: 'credits' },
    { day: 4, credits: 25, xp: 0, type: 'credits' },
    { day: 5, credits: 30, xp: 0, type: 'credits' },
    { day: 6, credits: 40, xp: 0, type: 'credits' },
    { day: 7, credits: 100, xp: 50, type: 'jackpot' }, // Jackpot day
  ],

  // Gamification - Badge Rarities
  BADGE_RARITIES: {
    common: { name: 'Yaygın', color: '#9E9E9E', reward_credits: 5 },
    rare: { name: 'Nadir', color: '#2196F3', reward_credits: 25 },
    epic: { name: 'Epik', color: '#9C27B0', reward_credits: 50 },
    legendary: { name: 'Efsanevi', color: '#FFD700', reward_credits: 100 },
  },

  // Credits Economy
  CREDIT_COSTS: {
    VIP_PREDICTION: 10,
  },

  CREDIT_REWARDS: {
    AD_REWARD: 5,
    REFERRAL_SIGNUP: 10,
    REFERRAL_FIRST_LOGIN: 50,
    REFERRAL_SUBSCRIPTION: 200,
    BADGE_COMMON: 5,
    BADGE_RARE: 25,
    BADGE_EPIC: 50,
    BADGE_LEGENDARY: 100,
  },

  // WebSocket Configuration
  WS_RECONNECT_INTERVAL: 5000, // 5 seconds
  WS_MAX_RECONNECT_ATTEMPTS: 10,
  WS_PING_INTERVAL: 30000, // 30 seconds

  // Cache Configuration
  CACHE_TTL: {
    MATCHES_LIVE: 30000, // 30 seconds
    MATCHES_DIARY: 60000, // 1 minute
    MATCH_DETAIL: 30000, // 30 seconds
    TEAM_INFO: 300000, // 5 minutes
    COMPETITION_INFO: 300000, // 5 minutes
    USER_PROFILE: 60000, // 1 minute
    XP_LEADERBOARD: 60000, // 1 minute
  },

  // UI Configuration
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  HAPTIC_FEEDBACK: {
    ENABLED: true,
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
  },

  // Deep Linking
  DEEP_LINK_SCHEME: 'goalgpt',
  DEEP_LINK_PREFIX: 'goalgpt://',

  // Social Features
  MAX_COMMENT_LENGTH: 1000,
  MIN_COMMENT_LENGTH: 3,
  COMMENTS_REFRESH_INTERVAL: 30000, // 30 seconds

  // Match Filters
  DEFAULT_MATCH_FILTERS: {
    showLive: true,
    showScheduled: true,
    showFinished: false,
    competitions: [],
  },

  // Subscription Tiers
  SUBSCRIPTION_TIERS: {
    FREE: 'free',
    VIP: 'vip',
  },

  // Feature Flags
  FEATURES: {
    AI_PREDICTIONS: true,
    MATCH_COMMENTS: true,
    XP_SYSTEM: true,
    CREDITS_SYSTEM: true,
    BADGES: true,
    REFERRALS: true,
    PARTNER_PROGRAM: true,
    DAILY_REWARDS: true,
    BLOG: true,
    PUSH_NOTIFICATIONS: true,
  },

  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'İnternet bağlantısı bulunamadı',
    SERVER_ERROR: 'Sunucu hatası, lütfen tekrar deneyin',
    UNAUTHORIZED: 'Oturum süreniz doldu, lütfen tekrar giriş yapın',
    INSUFFICIENT_CREDITS: 'Yetersiz kredi bakiyesi',
    AD_LIMIT_REACHED: 'Günlük reklam limiti aşıldı',
    PREDICTION_ALREADY_PURCHASED: 'Bu tahmin zaten satın alındı',
  },
};

export default APP_CONFIG;
