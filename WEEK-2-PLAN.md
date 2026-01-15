# Week 2 Plan: Screen Implementation

## Status: 🟡 PLANNED
**Period**: January 14-20, 2026
**Phase**: 7 - Core Features
**Duration**: 7 days
**Focus**: Real screen implementation using Week 1 components

---

## 🎯 Week 2 Overview

Week 2 focuses on implementing the **core screens** of the GoalGPT mobile app using the component library built in Week 1. This includes the home screen, match detail with 7 tabs, AI bots, live scores, and profile screens.

---

## 📋 Week 2 Objectives

### Day 6: Home Screen Implementation
**Target LOC**: ~600-800 lines

#### Components to Build:
1. **HomeScreen.tsx** - Main home screen container
2. **FeaturedMatches.tsx** - Featured/highlighted matches section
3. **LiveMatchesSection.tsx** - Live matches carousel
4. **UpcomingMatchesSection.tsx** - Upcoming matches list
5. **LeagueFilter.tsx** - League filter chips

#### Features:
- Pull-to-refresh for match updates
- Featured matches carousel (horizontal scroll)
- Live matches section with auto-refresh
- Upcoming matches grouped by date
- League filter chips (top leagues)
- Navigation to match detail
- Empty states (no live matches)
- Loading skeletons
- Error handling

#### API Integration:
- `GET /api/matches/live` - Live matches
- `GET /api/matches/diary?date=` - Today's matches
- WebSocket connection for real-time updates

---

### Day 7: Match Detail Screen (Part 1 - Layout + 3 Tabs)
**Target LOC**: ~800-1000 lines

#### Components to Build:
1. **MatchDetailScreen.tsx** - Main layout with tabs
2. **MatchHeader.tsx** - Match info header (teams, score, status)
3. **TabNavigation.tsx** - 7-tab navigation component

#### Tabs (Part 1):
4. **StatsTab.tsx** - Match statistics (possession, shots, etc.)
5. **EventsTab.tsx** - Match events timeline (goals, cards, subs)
6. **H2HTab.tsx** - Head-to-head history

#### Features:
- Sticky header with match info
- Tab navigation (7 tabs)
- Live data updates via WebSocket
- Pull-to-refresh on each tab
- Loading states per tab
- Empty states (no data available)
- Error handling per tab

#### API Integration:
- `GET /api/matches/:id` - Match detail
- `GET /api/matches/:id/live-stats` - Live statistics
- `GET /api/matches/:id/h2h` - Head-to-head

---

### Day 8: Match Detail Screen (Part 2 - Remaining 4 Tabs)
**Target LOC**: ~800-1000 lines

#### Tabs (Part 2):
1. **StandingsTab.tsx** - League standings table
2. **LineupTab.tsx** - Team lineups (formations)
3. **TrendTab.tsx** - Minute-by-minute trends
4. **AITab.tsx** - AI predictions for this match

#### Features:
- Interactive standings table
- Visual lineup formations (4-4-2, 4-3-3, etc.)
- Minute-by-minute charts (goals, xG, momentum)
- AI prediction cards with confidence scores
- Responsive layouts
- Empty states for missing data

#### API Integration:
- `GET /api/matches/:id/lineup` - Team lineups
- `GET /api/matches/:id/trend` - Minute data
- `GET /api/predictions/match/:id` - AI predictions
- `GET /api/leagues/:id/standings` - Standings

---

### Day 9: AI Bots Screen
**Target LOC**: ~500-600 lines

#### Components to Build:
1. **AIBotsScreen.tsx** - Main bots list screen
2. **BotCard.tsx** - Individual bot card
3. **BotStatsBar.tsx** - Win/lose stats visualization
4. **BotFilterChips.tsx** - Filter by category/sport

#### Features:
- Bot list with avatars and stats
- Win/lose ratio visualization
- Success percentage badges
- Filter by category (Football, Basketball, etc.)
- Sort by success rate
- Navigation to bot detail
- Search functionality
- Empty states (no bots)

#### API Integration:
- `GET /api/bots` - Bot list (needs backend endpoint)
- Bot ranking/sorting logic

---

### Day 10: Live Scores Screen
**Target LOC**: ~600-700 lines

#### Components to Build:
1. **LiveScoresScreen.tsx** - Main live scores container
2. **DateFilter.tsx** - Date picker/slider
3. **LeagueGroupedList.tsx** - Matches grouped by league
4. **LiveScoreCard.tsx** - Compact live score card
5. **MatchStatusFilter.tsx** - Filter by status (live, upcoming, ended)

#### Features:
- Date navigation (yesterday, today, tomorrow)
- Matches grouped by league
- Live match indicators
- Status filters (all, live, upcoming, ended)
- Pull-to-refresh
- Auto-refresh for live matches (WebSocket)
- Infinite scroll (load more dates)
- Empty states (no matches)

#### API Integration:
- `GET /api/matches/diary?date=` - Matches by date
- `GET /api/matches/live` - Live matches
- WebSocket for real-time updates

---

### Day 11: Profile Screen
**Target LOC**: ~700-800 lines

#### Components to Build:
1. **ProfileScreen.tsx** - Main profile container
2. **ProfileHeader.tsx** - User info, avatar, level
3. **XPProgressBar.tsx** - XP progress to next level
4. **AchievementsList.tsx** - Badges/achievements grid
5. **StatisticsSection.tsx** - User statistics
6. **SettingsSection.tsx** - App settings
7. **ThemeToggle.tsx** - Light/dark theme switcher

#### Features:
- User info (name, avatar, level)
- XP progress bar with next level
- Achievements/badges grid
- Statistics (predictions made, accuracy, streak)
- Settings (notifications, language, theme)
- Theme toggle (light/dark)
- Logout button
- Empty states (no achievements yet)

#### API Integration:
- `GET /api/user/profile` - User profile (needs backend)
- `GET /api/user/achievements` - Achievements (needs backend)
- `GET /api/user/stats` - Statistics (needs backend)

---

### Day 12: Navigation & Routing Integration
**Target LOC**: ~300-400 lines

#### Tasks:
1. **Setup Expo Router** - Configure file-based routing
2. **Create Layout.tsx** - App-wide layout with bottom tabs
3. **BottomTabBar.tsx** - Custom bottom navigation
4. **Route Configuration** - All screen routes
5. **Deep Linking** - Match detail deep links
6. **Navigation Guards** - Auth protection

#### Screens/Routes:
```
app/
├── (tabs)/
│   ├── index.tsx              # Home Screen
│   ├── live-scores.tsx        # Live Scores
│   ├── ai-bots.tsx            # AI Bots
│   └── profile.tsx            # Profile
├── match/
│   └── [id].tsx               # Match Detail (with tabs)
└── _layout.tsx                # Root layout
```

#### Features:
- Bottom tab navigation
- Stack navigation for match detail
- Back button handling
- Route transitions
- Deep linking support
- Navigation state persistence

---

### Day 13: Integration & Testing
**Target LOC**: ~200-300 lines (bug fixes, refinements)

#### Tasks:
1. **API Integration Testing** - Test all endpoints
2. **WebSocket Testing** - Real-time updates
3. **Error Handling** - Test error states
4. **Loading States** - Test skeleton screens
5. **Empty States** - Test no data scenarios
6. **Performance** - Optimize re-renders
7. **TypeScript** - Ensure 0 errors
8. **Documentation** - Update progress docs

#### Testing Scenarios:
- Live match updates
- Pull-to-refresh functionality
- Tab navigation smoothness
- Theme switching
- Network errors
- Empty data states
- Loading skeletons
- Deep linking

---

## 📊 Week 2 Metrics (Estimated)

### Files to Create:
- **Total Screens**: 5 main screens
- **Total Tabs**: 7 match detail tabs
- **Total Components**: ~30-35 screen-specific components
- **Total Files**: ~40-45 new files
- **Total LOC**: ~4,500-5,500 lines

### Daily Breakdown (Estimated):
| Day | Focus | Est. LOC | Components | Files |
|-----|-------|----------|------------|-------|
| 6 | Home Screen | 700 | 5 | 6 |
| 7 | Match Detail (Part 1) | 900 | 6 | 7 |
| 8 | Match Detail (Part 2) | 900 | 4 | 5 |
| 9 | AI Bots Screen | 550 | 4 | 5 |
| 10 | Live Scores Screen | 650 | 5 | 6 |
| 11 | Profile Screen | 750 | 7 | 8 |
| 12 | Navigation | 350 | 3 | 4 |
| 13 | Integration | 250 | - | 4 |
| **Total** | **Week 2** | **5,050** | **34** | **45** |

---

## 🎨 Design Principles

### Consistency
- Use Week 1 components throughout
- Consistent spacing (8pt grid)
- Consistent typography (Nohemi + SF Mono)
- Consistent theme colors

### Performance
- Lazy load tabs
- Optimize re-renders with React.memo
- Use FlatList for long lists
- Debounce search inputs

### User Experience
- Pull-to-refresh everywhere
- Skeleton screens for loading
- Friendly empty states
- Clear error messages
- Smooth transitions

### Code Quality
- TypeScript strict mode
- 0 compilation errors
- Proper prop types
- JSDoc comments
- Consistent naming

---

## 🔌 API Endpoints (Week 2)

### Existing Endpoints (Backend Ready):
```
✅ GET /api/matches/live              # Live matches
✅ GET /api/matches/diary?date=       # Matches by date
✅ GET /api/matches/:id               # Match detail
✅ GET /api/matches/:id/h2h           # Head-to-head
✅ GET /api/matches/:id/lineup        # Lineups
✅ GET /api/matches/:id/live-stats    # Live statistics
✅ GET /api/matches/:id/trend         # Minute data
✅ GET /api/predictions/match/:id     # AI predictions
✅ GET /api/leagues/:id/standings     # Standings
```

### New Endpoints Needed (Backend TODO):
```
⚠️ GET /api/bots                      # Bot list
⚠️ GET /api/user/profile              # User profile
⚠️ GET /api/user/achievements         # Achievements
⚠️ GET /api/user/stats                # User stats
```

**Action**: We can implement screens with mock data first, then connect real API when backend is ready.

---

## 📁 Folder Structure (Week 2)

```
src/
├── app/                            # Expo Router screens
│   ├── (tabs)/                     # Tab screens
│   │   ├── _layout.tsx             # Tab layout
│   │   ├── index.tsx               # Home
│   │   ├── live-scores.tsx         # Live Scores
│   │   ├── ai-bots.tsx             # AI Bots
│   │   └── profile.tsx             # Profile
│   ├── match/
│   │   └── [id].tsx                # Match Detail
│   └── _layout.tsx                 # Root layout
│
├── components/
│   ├── home/                       # Home screen components
│   │   ├── FeaturedMatches.tsx
│   │   ├── LiveMatchesSection.tsx
│   │   └── LeagueFilter.tsx
│   ├── match-detail/               # Match detail components
│   │   ├── MatchHeader.tsx
│   │   ├── TabNavigation.tsx
│   │   └── tabs/
│   │       ├── StatsTab.tsx
│   │       ├── EventsTab.tsx
│   │       ├── H2HTab.tsx
│   │       ├── StandingsTab.tsx
│   │       ├── LineupTab.tsx
│   │       ├── TrendTab.tsx
│   │       └── AITab.tsx
│   ├── ai-bots/                    # AI bots components
│   │   ├── BotCard.tsx
│   │   └── BotStatsBar.tsx
│   ├── live-scores/                # Live scores components
│   │   ├── DateFilter.tsx
│   │   ├── LeagueGroupedList.tsx
│   │   └── LiveScoreCard.tsx
│   └── profile/                    # Profile components
│       ├── ProfileHeader.tsx
│       ├── XPProgressBar.tsx
│       ├── AchievementsList.tsx
│       └── StatisticsSection.tsx
│
├── hooks/                          # Custom hooks
│   ├── useMatches.ts               # Match data hook
│   ├── useMatchDetail.ts           # Match detail hook
│   └── useWebSocket.ts             # WebSocket hook (existing)
│
└── utils/                          # Utilities
    ├── formatters.ts               # Date/time formatters
    └── constants.ts                # App constants
```

---

## 🎯 Success Criteria (Week 2)

### Functional Requirements:
- ✅ All 5 main screens implemented and navigable
- ✅ Match detail with all 7 tabs working
- ✅ Real-time updates via WebSocket
- ✅ Pull-to-refresh on all screens
- ✅ Theme switching works everywhere
- ✅ Navigation flows smoothly
- ✅ Deep linking to match detail

### Quality Requirements:
- ✅ 0 TypeScript errors
- ✅ All screens use Week 1 components
- ✅ Consistent design language
- ✅ Proper loading states
- ✅ Proper empty states
- ✅ Proper error handling
- ✅ Performance optimized (no lag)

### Documentation:
- ✅ Daily progress reports (DAY-6 to DAY-13)
- ✅ Week 2 summary document
- ✅ Component documentation
- ✅ API integration notes

---

## 🚀 Ready to Start Week 2

### Prerequisites Checklist:
- ✅ Week 1 components complete (5,585 LOC)
- ✅ Theme system operational
- ✅ TypeScript setup complete
- ✅ 0 compilation errors
- ✅ Backend API endpoints available
- ✅ WebSocket connection working

### Next Steps:
1. Start Day 6 (Home Screen)
2. Create `src/app/(tabs)/index.tsx`
3. Create home screen components
4. Integrate with live matches API
5. Test with real data

---

**Status**: 🟡 READY TO START
**Previous Phase**: Week 1 Complete (5,585 LOC)
**Current Phase**: Week 2 - Screen Implementation
**Prepared by**: Claude Sonnet 4.5
**Date**: 2026-01-13
