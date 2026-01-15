// src/api/index.ts
// GoalGPT Mobile App - API Exports

// Re-export all API modules
// Default export for convenience
import apiClient from './client';

export * from './client';
export * from './auth.api';
export * from './matches.api';
export * from './xp.api';
export * from './credits.api';
export * from './badges.api';
export * from './referrals.api';
export * from './leagues.api';
export * from './teams.api';
export * from './news.api';
export * from './predictions.api';
export * from './user.api';
export default apiClient;
