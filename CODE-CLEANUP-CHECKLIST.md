# Code Cleanup Checklist - Phase 13

**Phase**: 13 (Production Release)
**Priority**: HIGH
**Created**: January 16, 2026

---

## Overview

This checklist tracks all code cleanup tasks that must be completed before production release. Each task should be checked off when completed.

---

## 1. Remove Test/Debug Code

### Test Screens to Remove:
- [ ] `src/screens/TestLoginScreen.tsx` - Remove entire file
- [ ] `src/screens/test/DesignSystemShowcase.tsx` - Remove entire file
- [ ] `src/screens/test/` folder - Delete if empty after cleanup

### Test Routes to Remove:
- [ ] Remove TestLoginScreen route from navigation (if present)
- [ ] Remove DesignSystemShowcase route from navigation
- [ ] Remove any /test routes

### Debug Components:
- [ ] Search for components with "Test" or "Debug" in name
- [ ] Remove debug buttons/panels
- [ ] Remove developer-only UI elements

---

## 2. Console.log Cleanup

### Files with console.log (19 files found):

#### Context Files:
- [ ] `src/context/AnalyticsContext.tsx` - Review and remove/replace
- [ ] `src/context/FavoritesContext.tsx` - Review and remove/replace
- [ ] `src/context/ThemeContext.tsx` - Review and remove/replace
- [ ] `src/context/AuthContext.tsx` - Review and remove/replace
- [ ] `src/context/WebSocketContext.tsx` - Review and remove/replace

#### Config Files:
- [ ] `src/config/sentry.config.ts` - Keep only error logs
- [ ] `src/config/firebase.config.ts` - Remove debug logs

#### Navigation:
- [ ] `src/navigation/AppNavigator.tsx` - Remove navigation debug logs

#### Utils:
- [ ] `src/utils/performance.ts` - Replace with proper logging
- [ ] `src/utils/cacheManager.ts` - Replace with proper logging
- [ ] `src/constants/api.ts` - Remove debug logs

#### Screen Files:
- [ ] `src/screens/LiveMatchesScreen.tsx` - Remove console.logs
- [ ] `src/screens/NotificationSettingsScreen.tsx` - Remove console.logs
- [ ] `src/screens/LeagueDetailScreen.tsx` - Remove console.logs
- [ ] `src/screens/BotListScreen.tsx` - Remove console.logs
- [ ] `src/screens/MatchDetailScreen.tsx` - Remove console.logs
- [ ] `src/screens/TeamDetailScreen.tsx` - Remove console.logs
- [ ] `src/screens/predictions/PredictionsScreen.tsx` - Remove console.logs

### Replacement Strategy:

#### For Production Logging:
```typescript
// Before
console.log('User logged in:', user);

// After - Use proper logger
import { logger } from '@/utils/logger';
logger.info('User logged in', { userId: user.id });
```

#### For Debug-only Logging:
```typescript
// Before
console.log('Debug: API response', response);

// After - Conditional logging
if (__DEV__) {
  console.log('Debug: API response', response);
}
```

#### For Error Logging:
```typescript
// Before
console.log('Error:', error);

// After - Use Sentry
import * as Sentry from '@sentry/react-native';
Sentry.captureException(error);
```

---

## 3. TODO/FIXME Comments (8 found)

### Find All TODOs:
```bash
grep -r "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx"
```

### Resolution:
- [ ] List all TODO/FIXME comments
- [ ] Create GitHub issues for items that can't be fixed now
- [ ] Fix or remove comments that can be addressed
- [ ] Update code based on TODO instructions
- [ ] Remove resolved TODO comments

---

## 4. Debug Features & Dev Tools

### __DEV__ Checks:
- [ ] Search for `__DEV__` usage: `grep -r "__DEV__" src/`
- [ ] Verify all dev-only code is properly gated
- [ ] Remove any always-on debug features

### React DevTools:
- [ ] Ensure ReactotronConfig is only loaded in development
- [ ] Remove any hardcoded dev tool integrations
- [ ] Verify Redux DevTools only loads in dev/staging

### Debug Menus:
- [ ] Remove debug menus from production
- [ ] Remove developer settings panels
- [ ] Remove test data generators

---

## 5. API Configuration

### Hardcoded URLs:
- [x] ~~app.json - apiUrl~~ (moved to environment variables)
- [x] ~~app.json - wsUrl~~ (moved to environment variables)
- [ ] Search for hardcoded IPs: `grep -r "142.93.103.128" src/`
- [ ] Search for localhost: `grep -r "localhost" src/`
- [ ] Search for http:// : `grep -r 'http://' src/ | grep -v https`

### API Keys:
- [ ] Search for hardcoded API keys: `grep -r "AIza" src/`
- [ ] Search for RevenueCat keys: `grep -r "rcb_" src/`
- [ ] Verify all keys use environment variables

---

## 6. Error Handling

### console.error Usage:
```bash
grep -r "console.error" src/ --include="*.ts" --include="*.tsx"
```

### Tasks:
- [ ] Replace console.error with Sentry.captureException
- [ ] Add proper error boundaries
- [ ] Ensure all async operations have try-catch
- [ ] Add user-friendly error messages

---

## 7. Performance Optimization

### Bundle Size:
- [ ] Remove unused dependencies
- [ ] Check for duplicate packages
- [ ] Verify code splitting is working
- [ ] Test lazy loading

### Images:
- [ ] Compress all images
- [ ] Use WebP where possible
- [ ] Remove unused images from assets/
- [ ] Verify optimized image loading

---

## 8. Security Audit

### Sensitive Data:
- [ ] Search for passwords: `grep -ri "password.*=.*\"" src/`
- [ ] Search for tokens: `grep -ri "token.*=.*\"" src/`
- [ ] Search for secrets: `grep -ri "secret.*=.*\"" src/`
- [ ] Verify SecureStore usage for sensitive data

### Authentication:
- [ ] Review token storage implementation
- [ ] Verify token refresh logic
- [ ] Check for token exposure in logs
- [ ] Verify HTTPS-only for API calls

### API Security:
- [ ] All API calls use HTTPS
- [ ] API keys not exposed in client code
- [ ] Proper error handling (don't expose internals)
- [ ] Rate limiting handled gracefully

---

## 9. TypeScript & Linting

### Type Errors:
```bash
npm run type-check
```
- [ ] Fix all TypeScript errors
- [ ] Remove all `@ts-ignore` comments (or document why needed)
- [ ] Remove all `any` types (or replace with proper types)

### ESLint:
```bash
npm run lint
```
- [ ] Fix all ESLint errors
- [ ] Fix all ESLint warnings
- [ ] Remove unused imports
- [ ] Remove unused variables

### Formatting:
```bash
npm run format
```
- [ ] Run Prettier on all files
- [ ] Ensure consistent code style

---

## 10. Dependencies

### Unused Dependencies:
```bash
npx depcheck
```
- [ ] Remove unused dependencies
- [ ] Remove unused devDependencies
- [ ] Update outdated dependencies

### Security Vulnerabilities:
```bash
npm audit
```
- [ ] Fix all critical vulnerabilities
- [ ] Fix all high vulnerabilities
- [ ] Review medium/low vulnerabilities

### License Compliance:
```bash
npx license-checker --summary
```
- [ ] Review all dependency licenses
- [ ] Ensure license compatibility
- [ ] Document license attributions

---

## 11. Comments & Documentation

### Code Comments:
- [ ] Remove commented-out code
- [ ] Update outdated comments
- [ ] Add comments for complex logic
- [ ] Remove obvious comments

### File Headers:
- [ ] Ensure consistent file structure
- [ ] Remove unnecessary file headers
- [ ] Update copyright notices (if any)

---

## 12. Testing Artifacts

### Test Files:
- [ ] Remove .test.ts/.test.tsx files from production build
- [ ] Remove __tests__/ from production bundle
- [ ] Verify test utilities aren't imported in production code

### Mock Data:
- [ ] Remove mock data files
- [ ] Remove test fixtures
- [ ] Remove seed data

---

## 13. Environment-Specific Code

### Development-Only Code:
- [ ] Wrap dev tools in `if (__DEV__)` blocks
- [ ] Remove development-only imports in production
- [ ] Verify feature flags work correctly

### Staging-Only Code:
- [ ] Check for staging-specific code
- [ ] Ensure staging code doesn't leak to production
- [ ] Verify environment detection

---

## 14. Final Checks

### Build Verification:
- [ ] Run production build locally
- [ ] Test production build on iOS
- [ ] Test production build on Android
- [ ] Verify no console errors
- [ ] Check bundle size

### Functionality:
- [ ] All features work in production build
- [ ] No broken screens
- [ ] Navigation works correctly
- [ ] API calls work with production backend
- [ ] Push notifications work
- [ ] In-app purchases work (sandbox)

### Performance:
- [ ] App startup time < 3 seconds
- [ ] No memory leaks
- [ ] Smooth scrolling (60 FPS)
- [ ] Images load quickly

---

## Automation Scripts

### Find All console.log:
```bash
grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" | wc -l
```

### Find All TODOs:
```bash
grep -r "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx"
```

### Find Hardcoded URLs:
```bash
grep -r "http://" src/ --include="*.ts" --include="*.tsx"
```

### Find API Keys:
```bash
grep -r "AIza\|rcb_\|key_live" src/ --include="*.ts" --include="*.tsx"
```

### Type Check:
```bash
npm run type-check
```

### Lint Check:
```bash
npm run lint
```

### Security Audit:
```bash
npm audit
```

---

## Cleanup Commands

### Remove Test Screens:
```bash
rm src/screens/TestLoginScreen.tsx
rm -rf src/screens/test/
```

### Run Linter:
```bash
npm run lint:fix
```

### Format Code:
```bash
npm run format
```

### Update Dependencies:
```bash
npm update
```

---

## Sign-off

### Team Sign-off:
- [ ] Developer reviewed all code
- [ ] QA tested production build
- [ ] Product manager approved changes
- [ ] Security review completed
- [ ] All checklists items completed

### Final Verification:
- [ ] Production build successful
- [ ] No console errors
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit passed

---

**Completed By**: ________________
**Date**: ________________
**Build Version**: 1.0.0
**Ready for Store Submission**: [ ] YES [ ] NO

---

**Last Updated**: January 16, 2026
**Phase**: 13 (Production Release)
**Status**: In Progress
