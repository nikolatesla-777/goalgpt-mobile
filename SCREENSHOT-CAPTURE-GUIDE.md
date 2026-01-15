# Screenshot Capture Guide - GoalGPT Mobile
**Phase 13 - App Store Submission**
**Date**: 2025-01-15

---

## Overview

This guide provides step-by-step instructions for capturing professional app screenshots for both iOS App Store and Google Play Store submissions.

---

## Prerequisites

### Required Tools:
- [ ] Xcode (for iOS Simulator) - https://developer.apple.com/xcode/
- [ ] Android Studio (for Android Emulator) - https://developer.android.com/studio
- [ ] Image editor (Figma, Photoshop, or Sketch)
- [ ] Device frame tool (optional) - https://www.shotbot.io/

### Required Builds:
```bash
# Build preview/staging version with production-like data
eas build --profile staging --platform ios
eas build --profile staging --platform android
```

---

## iOS Screenshot Capture

### Step 1: Set Up iOS Simulator

#### Required Device:
**iPhone 15 Pro Max (6.7" Display)** - This is the REQUIRED size for App Store

```bash
# Open Xcode
# Go to: Xcode > Open Developer Tool > Simulator

# Select device:
# Hardware > Device > iOS 17.2 > iPhone 15 Pro Max
```

#### Simulator Settings:
```
1. Window > Physical Size (for accurate screenshots)
2. Device > Rotate Left/Right (if needed)
3. I/O > External Display > None
```

### Step 2: Install App on Simulator

```bash
# Drag and drop the .app file to simulator
# OR install via command line:
xcrun simctl install booted path/to/your.app

# Launch the app
xcrun simctl launch booted com.wizardstech.goalgpt
```

### Step 3: Prepare Environment

1. **Clear Simulator State**:
   - Device > Erase All Content and Settings
   - Reinstall app fresh

2. **Set System Time** (for consistent screenshots):
   - Show live matches at realistic times
   - E.g., 15:45 for afternoon match

3. **Configure App State**:
   - Create test account or use existing
   - Load production-like data
   - Navigate to first screenshot screen

### Step 4: Capture Screenshots

#### Screenshot 1: Home Screen (Live Matches Dashboard)
```
Setup:
- Ensure 3-5 live matches visible
- Show realistic scores (e.g., 2-1, 0-0, 3-2)
- Display match minutes (e.g., 45', 67', 89')
- Include league badges/logos

Capture:
- Command + S (saves to Desktop)
- Or: Device > Screenshot
- Verify saved as: Simulator Screen Shot - iPhone 15 Pro Max - [timestamp].png
```

#### Screenshot 2: Live Match Detail
```
Setup:
- Open a match in progress
- Show score and minute (e.g., "2-1 • 63'")
- Display live statistics (possession, shots, corners)
- Show match events timeline

Capture:
- Command + S
```

#### Screenshot 3: Match Statistics Tab
```
Setup:
- Navigate to Statistics tab
- Show possession percentage bars
- Display shots on/off target
- Include corners, fouls, offsides stats

Capture:
- Command + S
```

#### Screenshot 4: AI Predictions Tab
```
Setup:
- Navigate to AI/Predictions tab
- Show 3-5 bot predictions
- Display confidence percentages (e.g., 78%, 85%)
- Include bot tier badges (FREE, VIP, PREMIUM)

Capture:
- Command + S
```

#### Screenshot 5: Bot Leaderboard
```
Setup:
- Navigate to Bots/Leaderboard screen
- Show top 5-10 bots
- Display success rates (e.g., 78.5%, 81.2%)
- Include win/loss/pending counts

Capture:
- Command + S
```

#### Screenshot 6: User Profile
```
Setup:
- Navigate to Profile screen
- Show XP level and progress bar
- Display login streak
- Include earned badges/achievements

Capture:
- Command + S
```

### Step 5: Verify Screenshot Dimensions

```bash
# Check screenshot size:
sips -g pixelWidth -g pixelHeight screenshot.png

# Should output:
# pixelWidth: 1290
# pixelHeight: 2796
```

If dimensions are wrong:
```bash
# Resize with sips:
sips -z 2796 1290 input.png --out output.png
```

---

## Android Screenshot Capture

### Step 1: Set Up Android Emulator

#### Required Device:
**Pixel 7 Pro or Generic Full HD Device (1080x1920 minimum)**

```bash
# Open Android Studio
# Tools > Device Manager

# Create new virtual device:
# Category: Phone
# Device: Pixel 7 Pro
# System Image: API 33 (Android 13.0)
# Graphics: Hardware - GLES 2.0
```

#### Emulator Settings:
```
1. Settings (gear icon) > Advanced Settings
2. Set scale to 100%
3. Enable "Show Device Frame" (optional)
```

### Step 2: Install App on Emulator

```bash
# Install APK:
adb install path/to/app-release.apk

# Or drag and drop APK to emulator window

# Launch app:
adb shell am start -n com.wizardstech.goalgpt/.MainActivity
```

### Step 3: Prepare Environment

1. **Configure Emulator**:
   - Settings > Display > Dark theme (if using dark mode)
   - Set time to realistic match time
   - Ensure stable internet connection

2. **Configure App State**:
   - Login to test account
   - Navigate to home screen
   - Load live matches data

### Step 4: Capture Screenshots

#### Same 6 Screenshots as iOS:
1. Home Screen (Live Matches Dashboard)
2. Live Match Detail
3. Match Statistics Tab
4. AI Predictions Tab
5. Bot Leaderboard
6. User Profile

#### Capture Method:
- Click camera icon in emulator toolbar (bottom right)
- Or use: Command + S (Mac) / Ctrl + S (Windows)
- Screenshots saved to: ~/Desktop or configured location

### Step 5: Verify Screenshot Dimensions

Minimum requirement: **1080 x 1920 pixels**

```bash
# Check dimensions (Mac):
sips -g pixelWidth -g pixelHeight screenshot.png

# Check dimensions (Linux/Windows with ImageMagick):
identify screenshot.png
```

If wrong size:
```bash
# Resize to 1080x1920:
sips -z 1920 1080 input.png --out output.png

# Or with ImageMagick:
convert input.png -resize 1080x1920 output.png
```

---

## Screenshot Editing & Enhancement

### Step 1: Crop and Resize

Use your preferred image editor to:
1. Crop to exact dimensions
2. Remove status bar artifacts (if any)
3. Ensure no blurry or distorted areas

**Exact Dimensions Required:**
- iOS: 1290 x 2796 pixels (6.7" display)
- Android: 1080 x 1920 pixels (minimum)

### Step 2: Add Device Frames (Optional)

#### Using Shotbot.io (Free):
1. Visit: https://www.shotbot.io/
2. Upload screenshot
3. Select device: iPhone 15 Pro Max or Pixel 7 Pro
4. Choose background color (match brand: #2196F3 or white)
5. Download framed image

#### Using Figma:
1. Import device frame mockup
2. Place screenshot inside frame
3. Add background color or gradient
4. Export as PNG at 2x resolution

### Step 3: Add Text Overlays (Optional)

**Best Practices:**
- Keep text minimal and readable
- Use app brand colors (#2196F3)
- Don't cover important UI elements
- Maintain consistency across all screenshots

**Example Text Overlays:**
- Screenshot 1: "Real-time Live Scores"
- Screenshot 2: "Minute-by-Minute Updates"
- Screenshot 3: "Detailed Match Statistics"
- Screenshot 4: "AI-Powered Predictions"
- Screenshot 5: "Top Performing Bots"
- Screenshot 6: "Earn XP & Rewards"

### Step 4: Quality Check

Verify each screenshot:
- [ ] Correct dimensions
- [ ] High resolution (no blur)
- [ ] No personal information visible
- [ ] No debug overlays or dev tools
- [ ] Consistent theme (all dark or all light)
- [ ] No placeholder text or Lorem Ipsum
- [ ] Realistic data (not obviously test data)
- [ ] UI text in correct language
- [ ] No visible bugs or UI glitches

---

## Android Feature Graphic

### Requirements:
- **Size**: 1024 x 500 pixels
- **Format**: JPG or 24-bit PNG (no alpha channel)
- **File size**: Max 1MB

### Design Options:

#### Option 1: Logo + Tagline + Features
```
Layout:
┌─────────────────────────────────────────┐
│                                         │
│  [App Icon]  GoalGPT                   │
│              AI-Powered Predictions     │
│                                         │
│  ⚽ Live Scores | 🤖 AI Bots | 📊 Stats │
└─────────────────────────────────────────┘

Colors: #2196F3 background, white text
```

#### Option 2: App Preview
```
Layout:
┌─────────────────────────────────────────┐
│                                         │
│  [Phone Mockup]   Never Miss a Goal    │
│   with screenshot  AI Predictions       │
│                    Real-time Updates    │
└─────────────────────────────────────────┘

Colors: Gradient background, mockup on left
```

#### Option 3: Feature Icons
```
Layout:
┌─────────────────────────────────────────┐
│                                         │
│         GoalGPT - Football AI          │
│                                         │
│  ⚽        🤖         📊        🏆       │
│  Live    AI Bots   Stats   Rewards     │
└─────────────────────────────────────────┘

Colors: White background, blue icons
```

### Creation Steps:

#### Using Figma:
1. Create new frame: 1024 x 500 pixels
2. Add background color/gradient
3. Import app icon and logo
4. Add tagline text (60-80pt font)
5. Add feature icons or mockups
6. Export as PNG (flatten layers if using alpha)

#### Using Canva:
1. Create custom size: 1024 x 500 pixels
2. Use "Feature Graphic" templates
3. Customize with app branding
4. Download as PNG or JPG

#### Using Photoshop:
1. New file: 1024 x 500 pixels, 72 DPI
2. Design feature graphic
3. Flatten image (no transparency)
4. Save for Web: JPG Quality 100% or PNG-24

---

## Screenshot File Naming Convention

### iOS Screenshots:
```
ios_6_7_inch_01_home.png
ios_6_7_inch_02_live_match.png
ios_6_7_inch_03_statistics.png
ios_6_7_inch_04_predictions.png
ios_6_7_inch_05_leaderboard.png
ios_6_7_inch_06_profile.png
```

### Android Screenshots:
```
android_phone_01_home.png
android_phone_02_live_match.png
android_phone_03_statistics.png
android_phone_04_predictions.png
android_phone_05_leaderboard.png
android_phone_06_profile.png
```

### Feature Graphic:
```
android_feature_graphic.png (or .jpg)
```

---

## Upload to App Stores

### iOS - App Store Connect:

1. Log in to https://appstoreconnect.apple.com/
2. Navigate to: My Apps > GoalGPT > App Store tab
3. Scroll to: App Previews and Screenshots
4. Select: 6.7" Display
5. Drag and drop screenshots in order
6. Rearrange if needed (first screenshot is most important)
7. Add captions (optional, max 170 characters each)
8. Save changes

**Screenshot Order Recommendation:**
1. Home Screen (shows main value)
2. Live Match (demonstrates real-time feature)
3. AI Predictions (differentiator)
4. Statistics (for data lovers)
5. Leaderboard (social proof)
6. Profile (gamification hook)

### Android - Google Play Console:

1. Log in to https://play.google.com/console/
2. Select GoalGPT app
3. Navigate to: Store presence > Main store listing
4. Scroll to: Graphics
5. Upload feature graphic (required)
6. Upload phone screenshots (min 2, max 8)
7. Add video URL (optional)
8. Save changes

**Screenshot Order Recommendation:**
- Same as iOS (consistency across platforms)

---

## Testing Screenshots Before Submission

### iOS Preview in App Store Connect:
1. Upload screenshots
2. Click "App Store" tab preview
3. Verify how screenshots look on different device sizes
4. Check text readability
5. Test screenshot swiping order

### Android Preview in Play Console:
1. Upload screenshots
2. Click "Preview store listing"
3. View on different device sizes
4. Verify feature graphic appearance
5. Test on both light and dark Play Store themes

### Get Feedback:
- [ ] Show to team members
- [ ] Test with non-technical users
- [ ] Check on actual devices (not just simulator)
- [ ] Verify screenshots tell a clear story
- [ ] Ensure first screenshot grabs attention

---

## Troubleshooting

### Issue: Screenshots are blurry
**Solution**: Capture at 2x or 3x scale, then resize down

### Issue: Status bar shows wrong time
**Solution**: Edit image to remove/replace status bar

### Issue: Wrong aspect ratio
**Solution**: Use exact device specifications, don't crop incorrectly

### Issue: File size too large
**Solution**: Compress PNG with tools like TinyPNG or ImageOptim

### Issue: Feature graphic has transparency
**Solution**: Flatten layers or export as JPG instead of PNG

### Issue: Screenshots rejected by App Store
**Reasons**:
- Personal information visible
- Non-functional UI elements
- Misleading content
- Low quality/resolution
- Contains competitor branding

**Solution**: Review guidelines and recapture

---

## Timeline

### Estimated Time for Complete Screenshot Workflow:

| Task | Time Estimate |
|------|---------------|
| Set up simulators/emulators | 30 minutes |
| Configure app state with realistic data | 30 minutes |
| Capture iOS screenshots (6 screens) | 1 hour |
| Capture Android screenshots (6 screens) | 45 minutes |
| Edit and enhance screenshots | 2 hours |
| Create feature graphic | 1 hour |
| Quality review and revisions | 1 hour |
| Upload to app stores | 30 minutes |
| **Total** | **~7 hours** |

### Parallelization:
- Designer can create feature graphic while dev captures screenshots
- iOS and Android screenshots can be captured simultaneously by different team members

---

## Checklist

### Before Starting:
- [ ] Production/staging build ready
- [ ] Simulators/emulators configured
- [ ] Realistic test data prepared
- [ ] Design tools installed
- [ ] Style guide/brand colors available

### During Capture:
- [ ] All 6 required screenshots captured (iOS)
- [ ] All 6 required screenshots captured (Android)
- [ ] Screenshots show real functionality
- [ ] No debug tools visible
- [ ] Consistent theme (dark or light)
- [ ] All dimensions verified

### After Editing:
- [ ] Device frames added (if desired)
- [ ] Text overlays added (if desired)
- [ ] Quality check passed
- [ ] Files properly named
- [ ] Feature graphic created (Android)
- [ ] All files < 1MB each

### Before Upload:
- [ ] Team review completed
- [ ] Feedback incorporated
- [ ] Final approval received
- [ ] Screenshots ordered correctly
- [ ] Backup copies saved

### After Upload:
- [ ] Preview in App Store Connect
- [ ] Preview in Play Console
- [ ] Test on actual devices (if possible)
- [ ] Save for future updates

---

## Resources

### Screenshot Tools:
- **Shotbot** - https://www.shotbot.io/ (Free device frames)
- **MockUPhone** - https://mockuphone.com/ (Free mockups)
- **Previewed** - https://previewed.app/ (Premium)
- **Figma** - https://www.figma.com/ (Design tool)

### Guidelines:
- [iOS Screenshot Specs](https://help.apple.com/app-store-connect/#/devd274dd925)
- [Android Asset Guidelines](https://support.google.com/googleplay/android-developer/answer/9866151)
- [Apple Design Resources](https://developer.apple.com/design/resources/)
- [Material Design](https://material.io/)

### Image Optimization:
- **TinyPNG** - https://tinypng.com/ (Free PNG compression)
- **ImageOptim** - https://imageoptim.com/ (Mac app)
- **Squoosh** - https://squoosh.app/ (Google's web tool)

---

## Next Steps

1. **Schedule screenshot capture session** (1 day)
2. **Build staging version** with production-like data
3. **Capture all required screenshots** following this guide
4. **Edit and enhance** screenshots
5. **Create feature graphic** for Android
6. **Get team approval**
7. **Upload to app stores**
8. **Proceed to next phase** (legal documents)

**Status**: Ready to begin screenshot capture
**Owner**: Design + Development
**Estimated Completion**: 1 day
