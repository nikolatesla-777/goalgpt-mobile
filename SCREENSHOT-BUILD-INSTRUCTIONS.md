# Screenshot Build Instructions
**GoalGPT Mobile - Phase 13 Task 1.2**
**Date**: January 15, 2026

---

## Overview

This guide provides step-by-step instructions to build staging versions of the app for screenshot capture.

---

## Prerequisites

### 1. EAS CLI Installation
```bash
npm install -g eas-cli
```

### 2. EAS Login
You need an Expo account to build with EAS.

**Login Command:**
```bash
npx eas-cli login
```

**Options:**
- Login with email/username and password
- Or use `npx eas-cli login --sso` for SSO

---

## Build Process

### Step 1: Configure EAS Project (First Time Only)

If this is your first time building, you need to configure the EAS project:

```bash
cd /Users/utkubozbay/Downloads/GoalGPT/mobile-app/goalgpt-mobile
npx eas-cli build:configure
```

This will:
- Create or link an EAS project
- Update `app.json` with your project ID
- Generate `eas.json` (already exists)

### Step 2: Build Staging Version for iOS

**Command:**
```bash
npx eas-cli build --profile staging --platform ios
```

**What happens:**
- Uploads your code to EAS servers
- Builds Release configuration
- Creates IPA file for internal distribution
- Bundle identifier: `com.wizardstech.goalgpt.staging`
- Build time: ~10-20 minutes

**Download build:**
```bash
npx eas-cli build:download --platform ios --latest
```

Or download from: https://expo.dev/accounts/goalgpt/projects/goalgpt-mobile/builds

### Step 3: Build Staging Version for Android

**Command:**
```bash
npx eas-cli build --profile staging --platform android
```

**What happens:**
- Uploads your code to EAS servers
- Builds Release APK
- Application ID: `com.wizardstech.goalgpt.staging`
- Build time: ~10-20 minutes

**Download build:**
```bash
npx eas-cli build:download --platform android --latest
```

### Step 4: Build Both Platforms at Once (Recommended)

```bash
npx eas-cli build --profile staging --platform all
```

This queues both iOS and Android builds simultaneously.

---

## Installation

### iOS Installation (Physical Device)

**Option 1: Install via EAS (Easiest)**
1. Go to https://expo.dev
2. Navigate to your project builds
3. Open the build on your iOS device
4. Tap "Install" button
5. Follow iOS prompts to install

**Option 2: Install via Xcode**
1. Download the IPA file
2. Connect iPhone via USB
3. Open Xcode
4. Window → Devices and Simulators
5. Drag IPA to your device

**Option 3: Use iOS Simulator (For Screenshots)**
If you need simulator screenshots, build with:
```bash
npx eas-cli build --profile staging --platform ios --local
```
Then modify `eas.json` staging iOS config:
```json
"ios": {
  "simulator": true,
  ...
}
```

### Android Installation (Physical Device)

**Option 1: Install via EAS (Easiest)**
1. Go to https://expo.dev
2. Navigate to your project builds
3. Open the build on your Android device
4. Download and install APK

**Option 2: Install via ADB**
```bash
# Download APK first
npx eas-cli build:download --platform android --latest

# Install via ADB
adb install goalgpt-staging.apk
```

**Option 3: Direct Download**
1. Download APK to computer
2. Transfer to Android device (USB, email, cloud)
3. Open on device and install
4. May need to enable "Install from Unknown Sources"

---

## Screenshot Capture

### iOS Screenshots (iPhone 15 Pro Max - 1290x2796)

**Using Physical Device:**
1. Install staging build on iPhone 15 Pro Max
2. Open app and navigate to each screen
3. Take screenshot: Volume Up + Power Button
4. Screenshots saved to Photos app
5. AirDrop to Mac or sync via iCloud

**Required Screenshots (6 screens):**
1. **Home Screen** - Live matches, upcoming fixtures
2. **Match Detail** - Live match with statistics
3. **AI Predictions** - Bot predictions and accuracy
4. **Live Matches** - Multiple live match cards
5. **Leaderboard** - Bot performance rankings
6. **Profile** - User stats and achievements

**Screenshot Dimensions:**
- iPhone 15 Pro Max: 1290 x 2796 pixels
- Required for App Store

### Android Screenshots (1080x1920)

**Using Physical Device:**
1. Install staging APK on device
2. Open app and navigate to each screen
3. Take screenshot: Power + Volume Down
4. Screenshots saved to Gallery/Photos
5. Transfer to computer (USB, Google Photos, etc.)

**Required Screenshots (6 screens):**
Same 6 screens as iOS

**Screenshot Dimensions:**
- Standard: 1080 x 1920 pixels (most common)
- Required for Play Store

### Screenshot Editing

After capturing, you may want to:
1. Add device frames (optional)
2. Crop to exact dimensions
3. Adjust brightness/contrast
4. Add text overlays (optional)

**Tools:**
- Figma (free, online)
- Sketch (Mac)
- Photoshop
- Online: https://www.appure.io/ (device frames)

---

## Troubleshooting

### Build Fails - "No EAS Project ID"

**Problem:** `app.json` has placeholder `YOUR_EAS_PROJECT_ID`

**Solution:**
```bash
npx eas-cli build:configure
```

This will create/link a project and update the ID.

### Build Fails - "Invalid Bundle Identifier"

**Problem:** Bundle ID already used by another app

**Solution:** Update bundle identifier in `eas.json`:
```json
"staging": {
  "ios": {
    "bundleIdentifier": "com.wizardstech.goalgpt.staging.v2"
  }
}
```

### Build Fails - "Missing Credentials"

**Problem:** iOS requires provisioning profile

**Solution:** EAS will handle this automatically:
- First build: Creates credentials
- Follow prompts to sign in with Apple Developer account
- EAS manages certificates and profiles

### Cannot Install on iOS Device

**Problem:** Device not registered in provisioning profile

**Solution:**
1. Go to https://expo.dev
2. Your project → Credentials
3. Add device UDID
4. Rebuild app

Or use Ad Hoc distribution:
```bash
npx eas-cli device:create
```

### Screenshots Too Small/Large

**Problem:** Wrong device resolution

**Solution:**
- iOS: Use iPhone 15 Pro Max (or 14 Pro Max)
- Android: Use device with 1080x1920 or higher
- Can resize in image editor

---

## Current Configuration

**Staging Profile (`eas.json`):**
```json
{
  "staging": {
    "distribution": "internal",
    "channel": "staging",
    "ios": {
      "simulator": false,
      "buildConfiguration": "Release",
      "bundleIdentifier": "com.wizardstech.goalgpt.staging"
    },
    "android": {
      "buildType": "apk",
      "gradleCommand": ":app:assembleRelease",
      "applicationId": "com.wizardstech.goalgpt.staging"
    },
    "env": {
      "NODE_ENV": "production",
      "EXPO_PUBLIC_ENVIRONMENT": "staging"
    }
  }
}
```

**App Configuration (`app.json`):**
- App Name: GoalGPT
- Version: 1.0.0
- Bundle ID (iOS): com.wizardstech.goalgpt.staging
- Package Name (Android): com.wizardstech.goalgpt.staging

---

## Expected Build Times

| Platform | Time | Size |
|----------|------|------|
| iOS (EAS Cloud) | 10-20 min | ~20-30 MB IPA |
| Android (EAS Cloud) | 10-20 min | ~15-25 MB APK |
| Both Platforms | 15-25 min | Parallel builds |

---

## Quick Start Commands

**For first-time setup:**
```bash
# 1. Login to EAS
npx eas-cli login

# 2. Configure project (first time only)
npx eas-cli build:configure

# 3. Build both platforms
npx eas-cli build --profile staging --platform all

# 4. Check build status
npx eas-cli build:list

# 5. Download builds when ready
npx eas-cli build:download --platform ios --latest
npx eas-cli build:download --platform android --latest
```

**For subsequent builds:**
```bash
# Just build (if already configured)
npx eas-cli build --profile staging --platform all
```

---

## Alternative: Local Builds

If you prefer to build locally (faster but requires more setup):

**iOS (Requires Mac with Xcode):**
```bash
npx eas-cli build --profile staging --platform ios --local
```

**Android:**
```bash
npx eas-cli build --profile staging --platform android --local
```

**Requirements:**
- Mac with Xcode 14+ (for iOS)
- Android Studio with SDK (for Android)
- Valid certificates and provisioning profiles

---

## Screenshot Checklist

### Before Capturing:
- [ ] Staging build installed on device
- [ ] App opens successfully
- [ ] All features working (match data, predictions, etc.)
- [ ] Test account logged in
- [ ] Good lighting for device photos (if using frames)

### While Capturing:
- [ ] Clean status bar (time, battery, signal)
- [ ] Portrait orientation
- [ ] Highest quality settings
- [ ] Consistent navigation (same user, same data if possible)
- [ ] Capture multiple variations (pick best later)

### After Capturing:
- [ ] Verify dimensions (iOS: 1290x2796, Android: 1080x1920)
- [ ] Check image quality (no blur, compression)
- [ ] Organize by platform and screen
- [ ] Backup screenshots
- [ ] Edit if needed (frames, text, etc.)

---

## Next Steps After Screenshots

1. Upload screenshots to App Store Connect (iOS)
2. Upload screenshots to Play Console (Android)
3. Add feature graphic for Play Store (1024x500)
4. Verify all store listing content (from STORE-LISTING-COPY.md)
5. Proceed to production builds

---

**Status**: Ready for staging builds ✅

**Documentation Reference:**
- SCREENSHOT-CAPTURE-GUIDE.md (detailed capture instructions)
- APP-ASSETS-CHECKLIST.md (full asset requirements)
- STORE-LISTING-COPY.md (app store descriptions)

---

*Last Updated: January 15, 2026*
