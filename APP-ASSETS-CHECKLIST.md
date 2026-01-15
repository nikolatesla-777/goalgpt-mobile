# App Assets Checklist - Phase 13
**GoalGPT Mobile - Production Release**
**Date**: 2025-01-15

---

## 1. Current Asset Status ✅

### App Icons (COMPLETE)
- [x] **icon.png** - 1024x1024 ✅
  - Location: `assets/icon.png`
  - Status: Ready for App Store
  - Size: 22.38 KB

- [x] **adaptive-icon.png** - 1024x1024 ✅
  - Location: `assets/adaptive-icon.png`
  - Status: Ready for Play Store
  - Size: 17.55 KB

### Splash Screen (COMPLETE)
- [x] **splash-icon.png** - 1024x1024 ✅
  - Location: `assets/splash-icon.png`
  - Background: #2196F3 (Material Blue)
  - Resize mode: contain
  - Status: Ready for production

### App Configuration (COMPLETE)
- [x] app.json configured correctly
- [x] Bundle identifiers set
  - iOS: com.wizardstech.goalgpt
  - Android: com.wizardstech.goalgpt
- [x] Version: 1.0.0
- [x] Build numbers: iOS (1), Android (1)

---

## 2. Screenshots Required 📸

### iOS App Store Screenshots

#### Required Sizes:
1. **6.7" Display** (iPhone 14 Pro Max, 15 Pro Max) - **REQUIRED**
   - [ ] Size: 1290 x 2796 pixels
   - [ ] Minimum: 3 screenshots
   - [ ] Maximum: 10 screenshots
   - [ ] Status: NEEDED

2. **6.5" Display** (iPhone 11 Pro Max, XS Max)
   - [ ] Size: 1242 x 2688 pixels
   - [ ] Status: OPTIONAL but recommended

3. **5.5" Display** (iPhone 8 Plus)
   - [ ] Size: 1242 x 2208 pixels
   - [ ] Status: OPTIONAL

4. **12.9" iPad Pro** (3rd gen or later)
   - [ ] Size: 2048 x 2732 pixels
   - [ ] Status: OPTIONAL (if supporting iPad)

#### Screenshot Content Plan:
1. **Home Screen** - Live matches dashboard with real-time scores
2. **Live Match Detail** - Match in progress with minute-by-minute updates
3. **Match Statistics** - Detailed stats, lineup, H2H comparison
4. **AI Predictions** - Bot predictions with confidence scores
5. **Bot Leaderboard** - Top performing AI bots
6. **User Profile** - Achievements, streaks, and XP system

### Android Play Store Screenshots

#### Required:
1. **Phone Screenshots** - **REQUIRED**
   - [ ] Size: 1080 x 1920 pixels (minimum)
   - [ ] Minimum: 2 screenshots
   - [ ] Maximum: 8 screenshots
   - [ ] Status: NEEDED

2. **Feature Graphic** - **REQUIRED**
   - [ ] Size: 1024 x 500 pixels
   - [ ] JPG or 24-bit PNG (no alpha)
   - [ ] Status: NEEDED
   - [ ] Content: App logo + tagline + key features

#### Optional:
3. **7" Tablet Screenshots**
   - [ ] Size: 1200 x 1920 pixels
   - [ ] Status: OPTIONAL

4. **10" Tablet Screenshots**
   - [ ] Size: 1600 x 2560 pixels
   - [ ] Status: OPTIONAL

5. **Promo Video**
   - [ ] Duration: 30-120 seconds
   - [ ] YouTube URL
   - [ ] Status: OPTIONAL

---

## 3. Screenshot Capture Plan 🎯

### Recommended Tools:
- **iOS Simulator** - Xcode Simulator for precise device sizes
- **Android Emulator** - Android Studio for accurate screenshots
- **Expo Device Preview** - Test on actual devices
- **Screenshot Framers**:
  - https://www.shotbot.io/ (Free device frames)
  - https://mockuphone.com/ (Free mockups)
  - https://previewed.app/ (Premium, high-quality)

### Capture Steps:

#### Step 1: Build App for Screenshots
```bash
# iOS Development Build
eas build --profile preview --platform ios

# Android Development Build
eas build --profile preview --platform android
```

#### Step 2: Prepare Screenshot Environment
- Use production-like data (not test data)
- Ensure consistent theme (dark mode or light mode)
- Clear any debug overlays
- Use realistic match data
- Show live matches with actual scores

#### Step 3: Capture on Devices/Simulators
**iOS (Xcode Simulator):**
```bash
# Open in simulator
xcrun simctl boot "iPhone 15 Pro Max"
# Install development build
# Navigate to each screen
# Command+S to save screenshot
```

**Android (Android Studio):**
```bash
# Open emulator
# Install development build via: adb install app.apk
# Navigate to each screen
# Screenshot button in emulator toolbar
```

#### Step 4: Edit and Frame
1. Crop screenshots to exact dimensions
2. Add device frames (optional but recommended)
3. Add text overlays explaining features (optional)
4. Ensure consistent branding colors
5. Export at required dimensions

---

## 4. Marketing Assets 🎨

### App Store Marketing

#### App Preview Video (Optional)
- [ ] Duration: 15-30 seconds
- [ ] Show key features:
  - Live score updates
  - AI predictions
  - Real-time notifications
  - Bot leaderboard
- [ ] No audio required (use captions)
- [ ] Export formats: MOV or M4V

#### App Store Listing Copy
- [ ] **Promotional Text** (170 characters) - Appears above description
  - Example: "Get real-time football scores and AI-powered predictions! Track live matches, compare bot predictions, and never miss a goal. Download now! ⚽"

- [ ] **Description** (4000 characters max)
  - Highlight key features
  - Use bullet points
  - Include keywords for ASO
  - Call to action

- [ ] **Keywords** (100 characters, comma-separated)
  - Example: "football,soccer,live scores,predictions,AI,bots,livescore,fixtures,results,standings"

- [ ] **Support URL**
  - URL: https://goalgpt.com/support

- [ ] **Marketing URL** (Optional)
  - URL: https://goalgpt.com

### Play Store Marketing

#### Feature Graphic (REQUIRED)
- [ ] Size: 1024 x 500 pixels
- [ ] Content ideas:
  - App logo (centered or left-aligned)
  - Tagline: "AI-Powered Football Predictions"
  - Key features with icons
  - "Live Scores | AI Bots | Real-time Updates"

#### Store Listing Copy
- [ ] **Short Description** (80 characters)
  - Example: "Live football scores and AI predictions. Track matches in real-time!"

- [ ] **Full Description** (4000 characters)
  - Formatted with bullet points
  - Highlight key features
  - Include ASO keywords
  - End with call to action

- [ ] **App Category**
  - Primary: Sports
  - Secondary: N/A

- [ ] **Content Rating**
  - Target: Everyone (PEGI 3, ESRB E)

---

## 5. Asset Requirements Summary

### Immediate Priorities (Production Release):

#### CRITICAL (Must Have):
1. ✅ App Icon (1024x1024) - DONE
2. ✅ Adaptive Icon (Android) - DONE
3. ✅ Splash Screen - DONE
4. ⏳ iOS Screenshots (6.7" - minimum 3) - NEEDED
5. ⏳ Android Screenshots (1080x1920 - minimum 2) - NEEDED
6. ⏳ Android Feature Graphic (1024x500) - NEEDED

#### HIGH Priority:
7. ⏳ Store listing copy (both platforms)
8. ⏳ Keywords/ASO optimization
9. ⏳ Support URL content

#### MEDIUM Priority (Nice to Have):
10. ⏳ App Preview Video (iOS)
11. ⏳ Promo Video (Android)
12. ⏳ Tablet screenshots
13. ⏳ Additional device size screenshots

---

## 6. Pre-Submission Checklist

### Before Capturing Screenshots:
- [ ] Remove test accounts/data
- [ ] Use realistic match data
- [ ] Verify all UI text is in correct language
- [ ] Check for any visible bugs
- [ ] Ensure consistent branding
- [ ] Test on actual devices if possible

### Screenshot Quality Standards:
- [ ] No placeholder images or Lorem Ipsum text
- [ ] High resolution (no blurry images)
- [ ] Consistent UI theme across all screenshots
- [ ] No dev tools or debug overlays visible
- [ ] Proper aspect ratios maintained
- [ ] File sizes within platform limits

### Store Listing Quality:
- [ ] No spelling errors in descriptions
- [ ] Keywords properly researched
- [ ] Compliance with platform policies
- [ ] Contact information accurate
- [ ] Privacy policy URL valid
- [ ] Terms of service URL valid

---

## 7. Screenshot Capture Workflow

### Recommended Sequence:

```
1. Home Screen (Dashboard)
   ├─ Show live matches in progress
   ├─ Display upcoming fixtures
   └─ Highlight featured match

2. Live Match Detail
   ├─ Match in progress (e.g., 63')
   ├─ Real-time score (e.g., 2-1)
   └─ Live statistics visible

3. Match Statistics Tab
   ├─ Possession, shots, corners
   ├─ Team comparison bars
   └─ Player statistics

4. AI Predictions Tab
   ├─ Multiple bot predictions
   ├─ Confidence percentages
   └─ Win/loss indicators

5. Bot Leaderboard
   ├─ Top performing bots
   ├─ Success rates
   └─ Recent predictions

6. User Profile
   ├─ XP level and progress
   ├─ Login streak
   └─ Badges/achievements
```

---

## 8. Tools & Resources

### Screenshot Tools:
- iOS Simulator (Xcode) - Free, accurate device sizes
- Android Emulator (Android Studio) - Free, all device types
- https://www.shotbot.io/ - Free device frames
- https://mockuphone.com/ - Free mockup generator

### Design Tools:
- Figma - For editing and framing
- Sketch - Alternative design tool
- Adobe Photoshop - Professional editing
- Canva - Quick feature graphics

### ASO Tools:
- App Store Connect (built-in keyword analytics)
- Google Play Console (built-in)
- https://www.appannie.com/ - Market intelligence
- https://www.apptopia.com/ - Competitor analysis

### Guidelines:
- [iOS App Store Guidelines](https://developer.apple.com/app-store/product-page/)
- [Android Play Store Guidelines](https://developer.android.com/distribute/marketing-tools/device-art-generator)
- [App Store Screenshot Specs](https://help.apple.com/app-store-connect/#/devd274dd925)
- [Play Store Asset Specs](https://support.google.com/googleplay/android-developer/answer/9866151)

---

## 9. Timeline & Ownership

| Task | Owner | Estimated Time | Status |
|------|-------|----------------|--------|
| iOS Screenshots (3-6 screens) | Design/Dev | 2-3 hours | ⏳ TODO |
| Android Screenshots (2-5 screens) | Design/Dev | 1-2 hours | ⏳ TODO |
| Feature Graphic (Android) | Design | 1 hour | ⏳ TODO |
| Store Listing Copy | Marketing/Dev | 2 hours | ⏳ TODO |
| ASO Keywords Research | Marketing | 1 hour | ⏳ TODO |
| Preview Video (optional) | Video Editor | 4-6 hours | ⏳ SKIP |

**Total Estimated Time**: 7-9 hours (excluding optional video)

---

## 10. Next Steps

1. **Build preview version** for screenshot capture
   ```bash
   eas build --profile preview --platform all
   ```

2. **Install on simulator/emulator** and capture screenshots

3. **Edit and frame** screenshots using tools above

4. **Create feature graphic** for Play Store

5. **Write store listing copy** with ASO optimization

6. **Review and approve** all assets before submission

7. **Upload to App Store Connect** and **Play Console**

---

## Notes

- All current app icons (icon.png, adaptive-icon.png, splash-icon.png) are production-ready ✅
- Focus on capturing high-quality screenshots showing real app functionality
- Prioritize iPhone 14 Pro Max (6.7") and 1080x1920 Android screenshots
- Feature graphic should clearly communicate app value proposition
- Consider A/B testing different screenshot orders for better conversion

**Status**: Ready for screenshot capture phase
**Blockers**: Need production build with real data for professional screenshots
**Next Action**: Build preview version and set up screenshot environment
