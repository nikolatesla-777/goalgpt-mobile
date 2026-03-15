# CLAUDE.md - GoalGPT Mobile Proje Hafiza Karti

> Bu dosya mobil projenin "ana yasasi" olarak kabul edilmelidir.
> Her seferinde sifirdan ogrenmeni engellemek icin bu dosyayi oku!

---

## PROJE DURUMU

| Metrik | Deger |
|--------|-------|
| **Genel Saglik** | B+ (Iyi) |
| **Uretim Hazirligi** | %65 |
| **Kod Satiri** | 64,571 TypeScript/TSX |
| **Component Sayisi** | 231 dosya |
| **Test Coverage** | %50 (hedef: %70) |
| **Son Guncelleme** | 2026-03-15 |

---

## 1. TECH STACK

### Core Framework
| Teknoloji | Versiyon | Not |
|-----------|----------|-----|
| React Native | 0.81.5 | Latest stable |
| Expo | ~54.0.31 | Managed workflow |
| React | 19.1.0 | Latest |
| TypeScript | ~5.9.2 | Strict mode |
| Hermes | Enabled | JS engine |

### State & Data
| Teknoloji | Amac |
|-----------|------|
| React Context | Global state (Auth, Theme, Favorites) |
| TanStack React Query | Server state caching |
| AsyncStorage | Local persistence |
| SecureStore | Token storage (encrypted) |

### Navigation & UI
| Teknoloji | Amac |
|-----------|------|
| React Navigation v7 | Routing |
| Expo Router | File-based routing |
| Reanimated v4 | Animations |
| Lottie | Complex animations |

### Backend Integration
| Teknoloji | Amac |
|-----------|------|
| Axios | HTTP client |
| WebSocket | Real-time updates |
| Firebase | Auth + FCM |
| Sentry | Error tracking |

---

## 2. KLASOR YAPISI

```
goalgpt-mobile/
├── app/                        # Expo Router sayfalari
│   ├── (tabs)/                 # Bottom tab navigation
│   ├── (auth)/                 # Auth akisi
│   └── (onboarding)/           # Onboarding akisi
│
├── src/
│   ├── api/                    # API client (13 dosya)
│   │   ├── client.ts           # Axios + interceptors + token refresh
│   │   ├── auth.api.ts         # Login, register, refresh
│   │   ├── matches.api.ts      # Mac verileri
│   │   ├── predictions.api.ts  # AI tahminleri
│   │   └── user.api.ts         # Kullanici profili
│   │
│   ├── components/             # Atomic Design pattern
│   │   ├── atoms/              # NeonText, FavoriteButton, GlassCard
│   │   ├── molecules/          # MatchCard, PredictionCard, TeamBadge
│   │   ├── organisms/          # BlogSlider, MobilePredictionCard
│   │   ├── ui/                 # Button, Input, Card, Spinner
│   │   ├── skeletons/          # Loading placeholders
│   │   └── errors/             # ErrorBoundary, ErrorState
│   │
│   ├── screens/                # 31 ekran
│   │   ├── auth/               # Login, Register, Welcome
│   │   ├── home/               # HomeScreen
│   │   ├── live/               # LiveScreen
│   │   ├── predictions/        # PredictionsScreen
│   │   └── profile/            # ProfileScreen
│   │
│   ├── context/                # Global state providers
│   │   ├── AuthContext.tsx     # Auth state + methods
│   │   ├── ThemeContext.tsx    # Dark/Light tema
│   │   ├── FavoritesContext.tsx
│   │   ├── WebSocketContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── hooks/                  # 13 custom hook
│   │   ├── useWebSocket.ts     # Real-time updates
│   │   ├── useCachedData.ts    # Cache + offline
│   │   ├── useNetworkStatus.ts # Connectivity
│   │   └── usePredictionStats.ts
│   │
│   ├── services/               # 26 servis dosyasi
│   │   ├── websocket.service.ts
│   │   ├── firebase.service.ts
│   │   ├── analytics.service.ts
│   │   └── notifications.service.ts
│   │
│   ├── constants/
│   │   ├── theme.ts            # Design tokens
│   │   ├── api.ts              # API endpoints
│   │   └── config.ts           # App config
│   │
│   ├── types/                  # TypeScript tipleri
│   └── utils/                  # Yardimci fonksiyonlar
│       ├── errorHandler.ts     # Error parsing
│       ├── logger.ts           # Structured logging
│       └── cache.ts            # Cache utilities
│
├── assets/
│   ├── fonts/                  # Nohemi (brand font)
│   ├── images/
│   └── animations/             # Lottie files
│
├── __tests__/                  # Test dosyalari
│   ├── components/
│   ├── services/
│   ├── integration/
│   └── e2e/
│
└── [Config Files]
    ├── app.json                # Expo config
    ├── eas.json                # EAS Build config
    ├── metro.config.js         # Bundle optimization
    ├── jest.config.js          # Test config
    └── tsconfig.json           # TypeScript config
```

---

## 3. ONEMLI DOSYALAR

### Core Files
| Dosya | Aciklama | Satir |
|-------|----------|-------|
| `src/api/client.ts` | Axios instance, token refresh, retry logic | ~300 |
| `src/context/AuthContext.tsx` | Auth state, login/logout methods | ~400 |
| `src/services/websocket.service.ts` | WebSocket connection, reconnection | ~350 |
| `src/navigation/AppNavigator.tsx` | Root navigation, deep linking | ~500 |

### Screens
| Dosya | Aciklama |
|-------|----------|
| `src/screens/HomeScreen.tsx` | Ana sayfa, predictions, tabs |
| `src/screens/live/LiveScreen.tsx` | Canli skorlar, favorites |
| `src/screens/MatchDetailScreen.tsx` | Mac detayi (824 satir) |
| `src/screens/ProfileScreenContainer.tsx` | Profil, settings |

### Components
| Dosya | Aciklama |
|-------|----------|
| `src/components/molecules/MatchCard.tsx` | Mac karti, animations |
| `src/components/atoms/NeonText.tsx` | Brand text, glow effects |
| `src/components/ui/Button.tsx` | 4 variant, 3 size |
| `src/components/ui/GlassCard.tsx` | Glassmorphism container |

---

## 4. NAVIGATION YAPISI

```
Root Navigator
├── AnimatedSplash (Overlay)
│
├── AuthStack (isAuthenticated: false)
│   ├── Onboarding
│   ├── Login
│   └── Register
│
└── RootStack (isAuthenticated: true)
    ├── MainTabs
    │   ├── Home          → HomeScreen
    │   ├── Live          → LiveScreen
    │   ├── Predictions   → PredictionsScreen
    │   ├── Store         → StoreScreen
    │   └── Profile       → ProfileScreen
    │
    └── Modal Screens
        ├── MatchDetail   → { matchId: string }
        ├── BotDetail     → { botId: number }
        ├── BlogDetail    → { post: any }
        └── DailyRewards
```

### Deep Linking
```typescript
// Desteklenen URL'ler
goalgpt://                    // Custom scheme
https://goalgpt.com/match/123 // Universal link
https://goalgpt.com/bot/456   // Bot detail

// linkingConfig.ts
prefixes: ['goalgpt://', 'https://goalgpt.com', 'https://www.goalgpt.com']
```

---

## 5. STATE YONETIMI

### Context Provider Hierarchy
```tsx
<AuthProvider>           // Kullanici oturumu
  <ThemeProvider>        // Dark/Light tema
    <FavoritesProvider>  // Favori takimlar
      <WebSocketProvider> // Canli guncellemeler
        <ToastProvider>  // Bildirimler
          <App />
        </ToastProvider>
      </WebSocketProvider>
    </FavoritesProvider>
  </ThemeProvider>
</AuthProvider>
```

### AuthContext API
```typescript
interface AuthContextValue {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Methods
  signInWithEmail(email: string, password: string): Promise<void>;
  signInWithGoogle(idToken: string): Promise<void>;
  signInWithApple(): Promise<void>;
  signInWithPhone(phone: string): Promise<void>;
  signOut(): Promise<void>;
  refreshUser(): Promise<void>;
}
```

---

## 6. API CLIENT MIMARISI

### Token Management
```typescript
// SecureStore ile encrypted storage
TokenStorage.setTokens(accessToken, refreshToken)
TokenStorage.getAccessToken()
TokenStorage.clearTokens()
```

### Request Interceptor
```typescript
// Her request'e otomatik token ekleme
config.headers.Authorization = `Bearer ${token}`;
```

### Response Interceptor
```typescript
// 401 handling with queue system
if (status === 401 && !originalRequest._retry) {
  if (isRefreshing) {
    // Queue'ya ekle, refresh bitince retry
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(apiClient(originalRequest));
      });
    });
  }
  // Token refresh yap
  isRefreshing = true;
  const newToken = await refreshAccessToken();
  onTokenRefreshed(newToken);
}
```

### Retry Logic
```typescript
// Exponential backoff
MAX_RETRY_ATTEMPTS = 3
delays: 1s → 2s → 4s

// Retry edilenler
- Network errors
- 502, 503, 504 responses
```

---

## 7. WEBSOCKET IMPLEMENTASYONU

### Connection Config
```typescript
reconnectInterval: 3000ms
maxReconnectAttempts: 10
heartbeatInterval: 25000ms
```

### Reconnection (Exponential Backoff)
```typescript
delay = min(3000 * 2^(attempts-1), 30000)
// 3s → 6s → 12s → 24s → 30s (max)
```

### Event Types
```typescript
// Match events
'match:update'    // Genel guncelleme
'match:score'     // Skor degisimi
'match:status'    // Durum degisimi
'match:event'     // Gol, kart, vs.
'match:stats'     // Istatistikler

// System events
'MINUTE_UPDATE'   // Dakika guncellemesi
'PING'            // Heartbeat (auto-pong)
```

---

## 8. TEMA SISTEMI

### Renkler
```typescript
// Brand
PRIMARY: '#4BC41E'        // Neon Green
BACKGROUND: '#000000'     // OLED Black
SURFACE: '#141414'        // Card background
TEXT: '#FFFFFF'           // Primary text

// Semantic
SUCCESS: '#00E676'
ERROR: '#FF1744'
WARNING: '#FFEA00'
INFO: '#00B0FF'

// XP Levels
BRONZE: '#CD7F32'
SILVER: '#C0C0C0'
GOLD: '#FFD700'
PLATINUM: '#E5E4E2'
DIAMOND: '#B9F2FF'
VIP_ELITE: '#4BC41E'
```

### Typography
```typescript
// Fonts
UI: 'Nohemi'              // Brand font
DATA: 'SF Mono'           // Monospace

// Sizes
xs: 10, sm: 12, md: 14, base: 16, lg: 18, xl: 20, 2xl: 24, 3xl: 32
```

### Spacing (8pt Grid)
```typescript
xs: 4, sm: 8, md: 16, lg: 24, xl: 32, 2xl: 48, 3xl: 64
```

### Glassmorphism
```typescript
// 3 intensity level
default: rgba(23, 80, 61, 0.65)
intense: rgba(3, 39, 29, 0.85)   // Live matches
subtle: rgba(22, 104, 102, 0.45)
```

---

## 9. COMPONENT PATTERNS

### Button Variants
```typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'vip';
type ButtonSize = 'small' | 'medium' | 'large';

// Usage
<Button variant="primary" size="medium" onPress={handlePress}>
  Submit
</Button>
```

### GlassCard
```typescript
<GlassCard intensity="intense" padding={spacing.md}>
  {/* Live match content */}
</GlassCard>
```

### NeonText
```typescript
<NeonText color="brand" pulse={isLive}>
  LIVE
</NeonText>
```

### Animations
```typescript
// Press animation (useNativeDriver: true)
Animated.spring(scaleAnim, {
  toValue: 0.95,
  damping: 15,
  stiffness: 150,
  useNativeDriver: true,
});
```

---

## 10. ERROR HANDLING

### AppError Types
```typescript
type ErrorType = 'network' | 'server' | 'validation' | 'auth' | 'notFound' | 'unknown';

// Status code mapping
500, 502, 503, 504 → 'server'
401, 403           → 'auth'
400, 422           → 'validation'
404                → 'notFound'
No response        → 'network'
```

### ErrorBoundary
```typescript
// Global error boundary in App.tsx
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

### Sentry Integration
```typescript
// Capture edilenler
- Server errors (5xx)
- Unknown errors
- Auth failures (401)

// Capture edilmeyenler
- Network errors (expected)
- Validation errors (user input)
```

---

## 11. BILINEN SORUNLAR

### KRITIK (Yayindan Once Cozulmeli)

| Sorun | Dosya | Etki |
|-------|-------|------|
| Legal dokuman URL'leri eksik | - | App Store rejection |
| AdMob placeholder ID | app.json | Crash on launch |
| Screenshots eksik | - | Store submission blocked |
| Firebase project mismatch | google-services.json | Wrong analytics |

### ONEMLI (Yakin Zamanda)

| Sorun | Dosya | Cozum |
|-------|-------|-------|
| Profile navigation TODO | ProfileScreenContainer.tsx:118 | Navigate implement et |
| Favorites persistence TODO | LiveScreen.tsx:41 | AsyncStorage kullan |
| AdMob integration TODO | HomeScreen.tsx:275 | Rewarded video ekle |
| LoginScreen_backup.tsx | src/screens/ | Sil (git history var) |

### TEKNIK BORC

| Sorun | Miktar | Oncelik |
|-------|--------|---------|
| `any` type kullanimi | 18 instance | Medium |
| Duplicate services | deepLink, notification | Medium |
| Duplicate ErrorBoundary | 2 implementation | Low |
| Console.log statements | 42 dosyada | Low |

---

## 12. ACCESSIBILITY DURUM

### Iyi
- Touch targets: 44-56px minimum (WCAG 2.5 AAA)
- Color contrast (dark theme): AA+ compliant
- Loading states: Skeleton components

### Eksik
- `accessibilityLabel` yok (KRITIK)
- `accessibilityRole` yok
- Light theme green contrast fails WCAG
- Keyboard navigation yok

### Cozum
```typescript
// Her interactive component'e ekle:
<Pressable
  accessible={true}
  accessibilityLabel="Submit button"
  accessibilityRole="button"
  accessibilityState={{ disabled }}
>
```

---

## 13. PERFORMANCE OPTIMIZASYONLARI

### Yapilmis
- Hermes JS engine (bundle size -20%)
- Code splitting (lazy loading)
- Metro minification (terser)
- Console removal in production
- useNativeDriver: true for animations

### Yapilmasi Gereken
- FlatList for long lists (ScrollView kullaniliyor)
- React.memo() for pure components
- Image caching (expo-image kullan)
- AbortController for async operations

---

## 14. BUILD & DEPLOYMENT

### EAS Build Profiles
| Profile | Distribution | Platform | Use Case |
|---------|--------------|----------|----------|
| development | internal | iOS Sim + Android APK | Local dev |
| staging | internal | iOS + Android APK | QA testing |
| preview | internal | iOS + Android APK | Stakeholder review |
| production | store | iOS + Android AAB | App stores |

### Komutlar
```bash
# Development
npm install
npx expo start

# Build
eas build --profile development --platform ios
eas build --profile production --platform all

# Submit
eas submit --platform ios
eas submit --platform android
```

### Environment Variables
```bash
# .env.example temel alinarak .env olustur
API_URL=https://partnergoalgpt.com/api
WS_URL=wss://partnergoalgpt.com/ws
FIREBASE_API_KEY=...
REVENUECAT_API_KEY=...
SENTRY_DSN=...
```

---

## 15. TEST YAPISI

### Jest Config
```javascript
preset: 'jest-expo'
coverageThreshold: 50% (hedef: 70%)
setupFiles: ['__tests__/setup.ts']
```

### Test Kategorileri
```
__tests__/
├── components/     # Component tests
├── services/       # Service unit tests
├── integration/    # Context + data flow
├── e2e/            # Authentication flows
└── utils/          # Utility function tests
```

### Komutlar
```bash
npm test              # Run tests
npm run test:coverage # Coverage report
```

---

## 16. GUVENLIK ONLEMLERI

### Iyi
- SecureStore (encrypted token storage)
- Token refresh with queue system
- Sensitive data filtering in Sentry
- HTTPS/WSS only

### Eksik
- Certificate pinning yok
- Session revocation yok
- Rate limiting client-side yok
- Biometric authentication yok

---

## 17. YAYINA HAZIRLIK CHECKLIST

### Kritik (Blocker)
- [ ] Privacy Policy URL'i canli
- [ ] Terms of Service URL'i canli
- [ ] App Store screenshots (6 adet)
- [ ] Play Store feature graphic
- [ ] AdMob gercek ID
- [ ] Apple Developer Account ($99)
- [ ] Google Play Account ($25)

### Onemli
- [ ] TODO'lari tamamla (4 adet)
- [ ] Backup dosyalarini sil
- [ ] Duplicate services birlestir
- [ ] Test coverage %70'e cikart

### Nice-to-have
- [ ] Accessibility labels ekle
- [ ] Performance monitoring
- [ ] Structured logging

---

## 18. MIMARI SKORLAR

| Kategori | Skor | Durum |
|----------|------|-------|
| Component Organization | 8/10 | Solid |
| Hooks Quality | 8.5/10 | Excellent |
| Navigation | 8/10 | Well-designed |
| State Management | 8/10 | Good |
| Error Handling | 9/10 | Industry-standard |
| UI/UX Consistency | 8/10 | Professional |
| Performance | 6.5/10 | Needs optimization |
| Accessibility | 2/10 | Critical gap |
| Security | 7/10 | Good fundamentals |
| Build/Deploy | 6/10 | Incomplete |
| **GENEL** | **7.5/10** | **Iyi** |

---

## 19. HIZLI REFERANS

### API Endpoints
```typescript
AUTH.LOGIN:      POST /auth/login
AUTH.REGISTER:   POST /auth/register
AUTH.REFRESH:    POST /auth/refresh
AUTH.ME:         GET  /auth/me

MATCHES.LIVE:    GET  /matches/live
MATCHES.DETAIL:  GET  /matches/:id
MATCHES.H2H:     GET  /matches/:id/h2h

PREDICTIONS:     GET  /predictions
PREDICTIONS.BOT: GET  /predictions/bot/:id
```

### WebSocket Events
```typescript
// Subscribe
ws.send({ type: 'subscribe', matchIds: [123, 456] })

// Receive
onMessage: (event) => {
  if (event.type === 'match:score') {
    // Update UI
  }
}
```

### Token Flow
```
1. Login → accessToken + refreshToken
2. SecureStore'a kaydet
3. Her request'e accessToken ekle
4. 401 alirsan refreshToken ile yenile
5. Refresh basarisizsa logout
```

---

## 20. ILETISIM & KAYNAKLAR

### Production
- **API**: https://partnergoalgpt.com/api
- **WebSocket**: wss://partnergoalgpt.com/ws
- **Domain**: goalgpt.com

### Bundle IDs
- **iOS**: com.wizardstech.goalgpt
- **Android**: com.wizardstech.goalgpt

### Versiyon
- **App Version**: 1.0.1
- **Build Number**: 2

---

**Son Guncelleme**: 2026-03-15
**Analiz Eden**: Claude (Multi-Role Analysis)
**Versiyon**: 2.0
