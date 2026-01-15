# Phase 12: Testing & QA - Implementation Plan

**Status**: 🚧 IN PROGRESS
**Priority**: HIGH
**Start Date**: January 15, 2026
**Target Completion**: 2-3 days

---

## 🎯 Objectives

Establish comprehensive testing infrastructure for the GoalGPT mobile app:
- Unit tests for critical services and utilities
- Component tests for UI components
- Integration tests for API and data flows
- E2E tests for critical user journeys
- Performance regression tests
- Test coverage reporting

---

## 📊 Testing Strategy

### Test Pyramid Approach:

```
           /\
          /E2E\          10% - Critical user flows
         /------\
        /  INT   \       20% - API, data flows, contexts
       /----------\
      /   UNIT     \     70% - Services, utilities, hooks
     /--------------\
```

### Coverage Targets:

| Category | Target Coverage | Priority |
|----------|----------------|----------|
| Services | 80%+ | HIGH |
| Utilities | 90%+ | HIGH |
| Hooks | 75%+ | MEDIUM |
| Components | 60%+ | MEDIUM |
| E2E Flows | 5 critical paths | HIGH |

---

## 🛠️ Testing Stack

### Core Testing Libraries:
```json
{
  "@testing-library/react-native": "^12.4.3",
  "@testing-library/jest-native": "^5.4.3",
  "jest": "^29.7.0",
  "react-test-renderer": "18.2.0",
  "@types/jest": "^29.5.11"
}
```

### E2E Testing:
```json
{
  "detox": "^20.18.4",
  "@wdio/cli": "^8.27.0" // Alternative
}
```

### Mocking:
```json
{
  "jest-mock-extended": "^3.0.5",
  "nock": "^13.5.0" // API mocking
}
```

---

## 📦 Phase 12 Tasks

### Task 1: Setup Testing Infrastructure ⚙️
**Priority**: HIGH
**Estimated Time**: 2 hours

#### Sub-tasks:
- [x] Review existing Jest configuration
- [ ] Install additional testing dependencies
- [ ] Configure test file structure
- [ ] Setup test utilities and helpers
- [ ] Configure coverage reporting
- [ ] Setup CI/CD test automation

#### Files to Create/Modify:
```
jest.config.js                          # Jest configuration
jest.setup.js                           # Global test setup
__tests__/                              # Test directory
  ├── unit/                             # Unit tests
  │   ├── services/                     # Service tests
  │   ├── utils/                        # Utility tests
  │   └── hooks/                        # Hook tests
  ├── integration/                      # Integration tests
  │   ├── api/                          # API tests
  │   └── contexts/                     # Context tests
  ├── components/                       # Component tests
  └── e2e/                              # E2E tests
__mocks__/                              # Mock files
  ├── api/
  ├── services/
  └── fixtures/                         # Test data
```

---

### Task 2: Unit Tests - Services 🔧
**Priority**: HIGH
**Estimated Time**: 4 hours

#### Services to Test:

**1. analytics.service.ts** (Priority: HIGH)
- [ ] Session management (start/end)
- [ ] Event tracking
- [ ] User properties
- [ ] Screen tracking
- [ ] Error handling

**2. cache.service.ts** (Priority: HIGH)
- [ ] Get/set cache entries
- [ ] TTL expiration
- [ ] Stale-while-revalidate
- [ ] LRU eviction
- [ ] Cache invalidation
- [ ] Memory limits

**3. websocket.service.ts** (Priority: HIGH)
- [ ] Connection establishment
- [ ] Reconnection logic
- [ ] Message handling
- [ ] Event subscriptions
- [ ] Error handling

**4. performance.service.ts** (Priority: MEDIUM)
- [ ] API call tracking
- [ ] Performance profiling
- [ ] Threshold detection

---

### Task 3: Unit Tests - Utilities 🔨
**Priority**: MEDIUM
**Estimated Time**: 2 hours

#### Utilities to Test:
- [ ] Date formatting utilities
- [ ] String manipulation utilities
- [ ] Validation utilities
- [ ] Type guards and assertions
- [ ] Helper functions

---

### Task 4: Unit Tests - Custom Hooks 🪝
**Priority**: MEDIUM
**Estimated Time**: 3 hours

#### Hooks to Test:

**1. useScreenTracking** (Priority: HIGH)
- [ ] Screen view tracking
- [ ] Duration calculation
- [ ] Cleanup on unmount

**2. useWebSocket** (Priority: HIGH)
- [ ] Connection state
- [ ] Event subscriptions
- [ ] Auto-reconnection

**3. useAuth** (Priority: HIGH)
- [ ] Login/logout flow
- [ ] Token management
- [ ] Session persistence

**4. useFavorites** (Priority: MEDIUM)
- [ ] Add/remove favorites
- [ ] Persistence
- [ ] State updates

---

### Task 5: Component Tests 🎨
**Priority**: MEDIUM
**Estimated Time**: 4 hours

#### Components to Test:

**1. Atomic Components** (Priority: LOW)
- [ ] NeonText - renders correctly
- [ ] GlassCard - applies styles
- [ ] LiveIndicator - shows status

**2. Molecular Components** (Priority: MEDIUM)
- [ ] MatchCard - displays match data
- [ ] TeamBadge - shows team info
- [ ] OptimizedImage - loading states

**3. Organism Components** (Priority: HIGH)
- [ ] LiveMatchCard - renders/updates
- [ ] MatchList - renders list
- [ ] PredictionsCard - displays predictions

**4. Screen Components** (Priority: HIGH)
- [ ] HomeScreen - loads data
- [ ] LiveMatchesScreen - filters work
- [ ] PredictionsScreen - bots display

---

### Task 6: Integration Tests 🔗
**Priority**: HIGH
**Estimated Time**: 4 hours

#### Integration Scenarios:

**1. API Integration** (Priority: HIGH)
- [ ] Fetch live matches
- [ ] Fetch predictions
- [ ] Authentication flow
- [ ] WebSocket connection
- [ ] Error handling
- [ ] Retry logic

**2. Context Integration** (Priority: HIGH)
- [ ] AuthContext + API integration
- [ ] WebSocketContext + message handling
- [ ] AnalyticsContext + event tracking
- [ ] FavoritesContext + persistence

**3. Navigation Integration** (Priority: MEDIUM)
- [ ] Deep link handling
- [ ] Screen navigation
- [ ] Tab switching
- [ ] Back navigation

---

### Task 7: E2E Tests 🎭
**Priority**: MEDIUM
**Estimated Time**: 6 hours

#### Critical User Flows:

**1. Authentication Flow** (Priority: HIGH)
```
Scenario: User logs in successfully
  Given I am on the login screen
  When I enter valid credentials
  And I tap the login button
  Then I should see the home screen
  And I should see my profile data
```

**2. Live Match Viewing** (Priority: HIGH)
```
Scenario: User views live match details
  Given I am logged in
  When I tap on a live match
  Then I should see match details
  And I should see live score updates
  And I should see match events
```

**3. Predictions Flow** (Priority: HIGH)
```
Scenario: User views bot predictions
  Given I am logged in
  When I navigate to predictions tab
  Then I should see list of bots
  When I tap on a bot
  Then I should see bot's predictions
  And I should see success rate
```

**4. Favorites Flow** (Priority: MEDIUM)
```
Scenario: User adds match to favorites
  Given I am viewing a match
  When I tap the favorite button
  Then the match should be favorited
  And I should see it in favorites tab
```

**5. Real-time Updates** (Priority: HIGH)
```
Scenario: User receives live score updates
  Given I am viewing a live match
  When the score changes on the backend
  Then I should see the updated score
  Within 2 seconds
```

---

### Task 8: Performance Tests ⚡
**Priority**: MEDIUM
**Estimated Time**: 3 hours

#### Performance Benchmarks:

**1. Bundle Size** (Priority: HIGH)
- [ ] Initial bundle < 3MB
- [ ] Lazy-loaded chunks < 500KB each
- [ ] Total app size < 50MB

**2. Load Times** (Priority: HIGH)
- [ ] Cold start < 2s
- [ ] Screen navigation < 300ms
- [ ] API calls < 500ms
- [ ] Image loading < 1s

**3. Memory Usage** (Priority: MEDIUM)
- [ ] Idle memory < 50MB
- [ ] Active memory < 100MB
- [ ] No memory leaks after 1 hour

**4. FPS Performance** (Priority: HIGH)
- [ ] List scrolling: 60 FPS
- [ ] Screen transitions: 60 FPS
- [ ] Animations: 60 FPS

---

### Task 9: Test Coverage & Reporting 📊
**Priority**: MEDIUM
**Estimated Time**: 2 hours

#### Coverage Setup:
- [ ] Configure Jest coverage
- [ ] Generate HTML coverage reports
- [ ] Setup coverage thresholds
- [ ] Integrate with CI/CD
- [ ] Create coverage badges

#### Coverage Thresholds:
```javascript
coverageThreshold: {
  global: {
    statements: 70,
    branches: 65,
    functions: 70,
    lines: 70
  },
  './src/services/': {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80
  }
}
```

---

### Task 10: CI/CD Integration 🚀
**Priority**: HIGH
**Estimated Time**: 3 hours

#### GitHub Actions Workflow:
- [ ] Run tests on every PR
- [ ] Run tests on main branch
- [ ] Generate coverage reports
- [ ] Fail build if tests fail
- [ ] Fail build if coverage drops
- [ ] Run E2E tests on staging

#### Workflow File:
```yaml
.github/workflows/test.yml
```

---

## 📝 Test Examples

### Unit Test Example:

```typescript
// __tests__/unit/services/cache.service.test.ts
describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  it('should cache and retrieve data', async () => {
    const key = 'test:data';
    const data = { value: 123 };
    const fetcher = jest.fn(() => Promise.resolve(data));

    const result = await cacheService.get(key, fetcher);

    expect(result).toEqual(data);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should return cached data on second call', async () => {
    const key = 'test:data';
    const data = { value: 123 };
    const fetcher = jest.fn(() => Promise.resolve(data));

    await cacheService.get(key, fetcher);
    const result = await cacheService.get(key, fetcher);

    expect(result).toEqual(data);
    expect(fetcher).toHaveBeenCalledTimes(1); // Only called once
  });

  it('should evict LRU entry when max size reached', async () => {
    // Test LRU eviction logic
  });
});
```

### Component Test Example:

```typescript
// __tests__/components/LiveMatchCard.test.tsx
describe('LiveMatchCard', () => {
  const mockMatch = {
    id: 1,
    homeTeam: { name: 'Barcelona', logoUrl: '...' },
    awayTeam: { name: 'Real Madrid', logoUrl: '...' },
    homeScore: 2,
    awayScore: 1,
    minute: 45,
    statusId: 2,
  };

  it('should render match data correctly', () => {
    const { getByText } = render(<LiveMatchCard match={mockMatch} />);

    expect(getByText('Barcelona')).toBeTruthy();
    expect(getByText('Real Madrid')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
  });

  it('should call onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <LiveMatchCard match={mockMatch} onPress={onPress} />
    );

    fireEvent.press(getByTestId('match-card'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Integration Test Example:

```typescript
// __tests__/integration/api/matches.test.ts
describe('Matches API Integration', () => {
  it('should fetch live matches successfully', async () => {
    const matches = await getLiveMatches();

    expect(Array.isArray(matches)).toBe(true);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]).toHaveProperty('id');
    expect(matches[0]).toHaveProperty('homeTeam');
    expect(matches[0]).toHaveProperty('awayTeam');
  });

  it('should handle API errors gracefully', async () => {
    // Mock API failure
    jest.spyOn(apiClient, 'get').mockRejectedValue(new Error('Network error'));

    await expect(getLiveMatches()).rejects.toThrow('Network error');
  });
});
```

---

## 🚀 Implementation Timeline

### Day 1: Infrastructure & Unit Tests
- Morning: Setup testing infrastructure (Task 1)
- Afternoon: Service unit tests (Task 2)
- Evening: Utility unit tests (Task 3)

### Day 2: Component & Integration Tests
- Morning: Hook unit tests (Task 4)
- Afternoon: Component tests (Task 5)
- Evening: Integration tests (Task 6)

### Day 3: E2E & CI/CD
- Morning: E2E test setup
- Afternoon: E2E critical flows (Task 7)
- Evening: CI/CD integration (Task 10)

---

## ✅ Success Criteria

- [ ] 70%+ overall test coverage
- [ ] 80%+ service test coverage
- [ ] All critical user flows tested (E2E)
- [ ] CI/CD pipeline running tests automatically
- [ ] No failing tests
- [ ] Performance benchmarks documented
- [ ] Test documentation complete

---

## 🐛 Known Challenges

1. **React Native Testing Complexity** - Need to mock native modules
2. **Async Testing** - Proper handling of promises and timers
3. **WebSocket Testing** - Mocking real-time connections
4. **E2E Test Stability** - Flaky tests due to timing issues
5. **CI/CD Setup** - GitHub Actions configuration for React Native

---

## 📚 Resources

- [React Native Testing Library Docs](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Detox E2E Framework](https://wix.github.io/Detox/)

---

**Created**: January 15, 2026
**Author**: Claude Sonnet 4.5
