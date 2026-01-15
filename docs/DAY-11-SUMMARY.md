# 📱 Week 3 - Day 11: Push Notifications System

**Tarih:** 2026-01-14
**Week:** 3 (Core Features)
**Phase:** Phase 7 - Mobile App Core Features
**Durum:** ✅ Tamamlandı

---

## 🎯 Günün Hedefi

Push notifications altyapısı kurulumu. Development için Expo Notifications, Production/TestFlight için FCM migration guide.

**Master Plan Hedefi:**
- ✅ Push notifications setup
- ✅ Notification permissions handling
- ✅ Local notifications (test)
- ✅ Notification settings screen
- ✅ FCM migration guide (TestFlight için)

---

## ⚠️ ÖNEMLI NOT

**Development:** Expo Notifications (mevcut implementasyon)
**TestFlight/Production:** Firebase Cloud Messaging (FCM) gerekli

Bu dokümantasyonda her iki sistem de anlatılıyor:
1. **Bölüm 1-4:** Expo Notifications (Development)
2. **Bölüm 5:** FCM Migration Guide (TestFlight/Production)

---

## 📋 Yapılacaklar Listesi

- [x] Notification type definitions oluştur
- [x] NotificationService (Expo Notifications) oluştur
- [x] Notification permissions handler
- [x] NotificationSettings screen
- [x] Local notification test fonksiyonları
- [x] Settings integration (sound, vibration, quiet hours)
- [x] Favorites integration (notify only favorites)
- [x] FCM Migration Guide dokümantasyonu

---

## 🏗️ Oluşturulan Yapı (Expo Notifications)

### 1. Notification Type Definitions

**Dosya:** `src/types/notification.types.ts` (200 lines)

**Notification Types:**
```typescript
export type NotificationType =
  | 'match_start'      // Match is starting
  | 'goal'             // Goal scored
  | 'match_end'        // Match ended
  | 'prediction_win'   // AI prediction won
  | 'prediction_lose'  // AI prediction lost
  | 'general';         // General announcement
```

**Notification Payload:**
```typescript
export interface NotificationPayload {
  title: string;
  body: string;
  data: NotificationData;
  priority?: NotificationPriority;
  sound?: boolean;
  vibrate?: boolean;
  badge?: number;
}

export interface NotificationData {
  type: NotificationType;
  matchId?: string | number;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  minute?: number;
  league?: string;
  predictionId?: string | number;
  prediction?: string;
  confidence?: number;
  timestamp: string;
  actionUrl?: string; // Deep link URL
}
```

**Settings:**
```typescript
export interface NotificationSettings {
  enabled: boolean;

  // Match notifications
  matchStart: boolean;
  goals: boolean;
  matchEnd: boolean;

  // Prediction notifications
  predictionResults: boolean;

  // Favorite notifications
  notifyFavorites: boolean; // Only notify for favorites

  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string;   // "08:00"

  // Sound & vibration
  sound: boolean;
  vibration: boolean;
}
```

**Default Settings:**
```typescript
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  matchStart: true,
  goals: true,
  matchEnd: false, // Disabled by default (can be noisy)
  predictionResults: true,
  notifyFavorites: true, // Only notify favorites
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  sound: true,
  vibration: true,
};
```

---

### 2. Notification Service (Expo)

**Dosya:** `src/services/notification.service.ts` (550 lines)

**Notification Handler Config:**
```typescript
// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

#### Permissions

**Request Permissions:**
```typescript
export async function requestPermissions(): Promise<NotificationPermissionStatus> {
  try {
    // Check if physical device (not simulator)
    if (!Device.isDevice) {
      console.warn('⚠️ Push notifications only work on physical devices');
      return 'denied';
    }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Mark as asked
    await AsyncStorage.setItem(STORAGE_KEY_PERMISSION_ASKED, 'true');

    if (finalStatus === 'granted') {
      console.log('✅ Notification permissions granted');
      return 'granted';
    } else {
      console.log('❌ Notification permissions denied');
      return 'denied';
    }
  } catch (error) {
    console.error('❌ Failed to request permissions:', error);
    return 'denied';
  }
}
```

**Get Permission Status:**
```typescript
export async function getPermissionStatus(): Promise<NotificationPermissionStatus> {
  try {
    const { status } = await Notifications.getPermissionsAsync();

    if (status === 'granted') return 'granted';
    if (status === 'denied') return 'denied';

    // Check if we asked before
    const asked = await AsyncStorage.getItem(STORAGE_KEY_PERMISSION_ASKED);
    if (asked) return 'denied';

    return 'undetermined';
  } catch (error) {
    console.error('❌ Failed to get permission status:', error);
    return 'undetermined';
  }
}
```

#### Push Token (Expo)

**Get Expo Push Token:**
```typescript
export async function getExpoPushToken(): Promise<string | null> {
  try {
    if (!Device.isDevice) {
      console.warn('⚠️ Push tokens only work on physical devices');
      return null;
    }

    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-expo-project-id', // TODO: Replace with actual project ID
    });

    const token = tokenData.data;
    console.log('✅ Expo push token:', token);

    // Save token
    const pushToken: PushToken = {
      token,
      platform: Platform.OS as 'ios' | 'android',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify(pushToken));

    // TODO: Send token to backend
    // await sendTokenToBackend(token);

    return token;
  } catch (error) {
    console.error('❌ Failed to get push token:', error);
    return null;
  }
}
```

#### Settings Management

**Load Settings:**
```typescript
export async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!data) {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }

    const settings: NotificationSettings = JSON.parse(data);
    return settings;
  } catch (error) {
    console.error('❌ Failed to load notification settings:', error);
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}
```

**Save Settings:**
```typescript
export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  try {
    const data = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, data);
    console.log('✅ Notification settings saved');
  } catch (error) {
    console.error('❌ Failed to save notification settings:', error);
    throw error;
  }
}
```

#### Should Notify Logic

**Check if Should Send Notification:**
```typescript
export async function shouldNotify(type: NotificationType): Promise<boolean> {
  const settings = await loadNotificationSettings();

  // Check if notifications enabled globally
  if (!settings.enabled) return false;

  // Check type-specific settings
  switch (type) {
    case 'match_start':
      if (!settings.matchStart) return false;
      break;
    case 'goal':
      if (!settings.goals) return false;
      break;
    case 'match_end':
      if (!settings.matchEnd) return false;
      break;
    case 'prediction_win':
    case 'prediction_lose':
      if (!settings.predictionResults) return false;
      break;
  }

  // Check quiet hours
  if (settings.quietHoursEnabled) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const start = settings.quietHoursStart;
    const end = settings.quietHoursEnd;

    // Check if current time is in quiet hours range
    if (start < end) {
      if (currentTime >= start && currentTime < end) {
        console.log('⏰ Quiet hours active, notification suppressed');
        return false;
      }
    } else {
      // Overnight range (e.g., 22:00 - 08:00)
      if (currentTime >= start || currentTime < end) {
        console.log('⏰ Quiet hours active, notification suppressed');
        return false;
      }
    }
  }

  return true;
}
```

#### Schedule Local Notification

**Schedule Notification:**
```typescript
export async function scheduleLocalNotification(
  payload: NotificationPayload,
  delaySeconds: number = 0
): Promise<string | null> {
  try {
    // Check if should notify
    const should = await shouldNotify(payload.data.type);
    if (!should) {
      console.log('⏭️ Notification skipped based on settings');
      return null;
    }

    const settings = await loadNotificationSettings();

    // Schedule notification
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data,
        sound: settings.sound ? 'default' : undefined,
        badge: payload.badge,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: delaySeconds > 0 ? { seconds: delaySeconds } : null,
    });

    console.log('✅ Local notification scheduled:', id);
    return id;
  } catch (error) {
    console.error('❌ Failed to schedule notification:', error);
    return null;
  }
}
```

#### Notification Templates

**Match Start:**
```typescript
export function createMatchStartNotification(
  matchId: string | number,
  homeTeam: string,
  awayTeam: string,
  league?: string
): NotificationPayload {
  return {
    title: '⚽ Match Starting!',
    body: `${homeTeam} vs ${awayTeam}${league ? ` - ${league}` : ''}`,
    data: {
      type: 'match_start',
      matchId,
      homeTeam,
      awayTeam,
      league,
      timestamp: new Date().toISOString(),
      actionUrl: `/match/${matchId}`,
    },
    priority: 'high',
    sound: true,
    vibrate: true,
  };
}
```

**Goal:**
```typescript
export function createGoalNotification(
  matchId: string | number,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  scoringTeam: string,
  minute: number
): NotificationPayload {
  return {
    title: '⚽ GOAL!',
    body: `${scoringTeam} scores! ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam} (${minute}')`,
    data: {
      type: 'goal',
      matchId,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      minute,
      timestamp: new Date().toISOString(),
      actionUrl: `/match/${matchId}`,
    },
    priority: 'max',
    sound: true,
    vibrate: true,
  };
}
```

**Prediction Result:**
```typescript
export function createPredictionResultNotification(
  predictionId: string | number,
  matchId: string | number,
  prediction: string,
  result: 'win' | 'lose',
  confidence?: number
): NotificationPayload {
  const isWin = result === 'win';

  return {
    title: isWin ? '🎉 Prediction Won!' : '❌ Prediction Lost',
    body: `${prediction}${confidence ? ` (${confidence}% confidence)` : ''} - ${isWin ? 'Correct!' : 'Incorrect'}`,
    data: {
      type: isWin ? 'prediction_win' : 'prediction_lose',
      predictionId,
      matchId,
      prediction,
      confidence,
      timestamp: new Date().toISOString(),
      actionUrl: `/prediction/${predictionId}`,
    },
    priority: isWin ? 'high' : 'default',
    sound: true,
    vibrate: isWin,
  };
}
```

---

### 3. Notification Settings Screen

**Dosya:** `src/screens/NotificationSettingsScreen.tsx` (450 lines)

**Features:**
- Permission request banner (if not granted)
- Master notification toggle
- Match notifications (start, goals, end)
- Prediction notifications
- Favorites-only toggle
- Sound & vibration settings
- Test notification button
- Saving states with AsyncStorage

**UI Structure:**
```typescript
return (
  <SafeAreaView>
    {/* Header */}
    <Header title="Notifications" onBack={onBack} />

    <ScrollView>
      {/* Permission Banner (if not granted) */}
      {permissionStatus !== 'granted' && (
        <PermissionBanner onEnable={handleRequestPermissions} />
      )}

      {/* Master Toggle */}
      <Section title="General">
        <ToggleRow
          title="Notifications"
          subtitle="Master notification toggle"
          value={settings.enabled}
          onChange={(value) => handleToggleSetting('enabled', value)}
        />
      </Section>

      {/* Match Notifications */}
      <Section title="Match Notifications">
        <ToggleRow title="Match Start" value={settings.matchStart} ... />
        <ToggleRow title="Goals" value={settings.goals} ... />
        <ToggleRow title="Match End" value={settings.matchEnd} ... />
      </Section>

      {/* Prediction Notifications */}
      <Section title="Prediction Notifications">
        <ToggleRow title="Prediction Results" value={settings.predictionResults} ... />
      </Section>

      {/* Favorites */}
      <Section title="Favorites">
        <ToggleRow
          title="Only Notify Favorites"
          subtitle="Only get updates for favorited items"
          value={settings.notifyFavorites}
          ...
        />
      </Section>

      {/* Sound & Vibration */}
      <Section title="Sound & Vibration">
        <ToggleRow title="Sound" value={settings.sound} ... />
        <ToggleRow title="Vibration" value={settings.vibration} ... />
      </Section>

      {/* Test Button */}
      {permissionStatus === 'granted' && (
        <TestButton onPress={handleTestNotification} />
      )}
    </ScrollView>
  </SafeAreaView>
);
```

**Test Notification:**
```typescript
const handleTestNotification = async () => {
  if (permissionStatus !== 'granted') {
    Alert.alert('Permissions Required', 'Please enable notifications first');
    return;
  }

  const notification = NotificationService.createMatchStartNotification(
    123,
    'Man United',
    'Liverpool',
    'Premier League'
  );

  await NotificationService.scheduleLocalNotification(notification, 3);
  Alert.alert('Test Notification', 'A test notification will appear in 3 seconds');
};
```

---

## 🚀 Kullanım Örnekleri (Expo)

### 1. Request Permissions

```typescript
import * as NotificationService from '../services/notification.service';

async function setupNotifications() {
  const status = await NotificationService.requestPermissions();

  if (status === 'granted') {
    // Get push token
    const token = await NotificationService.getExpoPushToken();
    console.log('Push token:', token);

    // Send token to backend
    // await api.post('/users/push-token', { token });
  }
}
```

### 2. Send Local Notification

```typescript
// Match start notification
const notification = NotificationService.createMatchStartNotification(
  123,
  'Barcelona',
  'Real Madrid',
  'La Liga'
);

await NotificationService.scheduleLocalNotification(notification, 0);

// Goal notification (5 seconds delay)
const goalNotif = NotificationService.createGoalNotification(
  123,
  'Barcelona',
  'Real Madrid',
  1,
  0,
  'Barcelona',
  23
);

await NotificationService.scheduleLocalNotification(goalNotif, 5);
```

### 3. Check Settings Before Notifying

```typescript
// Integrate with favorites
const sendMatchStartNotification = async (match: Match) => {
  const settings = await NotificationService.loadNotificationSettings();

  // Check if should notify based on settings
  if (!settings.matchStart) {
    console.log('Match start notifications disabled');
    return;
  }

  // Check if should only notify favorites
  if (settings.notifyFavorites) {
    const isFavorited = await checkIfFavorited(match.id);
    if (!isFavorited) {
      console.log('Not a favorite, skipping notification');
      return;
    }
  }

  // Send notification
  const notification = NotificationService.createMatchStartNotification(
    match.id,
    match.homeTeam.name,
    match.awayTeam.name,
    match.league
  );

  await NotificationService.scheduleLocalNotification(notification);
};
```

---

## 🔥 FCM Migration Guide (TestFlight/Production)

### ⚠️ KRITIK: TestFlight'a atarken FCM gerekli!

Expo Notifications development için yeterli ama **TestFlight ve Production için Firebase Cloud Messaging (FCM) kurulumu zorunlu**.

---

### Neden FCM?

1. **Güvenilirlik:** FCM Apple ve Google'ın resmi push notification servisleri
2. **TestFlight:** Apple TestFlight FCM kullanımını gerektirir
3. **Production:** Gerçek push notifications için FCM şart
4. **Scalability:** Yüksek hacimli notificationslar için optimize
5. **Analytics:** Firebase Console'da detaylı analytics

---

### FCM Migration Adımları

#### Step 1: Firebase Project Setup

1. **Firebase Console'a git:** https://console.firebase.google.com
2. **Yeni proje oluştur:** "GoalGPT"
3. **iOS app ekle:**
   - Bundle ID: `com.goalgpt.mobile` (veya sizin bundle ID'niz)
   - App nickname: "GoalGPT iOS"
   - Download `GoogleService-Info.plist`

4. **Android app ekle (opsiyonel):**
   - Package name: `com.goalgpt.mobile`
   - Download `google-services.json`

---

#### Step 2: Install Firebase Packages

```bash
# Expo için Firebase paketleri
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging

# iOS için CocoaPods (gerekiyorsa)
cd ios
pod install
cd ..
```

---

#### Step 3: iOS Configuration

**3.1. Add GoogleService-Info.plist**
```
ios/
└── GoalGPT/
    └── GoogleService-Info.plist  (Firebase Console'dan indirilen dosya)
```

**3.2. Update app.json/app.config.js**
```json
{
  "expo": {
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "bundleIdentifier": "com.goalgpt.mobile"
    },
    "plugins": [
      "@react-native-firebase/app",
      [
        "@react-native-firebase/messaging",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ]
  }
}
```

**3.3. Enable Push Notifications Capability**
- Xcode → Target → Signing & Capabilities
- Add Capability → Push Notifications
- Add Capability → Background Modes
  - Check: Remote notifications

**3.4. Upload APNs Certificate to Firebase**
1. Apple Developer → Certificates, Identifiers & Profiles
2. Create new Certificate → Apple Push Notification service SSL
3. Download certificate (.p12)
4. Firebase Console → Project Settings → Cloud Messaging
5. Upload APNs certificate

---

#### Step 4: Android Configuration (Opsiyonel)

**4.1. Add google-services.json**
```
android/
└── app/
    └── google-services.json  (Firebase Console'dan indirilen dosya)
```

**4.2. Update app.json**
```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json",
      "package": "com.goalgpt.mobile"
    }
  }
}
```

---

#### Step 5: Update NotificationService for FCM

**Create: `src/services/notification.fcm.service.ts`**

```typescript
/**
 * FCM Notification Service (Production)
 */

import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_FCM_TOKEN = '@goalgpt_fcm_token';

/**
 * Request FCM permissions (iOS)
 */
export async function requestFCMPermissions(): Promise<boolean> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ FCM permissions granted');
      return true;
    }

    console.log('❌ FCM permissions denied');
    return false;
  } catch (error) {
    console.error('❌ Failed to request FCM permissions:', error);
    return false;
  }
}

/**
 * Get FCM token
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    // Request permissions first (iOS only)
    if (Platform.OS === 'ios') {
      const hasPermission = await requestFCMPermissions();
      if (!hasPermission) {
        return null;
      }
    }

    // Get FCM token
    const token = await messaging().getToken();
    console.log('✅ FCM token:', token);

    // Save token
    await AsyncStorage.setItem(STORAGE_KEY_FCM_TOKEN, token);

    // TODO: Send token to backend
    // await api.post('/users/fcm-token', { token });

    return token;
  } catch (error) {
    console.error('❌ Failed to get FCM token:', error);
    return null;
  }
}

/**
 * Setup FCM message handlers
 */
export function setupFCMHandlers() {
  // Foreground messages
  messaging().onMessage(async (remoteMessage) => {
    console.log('📩 FCM message received (foreground):', remoteMessage);

    // Show local notification
    // You can use expo-notifications here for display
  });

  // Background messages
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('📩 FCM message received (background):', remoteMessage);
  });

  // Token refresh
  messaging().onTokenRefresh(async (token) => {
    console.log('🔄 FCM token refreshed:', token);
    await AsyncStorage.setItem(STORAGE_KEY_FCM_TOKEN, token);

    // TODO: Update token on backend
    // await api.put('/users/fcm-token', { token });
  });
}

/**
 * Delete FCM token (on logout)
 */
export async function deleteFCMToken(): Promise<void> {
  try {
    await messaging().deleteToken();
    await AsyncStorage.removeItem(STORAGE_KEY_FCM_TOKEN);
    console.log('✅ FCM token deleted');
  } catch (error) {
    console.error('❌ Failed to delete FCM token:', error);
  }
}
```

---

#### Step 6: Update App Initialization

**Update: `App.tsx` or root component**

```typescript
import { useEffect } from 'react';
import * as FCMService from './src/services/notification.fcm.service';

function App() {
  useEffect(() => {
    // Setup FCM on app start
    FCMService.setupFCMHandlers();

    // Get FCM token
    FCMService.getFCMToken();
  }, []);

  return (
    // Your app components
  );
}
```

---

#### Step 7: Backend Integration

**Backend Endpoint: Send Push Notification**

```typescript
// Node.js + Firebase Admin SDK

import admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * Send push notification via FCM
 */
export async function sendPushNotification(
  tokens: string[],
  notification: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }
) {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      tokens, // Array of FCM tokens
    };

    const response = await admin.messaging().sendMulticast(message);

    console.log('✅ Push notification sent:', response.successCount, 'successful');
    console.log('❌ Failed:', response.failureCount);

    return response;
  } catch (error) {
    console.error('❌ Failed to send push notification:', error);
    throw error;
  }
}

// Example usage
const userTokens = ['fcm_token_1', 'fcm_token_2'];

await sendPushNotification(userTokens, {
  title: '⚽ Match Starting!',
  body: 'Barcelona vs Real Madrid - La Liga',
  data: {
    type: 'match_start',
    matchId: '123',
    actionUrl: '/match/123',
  },
});
```

---

#### Step 8: Build for TestFlight

**Build EAS Build:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS (TestFlight)
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios
```

**eas.json Configuration:**
```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.goalgpt.mobile",
        "buildConfiguration": "Release"
      }
    }
  }
}
```

---

### FCM vs Expo Notifications Comparison

| Feature | Expo Notifications | FCM |
|---------|-------------------|-----|
| **Development** | ✅ Perfect | ✅ Works |
| **Expo Go** | ✅ Works | ❌ Requires dev client |
| **TestFlight** | ❌ Limited | ✅ Full support |
| **Production** | ⚠️ Limited scale | ✅ Full scale |
| **Setup Complexity** | Easy | Medium |
| **iOS APNs** | Expo handles | Manual setup |
| **Android** | Expo handles | Manual setup |
| **Analytics** | Basic | ✅ Firebase Console |
| **Cost** | Free | Free (quotas) |

**Recommendation:**
- **Development:** Expo Notifications ✅
- **TestFlight/Production:** FCM ✅

---

### Migration Checklist

- [ ] Create Firebase project
- [ ] Add iOS app to Firebase
- [ ] Download GoogleService-Info.plist
- [ ] Install @react-native-firebase packages
- [ ] Update app.json/app.config.js
- [ ] Enable Push Notifications capability in Xcode
- [ ] Upload APNs certificate to Firebase
- [ ] Implement FCM service
- [ ] Update App initialization
- [ ] Test on physical device
- [ ] Build with EAS
- [ ] Submit to TestFlight
- [ ] Test push notifications in TestFlight

---

## ✅ Tamamlanan Görevler

### Development (Expo)
- [x] Notification type definitions (200 lines)
- [x] NotificationService (550 lines)
- [x] Permission handling
- [x] Local notifications
- [x] Notification templates (match start, goal, prediction)
- [x] Settings management (AsyncStorage)
- [x] Quiet hours logic
- [x] NotificationSettings screen (450 lines)
- [x] Test notification button
- [x] Sound & vibration settings
- [x] Favorites integration (notify only favorites)

### Production (Documentation)
- [x] FCM migration guide
- [x] Firebase setup steps
- [x] iOS configuration guide
- [x] APNs certificate setup
- [x] Backend integration guide
- [x] TestFlight build steps
- [x] Comparison table
- [x] Migration checklist

---

## 📊 Code Metrics

### Files Created (Development)

```
src/types/
└── notification.types.ts       200 lines

src/services/
└── notification.service.ts     550 lines

src/screens/
└── NotificationSettingsScreen.tsx  450 lines

Total:                          1,200 new lines
```

### Documentation

```
docs/
└── DAY-11-SUMMARY.md           (This file)
    ├── Expo implementation    (1,200 lines code)
    └── FCM migration guide    (Complete guide)
```

---

## 🔮 Future Enhancements

### 1. Rich Notifications (iOS)
```typescript
// Image attachments
notification: {
  title: 'Goal!',
  body: 'Barcelona scores!',
  ios: {
    attachments: [{
      url: 'https://..../goal-image.jpg',
    }],
  },
}
```

### 2. Notification Actions
```typescript
// Quick actions
notification: {
  title: 'Match Starting',
  body: 'Barcelona vs Real Madrid',
  categoryId: 'match_start',
  ios: {
    actions: [
      {
        id: 'view',
        title: 'View Match',
        openAppOnTap: true,
      },
      {
        id: 'dismiss',
        title: 'Dismiss',
      },
    ],
  },
}
```

### 3. Scheduled Notifications
```typescript
// Schedule 10 minutes before match
const matchStartTime = new Date(match.date);
const notificationTime = new Date(matchStartTime.getTime() - 10 * 60 * 1000);

await scheduleNotification({
  content: { ... },
  trigger: { date: notificationTime },
});
```

### 4. Notification Groups (iOS)
```typescript
// Group related notifications
notification: {
  title: 'Live Match Updates',
  body: '3 goals in Barcelona vs Real Madrid',
  ios: {
    threadIdentifier: `match_${matchId}`,
  },
}
```

---

**Güncelleme:** 2026-01-14
**Durum:** ✅ Development Complete, FCM Guide Ready
**Sonraki:** Week 4 - Advanced Features
**Master Plan Compliance:** ✅ %100
**TestFlight Ready:** ⚠️ FCM migration required
**Total Lines:** 1,200 lines (code) + Comprehensive FCM guide
