---
name: debug-fix
description: GoalGPT'de hata tespiti, debug süreci ve çözüm adımları
---

# GoalGPT Debug & Fix Skill

## Debug Öncelik Sırası
1. Sentry → Production hataları (sentry.io dashboard)
2. Console → Development logları (logger.ts)
3. React Query DevTools → Cache/fetch sorunları
4. Network → API response sorunları

## Hata Kategorileri ve Çözümleri

### Network Hatası
```tsx
// Belirti: "Network request failed"
// Kontrol et:
1. EXPO_PUBLIC_API_URL doğru mu? (.env)
2. Backend çalışıyor mu? (https://api.goalgpt.com/health)
3. WebSocket bağlantısı kopmuş mu? (WebSocketContext)

// Çözüm:
- src/api/client.ts → retry logic (3 deneme, exponential backoff)
- Offline durumu → useNetworkStatus hook
```

### Auth Hatası (401)
```tsx
// Belirti: Kullanıcı aniden çıkış yapıyor
// Kontrol et:
1. Token expire olmuş mu?
2. Refresh token geçerli mi?
3. client.ts interceptor çalışıyor mu?

// Çözüm:
- src/api/client.ts → subscribeTokenRefresh queue sistemi
- SecureStore token'ını kontrol et
- AuthContext.signOut() çağrıldı mı?
```

### WebSocket Hatası
```tsx
// Belirti: Canlı skorlar güncellenmiyor
// Kontrol et:
1. WebSocketContext bağlantı durumu
2. reconnectInterval: 3000ms (max 10 deneme)
3. PING/PONG heartbeat çalışıyor mu?

// Çözüm:
- src/services/websocket.service.ts
- reconnect: delay = min(3000 * 2^attempts, 30000)
```

### UI/Render Hatası
```tsx
// Belirti: Ekran boş, beyaz, veya crash
// Kontrol et:
1. ErrorBoundary yakaladı mı?
2. undefined/null data render ediliyor mu?
3. useTheme() doğru context'te mi?

// Çözüm:
- Optional chaining kullan: data?.field
- Loading state kontrol et: if (isLoading) return <Skeleton/>
- Error state kontrol et: if (error) return <ErrorState/>
```

### Theme/Stil Hatası
```tsx
// Belirti: Renkler yanlış, light/dark mode bozuk
// Kontrol et:
1. useTheme() kullanılıyor mu?
2. Hardcode renk var mı?
3. ThemeContext provider hierarchy doğru mu?

// Çözüm:
- theme-ui skill'e bak
- colors.background.primary kullan
- Light mode'da text.brand → '#2E7D1F'
```

### TypeScript Hatası
```tsx
// Belirti: Type error, any kullanımı
// Kontrol et:
1. src/types/ klasöründe tip tanımlı mı?
2. API response tipi any mi?
3. Navigation params tipi tanımlı mı?

// Çözüm:
- Interface tanımla, any kullanma
- src/types/navigation.ts → RootStackParamList
- API response için generic type kullan
```

## Logger Kullanımı
```tsx
import { logger } from '@/utils/logger';

logger.info('Kullanıcı giriş yaptı', { userId });
logger.error('API hatası', { error, endpoint });
logger.warn('Token yakında expire', { expiresIn });

// Production'da console.log KULLANMA
// logger otomatik Sentry'e iletir
```

## Sentry Hata Yakalama
```tsx
// Otomatik yakalananlar:
- Server errors (5xx)
- Unknown errors
- Auth failures (401)

// Manuel capture:
import * as Sentry from '@sentry/react-native';
Sentry.captureException(error);
Sentry.captureMessage('Kritik durum', 'warning');
```

## Performans Sorunları
```tsx
// Belirti: Ekran yavaş, scroll kasıyor
// Kontrol et:
1. FlatList yerine ScrollView mi kullanılıyor?
2. React.memo() eksik mi?
3. useCallback/useMemo eksik mi?
4. Image cache kullanılıyor mu?

// Çözüm:
- ScrollView → FlatList (uzun listeler için)
- React.memo() → sık render olan component'lar
- expo-image → image caching
```

## Debug Komutları
```bash
# Expo logları
npx expo start --clear

# TypeScript kontrol
npm run type-check

# Lint kontrol
npm run lint

# Test
npm test

# Bundle analiz
npx expo export --dump-sourcemap
```

## YASAK
- Production'da console.log bırakma (42 dosyada var, temizlenecek)
- Hata mesajını kullanıcıya direkt gösterme
- try/catch içinde sessizce yutma (en azından logger kullan)
- Sentry'e hassas veri gönderme (token, şifre)
