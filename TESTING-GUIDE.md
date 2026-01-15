# GoalGPT Mobile - Comprehensive Testing Guide

**Version**: 1.0.0
**Last Updated**: January 13, 2026
**Project**: GoalGPT Mobile App (React Native + Expo)

---

## Table of Contents

1. [Introduction](#introduction)
2. [Testing Strategy](#testing-strategy)
3. [Setup & Prerequisites](#setup--prerequisites)
4. [Manual Testing Checklist](#manual-testing-checklist)
5. [Integration Testing](#integration-testing)
6. [Performance Testing](#performance-testing)
7. [Security Testing](#security-testing)
8. [Accessibility Testing](#accessibility-testing)
9. [Platform-Specific Testing](#platform-specific-testing)
10. [Bug Reporting](#bug-reporting)

---

## Introduction

This guide provides comprehensive testing procedures for the GoalGPT mobile application. It covers all critical user flows, edge cases, and platform-specific scenarios to ensure app quality and reliability.

### Testing Objectives

- ✅ Validate all critical user flows work correctly
- ✅ Ensure app stability under various network conditions
- ✅ Verify proper error handling and recovery
- ✅ Confirm smooth performance (60fps scrolling)
- ✅ Check accessibility compliance
- ✅ Test on both iOS and Android platforms

---

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \  E2E Tests (Manual)
      /----\
     /      \  Integration Tests
    /--------\
   /          \  Unit Tests (Future)
  /-----------─\
```

**Current Focus**: Manual testing + Integration testing
**Future**: Automated unit tests with Jest + React Testing Library

---

## Setup & Prerequisites

### Development Environment

```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript check
npm run type-check

# 3. Run linter
npm run lint

# 4. Start development server
npm start
```

### Test Devices Recommended

**iOS**:
- iPhone 15 Pro (iOS 18+)
- iPhone 12 Mini (smaller screen)
- iPad Air (tablet)

**Android**:
- Pixel 7 Pro (Android 14+)
- Samsung Galaxy S21 (older Android)
- Tablet (10" screen)

### Network Conditions to Test

- ✅ **Fast WiFi** (100+ Mbps)
- ✅ **Slow WiFi** (1-5 Mbps)
- ✅ **4G/LTE** Mobile data
- ✅ **3G** Slow mobile
- ✅ **Offline** No connection
- ✅ **Intermittent** Connection drops

---

## Manual Testing Checklist

### 1. Authentication Flow

#### 1.1 New User Onboarding

- [ ] **Welcome Screen**
  - [ ] Logo and branding display correctly
  - [ ] "Get Started" button navigates to features screen
  - [ ] Animations smooth (60fps)

- [ ] **Features Screen**
  - [ ] All 4 feature cards display
  - [ ] Feature icons and descriptions visible
  - [ ] "Next" button navigates to referral screen
  - [ ] Swipe gestures work smoothly

- [ ] **Referral Code Screen**
  - [ ] Input field accepts text
  - [ ] "Skip" button works
  - [ ] "Continue" button validates and proceeds
  - [ ] Invalid code shows error message
  - [ ] Keyboard dismisses properly

#### 1.2 Google Sign-In

- [ ] **Google Sign-In Button**
  - [ ] Button is visible and styled correctly
  - [ ] Tap triggers Google auth flow
  - [ ] Google account picker appears
  - [ ] Selecting account signs in successfully
  - [ ] Error handling if user cancels
  - [ ] Network error handling

- [ ] **Post Sign-In**
  - [ ] User redirected to main app (tabs)
  - [ ] User data loads (profile, stats)
  - [ ] Token stored securely
  - [ ] Session persists on app restart

#### 1.3 Apple Sign-In (iOS Only)

- [ ] **Apple Sign-In Button**
  - [ ] Button visible on iOS devices
  - [ ] Tap triggers Apple auth flow
  - [ ] Face ID/Touch ID prompt appears
  - [ ] Successful authentication redirects to app
  - [ ] "Hide My Email" option works
  - [ ] Error handling for cancellation

#### 1.4 Phone Login

- [ ] **Phone Number Entry**
  - [ ] Input accepts valid phone numbers
  - [ ] Country code picker works
  - [ ] Invalid numbers show error
  - [ ] "Send Code" button triggers OTP

- [ ] **OTP Verification**
  - [ ] OTP input fields work
  - [ ] Auto-fill from SMS (if supported)
  - [ ] Countdown timer displays correctly
  - [ ] "Resend Code" works after timeout
  - [ ] Valid OTP authenticates user
  - [ ] Invalid OTP shows error

#### 1.5 Session Management

- [ ] **Auto-Login**
  - [ ] App remembers logged-in user
  - [ ] No re-authentication needed on restart
  - [ ] Session persists across app updates

- [ ] **Token Refresh**
  - [ ] Expired token automatically refreshes
  - [ ] No interruption to user experience
  - [ ] Failed refresh logs user out

- [ ] **Logout**
  - [ ] Logout button works
  - [ ] Confirmation dialog appears
  - [ ] User redirected to login screen
  - [ ] All cached user data cleared
  - [ ] Tokens removed from secure storage

---

### 2. Home Screen (Index)

#### 2.1 AI Suggestions Section

- [ ] **AI Recommendations Display**
  - [ ] Featured match cards render
  - [ ] Match details (teams, time, odds) visible
  - [ ] "View All" button navigates to AI bots
  - [ ] Empty state if no suggestions

- [ ] **Match Card Interaction**
  - [ ] Tap card navigates to match detail
  - [ ] Loading state shows skeleton
  - [ ] Error state shows retry button

#### 2.2 Quick Actions Section

- [ ] **Action Buttons**
  - [ ] "Canlı Maçlar" navigates to live scores
  - [ ] "AI Botlar" navigates to AI bots tab
  - [ ] "Profil" navigates to profile tab
  - [ ] Icons display correctly

#### 2.3 Recent Matches Section

- [ ] **Match List**
  - [ ] Recent matches load and display
  - [ ] Scores update automatically
  - [ ] Live indicator shows for ongoing matches
  - [ ] Tap match navigates to detail

#### 2.4 Pull-to-Refresh

- [ ] Pull down triggers refresh animation
- [ ] Data reloads from API
- [ ] Loading indicator shows
- [ ] Success: data updates
- [ ] Error: error message displays

---

### 3. Live Scores Screen

#### 3.1 Live Matches Display

- [ ] **Match List**
  - [ ] All live matches display
  - [ ] Scores update every 30 seconds
  - [ ] Minute indicator shows (45', 60', etc.)
  - [ ] Live dot indicator animates
  - [ ] No live matches: empty state

- [ ] **Match Grouping**
  - [ ] Matches grouped by status (1st half, 2nd half, etc.)
  - [ ] Group headers display match count
  - [ ] Collapsible sections (if implemented)

#### 3.2 League Filters

- [ ] **Filter Chips**
  - [ ] All leagues show as filter chips
  - [ ] Match count badge displays
  - [ ] Tap filter shows only that league
  - [ ] "All" filter shows all matches
  - [ ] Active filter highlighted

#### 3.3 Auto-Refresh

- [ ] **Automatic Updates**
  - [ ] Scores update every 30 seconds
  - [ ] No page reload (seamless)
  - [ ] Auto-refresh indicator shows
  - [ ] Can be toggled off (if implemented)

#### 3.4 Caching

- [ ] **Offline Support**
  - [ ] Cached data loads instantly
  - [ ] "From cache" indicator shows
  - [ ] Fresh data fetches in background
  - [ ] Offline: shows cached data + banner

---

### 4. AI Bots Screen

#### 4.1 Bot List

- [ ] **Bot Cards**
  - [ ] All AI bots display
  - [ ] Win rate percentage visible
  - [ ] Accuracy badge shows
  - [ ] Last prediction time displays
  - [ ] Bot icons render correctly

- [ ] **Bot Details**
  - [ ] Tap bot shows predictions
  - [ ] Bot statistics visible
  - [ ] Prediction history loads

#### 4.2 Predictions Display

- [ ] **Active Predictions**
  - [ ] Ongoing match predictions show
  - [ ] Odds and confidence displayed
  - [ ] Outcome status (pending/won/lost)

- [ ] **Past Predictions**
  - [ ] Historical predictions load
  - [ ] Results show (correct/incorrect)
  - [ ] Win rate calculated correctly

---

### 5. Profile Screen

#### 5.1 User Profile Header

- [ ] **Profile Info**
  - [ ] Avatar displays (or default)
  - [ ] Username shows
  - [ ] Email/phone displays
  - [ ] XP level and progress bar
  - [ ] Tier badge (bronze/silver/gold, etc.)

#### 5.2 User Stats

- [ ] **Statistics Cards**
  - [ ] Total predictions count
  - [ ] Win rate percentage
  - [ ] Credits balance
  - [ ] Subscription status
  - [ ] All stats load from API

#### 5.3 Settings

- [ ] **Appearance**
  - [ ] Dark mode toggle works
  - [ ] Theme changes immediately
  - [ ] Preference saved

- [ ] **Notifications**
  - [ ] Toggle notifications on/off
  - [ ] Live score notifications toggle
  - [ ] Prediction reminders toggle
  - [ ] Settings saved to backend
  - [ ] Success toast shows

- [ ] **Content Preferences**
  - [ ] Auto-play videos toggle
  - [ ] Other content settings

- [ ] **Account Management**
  - [ ] Edit profile navigation
  - [ ] Change password navigation
  - [ ] Change email navigation
  - [ ] Privacy settings navigation
  - [ ] Export data button

#### 5.4 Logout

- [ ] **Sign Out**
  - [ ] Logout button visible
  - [ ] Confirmation dialog shows
  - [ ] Cancel keeps user logged in
  - [ ] Confirm signs out successfully
  - [ ] Redirects to login screen
  - [ ] Cache cleared
  - [ ] Success toast shows

---

### 6. Match Detail Screen

#### 6.1 Match Header

- [ ] **Match Info**
  - [ ] Team names display
  - [ ] Team logos load
  - [ ] Current score shows
  - [ ] Match time/status visible
  - [ ] Live indicator (if live)

#### 6.2 Tab Navigation

- [ ] **Stats Tab**
  - [ ] Team statistics display
  - [ ] Possession, shots, cards, etc.
  - [ ] Visual progress bars
  - [ ] Data updates if live

- [ ] **Events Tab**
  - [ ] Goals listed with time and scorer
  - [ ] Cards (yellow/red) show
  - [ ] Substitutions display
  - [ ] Events sorted chronologically

- [ ] **H2H Tab**
  - [ ] Past matches between teams
  - [ ] Wins/draws/losses stats
  - [ ] Recent form indicators

- [ ] **Standings Tab**
  - [ ] League table displays
  - [ ] Team positions highlighted
  - [ ] Points, GD, form visible

- [ ] **Lineup Tab**
  - [ ] Formation diagram shows
  - [ ] Player names visible
  - [ ] Substitutes listed
  - [ ] Manager name displays

- [ ] **Trend Tab**
  - [ ] Minute-by-minute data
  - [ ] Charts/graphs render
  - [ ] Key events highlighted

- [ ] **AI Tab**
  - [ ] AI predictions display
  - [ ] Confidence scores show
  - [ ] Recommended bets visible

#### 6.3 Real-Time Updates

- [ ] **Live Match**
  - [ ] Score updates automatically
  - [ ] Events appear in real-time
  - [ ] Stats refresh periodically
  - [ ] No manual refresh needed

---

### 7. Error Handling & Edge Cases

#### 7.1 Network Errors

- [ ] **No Internet Connection**
  - [ ] Offline banner displays at top
  - [ ] Cached data shows when available
  - [ ] Error message if no cache
  - [ ] Retry button works
  - [ ] Auto-retry when connection restored

- [ ] **Slow Connection**
  - [ ] Loading indicators show
  - [ ] Timeout handled gracefully
  - [ ] Retry mechanism works (3 attempts)
  - [ ] User notified of delays

- [ ] **API Errors**
  - [ ] 500 errors show user-friendly message
  - [ ] 404 errors show "not found" message
  - [ ] 401 errors trigger re-login
  - [ ] Generic errors handled

#### 7.2 Loading States

- [ ] **Skeleton Screens**
  - [ ] Skeletons show during initial load
  - [ ] Smooth transition to content
  - [ ] No layout shift

- [ ] **Spinners**
  - [ ] Loading spinners centered
  - [ ] Spinner style matches theme

#### 7.3 Empty States

- [ ] **No Data**
  - [ ] Empty state icon displays
  - [ ] Helpful message shows
  - [ ] Action button (if applicable)

#### 7.4 Toast Notifications

- [ ] **Success Toasts**
  - [ ] Green background
  - [ ] Checkmark icon
  - [ ] Auto-dismiss after 3 seconds
  - [ ] Can tap to dismiss

- [ ] **Error Toasts**
  - [ ] Red background
  - [ ] X icon
  - [ ] Clear error message
  - [ ] Auto-dismiss

- [ ] **Warning Toasts**
  - [ ] Orange background
  - [ ] Warning icon
  - [ ] Informative message

- [ ] **Info Toasts**
  - [ ] Blue background
  - [ ] Info icon
  - [ ] Helpful tips

#### 7.5 React Error Boundary

- [ ] **Component Errors**
  - [ ] ErrorBoundary catches errors
  - [ ] Fallback UI displays
  - [ ] Error details shown (dev mode)
  - [ ] "Try Again" button resets
  - [ ] App doesn't crash

---

### 8. Data Caching & Persistence

#### 8.1 Cache Behavior

- [ ] **First Load**
  - [ ] Data fetches from API
  - [ ] Data cached locally
  - [ ] Subsequent loads instant

- [ ] **Cache Expiration**
  - [ ] Live matches: 1-minute TTL
  - [ ] User stats: 10-minute TTL
  - [ ] User settings: 5-minute TTL
  - [ ] Expired cache refetches

- [ ] **Cache Invalidation**
  - [ ] Logout clears user cache
  - [ ] Settings save invalidates settings cache
  - [ ] Force refresh bypasses cache

#### 8.2 Offline Mode

- [ ] **App Functionality**
  - [ ] Cached screens accessible
  - [ ] Offline banner shows
  - [ ] No crashes from network errors
  - [ ] Graceful degradation

- [ ] **Reconnection**
  - [ ] Offline banner dismisses
  - [ ] Data auto-refreshes
  - [ ] No user action needed

---

### 9. Performance Testing

#### 9.1 App Launch Time

- [ ] **Cold Start**
  - [ ] App launches < 3 seconds
  - [ ] Splash screen shows
  - [ ] Smooth transition to auth/main screen

- [ ] **Warm Start**
  - [ ] App resumes instantly
  - [ ] State preserved
  - [ ] No flicker

#### 9.2 Scrolling Performance

- [ ] **List Scrolling**
  - [ ] 60fps smooth scrolling
  - [ ] No jank or stuttering
  - [ ] Images load efficiently
  - [ ] Virtualization works (FlatList)

#### 9.3 Animation Performance

- [ ] **Transitions**
  - [ ] Tab navigation smooth
  - [ ] Screen transitions 60fps
  - [ ] Gesture animations fluid

- [ ] **Component Animations**
  - [ ] Toast slide animations smooth
  - [ ] Offline banner slide smooth
  - [ ] Skeleton pulse animations

#### 9.4 Memory Usage

- [ ] **Memory Leaks**
  - [ ] No memory growth over time
  - [ ] Event listeners cleaned up
  - [ ] Timers/intervals cleared
  - [ ] Subscriptions unsubscribed

---

### 10. Platform-Specific Testing

#### 10.1 iOS-Specific

- [ ] **Safe Area**
  - [ ] Content not hidden by notch
  - [ ] Bottom safe area respected
  - [ ] Home indicator spacing

- [ ] **Gestures**
  - [ ] Swipe back navigation works
  - [ ] Tab bar swipe gestures
  - [ ] Pull-to-refresh feels native

- [ ] **Permissions**
  - [ ] Push notification permission prompt
  - [ ] Photo library access (if needed)
  - [ ] Face ID/Touch ID prompt

#### 10.2 Android-Specific

- [ ] **Back Button**
  - [ ] Hardware back button works
  - [ ] Confirms exit on home screen
  - [ ] Navigates back in stack

- [ ] **Status Bar**
  - [ ] Status bar color matches theme
  - [ ] Icons visible (light/dark)

- [ ] **Permissions**
  - [ ] Push notification channel setup
  - [ ] Storage permissions (if needed)

---

## Integration Testing

### Critical User Flows to Test

#### Flow 1: New User Signup → First Prediction

**Steps**:
1. Launch app (fresh install)
2. Complete onboarding (3 screens)
3. Sign in with Google
4. Navigate to AI Bots
5. Select a bot
6. View predictions
7. Navigate to match detail

**Expected**: Smooth flow, no errors, all data loads

#### Flow 2: Returning User → Check Live Scores

**Steps**:
1. Launch app (existing user)
2. Auto-login successful
3. Navigate to Live Scores tab
4. View live matches
5. Filter by league
6. Tap match for details
7. View different tabs

**Expected**: Instant cache load, background refresh, smooth navigation

#### Flow 3: Offline → Online Transition

**Steps**:
1. Enable airplane mode
2. Launch app
3. Navigate screens (use cache)
4. Disable airplane mode
5. Observe auto-refresh

**Expected**: Offline banner shows/hides, data refreshes automatically

#### Flow 4: Settings Change → Profile Update

**Steps**:
1. Navigate to Profile
2. Toggle dark mode
3. Change notification settings
4. Save settings
5. Verify persistence

**Expected**: Settings save to backend, toast confirms, persists on restart

---

## Security Testing

### Authentication Security

- [ ] **Token Storage**
  - [ ] Tokens stored in secure storage (not AsyncStorage)
  - [ ] Tokens encrypted
  - [ ] Tokens removed on logout

- [ ] **API Security**
  - [ ] Auth token sent with requests
  - [ ] 401 errors trigger re-login
  - [ ] Sensitive data not logged

### Data Security

- [ ] **User Data**
  - [ ] PII not exposed in URLs
  - [ ] Cache doesn't persist sensitive data
  - [ ] HTTPS used for all requests

---

## Accessibility Testing

### Screen Reader Support (Future)

- [ ] All buttons have labels
- [ ] Images have alt text
- [ ] Proper heading hierarchy
- [ ] Focus order logical

### Visual Accessibility

- [ ] Color contrast WCAG AA compliant
- [ ] Text readable at different sizes
- [ ] Icons have text labels
- [ ] Error messages clear

---

## Bug Reporting

### Bug Report Template

```markdown
**Title**: Brief description of the issue

**Environment**:
- Device: iPhone 15 Pro / Pixel 7
- OS: iOS 18.0 / Android 14
- App Version: 1.0.0

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Screenshots/Videos**:
[Attach if applicable]

**Severity**:
- [ ] Critical (app crashes, data loss)
- [ ] High (feature broken)
- [ ] Medium (minor issue)
- [ ] Low (cosmetic)
```

---

## Automated Testing (Future)

### Unit Tests

```typescript
// Example: Testing error handler utility
describe('errorHandler', () => {
  it('should parse network errors correctly', () => {
    const error = new Error('Network Error');
    const result = parseError(error);
    expect(result.type).toBe('network');
  });
});
```

### Integration Tests

```typescript
// Example: Testing login flow
describe('Login Flow', () => {
  it('should login with valid credentials', async () => {
    // Test implementation
  });
});
```

---

## Conclusion

This testing guide covers all critical aspects of the GoalGPT mobile app. Regular testing ensures app quality, stability, and user satisfaction.

**Testing Cadence**:
- **Daily**: Quick smoke tests during development
- **Weekly**: Full manual testing checklist
- **Pre-Release**: Comprehensive testing + performance profiling
- **Post-Release**: User feedback monitoring + crash analytics

---

**Last Updated**: January 13, 2026
**Maintained By**: Development Team
**Questions**: Contact tech team
