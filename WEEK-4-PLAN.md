# Week 4 Implementation Plan - Advanced Features & Production Readiness

**Duration:** Days 21-27 (7 days)
**Focus:** Monitoring, WebSocket, Push Notifications, Testing, Optimization, Deployment Prep
**Goal:** Production-ready app with advanced features, monitoring, and deployment pipeline

---

## Week 4 Overview

Week 3 delivered a fully functional app with backend integration, state management, caching, and error handling. Week 4 focuses on production readiness, advanced features, automated testing, and deployment preparation.

### Main Objectives

1. **Monitoring & Analytics** - Error tracking, performance monitoring, user analytics
2. **Real-Time Features** - WebSocket integration for live updates
3. **Push Notifications** - Firebase Cloud Messaging setup
4. **Automated Testing** - Unit tests, integration tests, E2E tests
5. **Performance Optimization** - Code splitting, lazy loading, bundle optimization
6. **Deployment Preparation** - App store assets, beta testing, CI/CD
7. **Advanced Features** - Deep linking, share functionality, background sync

---

## Day-by-Day Breakdown

### Day 21: Error Tracking & Analytics Setup

**Focus:** Production monitoring infrastructure

#### Deliverables
- [ ] Sentry integration for error tracking
- [ ] Sentry source maps configuration
- [ ] Firebase Analytics integration
- [ ] Custom event tracking
- [ ] Performance monitoring setup
- [ ] Crash reporting configuration
- [ ] Analytics dashboard setup

#### Files to Create/Update
```
src/services/
├── analytics.service.ts    # Analytics wrapper
└── monitoring.service.ts   # Sentry wrapper

src/utils/
└── tracking.ts            # Event tracking utilities

src/config/
├── sentry.config.ts       # Sentry configuration
└── analytics.config.ts    # Analytics configuration
```

#### Implementation Details

**Sentry Setup:**
```typescript
// src/config/sentry.config.ts
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  enableAutoSessionTracking: true,
  tracesSampleRate: 1.0,
});
```

**Analytics Service:**
```typescript
// src/services/analytics.service.ts
export const analytics = {
  logEvent: (eventName: string, params?: object) => {
    // Firebase Analytics
  },
  logScreenView: (screenName: string) => {
    // Track screen views
  },
  setUserId: (userId: string) => {
    // Set user ID for tracking
  },
};
```

#### Success Criteria
- ✅ Errors automatically logged to Sentry
- ✅ User actions tracked in Firebase Analytics
- ✅ Performance metrics collected
- ✅ Crash reports with stack traces
- ✅ Dashboard showing real-time data

---

### Day 22: WebSocket Integration

**Focus:** Real-time data updates without polling

#### Deliverables
- [ ] WebSocket client implementation
- [ ] Connection management (connect/disconnect)
- [ ] Auto-reconnection logic
- [ ] Event handling system
- [ ] Live score updates via WebSocket
- [ ] Match event streaming
- [ ] Optimistic UI updates

#### Files to Create/Update
```
src/services/
├── websocket.service.ts    # WebSocket client
└── liveMatch.service.ts    # Live match subscriptions

src/hooks/
├── useWebSocket.ts         # WebSocket hook
└── useLiveMatch.ts         # Live match updates hook

src/context/
└── WebSocketContext.tsx    # Global WebSocket state
```

#### Implementation Details

**WebSocket Service:**
```typescript
// src/services/websocket.service.ts
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onopen = this.handleOpen;
    this.ws.onmessage = this.handleMessage;
    this.ws.onerror = this.handleError;
    this.ws.onclose = this.handleClose;
  }

  subscribe(channel: string, callback: (data: any) => void) {
    // Subscribe to specific channels
  }

  // Auto-reconnect logic
  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => this.connect(this.url), 1000 * Math.pow(2, this.reconnectAttempts));
      this.reconnectAttempts++;
    }
  }
}
```

**Live Match Hook:**
```typescript
// src/hooks/useLiveMatch.ts
export const useLiveMatch = (matchId: string) => {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(`match:${matchId}`, (data) => {
      // Update match data in real-time
    });

    return unsubscribe;
  }, [matchId]);
};
```

#### Success Criteria
- ✅ WebSocket connects successfully
- ✅ Real-time score updates (no polling)
- ✅ Auto-reconnects on disconnect
- ✅ Event streaming works smoothly
- ✅ Lower battery consumption than polling

---

### Day 23: Push Notifications

**Focus:** Firebase Cloud Messaging integration

#### Deliverables
- [ ] Firebase Cloud Messaging setup
- [ ] Push notification permissions
- [ ] Notification token management
- [ ] Local notification handling
- [ ] Background notification handling
- [ ] Notification categories/types
- [ ] Deep linking from notifications

#### Files to Create/Update
```
src/services/
├── notifications.service.ts    # FCM wrapper
└── notificationHandler.ts      # Handle notification taps

src/hooks/
└── useNotifications.ts         # Notification permissions hook

src/utils/
└── notificationUtils.ts        # Notification helpers
```

#### Implementation Details

**Notification Service:**
```typescript
// src/services/notifications.service.ts
import * as Notifications from 'expo-notifications';

export const notificationService = {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async getToken() {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  },

  async scheduleLocal(title: string, body: string, data?: object) {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: null, // Immediately
    });
  },
};
```

**Notification Types:**
- **Live Score Updates**: "Goal scored! Team A 2-1 Team B"
- **Match Starting Soon**: "Your predicted match starts in 15 minutes"
- **Prediction Result**: "Your prediction was correct! +10 points"
- **AI Bot Alert**: "AI Bot X has a new high-confidence prediction"

#### Success Criteria
- ✅ Push notifications work on iOS and Android
- ✅ Permissions requested appropriately
- ✅ Token synced with backend
- ✅ Notifications deep link to correct screen
- ✅ Background notifications handled

---

### Day 24: Unit Testing Setup

**Focus:** Automated testing infrastructure

#### Deliverables
- [ ] Jest configuration
- [ ] React Testing Library setup
- [ ] Test utilities and helpers
- [ ] Unit tests for utilities (cache, errorHandler)
- [ ] Unit tests for hooks (useAuth, useCachedData)
- [ ] Unit tests for components (Toast, ErrorBoundary)
- [ ] Integration tests for API client
- [ ] Test coverage reporting

#### Files to Create
```
__tests__/
├── utils/
│   ├── cache.test.ts
│   ├── errorHandler.test.ts
│   └── cacheManager.test.ts
├── hooks/
│   ├── useAuth.test.tsx
│   ├── useCachedData.test.tsx
│   └── useNetworkStatus.test.tsx
├── components/
│   ├── Toast.test.tsx
│   └── ErrorBoundary.test.tsx
├── services/
│   └── apiClient.test.ts
└── setup.ts
```

#### Implementation Details

**Jest Configuration:**
```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

**Example Test:**
```typescript
// __tests__/utils/cache.test.ts
import { cache } from '../../src/utils/cache';

describe('Cache Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set and get data from cache', async () => {
    const testData = { id: 1, name: 'Test' };
    await cache.set('test_key', testData);
    const result = await cache.get('test_key');
    expect(result).toEqual(testData);
  });

  it('should return null for expired cache', async () => {
    const testData = { id: 1, name: 'Test' };
    await cache.set('test_key', testData, { ttl: 1 }); // 1ms TTL
    await new Promise(resolve => setTimeout(resolve, 10));
    const result = await cache.get('test_key');
    expect(result).toBeNull();
  });
});
```

#### Success Criteria
- ✅ All critical utilities have tests
- ✅ Test coverage >70%
- ✅ CI can run tests automatically
- ✅ Tests run fast (<30s)
- ✅ Mock dependencies properly

---

### Day 25: Performance Optimization

**Focus:** Bundle size, code splitting, lazy loading

#### Deliverables
- [ ] Analyze bundle with React Native Bundle Visualizer
- [ ] Implement code splitting for heavy screens
- [ ] Lazy load components with React.lazy()
- [ ] Optimize images (WebP, compression)
- [ ] Remove unused dependencies
- [ ] Implement FlatList optimization
- [ ] Memoization audit
- [ ] Re-render optimization

#### Implementation Details

**Code Splitting:**
```typescript
// Lazy load heavy screens
const MatchDetailScreen = React.lazy(() => import('./app/match/[id]'));
const AIBotsScreen = React.lazy(() => import('./app/(tabs)/ai-bots'));

// With Suspense
<Suspense fallback={<LoadingSpinner />}>
  <MatchDetailScreen />
</Suspense>
```

**Image Optimization:**
- Use `expo-image` for better performance
- Implement progressive loading
- Cache images efficiently
- Use appropriate sizes (thumbnails vs full)

**FlatList Optimization:**
```typescript
<FlatList
  data={matches}
  renderItem={renderMatch}
  keyExtractor={(item) => item.id.toString()}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
  getItemLayout={getItemLayout} // For consistent item heights
/>
```

#### Success Criteria
- ✅ Bundle size reduced by 20%
- ✅ Initial load time <2s
- ✅ Smooth 60fps scrolling
- ✅ Memory usage optimized
- ✅ No unnecessary re-renders

---

### Day 26: Deep Linking & Share

**Focus:** App integration with OS features

#### Deliverables
- [ ] Deep linking configuration
- [ ] Universal links (iOS) / App links (Android)
- [ ] Handle incoming links
- [ ] Share functionality
- [ ] Dynamic link generation
- [ ] Link previews
- [ ] Analytics for link attribution

#### Files to Create/Update
```
src/services/
├── deepLink.service.ts     # Deep link handling
└── share.service.ts        # Share functionality

src/config/
└── linking.config.ts       # Expo Router linking config
```

#### Implementation Details

**Deep Link Configuration:**
```typescript
// app.json
{
  "expo": {
    "scheme": "goalgpt",
    "ios": {
      "associatedDomains": ["applinks:goalgpt.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "https", "host": "goalgpt.com" }]
        }
      ]
    }
  }
}
```

**Share Service:**
```typescript
// src/services/share.service.ts
import { Share } from 'react-native';

export const shareService = {
  async shareMatch(matchId: string, teams: string) {
    await Share.share({
      message: `Check out ${teams} on GoalGPT!`,
      url: `https://goalgpt.com/match/${matchId}`,
    });
  },

  async sharePrediction(predictionId: string) {
    await Share.share({
      message: 'Check out my AI prediction on GoalGPT!',
      url: `https://goalgpt.com/prediction/${predictionId}`,
    });
  },
};
```

#### Deep Link Patterns
- `goalgpt://match/123` - Open match detail
- `goalgpt://ai-bot/bot-name` - Open AI bot
- `goalgpt://profile/user-id` - Open user profile
- `https://goalgpt.com/match/123` - Universal link

#### Success Criteria
- ✅ Deep links open correct screens
- ✅ Universal links work (iOS)
- ✅ App links work (Android)
- ✅ Share sheet displays correctly
- ✅ Link previews render properly

---

### Day 27: Deployment Preparation & Week 4 Review

**Focus:** App store readiness and final testing

#### Deliverables
- [ ] App store assets (screenshots, descriptions)
- [ ] Privacy policy and terms of service
- [ ] App store listing optimization
- [ ] EAS Build configuration
- [ ] Beta testing with TestFlight/Play Console
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Final performance audit
- [ ] Week 4 summary documentation

#### App Store Requirements

**iOS (App Store)**
- [ ] App icon (1024x1024)
- [ ] Screenshots (6.5", 5.5", 12.9" iPad)
- [ ] App preview video (optional)
- [ ] App description (4000 chars)
- [ ] Keywords
- [ ] Privacy policy URL
- [ ] Support URL

**Android (Google Play)**
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (phone, tablet, 7-inch)
- [ ] App description (4000 chars)
- [ ] Short description (80 chars)
- [ ] Privacy policy URL

#### CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm test

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v2
      - uses: expo/expo-github-action@v7
      - run: eas build --platform all --non-interactive
```

#### Success Criteria
- ✅ App builds successfully for iOS and Android
- ✅ All app store assets prepared
- ✅ Privacy policy and terms complete
- ✅ Beta testing deployed
- ✅ CI/CD pipeline functional
- ✅ Final testing passed

---

## Technical Stack (Week 4 Additions)

### Monitoring & Analytics
- **Sentry** - Error tracking and performance monitoring
- **Firebase Analytics** - User behavior analytics
- **Firebase Crashlytics** - Crash reporting

### Real-Time Communication
- **WebSocket** - Real-time data updates
- **Socket.io** (optional) - Alternative to native WebSocket

### Push Notifications
- **Expo Notifications** - Local and push notifications
- **Firebase Cloud Messaging** - Push notification service

### Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **@testing-library/react-native** - RN-specific testing
- **Detox** (optional) - E2E testing

### Optimization
- **react-native-bundle-visualizer** - Bundle analysis
- **expo-image** - Optimized image component
- **React.lazy()** - Code splitting

### Deployment
- **EAS Build** - Expo Application Services
- **EAS Submit** - App store submission
- **GitHub Actions** - CI/CD automation

---

## Week 4 Success Metrics

### Monitoring & Analytics
- ✅ Error tracking active with Sentry
- ✅ Analytics dashboard showing user activity
- ✅ Crash reports with actionable data
- ✅ Performance metrics tracked

### Features
- ✅ WebSocket real-time updates working
- ✅ Push notifications delivered successfully
- ✅ Deep links navigate correctly
- ✅ Share functionality works on both platforms

### Testing
- ✅ Test coverage >70%
- ✅ All critical flows have tests
- ✅ CI runs tests automatically
- ✅ Tests run in <30 seconds

### Performance
- ✅ Bundle size <4MB (20% reduction)
- ✅ Initial load <2 seconds
- ✅ 60fps scrolling maintained
- ✅ Memory usage <150MB

### Deployment
- ✅ App builds for iOS and Android
- ✅ Beta deployed to TestFlight and Play Console
- ✅ CI/CD pipeline functional
- ✅ App store listings complete

---

## Risk Management

### Potential Risks

**Risk 1: Sentry integration complexity**
- **Mitigation:** Follow official React Native guide
- **Fallback:** Use basic console logging, add Sentry later

**Risk 2: WebSocket server not ready**
- **Mitigation:** Build client first, use mock WebSocket server
- **Fallback:** Continue with polling, add WebSocket later

**Risk 3: Push notification permissions denied**
- **Mitigation:** Explain value before requesting
- **Fallback:** In-app notifications only

**Risk 4: Test setup complexity**
- **Mitigation:** Start with simple utility tests
- **Fallback:** Focus on manual testing, add automated later

**Risk 5: App store rejection**
- **Mitigation:** Follow guidelines strictly, test thoroughly
- **Fallback:** Address issues and resubmit

---

## Week 4 Deliverables Summary

### Code
- Sentry integration
- Firebase Analytics integration
- WebSocket client
- Push notification service
- Unit tests (20+ test files)
- Performance optimizations
- Deep linking setup
- Share functionality

### Infrastructure
- CI/CD pipeline
- EAS Build configuration
- Beta testing channels
- Error tracking dashboard
- Analytics dashboard

### Documentation
- Week 4 summary
- Testing documentation
- Deployment guide
- API documentation updates
- App store listings

---

**Week 4 Start Date**: January 13, 2026
**Week 4 End Date**: January 20, 2026
**Status**: 📋 Ready to Begin

---

## Notes

- Days 21-27 are ambitious but achievable with focused execution
- Some tasks may extend into Week 5 (e.g., E2E testing, advanced optimizations)
- Prioritize production-critical features (monitoring, notifications) first
- Keep testing and documentation ongoing throughout the week
- Daily progress documentation continues
