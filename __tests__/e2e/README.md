# E2E Testing Documentation

## Overview

End-to-End (E2E) tests verify complete user flows in the GoalGPT mobile application. These tests simulate real user interactions from start to finish, ensuring all components work together correctly.

## Test Structure

```
__tests__/e2e/
├── flows/                          # User flow test files
│   ├── authentication.e2e.test.tsx    # Login, signup, logout flows
│   ├── liveMatchViewing.e2e.test.tsx  # Match viewing flows
│   ├── predictions.e2e.test.tsx       # Bot predictions flows
│   └── realTimeUpdates.e2e.test.tsx   # WebSocket real-time flows
└── README.md                       # This file
```

## Test Coverage

### 1. Authentication Flow (authentication.e2e.test.tsx)
**Total Tests**: 10+ tests covering authentication journeys

**User Journeys Tested**:
- Complete login flow (open app → enter credentials → login → see home)
- Login with invalid credentials (see error → retry)
- Sign up flow (register → auto-login → see home)
- Logout flow (profile → logout → return to login)
- Session persistence (login → close app → reopen → still logged in)
- Token refresh (using app → token expires → auto refresh → continue)
- Social authentication (Google login flow)

**Performance Benchmarks**:
- Login completion: <3 seconds

### 2. Live Match Viewing Flow (liveMatchViewing.e2e.test.tsx)
**Total Tests**: 15+ tests covering match viewing

**User Journeys Tested**:
- View live matches list (navigate → see matches)
- View match details (tap match → see details)
- View match events timeline (events tab → see goals, cards)
- View match statistics (stats tab → see possession, shots)
- Add/remove favorites (tap heart → match favorited)
- Filter matches by league (select filter → see filtered results)
- Real-time score updates (score changes → UI updates)
- Navigate back (details → back → list)

**Performance Benchmarks**:
- Live matches load: <2 seconds
- Match details render: <1 second

### 3. Predictions Flow (predictions.e2e.test.tsx)
**Total Tests**: 12+ tests covering prediction features

**User Journeys Tested**:
- View prediction bots list (navigate → see bots)
- View bot details (tap bot → see details)
- View bot predictions (bot details → see prediction list)
- Filter predictions by status (select "Won" → see only wins)
- View bot statistics (stats tab → see win rates)
- Navigate to match from prediction (tap prediction → match details)
- Compare multiple bots (select bots → compare)
- Filter by league (select league → see league predictions)
- View prediction history (history tab → see past predictions)
- Switch between bots (swipe/tap next → see next bot)

**Performance Benchmarks**:
- Bots list load: <2 seconds
- Bot details load: <1 second

### 4. Real-Time Updates Flow (realTimeUpdates.e2e.test.tsx)
**Total Tests**: 12+ tests covering WebSocket functionality

**User Journeys Tested**:
- Receive live score updates (viewing match → score changes → see update)
- Receive match state changes (first half → half time → see HT)
- Show goal notifications (goal scored → see notification → auto-dismiss)
- Display red card events (red card → see indicator)
- Handle WebSocket disconnection (connection lost → reconnecting indicator)
- Handle reconnection (reconnect → continue receiving updates)
- Multiple concurrent updates (multiple matches → all update)
- Update prediction results (match ends → prediction result updates)
- Handle match finish event (match ends → see FT → move to finished)
- High-frequency updates (rapid updates → all processed → no lag)

**Performance Benchmarks**:
- Score update processing: <100ms
- FPS during updates: >55 FPS

## Running E2E Tests

### Run All E2E Tests
```bash
npm test -- __tests__/e2e
```

### Run Specific Flow
```bash
# Authentication flow
npm test -- __tests__/e2e/flows/authentication.e2e.test.tsx

# Live match viewing flow
npm test -- __tests__/e2e/flows/liveMatchViewing.e2e.test.tsx

# Predictions flow
npm test -- __tests__/e2e/flows/predictions.e2e.test.tsx

# Real-time updates flow
npm test -- __tests__/e2e/flows/realTimeUpdates.e2e.test.tsx
```

### Run in Watch Mode
```bash
npm test -- __tests__/e2e --watch
```

### Run with Coverage
```bash
npm test -- __tests__/e2e --coverage
```

## Test Configuration

### Jest Setup
E2E tests use the same Jest configuration as other tests:
- **Framework**: Jest 29.x
- **Testing Library**: @testing-library/react-native
- **Timeout**: 15 seconds per test (extended for complex flows)
- **Environment**: jsdom

### Mocked Dependencies
All E2E tests mock external services to ensure:
1. Tests run reliably without network dependencies
2. Tests run quickly
3. Tests can simulate various scenarios

**Mocked Services**:
- `TokenStorage` - Secure token storage
- `apiClient` - API calls to backend
- `websocketService` - WebSocket connections
- `analyticsService` - Firebase Analytics
- `expo-secure-store` - Secure storage
- `expo-firebase-analytics` - Analytics tracking

## Writing New E2E Tests

### Test Structure Template
```typescript
/**
 * Feature E2E Test
 * Phase 12: Testing & QA - E2E Tests
 *
 * Tests the complete flow of [feature description]
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../../App';
import { TokenStorage } from '../../../src/api/client';

// Mock dependencies
jest.mock('../../../src/api/client');
jest.mock('../../../src/services/analytics.service');

describe('Feature E2E Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup initial state
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');
  });

  /**
   * Test: User Journey Name
   * User Journey: Step 1 → Step 2 → Step 3 → Expected Result
   */
  it('should complete user journey successfully', async () => {
    const { getByTestId, getByText } = render(<App />);

    // Step 1: Navigate to screen
    await waitFor(() => {
      fireEvent.press(getByTestId('screen-tab'));
    });

    // Step 2: Perform action
    await waitFor(() => {
      expect(getByTestId('target-screen')).toBeTruthy();
    });

    // Step 3: Verify result
    await waitFor(() => {
      expect(getByText('Expected Text')).toBeTruthy();
    });
  }, 15000);
});
```

### Best Practices

1. **Clear User Journey**: Document the exact user steps in comments
2. **Realistic Flows**: Test complete flows, not isolated interactions
3. **Proper Timing**: Use `waitFor` for async operations
4. **Performance Metrics**: Include performance benchmarks where relevant
5. **Error Scenarios**: Test both success and failure paths
6. **Analytics Tracking**: Verify analytics events are tracked
7. **Test Isolation**: Ensure tests don't depend on each other
8. **Descriptive Names**: Use descriptive test names that explain the journey

### TestID Naming Convention

Use consistent testID naming for UI elements:
```typescript
// Screens
testID="login-screen"
testID="home-screen"
testID="match-detail-screen"

// Tabs
testID="live-matches-tab"
testID="predictions-tab"
testID="profile-tab"

// Buttons
testID="login-button"
testID="logout-button"
testID="favorite-button"

// Inputs
testID="email-input"
testID="password-input"

// Cards
testID="match-card-{matchId}"
testID="bot-card-{botId}"
testID="prediction-card-{predictionId}"
```

## Troubleshooting

### Test Timeout Errors
If tests timeout, increase the timeout:
```typescript
it('should complete flow', async () => {
  // Test code
}, 20000); // 20 second timeout
```

### WebSocket Tests Failing
Ensure WebSocket mocks are properly setup:
```typescript
let mockWebSocketHandlers: Record<string, Function> = {};

(websocketService.on as jest.Mock).mockImplementation((event: string, handler: Function) => {
  mockWebSocketHandlers[event] = handler;
  return jest.fn();
});
```

### Component Not Found
Ensure you wait for async operations:
```typescript
await waitFor(() => {
  expect(getByTestId('component')).toBeTruthy();
}, { timeout: 5000 });
```

### State Updates Not Reflecting
Wrap state updates in `act()`:
```typescript
import { act } from '@testing-library/react-native';

act(() => {
  // Trigger state update
});
```

## Performance Testing

E2E tests include performance benchmarks to ensure the app meets user experience standards:

### Load Time Benchmarks
- **Login flow**: <3 seconds
- **Live matches load**: <2 seconds
- **Match details render**: <1 second
- **Bot details load**: <1 second

### Real-Time Performance
- **Score update processing**: <100ms
- **FPS during updates**: >55 FPS

### Testing Performance
```typescript
it('should load screen within 2 seconds', async () => {
  const startTime = Date.now();

  const { getByTestId } = render(<App />);

  await waitFor(() => {
    expect(getByTestId('screen')).toBeTruthy();
  });

  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(2000);
}, 10000);
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run E2E tests
        run: npm test -- __tests__/e2e --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

## Test Statistics

- **Total E2E Tests**: 49+ tests
- **Total Lines**: 1,600+ lines
- **Test Files**: 4 files
- **Coverage**: All critical user flows
- **Average Test Duration**: 2-5 seconds
- **Total Suite Duration**: ~2-3 minutes

## Maintenance

### Updating Tests
When UI changes:
1. Update testIDs if component structure changes
2. Update mock data to match new API responses
3. Update expected text/values in assertions
4. Verify performance benchmarks are still valid

### Adding New Flows
When adding new features:
1. Create new test file in `__tests__/e2e/flows/`
2. Follow the template structure
3. Document user journey in comments
4. Add performance benchmarks
5. Update this README with new test coverage

## Resources

- [React Native Testing Library Docs](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: 2026-01-15
**Phase**: Phase 12 - Testing & QA
**Status**: Complete
