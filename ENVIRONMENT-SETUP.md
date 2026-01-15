# Environment Setup Guide

**Phase 13: Production Release**
**Created**: January 16, 2026

---

## Overview

This guide explains how to configure environment variables for different build environments (development, staging, production) in the GoalGPT mobile app.

---

## Environment Files

### Available Environment Files:

| File | Purpose | Usage |
|------|---------|-------|
| `.env.example` | Template with placeholder values | Reference only (committed to git) |
| `.env.production` | Production environment | Store submissions |
| `.env.staging` | Staging/testing environment | Internal testing |
| `.env.development` | Local development (optional) | Development work |

**IMPORTANT**: Never commit `.env.production`, `.env.staging`, or `.env.development` to git. They are ignored by `.gitignore`.

---

## Setup Instructions

### Step 1: Copy Environment Template

```bash
# For production setup
cp .env.example .env.production

# For staging setup
cp .env.example .env.staging

# For local development
cp .env.example .env.development
```

### Step 2: Configure Environment Variables

Open the environment file and replace placeholder values with actual credentials:

#### Backend API
```bash
# Production
EXPO_PUBLIC_API_URL=https://api.goalgpt.com
EXPO_PUBLIC_WS_URL=wss://api.goalgpt.com/ws

# Staging
EXPO_PUBLIC_API_URL=https://staging.api.goalgpt.com
EXPO_PUBLIC_WS_URL=wss://staging.api.goalgpt.com/ws
```

#### RevenueCat (Subscriptions)

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Select your project
3. Go to API Keys → Public App-Specific Keys
4. Copy iOS and Android keys

```bash
EXPO_PUBLIC_REVENUE_CAT_IOS_KEY=rcb_xxxxxxxxxxxxx
EXPO_PUBLIC_REVENUE_CAT_ANDROID_KEY=rcb_xxxxxxxxxxxxx
```

#### Firebase (Auth & Analytics)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (production or staging)
3. Go to Project Settings → General
4. Scroll to "Your apps" section
5. Copy configuration values

```bash
EXPO_PUBLIC_FIREBASE_PROJECT_ID=goalgpt-production
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=goalgpt-production.firebaseapp.com
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=goalgpt-production.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID_IOS=1:123456789:ios:abc123
EXPO_PUBLIC_FIREBASE_APP_ID_ANDROID=1:123456789:android:abc123
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
```

#### Google OAuth (Sign In with Google)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services → Credentials
4. Find your OAuth 2.0 Client IDs
5. Copy iOS, Android, and Web client IDs

```bash
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxxxx.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxxxx.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

#### Apple Sign In

1. Go to [Apple Developer](https://developer.apple.com/)
2. Go to Certificates, Identifiers & Profiles
3. Find your Service ID and Keys
4. Copy Team ID and Key ID

```bash
EXPO_PUBLIC_APPLE_SERVICE_ID=com.wizardstech.goalgpt.signin
EXPO_PUBLIC_APPLE_TEAM_ID=ABC123DEF4
EXPO_PUBLIC_APPLE_KEY_ID=ABC123DEF4
```

#### AdMob (Rewarded Ads)

1. Go to [AdMob Console](https://apps.admob.com/)
2. Select your app
3. Go to App Settings → App ID
4. Go to Ad Units → Copy Unit IDs

```bash
# Production (real ads)
EXPO_PUBLIC_ADMOB_APP_ID_IOS=ca-app-pub-xxxxxxxx~yyyyyy
EXPO_PUBLIC_ADMOB_APP_ID_ANDROID=ca-app-pub-xxxxxxxx~yyyyyy
EXPO_PUBLIC_ADMOB_IOS_REWARDED_AD_UNIT=ca-app-pub-xxxxxxxx/zzzzzz
EXPO_PUBLIC_ADMOB_ANDROID_REWARDED_AD_UNIT=ca-app-pub-xxxxxxxx/zzzzzz

# Staging (test ads - already configured)
EXPO_PUBLIC_ADMOB_APP_ID_IOS=ca-app-pub-3940256099942544~1458002511
EXPO_PUBLIC_ADMOB_APP_ID_ANDROID=ca-app-pub-3940256099942544~3347511713
```

#### Branch.io (Deep Linking)

1. Go to [Branch Dashboard](https://dashboard.branch.io/)
2. Select your app
3. Go to Account Settings → Profile
4. Copy live or test key

```bash
# Production
EXPO_PUBLIC_BRANCH_KEY=key_live_xxxxxxxxxxxxx

# Staging
EXPO_PUBLIC_BRANCH_KEY=key_test_xxxxxxxxxxxxx
```

#### Sentry (Error Tracking)

1. Go to [Sentry](https://sentry.io/)
2. Select your organization and project
3. Go to Settings → Client Keys (DSN)
4. Copy the DSN

```bash
SENTRY_DSN=https://xxxxxxxxxxxxx@sentry.io/1234567
SENTRY_ENVIRONMENT=production  # or staging
SENTRY_ORG=goalgpt
SENTRY_PROJECT=goalgpt-mobile
```

---

## Building with Different Environments

### Production Build

```bash
# iOS Production
eas build --platform ios --profile production

# Android Production
eas build --platform android --profile production
```

The production profile automatically loads `.env.production` values.

### Staging Build

```bash
# iOS Staging
eas build --platform ios --profile staging

# Android Staging
eas build --platform android --profile staging
```

The staging profile automatically loads `.env.staging` values.

### Preview Build

```bash
# iOS Preview
eas build --platform ios --profile preview

# Android Preview
eas build --platform android --profile preview
```

The preview profile uses the same values as production for testing.

---

## Environment Variable Access in Code

All environment variables prefixed with `EXPO_PUBLIC_` are accessible in the app:

```typescript
// Access environment variables
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;
const enableDebugLogs = process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === 'true';

// Example usage
if (environment === 'production') {
  // Production-specific code
} else if (environment === 'staging') {
  // Staging-specific code
}
```

---

## Feature Flags

Control features based on environment:

```typescript
// In code
const isDevelopment = process.env.EXPO_PUBLIC_ENVIRONMENT === 'development';
const isProduction = process.env.EXPO_PUBLIC_ENVIRONMENT === 'production';

// Enable/disable features
if (process.env.EXPO_PUBLIC_ENABLE_DEV_MENU === 'true') {
  // Show dev menu
}

if (process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === 'true') {
  console.log('Debug log');
}
```

### Available Feature Flags:

| Flag | Production | Staging | Development |
|------|------------|---------|-------------|
| `ENABLE_ANALYTICS` | true | true | true |
| `ENABLE_CRASH_REPORTING` | true | true | true |
| `ENABLE_GAMIFICATION` | true | true | true |
| `ENABLE_DEV_MENU` | false | true | true |
| `ENABLE_DEBUG_LOGS` | false | true | true |
| `ENABLE_REDUX_DEVTOOLS` | false | true | true |

---

## Security Best Practices

### DO:
✅ Keep `.env.production` and `.env.staging` secure
✅ Store sensitive credentials in secure password managers
✅ Use different Firebase projects for staging and production
✅ Use RevenueCat sandbox keys for staging
✅ Use AdMob test IDs for staging
✅ Rotate API keys periodically
✅ Use read-only keys where possible

### DON'T:
❌ Commit `.env.production` or `.env.staging` to git
❌ Share environment files via email or Slack
❌ Use production credentials in staging
❌ Hardcode API keys in source code
❌ Use same Firebase project for all environments
❌ Share credentials with unauthorized team members

---

## Troubleshooting

### Environment variables not working?

1. **Check file name**: Must be `.env.production`, `.env.staging`, or `.env.development`
2. **Restart Metro**: `npx expo start -c` (clear cache)
3. **Check prefix**: Variables must start with `EXPO_PUBLIC_`
4. **Rebuild app**: Environment variables are bundled at build time

### Build failing with missing credentials?

1. Verify all placeholders are replaced
2. Check for typos in variable names
3. Ensure no extra spaces around values
4. Validate Firebase/RevenueCat/etc. credentials

### Wrong environment being used?

1. Check EAS build profile: `--profile production` vs `--profile staging`
2. Verify `EXPO_PUBLIC_ENVIRONMENT` is set correctly
3. Check eas.json profile configuration

---

## Checklist Before Production Build

- [ ] All placeholder values replaced in `.env.production`
- [ ] Production Firebase project configured
- [ ] Production RevenueCat keys added
- [ ] Production Google OAuth credentials added
- [ ] Production Apple Sign In configured
- [ ] Production AdMob app IDs added
- [ ] Production Branch.io key added
- [ ] Production Sentry DSN added
- [ ] Feature flags set correctly (debug = false)
- [ ] API URLs point to production backend
- [ ] All credentials tested in staging first
- [ ] `.env.production` NOT committed to git

---

## Support

For issues with environment setup:
- Check [Expo Environment Variables Docs](https://docs.expo.dev/guides/environment-variables/)
- Check [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
- Contact DevOps team

---

**Last Updated**: January 16, 2026
**Phase**: 13 (Production Release)
**Status**: Ready for production configuration
