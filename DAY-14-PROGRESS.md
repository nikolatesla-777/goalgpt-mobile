# Day 14 Progress - API Client & Service Layer

**Date:** 2026-01-13
**Week:** Week 3 - Backend Integration & State Management (Days 14-20)
**Focus:** API Client Configuration, Service Layer, TypeScript Types

---

## Overview

Day 14 establishes the foundation for backend integration by reviewing and extending the existing API infrastructure. The mobile app already had a sophisticated API client with token management and refresh logic. Today's work focused on:
- Reviewing existing API architecture (client, interceptors, token management)
- Creating missing API modules (Leagues, Teams, News, Predictions, User)
- Ensuring comprehensive TypeScript type safety
- Organizing all API exports for easy consumption

---

## Existing Infrastructure (Already Built)

### 1. API Client (`src/api/client.ts`)
**Status:** ✅ Already Implemented (199 lines)

**Key Features:**
- Axios instance with automatic base URL detection
- Token management using expo-secure-store
- Automatic token injection via request interceptor
- Automatic token refresh on 401 errors
- Comprehensive error handling
- TypeScript error types and utilities

**Token Management:**
```typescript
export const TokenStorage = {
  async setTokens(accessToken: string, refreshToken: string)
  async getAccessToken(): Promise<string | null>
  async getRefreshToken(): Promise<string | null>
  async clearTokens(): Promise<void>
}
```

**Interceptors:**
- **Request:** Adds Authorization header with access token
- **Response:** Handles 401 errors, refreshes tokens, retries failed requests

**Technical Highlights:**
- Prevents multiple simultaneous token refresh attempts
- Subscriber pattern for queued requests during refresh
- Automatic cleanup on refresh failure

---

### 2. API Endpoints (`src/constants/api.ts`)
**Status:** ✅ Already Implemented (126 lines)

Comprehensive endpoint definitions for:
- Authentication (Google, Apple, Phone, Refresh, Logout)
- XP System (Leaderboard, Transactions, Login Streak)
- Credits System (Transactions, Ad Rewards, Purchase)
- Badges (All, My Badges, Claim, Unclaimed)
- Referrals (My Code, Apply, Stats)
- Daily Rewards
- Matches (Live, Diary, Detail, H2H, Lineup, Stats, Trend)
- Teams (Detail, Fixtures, Standings, Players)
- Competitions (Detail, Fixtures, Standings)
- Predictions (Matched, For Match)
- Comments (CRUD operations)
- Blog/News (List, Detail)
- Partners
- WebSocket URL

---

### 3. App Configuration (`src/constants/config.ts`)
**Status:** ✅ Already Implemented (166 lines)

Configuration for:
- API timeout (30s)
- Pagination (page sizes)
- Gamification (XP levels, rewards, daily rewards)
- Credits economy
- WebSocket settings
- Cache TTL values
- Animation durations
- Haptic feedback
- Feature flags
- Error messages

---

### 4. Existing API Modules

#### Auth API (`src/api/auth.api.ts`)
**Status:** ✅ Already Implemented (154 lines)

**Features:**
- Google Sign In
- Apple Sign In
- Phone Login
- Get Current User
- Logout
- isAuthenticated check

**Types:**
- User
- AuthTokens
- AuthResponse
- DeviceInfo

---

#### Matches API (`src/api/matches.api.ts`)
**Status:** ✅ Already Implemented (179 lines)

**Features:**
- Get Live Matches
- Get Matches by Date (Diary)
- Get Match Detail
- Get Head-to-Head
- Get Match Lineup
- Get Live Stats
- Get Match Trend (minute-by-minute)

**Types:**
- Match
- MatchDetail
- H2HMatch
- LineupPlayer
- Lineup
- LiveStats
- TrendData

---

#### XP API (`src/api/xp.api.ts`)
**Status:** ✅ Already Implemented

Gamification system endpoints for experience points and levels.

---

#### Credits API (`src/api/credits.api.ts`)
**Status:** ✅ Already Implemented

In-app currency management endpoints.

---

#### Badges API (`src/api/badges.api.ts`)
**Status:** ✅ Already Implemented

Achievement/badge system endpoints.

---

#### Referrals API (`src/api/referrals.api.ts`)
**Status:** ✅ Already Implemented

Referral program endpoints.

---

## New API Modules Created Today

### 1. Leagues/Competitions API (`src/api/leagues.api.ts`)
**Status:** ✅ Created (99 lines)

**Features:**
- Get Competition Detail
- Get Competition Standings
- Get Competition Fixtures (with optional matchday filter)

**Types:**
```typescript
export interface Competition {
  id: number;
  name: string;
  logo: string;
  country: string;
  type: string;
}

export interface CompetitionDetail extends Competition {
  season: string;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  totalMatchdays: number;
}

export interface Standing {
  position: number;
  team: { id: number; name: string; logo: string };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
}

export interface CompetitionFixture {
  id: number;
  homeTeam: { id: number; name: string; logo: string };
  awayTeam: { id: number; name: string; logo: string };
  kickoffTime: string;
  statusId: number;
  statusName: string;
  homeScore: number | null;
  awayScore: number | null;
  matchday: number;
}
```

**API Calls:**
```typescript
getCompetitionDetail(competitionId: string): Promise<CompetitionDetail>
getCompetitionStandings(competitionId: string): Promise<Standing[]>
getCompetitionFixtures(competitionId: string, matchday?: number): Promise<CompetitionFixture[]>
```

---

### 2. Teams API (`src/api/teams.api.ts`)
**Status:** ✅ Created (141 lines)

**Features:**
- Get Team Detail
- Get Team Fixtures
- Get Team Players
- Get Team Standings

**Types:**
```typescript
export interface Team {
  id: number;
  name: string;
  logo: string;
  country: string;
  founded: number;
  venue: string;
}

export interface TeamDetail extends Team {
  coach: string;
  website: string;
  colors: { primary: string; secondary: string };
}

export interface TeamFixture {
  id: number;
  homeTeam: { id: number; name: string; logo: string };
  awayTeam: { id: number; name: string; logo: string };
  competition: { id: number; name: string; logo: string };
  kickoffTime: string;
  statusId: number;
  statusName: string;
  homeScore: number | null;
  awayScore: number | null;
}

export interface TeamPlayer {
  id: number;
  name: string;
  photo: string;
  position: string;
  number: number;
  age: number;
  nationality: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
}

export interface TeamStanding {
  position: number;
  team: { id: number; name: string; logo: string };
  competition: { id: number; name: string; logo: string };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
}
```

**API Calls:**
```typescript
getTeamDetail(teamId: string): Promise<TeamDetail>
getTeamFixtures(teamId: string): Promise<TeamFixture[]>
getTeamPlayers(teamId: string): Promise<TeamPlayer[]>
getTeamStandings(teamId: string): Promise<TeamStanding[]>
```

---

### 3. News/Blog API (`src/api/news.api.ts`)
**Status:** ✅ Created (99 lines)

**Features:**
- Get News List (with pagination and category filter)
- Get News Article by Slug
- Get News Categories
- Get Latest News (shortcut)

**Types:**
```typescript
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  author: { name: string; avatar: string };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number; // in minutes
  views: number;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}
```

**API Calls:**
```typescript
getNewsList(page: number, limit: number, category?: string): Promise<{
  articles: NewsArticle[];
  total: number;
  hasMore: boolean;
}>
getNewsArticle(slug: string): Promise<NewsArticle>
getNewsCategories(): Promise<NewsCategory[]>
getLatestNews(limit: number): Promise<NewsArticle[]>
```

---

### 4. Predictions API (`src/api/predictions.api.ts`)
**Status:** ✅ Created (124 lines)

**Features:**
- Get Matched Predictions (upcoming matches)
- Get Predictions for Specific Match
- Purchase Premium Prediction
- Get User Prediction History

**Types:**
```typescript
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
    homeTeam: { name: string; logo: string };
    awayTeam: { name: string; logo: string };
    kickoffTime: string;
    competition: { name: string; logo: string };
  };
  predictions: Prediction[];
  summary: {
    homeWinProbability: number;
    drawProbability: number;
    awayWinProbability: number;
    predictedScore: { home: number; away: number };
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
```

**API Calls:**
```typescript
getMatchedPredictions(): Promise<MatchPrediction[]>
getMatchPredictions(matchId: string): Promise<MatchPrediction>
purchasePremiumPrediction(predictionId: string): Promise<{ success: boolean; prediction: Prediction }>
getUserPredictionHistory(page: number, limit: number): Promise<{
  predictions: UserPredictionHistory[];
  total: number;
  hasMore: boolean;
}>
```

---

### 5. User Profile API (`src/api/user.api.ts`)
**Status:** ✅ Created (149 lines)

**Features:**
- Get User Profile
- Get User Stats
- Update User Profile
- Upload Avatar
- Get User Settings
- Update User Settings
- Change Password
- Delete Account

**Types:**
```typescript
export interface UserStats {
  totalPredictions: number;
  correctPredictions: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  favoriteLeague?: string;
  totalMatchesWatched: number;
  totalBotInteractions: number;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  liveScoreNotifications: boolean;
  predictionReminders: boolean;
  autoPlayVideos: boolean;
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface UpdateProfileData {
  name?: string;
  username?: string;
  profilePhotoUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
```

**API Calls:**
```typescript
getUserProfile(): Promise<User>
getUserStats(userId?: string): Promise<UserStats>
updateUserProfile(data: UpdateProfileData): Promise<User>
uploadAvatar(imageUri: string): Promise<{ url: string }>
getUserSettings(): Promise<UserSettings>
updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings>
changePassword(data: ChangePasswordData): Promise<{ success: boolean }>
deleteAccount(password: string): Promise<{ success: boolean }>
```

---

## Updated Files

### API Index (`src/api/index.ts`)
**Status:** ✅ Updated

Added exports for new modules:
```typescript
export * from './leagues.api';
export * from './teams.api';
export * from './news.api';
export * from './predictions.api';
export * from './user.api';
```

---

## Code Metrics

### API Modules Summary
| Module | Lines | Status | Functions | Types |
|--------|-------|--------|-----------|-------|
| client.ts | 199 | Existing | Token mgmt + interceptors | ApiError, ApiResponse |
| auth.api.ts | 154 | Existing | 6 | User, AuthTokens, AuthResponse, DeviceInfo |
| matches.api.ts | 179 | Existing | 7 | Match, MatchDetail, H2HMatch, Lineup, LiveStats, TrendData |
| xp.api.ts | - | Existing | Multiple | XP types |
| credits.api.ts | - | Existing | Multiple | Credit types |
| badges.api.ts | - | Existing | Multiple | Badge types |
| referrals.api.ts | - | Existing | Multiple | Referral types |
| **leagues.api.ts** | **99** | **New** | **3** | **Competition, Standing, CompetitionFixture** |
| **teams.api.ts** | **141** | **New** | **4** | **Team, TeamDetail, TeamFixture, TeamPlayer, TeamStanding** |
| **news.api.ts** | **99** | **New** | **4** | **NewsArticle, NewsCategory** |
| **predictions.api.ts** | **124** | **New** | **4** | **Prediction, MatchPrediction, UserPredictionHistory** |
| **user.api.ts** | **149** | **New** | **8** | **UserStats, UserSettings, UpdateProfileData, ChangePasswordData** |
| **TOTAL NEW** | **612** | - | **23** | **16** |

### Constants
| File | Lines | Purpose |
|------|-------|---------|
| api.ts | 126 | API endpoint definitions |
| config.ts | 166 | App configuration |

---

## TypeScript Compilation
```bash
npx tsc --noEmit
✅ 0 errors
```

All new modules compile without errors and maintain strict type safety.

---

## API Architecture

### Request Flow
```
Component
  ↓
API Function (e.g., getMatchDetail)
  ↓
apiClient.get/post/put/delete
  ↓
Request Interceptor (add token)
  ↓
HTTP Request → Backend
  ↓
Response Interceptor (handle 401, refresh token)
  ↓
Return Data or Throw Error
```

### Token Refresh Flow
```
Request → 401 Error
  ↓
Is refresh in progress?
  ├─ Yes → Queue request, wait for new token
  └─ No → Start refresh
      ↓
    Get refresh token from SecureStore
      ↓
    POST /api/auth/refresh
      ├─ Success → Save new tokens, retry all queued requests
      └─ Failure → Clear tokens, throw error (force re-login)
```

### Error Handling
```typescript
try {
  const response = await apiClient.get(url);
  return response.data.data;
} catch (error) {
  throw handleApiError(error);
}

// handleApiError returns:
{
  message: string;  // User-friendly error message
  code?: string;    // Error code
  status?: number;  // HTTP status
  data?: any;       // Additional error data
}
```

---

## Integration Points

### With Authentication (Day 15)
These API modules will be used by AuthContext:
- `auth.api.ts` - Login, logout, get current user
- `user.api.ts` - User profile and settings

### With Matches Screen (Day 16)
These API modules will power the Matches tab:
- `matches.api.ts` - Live matches, match details
- `leagues.api.ts` - Competition data
- `teams.api.ts` - Team information

### With Profile Screen (Day 17)
These API modules will power the Profile tab:
- `user.api.ts` - Profile, stats, settings
- `auth.api.ts` - User data

### With News & Predictions (Future)
- `news.api.ts` - News articles
- `predictions.api.ts` - AI predictions

---

## Features Implemented

### API Client
✅ Axios instance with base URL
✅ Request/response interceptors
✅ Automatic token injection
✅ Automatic token refresh on 401
✅ Error handling with user-friendly messages
✅ TypeScript error types

### Token Management
✅ Secure storage with expo-secure-store
✅ Access token + refresh token
✅ Token refresh logic
✅ Prevent multiple simultaneous refreshes
✅ Queue requests during refresh
✅ Automatic cleanup on failure

### API Modules
✅ Authentication (Google, Apple, Phone)
✅ Matches (Live, Detail, H2H, Lineup, Stats, Trend)
✅ Competitions/Leagues (Detail, Standings, Fixtures)
✅ Teams (Detail, Fixtures, Players, Standings)
✅ News/Blog (List, Detail, Categories)
✅ Predictions (Matched, Match-specific, Purchase, History)
✅ User Profile (Profile, Stats, Settings, Avatar, Password)
✅ XP System (existing)
✅ Credits System (existing)
✅ Badges (existing)
✅ Referrals (existing)

---

## Type Safety

All API modules include comprehensive TypeScript types:
- Request parameters
- Response data
- Error types
- Optional vs required fields
- Nullable fields (e.g., `homeScore: number | null`)

**Example:**
```typescript
export interface Match {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  statusId: number;
  kickoffTime: string;
  homeScore: number | null;  // Nullable for upcoming matches
  awayScore: number | null;
}
```

---

## Next Steps (Day 15)

Tomorrow we'll build on this API infrastructure by creating:

1. **AuthContext** - Global authentication state
2. **useAuth Hook** - Easy access to auth state and methods
3. **Login Integration** - Connect login screen to API
4. **Register Integration** - Connect register screen to API
5. **Protected Routes** - Automatic redirect for unauthenticated users
6. **Auto-login** - Check token on app start
7. **Session Management** - Handle token expiry

The API modules created today provide the foundation for all authentication and data fetching in the app.

---

## Success Criteria

✅ API client configured and working
✅ Request/response interceptors implemented
✅ Token management with refresh logic
✅ 11 API modules created/reviewed
✅ 23 new API functions
✅ 16 new TypeScript interfaces
✅ Comprehensive error handling
✅ TypeScript: 0 compilation errors
✅ All exports organized in index.ts

---

## Summary

Day 14 successfully established a robust API infrastructure:

**Reviewed Existing:**
- Sophisticated API client with token refresh
- Comprehensive endpoint definitions
- App configuration
- 6 existing API modules (Auth, Matches, XP, Credits, Badges, Referrals)

**Created New:**
- 5 new API modules (Leagues, Teams, News, Predictions, User)
- 612 lines of new code
- 23 new API functions
- 16 new TypeScript interfaces

**Technical Achievements:**
- 0 TypeScript errors
- Full type safety across all modules
- Consistent error handling
- Ready for AuthContext integration (Day 15)

**Status:** ✅ Day 14 Complete - Ready for Day 15 (Authentication Context)

---

**Next Day:** Day 15 - Authentication Context & Global State Management
