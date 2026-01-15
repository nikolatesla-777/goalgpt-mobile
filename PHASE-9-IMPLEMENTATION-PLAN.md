# Phase 9 Implementation Plan
# GoalGPT Mobile App - Advanced Features & Production Readiness

**Plan Date**: 2026-01-15
**Phase**: 9 (Advanced Features)
**Duration**: 5-7 days
**Prerequisites**: Phase 7-8 Complete ✅
**Focus**: Push Notifications, Deep Linking, Share, Navigation, Monitoring

---

## Executive Summary

Phase 9, mobil uygulamanın production-ready hale gelmesi için gerekli gelişmiş özellikleri kapsar. Push notifications, deep linking, share functionality, gelişmiş navigation akışları ve monitoring altyapısı bu fazda eklenecek.

**Ana Hedefler:**
1. **Push Notifications** - Firebase Cloud Messaging entegrasyonu
2. **Deep Linking** - Universal links ve app links
3. **Share Functionality** - Match, prediction ve bot paylaşımı
4. **Complete Navigation** - Tüm navigation akışlarını bağlama
5. **Monitoring & Analytics** - Sentry ve Firebase Analytics

**Beklenen Çıktılar:**
- Production-ready notification sistemi
- Tam işlevsel deep linking
- Social sharing özellikleri
- Complete navigation flow
- Error tracking ve analytics

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Day-by-Day Breakdown](#2-day-by-day-breakdown)
3. [Technical Specifications](#3-technical-specifications)
4. [Testing Strategy](#4-testing-strategy)
5. [Deployment Checklist](#5-deployment-checklist)
6. [Risk Management](#6-risk-management)
7. [Success Metrics](#7-success-metrics)

---

## 1. Architecture Overview

### 1.1 System Components

```
┌─────────────────────────────────────────┐
│         Mobile App (React Native)       │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ Navigation   │  │ Notifications   │ │
│  │ System       │  │ Service         │ │
│  └──────┬───────┘  └────────┬────────┘ │
│         │                   │          │
│  ┌──────▼───────┐  ┌────────▼────────┐ │
│  │ Deep Link    │  │ Analytics       │ │
│  │ Handler      │  │ Service         │ │
│  └──────┬───────┘  └────────┬────────┘ │
│         │                   │          │
│  ┌──────▼──────────────────▼────────┐  │
│  │     Share Service               │  │
│  └─────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
           │              │
           ▼              ▼
┌──────────────────┐  ┌──────────────────┐
│ Firebase         │  │ Backend API      │
│ (FCM, Analytics) │  │ 142.93.103.128   │
└──────────────────┘  └──────────────────┘
```

### 1.2 New File Structure

```
src/
├── services/
│   ├── notifications.service.ts    [NEW] - FCM integration
│   ├── deepLink.service.ts         [NEW] - Deep link handling
│   ├── share.service.ts            [NEW] - Share functionality
│   ├── analytics.service.ts        [NEW] - Firebase Analytics
│   └── monitoring.service.ts       [NEW] - Sentry integration
│
├── hooks/
│   ├── useNotifications.ts         [NEW] - Notification permissions
│   ├── useDeepLink.ts              [NEW] - Deep link navigation
│   └── useAnalytics.ts             [NEW] - Analytics tracking
│
├── config/
│   ├── firebase.config.ts          [NEW] - Firebase setup
│   ├── sentry.config.ts            [NEW] - Sentry setup
│   └── linking.config.ts           [NEW] - Deep linking config
│
├── navigation/
│   └── AppNavigator.tsx            [UPDATE] - Wire navigation
│
└── screens/
    ├── PlayerDetailScreen.tsx      [NEW] - Player detail page
    └── (update existing screens for share/analytics)
```

---

## 2. Day-by-Day Breakdown

### Day 1: Push Notifications Setup

**Duration**: 6-8 hours
**Priority**: High (Critical for user engagement)

#### 2.1.1 Firebase Configuration

**Tasks:**
1. Create Firebase project
2. Add iOS and Android apps to Firebase
3. Download configuration files
4. Install Firebase packages

**Commands:**
```bash
# Install dependencies
npx expo install expo-notifications
npx expo install @react-native-firebase/app
npx expo install @react-native-firebase/messaging

# Configure Firebase
# Add google-services.json (Android)
# Add GoogleService-Info.plist (iOS)
```

**Files to Create:**
```typescript
// src/config/firebase.config.ts
import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const initializeFirebase = () => {
  initializeApp(firebaseConfig);
};
```

#### 2.1.2 Notification Service Implementation

**Create:** `src/services/notifications.service.ts`

**Key Features:**
- Request permissions
- Get FCM token
- Handle foreground notifications
- Handle background notifications
- Schedule local notifications
- Token registration with backend

**Implementation:**
```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permission denied');
      return false;
    }

    return true;
  },

  /**
   * Get FCM token
   */
  async getToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });

      console.log('📱 Push token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  },

  /**
   * Register token with backend
   */
  async registerToken(token: string): Promise<void> {
    try {
      await apiClient.post('/api/notifications/register-token', {
        token,
        platform: Platform.OS,
        deviceId: await Device.getDeviceIdAsync(),
      });
      console.log('✅ Token registered with backend');
    } catch (error) {
      console.error('Failed to register token:', error);
    }
  },

  /**
   * Schedule local notification
   */
  async scheduleLocal(
    title: string,
    body: string,
    data?: Record<string, any>,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: trigger || null, // null = immediate
    });
  },

  /**
   * Handle notification tap
   */
  handleNotificationResponse(
    response: Notifications.NotificationResponse,
    navigation: any
  ): void {
    const data = response.notification.request.content.data;

    // Navigate based on notification type
    switch (data.type) {
      case 'goal':
        navigation.navigate('MatchDetail', { matchId: data.matchId });
        break;
      case 'prediction_result':
        navigation.navigate('Predictions');
        break;
      case 'bot_alert':
        navigation.navigate('BotDetail', { botId: data.botId });
        break;
      default:
        navigation.navigate('Home');
    }
  },

  /**
   * Setup notification listeners
   */
  setupListeners(navigation: any): () => void {
    // Notification received while app in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📬 Notification received:', notification);
      }
    );

    // Notification tapped by user
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        this.handleNotificationResponse(response, navigation);
      }
    );

    // Cleanup function
    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  },
};
```

#### 2.1.3 Notification Hook

**Create:** `src/hooks/useNotifications.ts`

```typescript
import { useState, useEffect } from 'react';
import { notificationService } from '../services/notifications.service';
import { useNavigation } from '@react-navigation/native';

export const useNotifications = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Request permissions and get token
    const initNotifications = async () => {
      const granted = await notificationService.requestPermissions();
      setHasPermission(granted);

      if (granted) {
        const fcmToken = await notificationService.getToken();
        if (fcmToken) {
          setToken(fcmToken);
          await notificationService.registerToken(fcmToken);
        }
      }
    };

    initNotifications();

    // Setup listeners
    const cleanup = notificationService.setupListeners(navigation);

    return cleanup;
  }, [navigation]);

  return { token, hasPermission };
};
```

#### 2.1.4 Integration Points

**Update:** `App.tsx`

```typescript
import { useNotifications } from './src/hooks/useNotifications';

function App() {
  useNotifications(); // Initialize notifications

  return (
    <NavigationContainer>
      {/* ... */}
    </NavigationContainer>
  );
}
```

#### 2.1.5 Notification Types

**Define notification categories:**

1. **Match Events**
   - Goal scored: "⚽ Goal! Team A 2-1 Team B (45')"
   - Match starting: "🔔 Match starting: Team A vs Team B"
   - Match finished: "✅ Full Time: Team A 3-2 Team B"

2. **Predictions**
   - Prediction result: "✅ Your prediction was correct! +10 XP"
   - Bot alert: "🤖 Bot X has new high-confidence prediction"

3. **User Engagement**
   - Daily reminder: "⚡ Check today's matches!"
   - Streak reminder: "🔥 Don't break your 7-day streak!"

#### Success Criteria - Day 1
- ✅ Firebase configured for iOS and Android
- ✅ Permissions requested appropriately
- ✅ FCM token retrieved successfully
- ✅ Token registered with backend
- ✅ Local notifications work
- ✅ Notification tap navigation works
- ✅ Test notification sent and received

---

### Day 2: Deep Linking Implementation

**Duration**: 6-8 hours
**Priority**: High (Essential for sharing and external links)

#### 2.2.1 Configuration

**Update:** `app.json`

```json
{
  "expo": {
    "scheme": "goalgpt",
    "ios": {
      "bundleIdentifier": "com.goalgpt.app",
      "associatedDomains": [
        "applinks:partnergoalgpt.com",
        "applinks:www.partnergoalgpt.com"
      ]
    },
    "android": {
      "package": "com.goalgpt.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "partnergoalgpt.com",
              "pathPrefix": "/"
            },
            {
              "scheme": "https",
              "host": "www.partnergoalgpt.com",
              "pathPrefix": "/"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

#### 2.2.2 Deep Link Service

**Create:** `src/services/deepLink.service.ts`

```typescript
import * as Linking from 'expo-linking';
import { NavigationContainerRef } from '@react-navigation/native';

export interface DeepLinkData {
  screen: string;
  params?: Record<string, any>;
}

export const deepLinkService = {
  /**
   * Parse deep link URL
   */
  parseUrl(url: string): DeepLinkData | null {
    try {
      const { hostname, path, queryParams } = Linking.parse(url);

      // goalgpt://match/123
      // https://partnergoalgpt.com/match/123

      const pathParts = path?.split('/').filter(Boolean) || [];

      if (pathParts.length === 0) {
        return { screen: 'Home' };
      }

      const [resource, id, subResource] = pathParts;

      switch (resource) {
        case 'match':
          return {
            screen: 'MatchDetail',
            params: { matchId: id },
          };

        case 'team':
          return {
            screen: 'TeamDetail',
            params: { teamId: id },
          };

        case 'league':
          return {
            screen: 'LeagueDetail',
            params: { leagueId: id },
          };

        case 'bot':
          return {
            screen: 'BotDetail',
            params: { botId: id },
          };

        case 'player':
          return {
            screen: 'PlayerDetail',
            params: { playerId: id },
          };

        case 'prediction':
          return {
            screen: 'Predictions',
            params: { predictionId: id },
          };

        default:
          return { screen: 'Home' };
      }
    } catch (error) {
      console.error('Failed to parse deep link:', error);
      return null;
    }
  },

  /**
   * Navigate to deep link
   */
  navigate(
    url: string,
    navigation: NavigationContainerRef<any>
  ): boolean {
    const linkData = this.parseUrl(url);

    if (!linkData) return false;

    try {
      navigation.navigate(linkData.screen, linkData.params);
      return true;
    } catch (error) {
      console.error('Failed to navigate to deep link:', error);
      return false;
    }
  },

  /**
   * Generate deep link
   */
  generateLink(screen: string, params?: Record<string, any>): string {
    const baseUrl = 'https://partnergoalgpt.com';

    switch (screen) {
      case 'MatchDetail':
        return `${baseUrl}/match/${params?.matchId}`;

      case 'TeamDetail':
        return `${baseUrl}/team/${params?.teamId}`;

      case 'LeagueDetail':
        return `${baseUrl}/league/${params?.leagueId}`;

      case 'BotDetail':
        return `${baseUrl}/bot/${params?.botId}`;

      case 'PlayerDetail':
        return `${baseUrl}/player/${params?.playerId}`;

      default:
        return baseUrl;
    }
  },
};
```

#### 2.2.3 Deep Link Hook

**Create:** `src/hooks/useDeepLink.ts`

```typescript
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { deepLinkService } from '../services/deepLink.service';

export const useDeepLink = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Handle initial URL (app opened from link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('📎 Initial URL:', url);
        deepLinkService.navigate(url, navigation);
      }
    });

    // Handle URL while app is open
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('📎 Deep link received:', event.url);
      deepLinkService.navigate(event.url, navigation);
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);
};
```

#### 2.2.4 Testing Deep Links

**Test URLs:**
```bash
# Test on iOS simulator
xcrun simctl openurl booted "goalgpt://match/123"
xcrun simctl openurl booted "https://partnergoalgpt.com/match/123"

# Test on Android emulator
adb shell am start -W -a android.intent.action.VIEW -d "goalgpt://match/123"
adb shell am start -W -a android.intent.action.VIEW -d "https://partnergoalgpt.com/match/123"
```

#### Success Criteria - Day 2
- ✅ Deep link configuration complete
- ✅ Custom scheme (goalgpt://) works
- ✅ Universal links (iOS) work
- ✅ App links (Android) work
- ✅ Handles match, team, league, bot, player links
- ✅ Graceful fallback for invalid links
- ✅ Works when app is closed, backgrounded, or open

---

### Day 3: Share Functionality

**Duration**: 4-6 hours
**Priority**: Medium (Enhances viral growth)

#### 2.3.1 Share Service

**Create:** `src/services/share.service.ts`

```typescript
import { Share, Platform } from 'react-native';
import { deepLinkService } from './deepLink.service';

export const shareService = {
  /**
   * Share match
   */
  async shareMatch(
    matchId: string | number,
    homeTeam: string,
    awayTeam: string,
    score?: { home: number; away: number }
  ): Promise<boolean> {
    try {
      const url = deepLinkService.generateLink('MatchDetail', { matchId });

      const message = score
        ? `${homeTeam} ${score.home}-${score.away} ${awayTeam}\n\nWatch on GoalGPT: ${url}`
        : `${homeTeam} vs ${awayTeam}\n\nFollow on GoalGPT: ${url}`;

      const result = await Share.share({
        message,
        url: Platform.OS === 'ios' ? url : undefined,
        title: `${homeTeam} vs ${awayTeam}`,
      });

      if (result.action === Share.sharedAction) {
        console.log('✅ Match shared successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to share match:', error);
      return false;
    }
  },

  /**
   * Share prediction
   */
  async sharePrediction(
    botName: string,
    match: string,
    prediction: string,
    confidence: number
  ): Promise<boolean> {
    try {
      const url = 'https://partnergoalgpt.com/predictions';

      const message = `🤖 ${botName} predicts:\n${match}\n${prediction} (${confidence}% confidence)\n\nSee all predictions: ${url}`;

      const result = await Share.share({
        message,
        url: Platform.OS === 'ios' ? url : undefined,
        title: 'AI Prediction',
      });

      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Failed to share prediction:', error);
      return false;
    }
  },

  /**
   * Share bot
   */
  async shareBot(
    botId: number,
    botName: string,
    successRate: number,
    totalPredictions: number
  ): Promise<boolean> {
    try {
      const url = deepLinkService.generateLink('BotDetail', { botId });

      const message = `🤖 Check out ${botName}!\n\n📊 ${successRate}% Success Rate\n🎯 ${totalPredictions} Predictions\n\nView on GoalGPT: ${url}`;

      const result = await Share.share({
        message,
        url: Platform.OS === 'ios' ? url : undefined,
        title: botName,
      });

      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Failed to share bot:', error);
      return false;
    }
  },

  /**
   * Share team
   */
  async shareTeam(
    teamId: string | number,
    teamName: string
  ): Promise<boolean> {
    try {
      const url = deepLinkService.generateLink('TeamDetail', { teamId });

      const message = `⚽ Follow ${teamName} on GoalGPT\n\n${url}`;

      const result = await Share.share({
        message,
        url: Platform.OS === 'ios' ? url : undefined,
        title: teamName,
      });

      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Failed to share team:', error);
      return false;
    }
  },

  /**
   * Share app
   */
  async shareApp(): Promise<boolean> {
    try {
      const message = `⚽ GoalGPT - AI-Powered Football Predictions\n\nGet live scores, AI predictions, and match analysis!\n\nhttps://partnergoalgpt.com`;

      const result = await Share.share({
        message,
        title: 'GoalGPT App',
      });

      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Failed to share app:', error);
      return false;
    }
  },
};
```

#### 2.3.2 Integration with Screens

**Example: Update Match Detail Header**

```typescript
// In MatchDetailScreen header
<TouchableOpacity
  onPress={() => {
    shareService.shareMatch(
      matchId,
      match.homeTeam.name,
      match.awayTeam.name,
      { home: match.homeScore, away: match.awayScore }
    );
  }}
  style={styles.shareButton}
>
  <Ionicons name="share-outline" size={24} color="#FFFFFF" />
</TouchableOpacity>
```

#### Success Criteria - Day 3
- ✅ Share match works
- ✅ Share prediction works
- ✅ Share bot works
- ✅ Share team works
- ✅ Share app works
- ✅ iOS and Android native share sheets
- ✅ Deep links in shared content work

---

### Day 4: Complete Navigation Wiring

**Duration**: 6-8 hours
**Priority**: High (Essential for UX)

#### 2.4.1 Navigation Mappings

**Screens to Wire:**
1. LiveMatches → Match Detail
2. Bot List → Bot Detail
3. Match Detail → Team Detail
4. Match Detail → League Detail
5. Team Detail → Match Detail
6. League Detail → Match Detail
7. League Detail → Team Detail
8. CompactMatchCard → Match Detail (everywhere)

#### 2.4.2 Update Screens

**LiveMatchesScreen:**
```typescript
const handleMatchPress = useCallback((matchId: string | number) => {
  navigation.navigate('MatchDetail', { matchId });
}, [navigation]);

<LiveMatchesFeed
  matches={updatedMatches}
  onMatchPress={handleMatchPress}
  // ...
/>
```

**BotListScreen:**
```typescript
const handleBotPress = useCallback((bot: Bot) => {
  navigation.navigate('BotDetail', { botId: bot.id });
}, [navigation]);
```

**TeamDetailScreen:**
```typescript
// In fixtures tab
<CompactMatchCard
  {...fixture}
  onPress={() => navigation.navigate('MatchDetail', { matchId: fixture.id })}
/>

// In standings tab (team rows)
<TouchableOpacity
  onPress={() => navigation.navigate('TeamDetail', { teamId: standing.team_id })}
>
```

**LeagueDetailScreen:**
```typescript
// In fixtures tab
<CompactMatchCard
  {...fixture}
  onPress={() => navigation.navigate('MatchDetail', { matchId: fixture.id })}
/>

// In standings tab (team rows)
<TouchableOpacity
  onPress={() => navigation.navigate('TeamDetail', { teamId: standing.team_id })}
>
```

#### 2.4.3 Create Missing Screens

**PlayerDetailScreen (if needed):**

```typescript
// src/screens/PlayerDetailScreen.tsx
export const PlayerDetailScreen = ({ route }) => {
  const { playerId } = route.params;
  // Fetch player data
  // Show stats, photo, career history
  // Show recent matches
};
```

#### 2.4.4 Stack Navigator Update

**Update:** `src/navigation/AppNavigator.tsx`

```typescript
<Stack.Navigator>
  {/* Existing screens */}
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />

  {/* New screens */}
  <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
  <Stack.Screen name="LeagueDetail" component={LeagueDetailScreen} />
  <Stack.Screen name="BotDetail" component={BotDetailScreen} />
  <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} />
</Stack.Navigator>
```

#### Success Criteria - Day 4
- ✅ All match cards navigate to match detail
- ✅ Bot list navigates to bot detail
- ✅ Team names navigate to team detail
- ✅ League names navigate to league detail
- ✅ Back button works from all screens
- ✅ Navigation history preserved
- ✅ No broken navigation links

---

### Day 5: Analytics & Monitoring

**Duration**: 6-8 hours
**Priority**: High (Production requirement)

#### 2.5.1 Sentry Setup

**Install:**
```bash
npx expo install @sentry/react-native
```

**Create:** `src/config/sentry.config.ts`

```typescript
import * as Sentry from '@sentry/react-native';

export const initializeSentry = () => {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    enabled: !__DEV__,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 10000,
    tracesSampleRate: 1.0,
    attachScreenshot: true,
    attachViewHierarchy: true,
    integrations: [
      new Sentry.ReactNativeTracing({
        tracingOrigins: ['142.93.103.128', 'partnergoalgpt.com'],
        routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
      }),
    ],
  });
};
```

**Create:** `src/services/monitoring.service.ts`

```typescript
import * as Sentry from '@sentry/react-native';

export const monitoring = {
  /**
   * Log error to Sentry
   */
  logError(error: Error, context?: Record<string, any>): void {
    if (__DEV__) {
      console.error('Error:', error, context);
      return;
    }

    Sentry.captureException(error, {
      extra: context,
    });
  },

  /**
   * Log custom event
   */
  logEvent(eventName: string, data?: Record<string, any>): void {
    Sentry.addBreadcrumb({
      category: 'custom',
      message: eventName,
      level: 'info',
      data,
    });
  },

  /**
   * Set user context
   */
  setUser(userId: string, email?: string): void {
    Sentry.setUser({
      id: userId,
      email,
    });
  },

  /**
   * Clear user context
   */
  clearUser(): void {
    Sentry.setUser(null);
  },
};
```

#### 2.5.2 Firebase Analytics

**Create:** `src/services/analytics.service.ts`

```typescript
import analytics from '@react-native-firebase/analytics';

export const analyticsService = {
  /**
   * Log screen view
   */
  async logScreenView(screenName: string): Promise<void> {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  },

  /**
   * Log custom event
   */
  async logEvent(
    eventName: string,
    params?: Record<string, any>
  ): Promise<void> {
    await analytics().logEvent(eventName, params);
  },

  /**
   * Set user ID
   */
  async setUserId(userId: string): Promise<void> {
    await analytics().setUserId(userId);
  },

  /**
   * Set user property
   */
  async setUserProperty(name: string, value: string): Promise<void> {
    await analytics().setUserProperty(name, value);
  },

  // Predefined events
  events: {
    matchViewed: (matchId: string) =>
      analyticsService.logEvent('match_viewed', { matchId }),

    predictionViewed: (botId: number) =>
      analyticsService.logEvent('prediction_viewed', { botId }),

    shareMatch: (matchId: string) =>
      analyticsService.logEvent('share_match', { matchId }),

    filterApplied: (filterType: string) =>
      analyticsService.logEvent('filter_applied', { filterType }),

    searchPerformed: (query: string) =>
      analyticsService.logEvent('search_performed', { query }),
  },
};
```

#### 2.5.3 Analytics Hook

**Create:** `src/hooks/useAnalytics.ts`

```typescript
import { useEffect } from 'react';
import { useNavigationState } from '@react-navigation/native';
import { analyticsService } from '../services/analytics.service';

export const useAnalytics = () => {
  const navigationState = useNavigationState((state) => state);

  useEffect(() => {
    if (navigationState) {
      const currentRoute = getCurrentRoute(navigationState);
      if (currentRoute) {
        analyticsService.logScreenView(currentRoute.name);
      }
    }
  }, [navigationState]);
};

function getCurrentRoute(state: any): any {
  if (state.index === undefined || state.index === null) {
    return state;
  }

  const route = state.routes[state.index];

  if (route.state) {
    return getCurrentRoute(route.state);
  }

  return route;
}
```

#### 2.5.4 Integration

**Update:** `App.tsx`

```typescript
import { initializeSentry } from './src/config/sentry.config';
import { useAnalytics } from './src/hooks/useAnalytics';

// Initialize Sentry before app renders
initializeSentry();

function App() {
  useAnalytics(); // Track screen views

  return (
    <NavigationContainer>
      {/* ... */}
    </NavigationContainer>
  );
}

export default Sentry.wrap(App);
```

#### Success Criteria - Day 5
- ✅ Sentry captures errors
- ✅ Sentry shows stack traces
- ✅ Firebase Analytics tracks screens
- ✅ Custom events logged
- ✅ User tracking works
- ✅ Dashboard shows data
- ✅ No performance impact

---

## 3. Technical Specifications

### 3.1 Dependencies

**New Packages:**
```json
{
  "dependencies": {
    "expo-notifications": "~0.27.0",
    "@react-native-firebase/app": "^18.7.0",
    "@react-native-firebase/messaging": "^18.7.0",
    "@react-native-firebase/analytics": "^18.7.0",
    "@sentry/react-native": "^5.15.0",
    "expo-linking": "~6.0.0"
  }
}
```

### 3.2 Environment Variables

**Add to:** `.env`

```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Sentry
EXPO_PUBLIC_SENTRY_DSN=https://your_key@sentry.io/your_project

# Expo
EXPO_PUBLIC_PROJECT_ID=your_expo_project_id
```

### 3.3 Backend API Requirements

**New Endpoints Needed:**
```
POST /api/notifications/register-token
  Body: { token, platform, deviceId }
  Response: { success: true }

DELETE /api/notifications/unregister-token
  Body: { token }
  Response: { success: true }

GET /api/notifications/preferences
  Response: { matchStart: true, goals: true, ... }

PUT /api/notifications/preferences
  Body: { matchStart: true, goals: true, ... }
  Response: { success: true }
```

---

## 4. Testing Strategy

### 4.1 Manual Testing Checklist

**Push Notifications:**
- [ ] Permissions requested at appropriate time
- [ ] Foreground notification appears
- [ ] Background notification appears
- [ ] Notification tap opens correct screen
- [ ] Sound plays
- [ ] Badge updates

**Deep Links:**
- [ ] Custom scheme works (goalgpt://)
- [ ] Universal links work (https://partnergoalgpt.com)
- [ ] App opens when link clicked (iOS)
- [ ] App opens when link clicked (Android)
- [ ] Navigates to correct screen
- [ ] Handles invalid links gracefully

**Share:**
- [ ] Share sheet opens
- [ ] Message includes deep link
- [ ] Shared link works when clicked
- [ ] Share to WhatsApp works
- [ ] Share to Twitter works
- [ ] Copy link works

**Analytics:**
- [ ] Screen views tracked
- [ ] Custom events logged
- [ ] Firebase dashboard shows data
- [ ] Sentry captures errors
- [ ] No PII logged

### 4.2 Testing Tools

**Notification Testing:**
```bash
# Send test notification
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ExponentPushToken[YOUR_TOKEN]",
    "title": "Test",
    "body": "This is a test notification",
    "data": {"type": "goal", "matchId": "123"}
  }'
```

**Deep Link Testing:**
```bash
# iOS
xcrun simctl openurl booted "goalgpt://match/123"

# Android
adb shell am start -a android.intent.action.VIEW -d "goalgpt://match/123"
```

---

## 5. Deployment Checklist

### 5.1 Pre-Deployment

- [ ] All Phase 9 features tested
- [ ] TypeScript compilation passes
- [ ] No console errors or warnings
- [ ] Firebase project created
- [ ] Sentry project created
- [ ] Environment variables set
- [ ] Privacy policy updated (notifications)
- [ ] Terms of service updated

### 5.2 App Store Requirements

**iOS:**
- [ ] Associated domains configured
- [ ] Push notification capability enabled
- [ ] Privacy manifest updated
- [ ] Screenshot showing notifications

**Android:**
- [ ] Deep link intent filters configured
- [ ] FCM configured
- [ ] Privacy policy linked
- [ ] Screenshot showing notifications

### 5.3 Post-Deployment

- [ ] Monitor error rates in Sentry
- [ ] Check analytics dashboard
- [ ] Test notifications on production
- [ ] Test deep links on production
- [ ] Verify share functionality
- [ ] Monitor user feedback

---

## 6. Risk Management

### 6.1 Potential Risks

**Risk 1: Notification Permission Denial**
- **Probability:** High
- **Impact:** Medium
- **Mitigation:** Explain value before requesting, allow enabling later
- **Fallback:** In-app notifications only

**Risk 2: Deep Link Configuration Issues**
- **Probability:** Medium
- **Impact:** High
- **Mitigation:** Test thoroughly on both platforms
- **Fallback:** Custom scheme only (no universal links)

**Risk 3: Firebase/Sentry Integration Complexity**
- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:** Follow official guides, use examples
- **Fallback:** Basic logging, add advanced features later

**Risk 4: Share Functionality Platform Differences**
- **Probability:** Low
- **Impact:** Low
- **Mitigation:** Test on both platforms
- **Fallback:** Copy link to clipboard

### 6.2 Rollback Plan

If critical issues found:
1. Disable notifications temporarily
2. Remove deep link handling
3. Hide share buttons
4. Deploy hotfix
5. Monitor and re-enable

---

## 7. Success Metrics

### 7.1 Feature Adoption

**Week 1 Targets:**
- Notification opt-in rate: >40%
- Deep link click-through: >20%
- Share feature usage: >5%
- Zero crashes from new features

**Week 2 Targets:**
- Notification opt-in rate: >50%
- Deep link click-through: >30%
- Share feature usage: >10%
- Error rate <0.1%

### 7.2 Performance Metrics

- App size increase: <2MB
- Initial load time impact: <100ms
- Memory usage increase: <20MB
- Battery impact: Minimal (monitored)

### 7.3 Quality Metrics

- Zero critical bugs
- Sentry error rate: <0.5%
- Analytics data accuracy: 100%
- User rating maintained: ≥4.5 stars

---

## 8. Documentation Updates

### 8.1 User Documentation

**Topics to Document:**
- How to enable notifications
- What notifications user will receive
- How to share matches/predictions
- Deep link examples for testing

### 8.2 Developer Documentation

**Topics to Document:**
- Firebase setup guide
- Sentry configuration
- Deep linking patterns
- Share implementation
- Analytics event list

---

## 9. Timeline Summary

| Day | Focus | Duration | Priority |
|-----|-------|----------|----------|
| 1 | Push Notifications | 6-8h | High |
| 2 | Deep Linking | 6-8h | High |
| 3 | Share Functionality | 4-6h | Medium |
| 4 | Navigation Wiring | 6-8h | High |
| 5 | Analytics & Monitoring | 6-8h | High |

**Total Estimated Time:** 28-38 hours (5-7 days)

---

## 10. Next Steps After Phase 9

**Phase 10 (Optional Enhancements):**
- Offline mode & caching
- Advanced filtering
- User preferences
- Social features (comments, forums)
- Gamification (leaderboards, achievements)
- Performance optimizations
- A/B testing framework

---

**Plan Created**: 2026-01-15
**Plan Owner**: Claude Sonnet 4.5
**Status**: ✅ Ready for Implementation
**Prerequisites**: Phase 7-8 Complete ✅
**Estimated Completion**: 5-7 days from start
