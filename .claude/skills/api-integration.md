---
name: api-integration
description: GoalGPT API entegrasyonu, TheSports/FootyStats API, endpoint kullanimi ve React Query kurallari
---

# GoalGPT API Integration Skill

## Mimari Genel Bakis

```
Mobile App (React Native)
    |
    | HTTPS (apiClient.ts)
    v
Backend API (Fastify)
    |
    ├── TheSports API (canli mac verileri)
    └── FootyStats API (istatistikler, xG, BTTS)
```

## API Dosya Yapisi (Mobile)

```
src/api/
├── client.ts          → Axios instance, interceptors, token refresh, retry
├── auth.api.ts        → Login, register, Google/Apple signin, refresh
├── matches.api.ts     → Canli maclar, detay, h2h, lineup, stats, trend
├── predictions.api.ts → AI tahminleri, mac tahminleri
├── user.api.ts        → Profil, stats, settings, avatar, password
├── xp.api.ts          → XP puanlari, transactions, leaderboard
├── credits.api.ts     → Kredi bakiye, ad-reward, purchase
├── badges.api.ts      → Rozetler, claim, unclaimed
├── referrals.api.ts   → Referans kodu, stats
├── leagues.api.ts     → Lig detaylari, standings, fixtures
├── teams.api.ts       → Takim detaylari, players, fixtures
└── news.api.ts        → Blog/haber icerikleri
```

## Base URL'ler

```typescript
// Mobile → Backend
Production: https://partnergoalgpt.com/api
WebSocket:  wss://partnergoalgpt.com/ws

// Backend → External APIs
TheSports:  https://api.thesports.com/v1/football
FootyStats: https://api.football-data-api.com

// Config: src/constants/api.ts + process.env.EXPO_PUBLIC_API_URL
```

---

## TheSports API (Backend Kullanimi)

### Authentication
```typescript
// Her request'e eklenir
params: {
  user: process.env.THESPORTS_API_USER,
  secret: process.env.THESPORTS_API_SECRET,
  page: 1  // Pagination icin
}
```

### Temel Endpointler

| Endpoint | Aciklama | Kullanim |
|----------|----------|----------|
| `/match/detail_live` | Canli mac detaylari | Skor, dakika, olaylar |
| `/match/list` | Mac listesi | Gunluk/haftalik maclar |
| `/match/recent` | Takimin son maclari | H2H hesaplamalari |
| `/match/lineup` | Kadro bilgileri | Ilk 11, yedekler |
| `/match/trend` | Dakika dakika trend | Grafik verileri |
| `/match/incidents` | Mac olaylari | Gol, kart, degisiklik |
| `/team/list` | Takim listesi | Sync icin |
| `/team/squad` | Takim kadrosu | Oyuncular |
| `/competition/list` | Lig listesi | Sync icin |
| `/season/list` | Sezon listesi | Sync icin |
| `/season/standings` | Puan durumu | Tablo |
| `/country/list` | Ulke listesi | Sync icin |
| `/category/list` | Kategori listesi | Futbol/basketbol |
| `/referee/list` | Hakem listesi | Mac hakem bilgisi |
| `/venue/list` | Stadyum listesi | Sync icin |

### Pagination Kurali
```typescript
// Sayfa 1'den basla, results bos gelene kadar devam et
let page = 1;
while (hasMore) {
  const response = await fetch(`${endpoint}?page=${page}`);
  if (response.results.length === 0) break;
  page++;
  await delay(200); // Rate limit: 200ms
}
```

### Rate Limiting
- Normal: 200ms delay between pages
- 429 Rate Limit: 60 saniye bekle, tekrar dene
- Max Retry: 3 deneme (exponential backoff)

### WebSocket Events (TheSports)
```typescript
// Baglanti
wss://thesports-websocket-url

// Eventler (backend'de parse edilir)
'match_detail_update'  → Skor/dakika degisimi
'match_incidents'      → Gol, kart olaylari
```

---

## FootyStats API (Backend Kullanimi)

### Authentication
```typescript
// Query param olarak
params: {
  key: process.env.FOOTYSTATS_API_KEY
}
```

### Temel Endpointler

| Endpoint | Aciklama | Donen Veri |
|----------|----------|------------|
| `/league-list` | Mevcut ligler | Ulke, sezon bilgileri |
| `/todays-matches` | Bugunun maclari | BTTS, xG, potansiyeller |
| `/match` | Mac detayi | H2H, odds, trends |
| `/league-teams` | Lig takimlari | Form, istatistikler |
| `/league-season` | Sezon stats | Lig geneli veriler |
| `/league-tables` | Puan durumu | Standings |
| `/league-players` | Lig oyunculari | Sayfalanmis (max 200) |
| `/player-stats` | Oyuncu detay | Gol, asist, dakika |
| `/lastx` | Son X mac formu | formRun, PPG, xG |
| `/referee` | Hakem stats | Kart/penalti ortalamasi |
| `/stats-data-btts` | BTTS istatistikleri | Top BTTS takimlari |
| `/stats-data-over25` | Over 2.5 stats | Top O2.5 takimlari |

### FootyStats Spesifik Veriler
```typescript
interface FootyStatsMatch {
  btts_potential: number;    // 0-100 BTTS olasiligi
  o25_potential: number;     // Over 2.5 olasiligi
  o15_potential: number;     // Over 1.5 olasiligi
  team_a_xg_prematch: number; // Ev sahibi beklenen gol
  team_b_xg_prematch: number; // Deplasuman beklenen gol
  corners_potential: number;  // Korner potansiyeli
  cards_potential: number;    // Kart potansiyeli
  h2h: {
    bttsPercentage: number;
    over25Percentage: number;
    avg_goals: number;
  };
}
```

### Rate Limiting
```typescript
// Token bucket: 30 req/min, 10 burst
requestsPerMinute: 30,
maxBurst: 10
// Retry: 3 deneme, exponential backoff (500ms → 2s → 10s)
```

---

## Mobile API Endpoints (Tum Liste)

### AUTH
```typescript
POST /api/auth/login         → Email/password giris
POST /api/auth/register      → Kayit
POST /api/auth/google/signin → Google OAuth
POST /api/auth/apple/signin  → Apple OAuth
POST /api/auth/phone/login   → Telefon ile giris
POST /api/auth/refresh       → Token yenileme
GET  /api/auth/me            → Kullanici bilgisi
POST /api/auth/logout        → Cikis
```

### MATCHES
```typescript
GET /api/matches/live              → Canli maclar
GET /api/matches/diary?date=X      → Tarihe gore maclar
GET /api/matches/:id               → Mac detayi
GET /api/matches/:id/h2h           → Kafa kafaya
GET /api/matches/:id/lineup        → Kadro
GET /api/matches/:id/live-stats    → Canli istatistikler
GET /api/matches/:id/trend         → Dakika trend verisi
```

### TEAMS
```typescript
GET /api/teams/:id           → Takim bilgisi
GET /api/teams/:id/fixtures  → Takim fiksturu
GET /api/teams/:id/standings → Takim puan durumu
GET /api/teams/:id/players   → Takim kadrosu
```

### COMPETITIONS
```typescript
GET /api/leagues/:id           → Lig bilgisi
GET /api/leagues/:id/fixtures  → Lig fiksturu
GET /api/leagues/:id/standings → Puan durumu
```

### PREDICTIONS
```typescript
GET  /api/predictions/matched       → Eslesmis tahminler
GET  /api/predictions/match/:id     → Mac tahminleri
POST /api/credits/purchase-prediction/:id → Premium tahmin satin al
```

### XP SYSTEM
```typescript
GET  /api/xp/me           → XP bilgisi
GET  /api/xp/transactions → XP gecmisi
GET  /api/xp/leaderboard  → Siralamalar
GET  /api/xp/login-streak → Giris serisi
POST /api/xp/grant        → XP ekle (admin)
```

### CREDITS
```typescript
GET  /api/credits/me           → Bakiye
GET  /api/credits/transactions → Gecmis
POST /api/credits/ad-reward    → Reklam odulu
GET  /api/credits/daily-stats  → Gunluk stats
```

### BADGES
```typescript
GET  /api/badges          → Tum rozetler
GET  /api/badges/my-badges → Kazanilan rozetler
POST /api/badges/claim    → Rozet al
GET  /api/badges/unclaimed → Alinmamis rozetler
```

### REFERRALS
```typescript
GET  /api/referrals/my-code     → Referans kodum
POST /api/referrals/apply       → Kod kullan
GET  /api/referrals/my-referrals → Davet ettigim
GET  /api/referrals/stats       → Istatistikler
```

### DAILY REWARDS
```typescript
GET  /api/daily-rewards/status  → Odul durumu
POST /api/daily-rewards/claim   → Odul al
GET  /api/daily-rewards/history → Gecmis
```

### COMMENTS
```typescript
GET    /api/comments/match/:matchId → Mac yorumlari
POST   /api/comments                → Yorum yaz
PUT    /api/comments/:id            → Guncelle
DELETE /api/comments/:id            → Sil
POST   /api/comments/:id/like       → Begen
DELETE /api/comments/:id/unlike     → Begeniyi kaldir
POST   /api/comments/:id/report     → Sikayet et
```

### NOTIFICATIONS
```typescript
POST /api/notifications/register-token → FCM token kaydet
DELETE /api/notifications/unregister-token
GET  /api/notifications/preferences
PUT  /api/notifications/preferences
GET  /api/notifications/history
PUT  /api/notifications/:id/read
```

### BLOG
```typescript
GET /api/blog         → Liste
GET /api/blog/:slug   → Detay
```

---

## Yeni API Dosyasi Sablonu

```tsx
// src/api/yeni.api.ts
import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface YeniType {
  id: string;
  name: string;
  // ...
}

export interface CreateYeniDto {
  name: string;
  // ...
}

// API Functions
export async function getYeniList(): Promise<YeniType[]> {
  try {
    const response = await apiClient.get<ApiResponse<YeniType[]>>(
      API_ENDPOINTS.YENI.LIST
    );
    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getYeniById(id: string): Promise<YeniType> {
  try {
    const response = await apiClient.get<ApiResponse<YeniType>>(
      `${API_ENDPOINTS.YENI.LIST}/${id}`
    );
    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createYeni(payload: CreateYeniDto): Promise<YeniType> {
  try {
    const response = await apiClient.post<ApiResponse<YeniType>>(
      API_ENDPOINTS.YENI.LIST,
      payload
    );
    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}
```

---

## React Query Hook Sablonu

```tsx
// src/hooks/useYeni.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getYeniList, getYeniById, createYeni } from '@/api/yeni.api';

export const YENI_KEYS = {
  all: ['yeni'] as const,
  list: () => [...YENI_KEYS.all, 'list'] as const,
  detail: (id: string) => [...YENI_KEYS.all, 'detail', id] as const,
};

// Liste hook
export const useYeniList = () =>
  useQuery({
    queryKey: YENI_KEYS.list(),
    queryFn: getYeniList,
    staleTime: 30000,  // 30 saniye fresh
  });

// Detay hook
export const useYeniDetail = (id: string) =>
  useQuery({
    queryKey: YENI_KEYS.detail(id),
    queryFn: () => getYeniById(id),
    enabled: !!id,  // id yoksa fetch yapma
  });

// Mutation hook
export const useCreateYeni = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createYeni,
    onSuccess: () => {
      // Liste cache'ini invalidate et
      queryClient.invalidateQueries({ queryKey: YENI_KEYS.list() });
    },
    onError: (error) => {
      console.error('Create failed:', error);
    },
  });
};
```

---

## Token Yonetimi (client.ts)

### SecureStore Kullanimi
```typescript
// Token kaydetme
await TokenStorage.setTokens(accessToken, refreshToken);

// Token okuma
const token = await TokenStorage.getAccessToken();

// Token silme (logout)
await TokenStorage.clearTokens();
```

### Token Refresh Flow
```
1. Request 401 alir
2. isRefreshing kontrolu (duplicate onleme)
3. /api/auth/refresh cagirilir
4. Yeni token'lar SecureStore'a yazilir
5. Bekleyen tum request'ler yeni token ile tekrarlanir
6. Refresh basarisizsa → clearTokens + logout
```

### Retry Logic
```typescript
MAX_RETRY_ATTEMPTS = 3
RETRY_DELAY_MS = 1000
RETRY_DELAY_MULTIPLIER = 2 // Exponential: 1s → 2s → 4s

// Retry edilenler
- Network errors
- 502, 503, 504 status
```

---

## WebSocket Events (Mobile)

### Baglanti
```typescript
// URL: wss://partnergoalgpt.com/ws
const ws = new WebSocket(API_ENDPOINTS.WS);
```

### Subscribe
```typescript
ws.send(JSON.stringify({
  type: 'subscribe',
  matchIds: [123, 456]
}));
```

### Event Tipleri
```typescript
'match:update'    → Genel guncelleme
'match:score'     → Skor degisimi { matchId, homeScore, awayScore }
'match:status'    → Durum degisimi { matchId, statusId, minute }
'match:event'     → Olay { matchId, eventType, minute, player }
'match:stats'     → Istatistik { matchId, possession, shots, ... }
'MINUTE_UPDATE'   → Dakika { matchId, minute }
'PING'            → Heartbeat (auto-pong)
```

---

## Hata Yonetimi

### handleApiError Response
```typescript
interface ApiError {
  message: string;    // Kullaniciya gosterilecek mesaj
  code?: string;      // NETWORK_ERROR, AUTH_ERROR, etc.
  status?: number;    // HTTP status code
  data?: any;         // Raw response data
}
```

### Status Code Mapping
```typescript
401, 403 → Auth hatasi, token refresh veya logout
400, 422 → Validation hatasi, formu duzelt
404      → Kayit bulunamadi
500+     → Server hatasi, retry edilebilir
Network  → Baglanti hatasi, retry edilebilir
```

---

## API-Ekran Eslesmesi

| Ekran | Kullanan API |
|-------|--------------|
| HomeScreen | matches/live, predictions/matched, blog |
| LiveScreen | matches/live, WebSocket |
| MatchDetailScreen | matches/:id, h2h, lineup, live-stats, trend |
| PredictionsScreen | predictions/matched |
| ProfileScreen | auth/me, xp/me, badges/my-badges |
| LeaderboardScreen | xp/leaderboard |
| DailyRewardsScreen | daily-rewards/status, claim |
| TeamDetailScreen | teams/:id, fixtures, standings, players |
| LeagueDetailScreen | leagues/:id, fixtures, standings |

---

## Kurallar

### YAPILMASI GEREKEN
- Her endpoint icin ayrı api dosyasi olustur
- Her api icin queryKey sabiti tanimla (YENI_KEYS pattern)
- Mutation sonrasi ilgili query'yi invalidate et
- Loading/error state MUTLAKA handle et
- Response type'i interface ile tanimla
- try/catch ile handleApiError kullan

### YASAK
- useEffect icinde fetch (React Query kullan)
- axios direkt import (apiClient kullan)
- any response type
- Token'i manuel header'a eklemek (interceptor yapar)
- API cagirisini direkt component icinde yapmak (hook kullan)

---

## Environment Degiskenleri

```bash
# Mobile (.env)
EXPO_PUBLIC_API_URL=https://partnergoalgpt.com/api
EXPO_PUBLIC_WS_URL=wss://partnergoalgpt.com/ws

# Backend (.env)
THESPORTS_API_USER=xxx
THESPORTS_API_SECRET=xxx
FOOTYSTATS_API_KEY=xxx
DATABASE_URL=postgres://...
```
