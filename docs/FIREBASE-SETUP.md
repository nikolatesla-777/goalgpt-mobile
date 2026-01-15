# Firebase Setup Guide
## GoalGPT Mobile App - Authentication Configuration

Bu dokuman Firebase projesi kurulumu ve authentication yapılandırması için adım adım rehberdir.

---

## 📋 Gereksinimler

- Google hesabı (Firebase Console erişimi için)
- Firebase CLI (opsiyonel)
- iOS Developer hesabı (Apple Sign In için)
- Android Developer hesabı (Google Play için)

---

## 🔥 Adım 1: Firebase Projesi Oluştur

### 1.1 Firebase Console'a Git
https://console.firebase.google.com

### 1.2 Yeni Proje Oluştur
1. "Add project" butonuna tıkla
2. Proje adı: **GoalGPT Mobile** (veya tercih ettiğiniz isim)
3. Google Analytics'i aktif et (önerilir)
4. "Create project" tıkla

### 1.3 Proje ID'yi Kaydet
- Proje ayarlarında (Project Settings) proje ID'nizi bulun
- Örnek: `goalgpt-mobile` veya `goalgpt-mobile-prod`

---

## 📱 Adım 2: iOS App Ekle

### 2.1 iOS App Ekle
1. Firebase Console'da projenizi açın
2. "Add app" → iOS simgesi
3. **Bundle ID:** `com.goalgpt.mobile` (app.json ile aynı olmalı!)
4. App nickname: **GoalGPT iOS**
5. "Register app" tıkla

### 2.2 GoogleService-Info.plist İndir
1. Firebase Console'dan **GoogleService-Info.plist** dosyasını indirin
2. Dosyayı **SAKLAYIN** (şimdilik projeye eklemeyeceğiz)
3. Expo kullandığımız için native proje klasörü yok, bu dosya EAS Build sırasında kullanılacak

### 2.3 iOS API Key ve App ID'yi Kaydet
`GoogleService-Info.plist` dosyasını text editörde açın ve şu değerleri kaydedin:

```xml
<key>API_KEY</key>
<string>AIzaXXXXXXXXXXXXXXXXXXXXXXX</string>

<key>GOOGLE_APP_ID</key>
<string>1:000000000000:ios:xxxxxxxxxxxx</string>

<key>GCM_SENDER_ID</key>
<string>000000000000</string>

<key>PROJECT_ID</key>
<string>goalgpt-mobile</string>
```

---

## 🤖 Adım 3: Android App Ekle

### 3.1 Android App Ekle
1. Firebase Console'da "Add app" → Android simgesi
2. **Package name:** `com.goalgpt.mobile` (app.json ile aynı!)
3. App nickname: **GoalGPT Android**
4. Debug signing certificate SHA-1: (şimdilik boş bırakabilirsiniz, sonra ekleyeceğiz)
5. "Register app" tıkla

### 3.2 google-services.json İndir
1. Firebase Console'dan **google-services.json** dosyasını indirin
2. Dosyayı **SAKLAYIN** (EAS Build sırasında kullanılacak)

### 3.3 Android API Key ve App ID'yi Kaydet
`google-services.json` dosyasını açın ve şu değerleri kaydedin:

```json
{
  "project_info": {
    "project_id": "goalgpt-mobile",
    "firebase_url": "https://goalgpt-mobile.firebaseio.com"
  },
  "client": [
    {
      "client_info": {
        "android_client_info": {
          "package_name": "com.goalgpt.mobile"
        }
      },
      "api_key": [
        {
          "current_key": "AIzaXXXXXXXXXXXXXXXXXXXXXXX"
        }
      ],
      "oauth_client": [
        {
          "client_id": "000000000000-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
        }
      ]
    }
  ]
}
```

---

## 🔑 Adım 4: Authentication Providers'ı Aktif Et

### 4.1 Google Sign In
1. Firebase Console → **Authentication** → **Sign-in method**
2. **Google** provider'ını aktif et
3. Support email seçin
4. "Save" tıkla

### 4.2 Phone Authentication
1. Authentication → Sign-in method
2. **Phone** provider'ını aktif et
3. reCAPTCHA verification (Web) → Aktif et
4. Test phone numbers ekle (opsiyonel, development için):
   - Örnek: +905551234567 → Verification code: 123456
5. "Save" tıkla

### 4.3 Apple Sign In (iOS için)
1. Authentication → Sign-in method
2. **Apple** provider'ını aktif et
3. Eğer Apple Developer hesabınız varsa:
   - Team ID ekleyin
   - Key ID ekleyin
   - Private key (.p8 dosyası) yükleyin
4. "Save" tıkla

**NOT:** Apple Sign In için Apple Developer Console'da da yapılandırma gerekiyor (aşağıda)

---

## 🍎 Adım 5: Apple Sign In Yapılandırması (iOS)

### 5.1 Apple Developer Console
https://developer.apple.com/account

### 5.2 App ID'yi Yapılandır
1. Certificates, Identifiers & Profiles → **Identifiers**
2. App ID'nizi bulun: `com.goalgpt.mobile`
3. **Sign In with Apple** capability'sini aktif edin
4. "Save" tıkla

### 5.3 Service ID Oluştur (Opsiyonel - Web için)
1. Identifiers → "+" butonu → **Services IDs**
2. Description: **GoalGPT Sign In**
3. Identifier: `com.goalgpt.signin`
4. "Continue" → "Register"
5. Service ID'yi seçin → "Configure" (Sign In with Apple)
6. Primary App ID: `com.goalgpt.mobile` seçin
7. Domains: Firebase auth domain'inizi ekleyin (örn: `goalgpt-mobile.firebaseapp.com`)
8. Return URLs: Firebase callback URL'ini ekleyin
9. "Save" → "Continue" → "Register"

### 5.4 Key Oluştur
1. Keys → "+" butonu
2. Key Name: **GoalGPT Apple Sign In Key**
3. **Sign In with Apple** aktif et
4. Configure → Primary App ID seçin
5. "Save" → "Continue" → "Register"
6. **Key ID'yi kaydedin** (örn: ABC123DEF4)
7. **Download** butonuna tıkla (.p8 dosyasını indirin)
8. **ÖNEMLI:** Bu dosya sadece bir kez indirilebilir, güvenli bir yere kaydedin!

### 5.5 Firebase'e Ekle
1. Firebase Console → Authentication → Sign-in method → Apple
2. **Team ID:** Apple Developer Account → Membership → Team ID
3. **Key ID:** Yukarıda oluşturduğunuz key ID
4. **Private key:** .p8 dosyasının içeriğini yapıştırın
5. "Save"

---

## 🔑 Adım 6: Google OAuth Yapılandırması

### 6.1 OAuth Consent Screen
1. Google Cloud Console: https://console.cloud.google.com
2. Proje seçin (Firebase ile aynı proje)
3. APIs & Services → **OAuth consent screen**
4. User Type: **External** seçin (test için Internal de olabilir)
5. "Create" tıkla

### 6.2 OAuth Consent Screen Bilgileri
1. **App name:** GoalGPT
2. **User support email:** destek@goalgpt.com
3. **App logo:** Logo yükleyin (120x120 px)
4. **App domain:** goalgpt.com
5. **Authorized domains:** goalgpt.com, firebaseapp.com
6. **Developer contact:** email@goalgpt.com
7. "Save and Continue"

### 6.3 Scopes
1. "Add or Remove Scopes" tıkla
2. Şu scope'ları ekleyin:
   - `email`
   - `profile`
   - `openid`
3. "Update" → "Save and Continue"

### 6.4 Test Users (Development için)
1. "Add Users" tıkla
2. Test kullanıcılarınızın email'lerini ekleyin
3. "Save and Continue"

### 6.5 OAuth Credentials Oluştur
1. APIs & Services → **Credentials**
2. "Create Credentials" → **OAuth client ID**

**iOS Client ID:**
- Application type: **iOS**
- Name: **GoalGPT iOS**
- Bundle ID: `com.goalgpt.mobile`
- "Create"
- **Client ID'yi kaydedin:** `XXXXXXXX-XXXXXXXX.apps.googleusercontent.com`

**Android Client ID:**
- Application type: **Android**
- Name: **GoalGPT Android**
- Package name: `com.goalgpt.mobile`
- SHA-1 certificate fingerprint: (aşağıda alacağız)
- "Create"
- **Client ID'yi kaydedin**

**Web Client ID:**
- Application type: **Web application**
- Name: **GoalGPT Web (for mobile)**
- Authorized redirect URIs: Firebase auth domain
- "Create"
- **Client ID'yi kaydedin**

---

## 🔐 Adım 7: Android SHA-1 Fingerprint

### 7.1 Debug SHA-1 (Development)
```bash
cd /Users/utkubozbay/Downloads/GoalGPT/mobile-app/goalgpt-mobile
npx expo prebuild
cd android
./gradlew signingReport
```

Output'tan **SHA1** değerini kopyalayın:
```
Variant: debug
Config: debug
Store: ~/.android/debug.keystore
Alias: androiddebugkey
SHA1: A1:B2:C3:D4:E5:F6:G7:H8:I9:J0:K1:L2:M3:N4:O5:P6:Q7:R8:S9:T0
```

### 7.2 SHA-1'i Firebase'e Ekle
1. Firebase Console → Project Settings → GoalGPT Android
2. "Add fingerprint" tıkla
3. SHA-1'i yapıştır
4. "Save"

### 7.3 SHA-1'i Google OAuth'a Ekle
1. Google Cloud Console → Credentials → Android OAuth Client ID
2. SHA-1 certificate fingerprint alanına yapıştır
3. "Save"

### 7.4 Production SHA-1 (İleride)
EAS Build ile production build aldığınızda:
```bash
eas credentials -p android
# SHA-1'i göreceksiniz
```
Bu SHA-1'i de Firebase ve Google OAuth'a ekleyin.

---

## ⚙️ Adım 8: Environment Variables Yapılandırması

### 8.1 .env Dosyası Oluştur
```bash
cd /Users/utkubozbay/Downloads/GoalGPT/mobile-app/goalgpt-mobile
cp .env.example .env
```

### 8.2 .env Dosyasını Düzenle
```bash
# Firebase
FIREBASE_IOS_API_KEY=AIzaXXXXXXXXXXXX  # GoogleService-Info.plist'ten
FIREBASE_ANDROID_API_KEY=AIzaYYYYYYYY  # google-services.json'dan
FIREBASE_PROJECT_ID=goalgpt-mobile
FIREBASE_MESSAGING_SENDER_ID=000000000000
FIREBASE_APP_ID_IOS=1:000000000000:ios:xxxx
FIREBASE_APP_ID_ANDROID=1:000000000000:android:yyyy

# Google OAuth
GOOGLE_IOS_CLIENT_ID=XXXX-XXXX.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=YYYY-YYYY.apps.googleusercontent.com
GOOGLE_WEB_CLIENT_ID=ZZZZ-ZZZZ.apps.googleusercontent.com

# Apple Sign In
APPLE_SERVICE_ID=com.goalgpt.signin
APPLE_TEAM_ID=ABC123DEF4
APPLE_KEY_ID=XYZ789
```

### 8.3 firebase.config.json Güncelle
`firebase.config.json` dosyasını gerçek değerlerle güncelleyin:

```json
{
  "development": {
    "apiKey": "AIzaXXXXXXXXXXXX",
    "authDomain": "goalgpt-mobile.firebaseapp.com",
    "projectId": "goalgpt-mobile",
    "storageBucket": "goalgpt-mobile.appspot.com",
    "messagingSenderId": "000000000000",
    "appId": "1:000000000000:web:xxxx"
  },
  "production": {
    "apiKey": "AIzaXXXXXXXXXXXX",
    "authDomain": "goalgpt-mobile.firebaseapp.com",
    "projectId": "goalgpt-mobile",
    "storageBucket": "goalgpt-mobile.appspot.com",
    "messagingSenderId": "000000000000",
    "appId": "1:000000000000:web:xxxx"
  }
}
```

---

## ✅ Adım 9: Verification Checklist

Firebase yapılandırmasının doğru olduğunu kontrol edin:

### Firebase Console
- [ ] iOS app eklendi (Bundle ID: com.goalgpt.mobile)
- [ ] Android app eklendi (Package: com.goalgpt.mobile)
- [ ] Google Sign In provider aktif
- [ ] Phone provider aktif
- [ ] Apple Sign In provider aktif (iOS için)

### Google OAuth
- [ ] OAuth consent screen yapılandırıldı
- [ ] iOS OAuth client ID oluşturuldu
- [ ] Android OAuth client ID oluşturuldu
- [ ] Web OAuth client ID oluşturuldu
- [ ] Android SHA-1 eklendi

### Apple Sign In (iOS)
- [ ] App ID'de Sign In with Apple aktif
- [ ] Service ID oluşturuldu
- [ ] Key oluşturuldu (.p8 dosyası indirildi)
- [ ] Firebase'e Team ID, Key ID, Private key eklendi

### Config Files
- [ ] GoogleService-Info.plist indirildi ve saklandı
- [ ] google-services.json indirildi ve saklandı
- [ ] .env dosyası oluşturuldu ve değerler eklendi
- [ ] firebase.config.json güncellendi

---

## 🧪 Adım 10: Test

### Firebase SDK Test
```javascript
// Test Firebase initialization
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config.json';

const app = initializeApp(firebaseConfig.development);
console.log('Firebase initialized:', app.name); // "[DEFAULT]"
```

### Google Sign In Test
- Expo Go veya Development build ile test edin
- Google button'a tıkladığınızda OAuth ekranı açılmalı
- Email seçimi yapabilmeli ve geri dönebilmelisiniz

### Phone Auth Test
- Test phone number ekleyin (Firebase Console)
- SMS gelmesini beklemeden test code ile giriş yapabilirsiniz

### Apple Sign In Test
- **Sadece fiziksel iOS cihazda** test edilebilir (iOS 13+)
- Simulator'de çalışmaz
- Face ID / Touch ID ile doğrulama yapılmalı

---

## 🚨 Troubleshooting

### Sorun 1: "Developer Error" (Google Sign In Android)
**Sebep:** SHA-1 fingerprint eksik
**Çözüm:** Adım 7'yi takip edin, SHA-1'i Firebase ve Google OAuth'a ekleyin

### Sorun 2: "Network Error" (Firebase)
**Sebep:** google-services.json veya GoogleService-Info.plist eksik/yanlış
**Çözüm:** Dosyaları tekrar indirin, Package/Bundle ID'leri kontrol edin

### Sorun 3: Apple Sign In Button Görünmüyor
**Sebep:** iOS 13+ gerekir, simulator desteklemiyor
**Çözüm:** Fiziksel iOS cihazda test edin

### Sorun 4: Phone Auth reCAPTCHA Sonsuz Döngü
**Sebep:** reCAPTCHA initialization sorunu
**Çözüm:** `initializeRecaptcha` fonksiyonunun doğru çağrıldığından emin olun

### Sorun 5: OAuth Redirect Çalışmıyor
**Sebep:** URL Scheme eksik veya yanlış
**Çözüm:** app.json'da `"scheme": "goalgpt"` olduğundan emin olun

---

## 📚 Ek Kaynaklar

- **Firebase Docs:** https://firebase.google.com/docs/auth
- **Expo Firebase:** https://docs.expo.dev/guides/using-firebase/
- **Google Sign In:** https://firebase.google.com/docs/auth/web/google-signin
- **Apple Sign In:** https://firebase.google.com/docs/auth/web/apple
- **Phone Auth:** https://firebase.google.com/docs/auth/web/phone-auth

---

**Son Güncelleme:** 2026-01-12
**Versiyon:** 1.0
**Durum:** ✅ PRODUCTION READY
