# Week 3 Implementation Plan - Backend Integration & State Management

**Duration:** Days 14-20 (7 days)
**Focus:** API Integration, State Management, Authentication Flow, Data Persistence
**Goal:** Connect frontend to backend, implement global state, complete user flows

---

## Week 3 Overview

Week 2'de 8 ekran ve 50+ bileşen oluşturduk. Week 3'te bu ekranları backend API'ye bağlayacak, global state management ekleyecek ve gerçek veri akışını kuracağız.

### Main Objectives

1. **Backend Integration** - API client kurulumu ve tüm endpoint'lerin bağlanması
2. **State Management** - Context API veya Redux ile global state
3. **Authentication Flow** - Gerçek login/logout/token yönetimi
4. **Data Persistence** - AsyncStorage ile offline data caching
5. **Real-time Updates** - WebSocket bağlantısı için altyapı
6. **Error Handling** - Kapsamlı hata yönetimi ve retry logic
7. **Performance** - Optimizasyon ve caching stratejileri

---

## Day-by-Day Breakdown

### Day 14: API Client & Service Layer
**Focus:** Backend bağlantısı için temel altyapı

#### Deliverables
- [ ] API client konfigürasyonu (axios/fetch wrapper)
- [ ] Request/response interceptors
- [ ] Error handling middleware
- [ ] Base URL ve environment management
- [ ] Auth token injection
- [ ] Refresh token logic
- [ ] API response types (TypeScript interfaces)

#### Files to Create
```
src/api/
├── client.ts              # Axios instance configuration
├── interceptors.ts        # Request/response interceptors
├── types.ts              # API response types
└── endpoints.ts          # API endpoint constants

src/services/
├── auth.service.ts       # Authentication API calls
├── matches.service.ts    # Match data API calls
├── leagues.service.ts    # League data API calls
├── news.service.ts       # News API calls
├── predictions.service.ts # Predictions API calls
└── user.service.ts       # User profile API calls
```

#### Implementation Details

**API Client Setup:**
```typescript
// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 - Refresh token or logout
    // Handle 500 - Show error message
    // Handle network errors
    return Promise.reject(error);
  }
);
```

**Service Example:**
```typescript
// src/services/matches.service.ts
export const matchesService = {
  getLiveMatches: async (): Promise<Match[]> => {
    const response = await apiClient.get('/matches/live');
    return response.data;
  },

  getMatchById: async (id: number): Promise<MatchDetail> => {
    const response = await apiClient.get(`/matches/${id}`);
    return response.data;
  },

  // ... other methods
};
```

#### Success Criteria
- ✅ API client successfully makes requests to backend
- ✅ Auth token automatically injected in requests
- ✅ Error handling catches and processes all error types
- ✅ TypeScript compilation: 0 errors
- ✅ Environment variables properly configured

---

### Day 15: Authentication Context & Flow
**Focus:** Global authentication state ve user session yönetimi

#### Deliverables
- [ ] AuthContext implementation
- [ ] useAuth custom hook
- [ ] Login/logout/register integration
- [ ] Token storage and retrieval
- [ ] Protected routes implementation
- [ ] Auto-login on app start
- [ ] Session timeout handling

#### Files to Create
```
src/context/
├── AuthContext.tsx       # Auth state and methods
└── AuthProvider.tsx      # Auth context provider

src/hooks/
├── useAuth.ts           # Auth hook for components
└── useProtectedRoute.ts # Route protection hook

app/
└── _layout.tsx          # Update with auth check
```

#### Implementation Details

**AuthContext:**
```typescript
// src/context/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize - Check for saved token
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (token) {
        // Validate token and fetch user data
        const userData = await authService.validateToken(token);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await AsyncStorage.removeItem('@auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    await AsyncStorage.setItem('@auth_token', response.token);
    setUser(response.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@auth_token');
    setUser(null);
    // Navigate to login
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

**useAuth Hook:**
```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**App Layout with Auth:**
```typescript
// app/_layout.tsx
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack>
            {/* Auth routing logic */}
          </Stack>
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

#### Success Criteria
- ✅ User can login and session persists
- ✅ User can logout and session clears
- ✅ Auto-login on app restart works
- ✅ Protected routes redirect to login
- ✅ User data accessible throughout app
- ✅ Token refresh works automatically

---

### Day 16: Matches Screen Integration
**Focus:** Canlı maç verilerini API'den çekme ve gerçek zamanlı güncelleme

#### Deliverables
- [ ] Live matches API integration
- [ ] Match filters API integration
- [ ] Real-time score updates via polling/WebSocket
- [ ] Match detail data fetching
- [ ] Pull-to-refresh implementation
- [ ] Error states for failed requests
- [ ] Loading skeletons for better UX

#### Implementation Updates

**Update MatchesScreen:**
```typescript
// app/(tabs)/matches.tsx
import { matchesService } from '../../src/services/matches.service';

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
    // Set up polling for live updates every 30s
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, [selectedDate, selectedLeague, selectedStatus]);

  const fetchMatches = async () => {
    try {
      setError(null);
      const data = await matchesService.getLiveMatches({
        date: selectedDate,
        leagueId: selectedLeague,
        statusId: selectedStatus,
      });
      setMatches(data);
    } catch (err) {
      setError('Maçlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

#### Success Criteria
- ✅ Live matches load from API
- ✅ Filters work with API queries
- ✅ Real-time updates every 30s
- ✅ Pull-to-refresh works
- ✅ Error handling shows user-friendly messages
- ✅ Loading states show skeletons

---

### Day 17: Profile & User Data Integration
**Focus:** Kullanıcı profili, istatistikler ve ayarlar API'ye bağlama

#### Deliverables
- [ ] User profile API integration
- [ ] User stats API integration
- [ ] Profile update functionality
- [ ] Settings save to backend
- [ ] Avatar upload
- [ ] Password change implementation
- [ ] Notifications preferences sync

#### Implementation Updates

**Update ProfileScreen:**
```typescript
// app/(tabs)/profile.tsx
import { userService } from '../../src/services/user.service';

export default function ProfileScreen() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const data = await userService.getUserStats(user.id);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleUpdateProfile = async (data: Partial<User>) => {
    try {
      await updateUser(data);
      Alert.alert('Başarılı', 'Profil güncellendi');
    } catch (err) {
      Alert.alert('Hata', 'Profil güncellenemedi');
    }
  };

  // ... rest of component
}
```

#### Success Criteria
- ✅ User profile loads from API
- ✅ User stats load from API
- ✅ Profile updates save to backend
- ✅ Settings sync with backend
- ✅ Avatar upload works
- ✅ Password change works

---

### Day 18: Data Caching & Offline Support
**Focus:** AsyncStorage ile veri önbellekleme ve offline çalışma

#### Deliverables
- [ ] Cache strategy implementation
- [ ] Offline data persistence
- [ ] Cache invalidation logic
- [ ] Optimistic updates
- [ ] Network status detection
- [ ] Offline indicator UI
- [ ] Sync on reconnection

#### Files to Create
```
src/utils/
├── cache.ts             # Cache management utilities
├── storage.ts           # AsyncStorage wrapper
└── network.ts           # Network status detection

src/hooks/
├── useCache.ts          # Cache hook
└── useNetworkStatus.ts  # Network status hook
```

#### Implementation Details

**Cache Utility:**
```typescript
// src/utils/cache.ts
export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      // Cache valid for 5 minutes
      if (age > 5 * 60 * 1000) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return data as T;
    } catch (error) {
      return null;
    }
  },

  set: async <T>(key: string, data: T): Promise<void> => {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  },

  invalidate: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};
```

**useCache Hook:**
```typescript
// src/hooks/useCache.ts
export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options = { cacheTime: 5 * 60 * 1000 }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [key]);

  const fetchData = async () => {
    // Try cache first
    const cached = await cache.get<T>(key);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    // Fetch from API
    try {
      const result = await fetcher();
      await cache.set(key, result);
      setData(result);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, refetch: fetchData };
};
```

#### Success Criteria
- ✅ Data cached after first fetch
- ✅ Cache served on subsequent requests
- ✅ Cache invalidates after TTL
- ✅ Offline mode works with cached data
- ✅ Network status detected and shown
- ✅ Data syncs when back online

---

### Day 19: Error Handling & Loading States
**Focus:** Kullanıcı deneyimi için gelişmiş hata yönetimi

#### Deliverables
- [ ] Global error boundary
- [ ] API error handling standardization
- [ ] Loading skeletons for all screens
- [ ] Retry mechanisms
- [ ] Toast/Snackbar notifications
- [ ] Network error recovery
- [ ] Fallback UI components

#### Files to Create
```
src/components/errors/
├── ErrorBoundary.tsx    # React error boundary
├── NetworkError.tsx     # Network error component
├── ApiError.tsx         # API error component
└── FallbackError.tsx    # Generic fallback

src/components/loading/
├── SkeletonCard.tsx     # Card skeleton
├── SkeletonList.tsx     # List skeleton
└── SkeletonProfile.tsx  # Profile skeleton

src/utils/
└── errorHandler.ts      # Error handling utilities
```

#### Implementation Details

**Error Boundary:**
```typescript
// src/components/errors/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return <FallbackError onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

**Toast Notification:**
```typescript
// src/utils/toast.ts
export const toast = {
  success: (message: string) => {
    // Show success toast
  },
  error: (message: string) => {
    // Show error toast
  },
  info: (message: string) => {
    // Show info toast
  },
};
```

#### Success Criteria
- ✅ Errors caught and displayed gracefully
- ✅ Loading skeletons shown during data fetch
- ✅ Retry buttons work on failed requests
- ✅ Toast notifications inform user of actions
- ✅ Network errors handled with recovery options
- ✅ App doesn't crash on errors

---

### Day 20: Testing, Optimization & Week 3 Review
**Focus:** Week 3'ün tamamlanması, test ve optimizasyon

#### Deliverables
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Memory leak checks
- [ ] Bundle size optimization
- [ ] API call optimization (batching, debouncing)
- [ ] Image optimization
- [ ] Code cleanup
- [ ] Week 3 summary documentation

#### Testing Checklist

**Authentication Flow:**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Auto-login on app restart
- [ ] Token refresh on expiry
- [ ] Protected routes redirect

**Data Fetching:**
- [ ] Matches load from API
- [ ] Match detail loads correctly
- [ ] Profile data loads
- [ ] News articles load
- [ ] Predictions load

**Caching:**
- [ ] Data cached after first fetch
- [ ] Cache served on subsequent requests
- [ ] Cache invalidates correctly
- [ ] Offline mode works

**Error Handling:**
- [ ] Network errors handled
- [ ] API errors handled
- [ ] Loading states shown
- [ ] Retry mechanisms work

**Performance:**
- [ ] App loads in <3s
- [ ] Smooth scrolling (60fps)
- [ ] No memory leaks
- [ ] Bundle size <5MB

#### Optimization Tasks

**API Call Optimization:**
```typescript
// Debounce search queries
const debouncedSearch = useMemo(
  () => debounce((query: string) => searchMatches(query), 500),
  []
);

// Batch multiple requests
const fetchAll = async () => {
  const [matches, leagues, news] = await Promise.all([
    matchesService.getLive(),
    leaguesService.getAll(),
    newsService.getLatest(),
  ]);
};
```

**Image Optimization:**
- Use optimized image formats (WebP)
- Lazy load images
- Image caching with react-native-fast-image

#### Week 3 Documentation
- [ ] Create WEEK-3-SUMMARY.md
- [ ] Document all API integrations
- [ ] Document state management architecture
- [ ] Create integration guide
- [ ] Update main README.md

#### Success Criteria
- ✅ All critical user flows tested and working
- ✅ Performance benchmarks met
- ✅ No memory leaks detected
- ✅ Bundle size optimized
- ✅ Documentation complete
- ✅ Ready for production deployment

---

## Week 3 Architecture

### State Management Flow
```
┌─────────────────┐
│   App Root      │
│   (_layout)     │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Providers │
    │ - Theme  │
    │ - Auth   │
    │ - Cache  │
    └────┬─────┘
         │
    ┌────▼─────────────┐
    │   Screens        │
    │ - useAuth()      │
    │ - useCache()     │
    │ - useAPI()       │
    └──────────────────┘
```

### Data Flow
```
Component → Hook → Service → API Client → Backend
   ↓                                           ↓
 State ← Cache ← Response ← Interceptor ← Response
```

### Authentication Flow
```
App Start
   ↓
Check AsyncStorage for @auth_token
   ↓
   ├─ Token exists → Validate → Set user → Main App
   └─ No token → Check @onboarding_completed
                    ↓
                    ├─ Completed → Login Screen
                    └─ Not completed → Onboarding
```

---

## Technical Stack (Week 3 Additions)

### State Management
- **Context API** - Global state (Auth, Theme, Cache)
- **AsyncStorage** - Local data persistence
- **React Query** (optional) - Server state management

### API Integration
- **Axios** - HTTP client
- **Interceptors** - Request/response middleware
- **TypeScript** - Full API type safety

### Error Handling
- **Error Boundary** - React error catching
- **Toast/Snackbar** - User notifications
- **Sentry** (optional) - Error tracking

### Performance
- **React.memo** - Component memoization
- **useMemo/useCallback** - Hook optimization
- **FlatList optimization** - Virtualization
- **Image caching** - Fast image loading

---

## Environment Variables

### Required Environment Variables
```env
# .env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_WS_URL=ws://localhost:3000/ws
EXPO_PUBLIC_ENV=development
```

### Production Environment
```env
# .env.production
EXPO_PUBLIC_API_URL=https://api.goalgpt.com
EXPO_PUBLIC_WS_URL=wss://api.goalgpt.com/ws
EXPO_PUBLIC_ENV=production
```

---

## Integration Points

### Backend Requirements
Week 3 için backend'den beklenen endpoint'ler:

**Authentication:**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Send reset code
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

**Matches:**
- `GET /api/matches/live` - Live matches
- `GET /api/matches/diary` - Matches by date
- `GET /api/matches/:id` - Match detail
- `GET /api/matches/:id/h2h` - Head to head
- `GET /api/matches/:id/lineup` - Lineup
- `GET /api/matches/:id/stats` - Live stats

**User:**
- `GET /api/user/profile` - User profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/stats` - User statistics
- `PUT /api/user/settings` - Update settings
- `POST /api/user/avatar` - Upload avatar
- `PUT /api/user/password` - Change password

**Leagues:**
- `GET /api/leagues` - All leagues
- `GET /api/leagues/:id` - League detail
- `GET /api/leagues/:id/standings` - Standings
- `GET /api/leagues/:id/fixtures` - Fixtures

**News:**
- `GET /api/news` - Latest news
- `GET /api/news/:id` - News detail
- `GET /api/news/categories` - News categories

**Predictions:**
- `GET /api/predictions/matched` - Matched predictions
- `GET /api/predictions/match/:id` - Match predictions

---

## Success Metrics

### Week 3 Goals
- ✅ 100% backend integration complete
- ✅ Authentication flow fully functional
- ✅ All screens loading real data
- ✅ Offline support with caching
- ✅ Error handling comprehensive
- ✅ Performance benchmarks met
- ✅ 0 TypeScript errors
- ✅ Ready for beta testing

### Performance Targets
- **App load time:** < 3 seconds
- **API response time:** < 1 second
- **Scroll performance:** 60 FPS
- **Memory usage:** < 200MB
- **Bundle size:** < 5MB

---

## Risk Management

### Potential Risks

**Risk 1: Backend API not ready**
- **Mitigation:** Mock API responses, use JSON server
- **Fallback:** Continue with mock data, implement later

**Risk 2: Authentication complexity**
- **Mitigation:** Start simple (JWT), add OAuth later
- **Fallback:** Basic auth with email/password only

**Risk 3: Performance issues**
- **Mitigation:** Profile early, optimize incrementally
- **Fallback:** Reduce features, prioritize critical paths

**Risk 4: State management complexity**
- **Mitigation:** Start with Context, migrate to Redux if needed
- **Fallback:** Keep state local where possible

---

## Week 3 Deliverables Summary

### Code
- API client with interceptors
- 6+ service files
- AuthContext and provider
- useAuth, useCache, useNetworkStatus hooks
- Error boundary and error components
- Loading skeletons for all screens
- Updated all screens with API integration

### Documentation
- WEEK-3-SUMMARY.md
- API integration guide
- State management documentation
- Testing guide
- Deployment guide

### Testing
- Integration tests for critical flows
- Performance benchmarks
- Memory leak checks
- Error scenario testing

---

## Next Steps (Week 4 Preview)

Week 4 potential focus areas:
1. **Advanced Features** - WebSocket real-time updates, push notifications
2. **Analytics** - User behavior tracking, crash reporting
3. **Optimization** - Code splitting, lazy loading, bundle optimization
4. **Testing** - Unit tests, E2E tests, automated testing
5. **Deployment** - App store preparation, beta testing, CI/CD

---

**Week 3 Start Date:** TBD
**Week 3 End Date:** TBD
**Status:** 📋 Planning Complete - Ready to Begin

---

## Notlar

- Her gün sonunda TypeScript compilation check yapılacak (0 errors target)
- Her gün sonunda progress dokümanı oluşturulacak
- API endpoint'ler backend ile koordine edilecek
- Mock data'dan real data'ya geçiş kademeli olacak
- Performance her gün monitor edilecek
- Git commit'ler günlük olarak yapılacak
