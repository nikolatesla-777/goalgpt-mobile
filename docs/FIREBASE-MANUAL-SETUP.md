# 🔥 Firebase Manual Setup Guide
## Step-by-Step Authentication Configuration

> **⏱️ Estimated Time:** 15 minutes
> **Required:** Firebase Console access
> **URL:** https://console.firebase.google.com/project/santibet-715ef

---

## 🎯 STEP 1: ENABLE GOOGLE SIGN IN (5 minutes)

### 1.1 Navigate to Authentication
```
1. Go to: https://console.firebase.google.com/project/santibet-715ef
2. Left sidebar → Click "Authentication"
3. Top tabs → Click "Sign-in method"
```

### 1.2 Enable Google Provider
```
4. Find "Google" in the providers list
5. Click on "Google" row
6. Toggle "Enable" to ON
7. Support email → Select: info@goalgpt.com (or your email)
8. Click "Save"
```

**✅ Expected Result:**
- Google provider shows "Enabled" status
- Green checkmark appears

**Screenshot Location:**
```
Take screenshot → Save as: "firebase-google-enabled.png"
```

---

## 🎯 STEP 2: ENABLE PHONE AUTHENTICATION (5 minutes)

### 2.1 Enable Phone Provider
```
1. Still in "Sign-in method" tab
2. Find "Phone" in the providers list
3. Click on "Phone" row
4. Toggle "Enable" to ON
```

### 2.2 Configure reCAPTCHA (Web)
```
5. Check: ☑️ "Enable reCAPTCHA verification (for web)"
6. This is required for phone auth on web platform
```

### 2.3 Add Test Phone Numbers (Optional)
```
7. Scroll down to "Test phone numbers" section
8. Click "Add phone number"
9. Enter test number: +905551234567
10. Enter verification code: 123456
11. Click "Add"

This allows testing without consuming SMS quota.
```

### 2.4 Save Configuration
```
12. Click "Save" at the bottom
```

**✅ Expected Result:**
- Phone provider shows "Enabled" status
- Test phone numbers (if added) appear in list

**⚠️ IMPORTANT - SMS Limits:**
```
Firebase Free Tier: ~1,000-2,000 SMS/month for Turkey
Production Usage: Upgrade to Blaze plan (pay-as-you-go)

Current Pricing (Estimate):
- Turkey SMS: ~$0.05-0.10 per SMS
- For 50,000 users: Budget $5,000-10,000/month for SMS
```

**Screenshot Location:**
```
Take screenshot → Save as: "firebase-phone-enabled.png"
```

---

## 🎯 STEP 3: VERIFY GOOGLE OAUTH CREDENTIALS (2 minutes)

### 3.1 Check OAuth Consent Screen
```
1. Go to: https://console.cloud.google.com
2. Select project: "santibet-715ef"
3. Left menu → APIs & Services → OAuth consent screen
```

**Expected Configuration:**
```
✅ User Type: External
✅ App name: GoalGPT
✅ Support email: [your email]
✅ Authorized domains: goalgpt.com (if you have domain)
✅ Scopes: email, profile, openid
```

**If NOT configured:**
```
4. Fill in required fields:
   - App name: GoalGPT
   - User support email: info@goalgpt.com
   - Developer contact: info@goalgpt.com
5. Click "Save and Continue"
6. Scopes → Add: email, profile, openid
7. Click "Save and Continue"
8. Test users → Add your test accounts
9. Click "Save and Continue"
```

### 3.2 Verify OAuth Client IDs
```
1. Left menu → APIs & Services → Credentials
2. Check for existing OAuth 2.0 Client IDs:
```

**Expected Client IDs:**
```
✅ iOS Client ID:
   481690202462-v66g0mfiejmt94cm4et1r9bccq6j12pq.apps.googleusercontent.com

✅ Android Client ID:
   481690202462-7sr54a5l9p2f160cpau8j1dou2opij6p.apps.googleusercontent.com

✅ Web Client ID:
   481690202462-hmc6nsn2f1b5iic3bnncjn3sijiq77ml.apps.googleusercontent.com
```

**If missing any client ID:**
```
3. Click "Create Credentials" → "OAuth client ID"

For iOS:
- Application type: iOS
- Name: GoalGPT iOS
- Bundle ID: com.wizardstech.goalgpt
- Click "Create"

For Android:
- Application type: Android
- Name: GoalGPT Android
- Package name: com.wizardstech.goalgpt
- SHA-1: 2ae0f040f4341a3c51b6da4472b618b5c55bfc44
- Click "Create"

For Web:
- Application type: Web application
- Name: GoalGPT Web (for mobile)
- Authorized redirect URIs:
  https://santibet-715ef.firebaseapp.com/__/auth/handler
- Click "Create"
```

**Screenshot Location:**
```
Take screenshot → Save as: "google-oauth-credentials.png"
```

---

## 🎯 STEP 4: APPLE SIGN IN (OPTIONAL - iOS ONLY)

> **⚠️ NOTICE:** Apple Sign In requires:
> - Apple Developer Account ($99/year)
> - iOS 13+ devices for testing
> - Physical device (not simulator)
>
> **Decision:** Skip now, add later if needed

### If you want to enable Apple Sign In:

#### 4.1 Apple Developer Console
```
1. Go to: https://developer.apple.com/account
2. Login with Apple ID
3. Certificates, Identifiers & Profiles
```

#### 4.2 Enable Sign In with Apple for App ID
```
4. Identifiers → App IDs
5. Find: com.wizardstech.goalgpt
6. Click on it
7. Capabilities → Check "Sign In with Apple"
8. Click "Save"
```

#### 4.3 Create Service ID
```
9. Identifiers → Click "+" button
10. Select "Services IDs" → Continue
11. Description: GoalGPT Sign In
12. Identifier: com.wizardstech.goalgpt.signin
13. Click "Continue" → "Register"
14. Click on newly created Service ID
15. Check "Sign In with Apple" → Click "Configure"
16. Primary App ID: Select "com.wizardstech.goalgpt"
17. Domains and Subdomains:
    - Add: santibet-715ef.firebaseapp.com
18. Return URLs:
    - Add: https://santibet-715ef.firebaseapp.com/__/auth/callback
19. Click "Save" → "Continue" → "Register"
```

#### 4.4 Create Key
```
20. Keys → Click "+" button
21. Key Name: GoalGPT Apple Sign In Key
22. Check "Sign In with Apple" → Click "Configure"
23. Primary App ID: Select "com.wizardstech.goalgpt"
24. Click "Save" → "Continue" → "Register"
25. Click "Download" → Save .p8 file
26. **IMPORTANT:** Copy Key ID (e.g., ABC123DEF4)
```

#### 4.5 Add to Firebase
```
27. Firebase Console → Authentication → Sign-in method → Apple
28. Toggle "Enable" to ON
29. Service ID: com.wizardstech.goalgpt.signin
30. Team ID: (find in Apple Developer → Membership)
31. Key ID: (copied from step 26)
32. Private Key: (open .p8 file, copy content)
33. Click "Save"
```

**Screenshot Location:**
```
Take screenshots at each major step
Save as: "apple-signin-[step].png"
```

---

## 🎯 STEP 5: VERIFY CONFIGURATION

### 5.1 Check Authentication Dashboard
```
1. Firebase Console → Authentication
2. You should see:
   ✅ Google: Enabled
   ✅ Phone: Enabled
   ⚠️ Apple: Enabled (if you did Step 4)
```

### 5.2 Test Phone Numbers (Optional)
```
3. Sign-in method → Phone → Test phone numbers
4. Try adding: +905551234567 → Code: 123456
```

### 5.3 Usage & Quotas
```
5. Firebase Console → Usage and billing
6. Check current plan:
   - Spark Plan (Free): Limited SMS
   - Blaze Plan (Pay-as-you-go): Unlimited (charged per use)
```

**⚠️ RECOMMENDATION:** Upgrade to Blaze plan before production release

---

## ✅ VERIFICATION CHECKLIST

After completing all steps, verify:

### Firebase Authentication
- [ ] Google Sign In: Enabled
- [ ] Phone Authentication: Enabled
- [ ] reCAPTCHA: Enabled (for web)
- [ ] Apple Sign In: Enabled (optional)
- [ ] Test phone numbers: Added (optional)

### Google Cloud Console
- [ ] OAuth Consent Screen: Configured
- [ ] iOS Client ID: Exists
- [ ] Android Client ID: Exists
- [ ] Web Client ID: Exists
- [ ] SHA-1 Fingerprint: Added (Android)

### Apple Developer (If applicable)
- [ ] App ID: Sign In with Apple enabled
- [ ] Service ID: Created
- [ ] Key: Generated (.p8 downloaded)
- [ ] Firebase: Team ID, Key ID, Private key added

---

## 🚨 TROUBLESHOOTING

### Issue: "OAuth consent screen not configured"
```
Solution: Complete Step 3.1 - Configure OAuth consent screen
```

### Issue: "Invalid SHA-1 certificate fingerprint"
```
Solution:
1. Generate debug SHA-1:
   cd mobile-app/goalgpt-mobile
   npx expo prebuild
   cd android && ./gradlew signingReport
2. Copy SHA-1 from output
3. Google Cloud Console → Credentials → Android Client → Add SHA-1
```

### Issue: "Phone auth not working"
```
Solution:
1. Check reCAPTCHA is enabled
2. Test with test phone number first
3. Verify Firebase project ID matches in code
```

### Issue: "Apple Sign In button not showing"
```
Solution:
1. iOS 13+ required
2. Test on physical device (not simulator)
3. Verify Apple capability in App ID
```

---

## 📸 REQUIRED SCREENSHOTS

Please take and save these screenshots:

```
1. firebase-google-enabled.png     (Step 1 complete)
2. firebase-phone-enabled.png      (Step 2 complete)
3. google-oauth-credentials.png    (Step 3 complete)
4. apple-signin-complete.png       (Step 4 complete - if applicable)
```

---

## 📝 AFTER COMPLETION

Once all steps are done, update this checklist:

```markdown
## Configuration Status

Last Updated: [DATE]

✅ Google Sign In: ENABLED
✅ Phone Auth: ENABLED
⚠️ Apple Sign In: PENDING (optional)
✅ OAuth Credentials: VERIFIED
✅ Test Phone Numbers: ADDED
⏳ Blaze Plan: PENDING (upgrade before production)
```

---

## 🆘 NEED HELP?

If you encounter issues:

1. Check Firebase Console → Authentication → Users tab
   - Should see test users after testing

2. Check Firebase Console → Authentication → Usage tab
   - Should see authentication attempts

3. Check logs:
   - Backend: Check API logs for OAuth errors
   - Mobile: Check Expo dev tools console

---

**Next Step:** After completing this setup, return to implementation and test authentication flows.

**Documentation:** All screenshots and notes should be saved in:
```
/mobile-app/goalgpt-mobile/docs/setup-screenshots/
```
