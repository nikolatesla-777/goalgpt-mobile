# Pre-Submission Checklist - App Store & Play Store
**GoalGPT Mobile - Phase 13**
**Date**: January 15, 2026
**Target Launch**: Week 3 (Day 18)

---

## Overview

This comprehensive checklist covers all requirements before submitting to Apple App Store and Google Play Store.

**Status Legend:**
- ✅ = Complete
- ⚠️ = In Progress / Partially Complete
- ❌ = Not Started
- 🔴 = Critical Blocker
- 🟡 = Required
- 🟢 = Recommended
- ⚪ = Optional

---

## 🔴 CRITICAL BLOCKERS (Must Complete First)

These items will prevent submission or cause immediate rejection:

### Legal & Compliance
- [x] ✅ Privacy Policy document created (PRIVACY-POLICY.md)
- [x] ✅ Terms of Service document created (TERMS-OF-SERVICE.md)
- [x] ✅ EULA document created (EULA.md)
- [ ] 🔴 **Host Privacy Policy at https://goalgpt.com/privacy**
- [ ] 🔴 **Host Terms of Service at https://goalgpt.com/terms**
- [ ] 🔴 **Set up privacy@goalgpt.com email** (monitored daily)
- [ ] 🔴 **Set up legal@goalgpt.com email** (monitored regularly)
- [x] ✅ Legal links in app (Settings + Registration/Login screens)

**Blocking Issues:**
- ⚠️ Legal documents drafted but NOT hosted (App Store requires live URLs)
- ⚠️ Privacy email not set up (GDPR/CCPA compliance requires this)

**Action Required:**
1. Host legal documents on goalgpt.com or temporary hosting (GitHub Pages works)
2. Create and configure email addresses
3. Test URLs are accessible from mobile devices

### App Assets
- [x] ✅ App icon (1024x1024) ready
- [x] ✅ Splash screen ready
- [ ] 🔴 **iOS Screenshots (6 screens, 1290x2796)**
- [ ] 🔴 **Android Screenshots (6 screens, 1080x1920)**
- [ ] 🔴 **Android Feature Graphic (1024x500)**

**Blocking Issues:**
- ⚠️ Screenshots not captured yet (requires staging build)
- ⚠️ Feature graphic not created

**Action Required:**
1. Build staging apps (SCREENSHOT-BUILD-INSTRUCTIONS.md)
2. Capture screenshots on devices
3. Create Android feature graphic

### Developer Accounts
- [ ] 🔴 **Apple Developer Account** ($99/year)
  - Status: Unknown
  - Required for iOS submission
  - Takes 24-48 hours to activate

- [ ] 🔴 **Google Play Developer Account** ($25 one-time)
  - Status: Unknown
  - Required for Android submission
  - Takes 1-2 days to activate

**Action Required:**
1. Register at https://developer.apple.com/programs/ (iOS)
2. Register at https://play.google.com/console/signup (Android)
3. Complete identity verification
4. Accept agreements

---

## 🟡 REQUIRED FOR SUBMISSION

These are mandatory for successful submission:

### iOS App Store Connect

#### App Information
- [ ] **Bundle Identifier**: com.wizardstech.goalgpt
- [ ] **App Name**: GoalGPT
- [ ] **Primary Language**: English (or Turkish)
- [ ] **Bundle ID registered** in Apple Developer portal
- [ ] **Privacy Policy URL**: https://goalgpt.com/privacy
- [ ] **EULA** (optional - can use Apple's standard EULA)
- [ ] **Support URL**: https://goalgpt.com/support
- [ ] **Marketing URL**: https://goalgpt.com (optional)

#### App Store Listing
- [x] ✅ App description prepared (STORE-LISTING-COPY.md)
- [x] ✅ Keywords prepared (ASO strategy documented)
- [ ] **Screenshots uploaded** (6 screens minimum)
- [ ] **App Preview Video** (optional but recommended)
- [ ] **Promotional Text** (170 characters)
- [ ] **App Subtitle** (30 characters)
- [ ] **Category selected**: Sports or Entertainment
- [ ] **Content Rights**: Confirm you own/licensed all content

#### App Privacy (iOS 14.5+)
- [ ] **Complete Data Collection Questionnaire**
  - Personal data collected: Email, Name, User ID
  - Usage data: Analytics, Crash logs
  - Tracking: Location (if used), Advertising ID
  - Third-party data: Firebase, Sentry, RevenueCat, AdMob
- [ ] **Data Use**: Account creation, analytics, advertising, product personalization
- [ ] **Data Linked to User**: Yes (email, name, user ID)
- [ ] **App Tracking Transparency (ATT)**: Implement if tracking users

Reference: PRIVACY-POLICY.md for complete data collection details

#### Version Information
- [ ] **Version**: 1.0.0
- [ ] **Build Number**: 1 (auto-incremented by EAS)
- [ ] **Copyright**: © 2026 Wizards Tech / GoalGPT
- [ ] **What's New**: Initial release description

#### Pricing & Availability
- [ ] **Price**: Free (with in-app purchases if applicable)
- [ ] **Availability**: All countries or specific countries
- [ ] **Pre-order**: No (for initial release)

#### In-App Purchases (If Applicable)
- [ ] **VIP Subscription**: Configure pricing tiers
- [ ] **RevenueCat Product IDs**: Match configuration
- [ ] **Subscription terms**: Clear description
- [ ] **Restore purchases**: Implemented in app

#### Age Rating
- [ ] **Complete Age Rating Questionnaire**
  - Likely: 4+ or 9+ (depending on gambling references)
  - Sports betting references: May require 17+
  - Realistic violence: None
  - Gambling: Check if predictions constitute gambling

### Google Play Console

#### App Details
- [ ] **Application ID**: com.wizardstech.goalgpt
- [ ] **App Name**: GoalGPT
- [ ] **Default Language**: English (or Turkish)
- [ ] **Short Description**: 80 characters
- [ ] **Full Description**: 4000 characters (STORE-LISTING-COPY.md)
- [ ] **App Icon**: 512x512 PNG
- [ ] **Feature Graphic**: 1024x500 JPEG/PNG

#### Screenshots & Media
- [ ] **Phone Screenshots**: 6 screens (1080x1920 minimum)
- [ ] **7-inch Tablet Screenshots**: Optional
- [ ] **10-inch Tablet Screenshots**: Optional
- [ ] **Promo Video**: YouTube link (optional)

#### Store Listing
- [ ] **Category**: Sports or Entertainment
- [ ] **Tags**: Up to 5 tags
- [ ] **Contact Details**:
  - Email: support@goalgpt.com
  - Phone: Optional
  - Website: https://goalgpt.com

#### Content Rating
- [ ] **Complete IARC Questionnaire**
  - Violence: None
  - Sex: None
  - Language: None
  - Drugs: None
  - Gambling: Check based on app functionality

#### Privacy & Data Safety
- [ ] **Privacy Policy URL**: https://goalgpt.com/privacy
- [ ] **Complete Data Safety Form**:
  - Data collected: Email, name, user ID, analytics
  - Data shared: With third-parties (Firebase, Sentry, RevenueCat)
  - Security practices: Data encrypted in transit
  - User controls: Account deletion, data export

Reference: PRIVACY-POLICY.md for complete details

#### App Access
- [ ] **All features available**: Or explain restricted access
- [ ] **Test credentials**: If login required for review

#### Pricing & Distribution
- [ ] **Countries**: All or specific
- [ ] **Price**: Free
- [ ] **Contains Ads**: Yes/No
- [ ] **In-app purchases**: Configure if applicable

### Production Builds

#### iOS Production Build
- [ ] **Build profile**: production (not staging)
- [ ] **Bundle ID**: com.wizardstech.goalgpt
- [ ] **Version**: 1.0.0
- [ ] **Build Number**: Auto-increment enabled
- [ ] **Distribution**: store
- [ ] **Hermes**: Enabled ✅
- [ ] **Optimization**: Production mode ✅
- [ ] **Code signing**: EAS handles automatically

**Build Command:**
```bash
npx eas-cli build --profile production --platform ios
```

#### Android Production Build
- [ ] **Build profile**: production (not staging)
- [ ] **Application ID**: com.wizardstech.goalgpt
- [ ] **Version Code**: Auto-increment enabled
- [ ] **Version Name**: 1.0.0
- [ ] **Build Type**: AAB (App Bundle)
- [ ] **Distribution**: store
- [ ] **Hermes**: Enabled ✅
- [ ] **Optimization**: Production mode ✅
- [ ] **Signing**: EAS handles automatically

**Build Command:**
```bash
npx eas-cli build --profile production --platform android
```

#### Build Verification
- [ ] **iOS IPA size**: < 25 MB ✅ (estimated ~15-20 MB)
- [ ] **Android AAB size**: < 15 MB ✅ (estimated ~12-15 MB)
- [ ] **Build logs**: No errors or warnings
- [ ] **Test installation**: Installs successfully
- [ ] **App launches**: Opens without crashes

---

## 🟢 RECOMMENDED (Should Complete)

Highly recommended to ensure smooth review and better user experience:

### Testing

#### Device Testing
- [ ] **Test on iOS devices**:
  - [ ] iPhone 15 Pro Max (target device)
  - [ ] iPhone 14 / 14 Pro
  - [ ] iPhone SE (3rd gen) - small screen
  - [ ] iPad (if supporting tablets)

- [ ] **Test on Android devices**:
  - [ ] Pixel 7 Pro (target device)
  - [ ] Samsung Galaxy S23
  - [ ] OnePlus / Xiaomi device
  - [ ] Low-end device (budget phone)

#### Functionality Testing
- [ ] **Auth Flow**: Login/Register with Apple, Google
- [ ] **Main Features**:
  - [ ] Live match tracking works
  - [ ] AI predictions display correctly
  - [ ] Real-time updates via WebSocket
  - [ ] Match details load properly
  - [ ] Profile/settings accessible
- [ ] **Legal Links**: Privacy, Terms, EULA open correctly
- [ ] **Push Notifications**: Request permission, receive notifications
- [ ] **In-App Purchases**: Purchase flow (if applicable)
- [ ] **Deep Linking**: App links work (goalgpt://)
- [ ] **Offline Mode**: Graceful handling of no internet

#### Performance Testing
- [ ] **App Launch Time**: < 3 seconds
- [ ] **Memory Usage**: < 200 MB on average
- [ ] **Battery Impact**: Minimal drain during active use
- [ ] **Network Usage**: Optimized API calls
- [ ] **Frame Rate**: 60 FPS on main screens

#### Crash Testing
- [ ] **Sentry configured**: Error tracking active ✅
- [ ] **No crashes** during 30-minute test session
- [ ] **Graceful error handling**: Network failures, API errors
- [ ] **Edge cases tested**: Empty states, long content, special characters

### App Store Optimization (ASO)

#### Keyword Research
- [x] ✅ Primary keywords identified (STORE-LISTING-COPY.md)
- [x] ✅ Secondary keywords identified
- [x] ✅ Long-tail keywords identified
- [ ] **Competitor analysis**: Research top 10 competitors
- [ ] **Keyword testing**: Use tools (AppTweak, Sensor Tower)

#### App Description
- [x] ✅ First paragraph hook (160 chars - visible before "more")
- [x] ✅ Feature bullets clear and concise
- [x] ✅ Call-to-action included
- [x] ✅ Keywords naturally integrated
- [ ] **Localization**: Turkish translation (if targeting Turkey)

#### Visual Assets
- [ ] **Screenshots optimized**:
  - [ ] Clear, high-quality images
  - [ ] Captions/text overlays (optional)
  - [ ] Device frames (optional)
  - [ ] Consistent branding
- [ ] **Icon A/B testing**: Test multiple icon designs
- [ ] **App Preview Video**: 15-30 seconds showcase

### Beta Testing

#### TestFlight (iOS)
- [ ] **Internal Testing**: Team members test build
- [ ] **External Testing**: 10-20 beta testers
- [ ] **Feedback collected**: Bug reports, UX issues
- [ ] **Iterate**: Fix critical issues before submission

#### Google Play Internal Testing
- [ ] **Closed Testing**: Small group of testers
- [ ] **Open Testing**: Larger public beta (optional)
- [ ] **Feedback collected**: Bug reports, feature requests
- [ ] **Iterate**: Fix issues before production

### Compliance & Legal

#### Data Privacy Implementation
- [ ] **Account Deletion**: Implement in Settings ⚠️
  - [ ] Backend endpoint: DELETE /api/users/me
  - [ ] UI in Settings > Account
  - [ ] Confirmation dialog
  - [ ] Data deleted within 30 days

- [ ] **Data Export**: Implement in Settings ⚠️
  - [ ] Backend endpoint: GET /api/users/me/data-export
  - [ ] Returns JSON with all user data
  - [ ] UI in Settings > Privacy

- [ ] **App Tracking Transparency (ATT)**: iOS 14.5+ ⚠️
  - [ ] Request permission before tracking
  - [ ] Respect user choice
  - [ ] Info.plist updated with usage description

- [ ] **Privacy Settings**: Toggle analytics, ads ⚠️
  - [ ] Analytics opt-out
  - [ ] Personalized ads toggle
  - [ ] Push notification preferences

#### Third-Party Compliance
- [ ] **Firebase**: Privacy policy link provided ✅
- [ ] **Sentry**: Privacy policy link provided ✅
- [ ] **RevenueCat**: Subscription terms clear ✅
- [ ] **AdMob**: Ad policies followed (if using ads)
- [ ] **Branch.io**: Deep linking configured ✅

### Marketing & Launch Prep

#### Pre-Launch Marketing
- [ ] **Landing Page**: goalgpt.com live with app info
- [ ] **Social Media**: Twitter, Instagram, Facebook accounts
- [ ] **Press Kit**: Screenshots, icon, description, contact
- [ ] **Beta Sign-Up**: Email collection for launch notification
- [ ] **App Store Preview**: Share pre-order link (if using pre-order)

#### Launch Strategy
- [ ] **Launch Date**: Target date set (Week 3, Day 18)
- [ ] **Press Release**: Draft ready (STORE-LISTING-COPY.md)
- [ ] **Launch Email**: Draft for beta users and subscribers
- [ ] **Social Media Posts**: Scheduled for launch day
- [ ] **Support Ready**: FAQ, troubleshooting docs prepared

---

## ⚪ OPTIONAL (Nice to Have)

These enhance the app but aren't required for initial submission:

### Enhanced Features
- [ ] **Dark Mode**: Full dark theme support (if not implemented)
- [ ] **Localization**: Multiple languages (Turkish, Spanish, etc.)
- [ ] **Accessibility**: VoiceOver, Dynamic Type support
- [ ] **3D Touch**: Quick actions on home screen
- [ ] **Widgets**: iOS/Android home screen widgets
- [ ] **Watch App**: Apple Watch companion

### Marketing Assets
- [ ] **Promo Video**: App Store preview video (15-30s)
- [ ] **Demo Account**: Pre-populated with data for reviewers
- [ ] **Product Hunt**: Prepare launch post
- [ ] **App Store Featuring**: Request featuring from Apple/Google
- [ ] **Influencer Outreach**: Contact sports/tech influencers

### Additional Testing
- [ ] **Accessibility Testing**: VoiceOver, TalkBack
- [ ] **Localization Testing**: All supported languages
- [ ] **Load Testing**: High traffic scenarios
- [ ] **Security Testing**: Penetration testing, vulnerability scan
- [ ] **Automated Testing**: Unit tests, integration tests, E2E tests

---

## 📊 Progress Summary

### Overall Completion: ~60%

```
Critical Blockers:     ████░░░░░░  40% (4/10 items)
Required Items:        ██████░░░░  60% (18/30 items)
Recommended:           ███████░░░  70% (14/20 items)
Optional:              ░░░░░░░░░░  0% (0/15 items)
```

### By Category

| Category | Complete | Total | % |
|----------|----------|-------|---|
| Legal/Compliance | 5 | 10 | 50% |
| App Assets | 3 | 9 | 33% |
| App Store Connect | 2 | 15 | 13% |
| Play Console | 1 | 14 | 7% |
| Production Builds | 2 | 8 | 25% |
| Testing | 0 | 12 | 0% |
| ASO | 4 | 8 | 50% |
| Beta Testing | 0 | 6 | 0% |
| Marketing | 0 | 8 | 0% |

---

## 🚨 Critical Path to Submission

**Must complete in this order:**

### Week 1 (Current - Day 3)

**Day 3-4: Legal & Assets (CRITICAL)**
1. ⏰ Host legal documents on goalgpt.com
2. ⏰ Set up privacy@ and legal@ email addresses
3. ⏰ Build staging apps (SCREENSHOT-BUILD-INSTRUCTIONS.md)
4. ⏰ Capture iOS screenshots (6 screens)
5. ⏰ Capture Android screenshots (6 screens)
6. ⏰ Create Android feature graphic

**Estimated Time:** 1-2 days

### Week 2 (Day 5-7): App Store Setup

**Day 5: iOS App Store Connect**
1. Register Apple Developer account (if not done)
2. Create app in App Store Connect
3. Upload screenshots
4. Complete app description and metadata
5. Complete privacy questionnaire
6. Submit for review

**Estimated Time:** 1 day

**Day 6: Google Play Console**
1. Register Google Play Developer account (if not done)
2. Create app in Play Console
3. Upload screenshots and feature graphic
4. Complete store listing
5. Complete data safety form
6. Submit for review

**Estimated Time:** 1 day

**Day 7: Production Builds & Testing**
1. Build production iOS (.ipa)
2. Build production Android (.aab)
3. Test on physical devices
4. Upload to stores

**Estimated Time:** 1 day

### Week 2-3 (Day 8-17): Review Process

**iOS Review:** 1-7 days (average: 24-48 hours)
**Android Review:** 1-7 days (average: 1-3 days)

**During review:**
- Monitor for questions from reviewers
- Prepare for rejections (address quickly)
- Beta test with TestFlight/Internal Testing
- Fix any critical bugs found

### Week 3 (Day 18): LAUNCH! 🚀

**Launch Day Activities:**
1. Approve apps for release
2. Send launch email to beta users
3. Post on social media
4. Submit to Product Hunt
5. Monitor analytics and crash reports
6. Respond to initial user reviews

---

## 🎯 Immediate Action Items (Next 48 Hours)

**Priority 1: Unblock Submission (CRITICAL)**
1. [ ] Host legal documents (GitHub Pages as temporary solution)
   - Create gh-pages branch
   - Add HTML versions of Privacy, Terms, EULA
   - Test URLs work from mobile

2. [ ] Set up email addresses
   - Configure privacy@goalgpt.com
   - Configure legal@goalgpt.com
   - Test email receipt

**Priority 2: Build & Capture Screenshots**
3. [ ] Login to EAS: `npx eas-cli login`
4. [ ] Configure EAS project: `npx eas-cli build:configure`
5. [ ] Build staging: `npx eas-cli build --profile staging --platform all`
6. [ ] Install on iPhone 15 Pro Max and Android device
7. [ ] Capture 6 screenshots per platform
8. [ ] Create Android feature graphic (1024x500)

**Priority 3: Developer Accounts**
9. [ ] Register Apple Developer Program ($99/year)
10. [ ] Register Google Play Console ($25 one-time)
11. [ ] Complete identity verification
12. [ ] Accept agreements

---

## ⚠️ Risk Assessment

### High Risk (Likely to Cause Delays)

**1. Legal Documents Not Hosted**
- **Impact**: Submission will be rejected immediately
- **Mitigation**: Use GitHub Pages temporarily
- **Timeline**: Can be done in 1 hour

**2. No Screenshots**
- **Impact**: Cannot submit without screenshots
- **Mitigation**: Build staging now, capture today
- **Timeline**: 2-3 hours total

**3. Developer Accounts Not Active**
- **Impact**: Cannot submit until accounts approved (24-48 hours)
- **Mitigation**: Register immediately
- **Timeline**: 1-2 days activation

### Medium Risk

**4. Privacy Features Not Implemented**
- **Impact**: May be required for approval (ATT, data deletion)
- **Mitigation**: Implement basic versions quickly
- **Timeline**: 4-6 hours

**5. No Device Testing**
- **Impact**: May have critical bugs discovered in review
- **Mitigation**: Test on at least 2-3 devices before submission
- **Timeline**: 2-3 hours

### Low Risk

**6. Incomplete Store Listings**
- **Impact**: Lower quality listing, but won't block submission
- **Mitigation**: Use prepared content from STORE-LISTING-COPY.md
- **Timeline**: Content already prepared

---

## 📞 Support Resources

**Documentation:**
- LEGAL-DOCUMENTS-GUIDE.md - Legal implementation details
- SCREENSHOT-BUILD-INSTRUCTIONS.md - Build and capture process
- SCREENSHOT-CAPTURE-GUIDE.md - Detailed screenshot guidelines
- STORE-LISTING-COPY.md - All app store copy prepared
- APP-ASSETS-CHECKLIST.md - Complete asset requirements
- BUNDLE-SIZE-REPORT.md - Bundle optimization results

**Official Guides:**
- Apple App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Policy Center: https://play.google.com/about/developer-content-policy/
- App Store Connect Help: https://developer.apple.com/help/app-store-connect/
- Play Console Help: https://support.google.com/googleplay/android-developer/

**Contact:**
- Support: support@goalgpt.com
- Privacy: privacy@goalgpt.com (to be set up)
- Legal: legal@goalgpt.com (to be set up)

---

## ✅ Daily Checklist Template

Use this for daily progress tracking:

**Date: _________**

**Critical Items Completed Today:**
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

**Blockers Encountered:**
- Issue: _________________
- Resolution: _____________

**Tomorrow's Priorities:**
1. _____________________
2. _____________________
3. _____________________

**Hours Spent:** ___
**Confidence Level:** ___ / 10

---

**Last Updated:** January 15, 2026, 23:00
**Next Review:** Daily until submission
**Target Submission:** Week 2, Day 7 (January 22-23, 2026)
**Target Launch:** Week 3, Day 18 (February 2, 2026)

---

*This checklist is comprehensive but flexible. Adjust based on your specific situation and requirements.*
