---
name: deploy
description: GoalGPT backend ve mobile deployment süreçleri, CI/CD, rollback prosedürleri
---

# GoalGPT Deploy Skill

## Genel Mimari

```
                    ┌─────────────────┐
                    │   GitHub Repo   │
                    │  (new-goalgpt)  │
                    └────────┬────────┘
                             │ push to main
                             ▼
                    ┌─────────────────┐
                    │  GitHub Actions │
                    │  CI/CD Pipeline │
                    └────────┬────────┘
                             │ SSH deploy
                             ▼
                    ┌─────────────────┐
                    │  Digital Ocean  │
                    │  142.93.103.128 │
                    │  PM2 + Node.js  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Supabase     │
                    │   PostgreSQL    │
                    └─────────────────┘
```

---

## ⚠️ KRİTİK: firebase-service-account.json

Firebase Admin SDK **JSON dosyası** kullanıyor, ENV değil!

### Dosya Konumu (VPS)
```
/var/www/goalgpt/firebase-service-account.json
```

### Deploy Checklist
- [ ] `firebase-service-account.json` VPS'te mevcut mu?
- [ ] `.gitignore`'da var mı? (repo'ya commit edilmemeli!)
- [ ] Yeni sunucuya taşırken manuel kopyalanmalı

### Kontrol Komutu
```bash
ssh root@142.93.103.128 "ls -la /var/www/goalgpt/firebase-service-account.json"
```

### ⛔ BU DOSYA KAYBOLURSA
- Push notifications çalışmaz
- Firebase Auth token doğrulaması çalışmaz
- **Tüm auth sistemi çöker**

### Yeni Sunucuya Taşıma
```bash
# Local'den VPS'e kopyala
scp firebase-service-account.json root@NEW_IP:/var/www/goalgpt/

# İzinleri ayarla (güvenlik)
ssh root@NEW_IP "chmod 600 /var/www/goalgpt/firebase-service-account.json"
```

---

## Backend Deploy (new-goalgpt → Digital Ocean)

### VPS Bilgileri
```
IP: 142.93.103.128
User: root
App Dir: /var/www/goalgpt
Node: 20.19.6
Process Manager: PM2
```

### Klasör Yapısı (VPS)
```
/var/www/goalgpt/
├── current/           → Symlink to active release
├── releases/          → Timestamped release folders
│   ├── 20260315-143022/
│   └── 20260316-091544/
├── shared/
│   ├── .env           → Production secrets
│   ├── logs/          → PM2 logs
│   └── ecosystem.config.js
└── previous_release.txt
```

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy-production.yml
Trigger: push to main OR tag v*.*.*

Jobs:
1. CI (ci):
   - npm ci
   - TypeScript build
   - Lint
   - Tests

2. Deploy (deploy):
   - Create tarball (dist + package.json)
   - SSH upload to VPS
   - Extract to /releases/TIMESTAMP
   - Symlink .env and logs
   - npm ci --production
   - Atomic symlink swap (current → new release)

3. Restart:
   - pm2 reload ecosystem.config.js --env production

4. Health Check:
   - curl http://localhost:3000/api/health
   - curl http://localhost:3000/api/matches/live
   - Max 6 retries, 5s intervals

5. Auto-Rollback (on failure):
   - Restore previous_release symlink
   - pm2 restart

6. Cleanup:
   - Keep last 5 releases, delete older
```

### Manuel Deploy (SSH)
```bash
# SSH bağlan
ssh root@142.93.103.128

# Dizine git
cd /var/www/goalgpt/current

# Pull & build
git pull origin main
npm ci
npm run build

# PM2 restart
pm2 reload ecosystem.config.js --env production
pm2 save

# Logları izle
pm2 logs goalgpt-backend --lines 50
```

### PM2 Konfigürasyonu
```javascript
// ecosystem.config.js
{
  name: 'goalgpt-backend',
  script: 'npm',
  args: 'start',
  cwd: '/var/www/goalgpt',
  instances: 1,
  exec_mode: 'fork',
  node_args: '--max-old-space-size=2048',  // 2GB heap
  max_memory_restart: '1800M',
  env: {
    NODE_ENV: 'production',
    DB_MAX_CONNECTIONS: '50'
  },
  restart_delay: 8000,     // 8s delay for port cleanup
  kill_timeout: 15000      // 15s graceful shutdown
}
```

---

## Mobile Deploy (EAS Build → App Stores)

### EAS Build Profiles
```json
// eas.json
{
  "build": {
    "development": {
      "distribution": "internal",
      "ios": { "simulator": true },
      "android": { "buildType": "apk" }
    },
    "staging": {
      "distribution": "internal",
      "channel": "staging"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store",
      "channel": "production",
      "ios": { "autoIncrement": "buildNumber" },
      "android": {
        "buildType": "app-bundle",
        "autoIncrement": "versionCode"
      }
    }
  }
}
```

### Build Komutları
```bash
# Development (internal test)
eas build --profile development --platform ios
eas build --profile development --platform android

# Staging (QA test)
eas build --profile staging --platform all

# Production (store)
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Submit Komutları
```bash
# App Store (iOS)
eas submit --platform ios --latest

# Play Store (Android)
eas submit --platform android --latest --track internal
eas submit --platform android --latest --track production
```

### GitHub Actions (Mobile)
```yaml
# .github/workflows/deploy.yml
Trigger: workflow_dispatch (manual)

Inputs:
  - platform: ios | android | all
  - environment: production | beta

Steps:
1. Checkout + Node setup
2. Setup Expo (expo-github-action)
3. npm ci
4. eas build --profile production
5. eas submit (TestFlight or Play Console)
```

---

## Rollback Prosedürü

### Backend Rollback (Otomatik)
```bash
# GitHub Actions otomatik yapıyor, manuel için:
ssh root@142.93.103.128

cd /var/www/goalgpt

# Önceki release'i bul
cat previous_release.txt

# Symlink değiştir
PREV=$(cat previous_release.txt)
ln -sfn "$PREV" current

# Restart
pm2 restart ecosystem.config.js --env production

# Verify
curl http://localhost:3000/api/health
```

### Mobile Rollback
```bash
# Son build'i kontrol et
eas build:list --platform ios --limit 5

# Önceki build'i submit et
eas submit --platform ios --id BUILD_ID

# Veya App Store Connect'ten manuel phased rollout durdur
```

---

## Environment Variables

### Backend (VPS: /var/www/goalgpt/shared/.env)
```bash
# Kritik değişkenler
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
JWT_SECRET, JWT_REFRESH_SECRET
THESPORTS_API_USER, THESPORTS_API_SECRET
FOOTYSTATS_API_KEY
TELEGRAM_BOT_TOKEN

# Tam liste: new-goalgpt/.env.example
```

### Mobile (EAS Secrets)
```bash
# EAS'te tanımlı değişkenler
eas secret:list

# Yeni secret ekle
eas secret:create --name EXPO_PUBLIC_API_URL --value "https://..."

# .env.example'daki değişkenler
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_WS_URL
EXPO_PUBLIC_ENVIRONMENT
```

### GitHub Secrets (CI/CD)
```
VPS_SSH_KEY      → SSH private key for Digital Ocean
EXPO_TOKEN       → EAS authentication token
```

---

## Migration Checklist

### Deploy Öncesi
- [ ] Tüm testler geçiyor mu? (`npm test`)
- [ ] TypeScript hata yok mu? (`npm run typecheck`)
- [ ] .env.example güncel mi?
- [ ] Migration gerekli mi? (DB schema değişikliği)
- [ ] Breaking change var mı? (API endpoint değişikliği)

### Deploy Sırası
- [ ] GitHub Actions başarılı mı?
- [ ] Health check geçti mi?
- [ ] PM2 status OK mi?

### Deploy Sonrası
- [ ] API endpointleri çalışıyor mu?
- [ ] WebSocket bağlantısı OK mi?
- [ ] Loglar normal mi? (`pm2 logs`)
- [ ] Sentry'de yeni hata var mı?

---

## Monitoring Komutları

### VPS Üzerinde
```bash
# PM2 durumu
pm2 status
pm2 monit

# Loglar
pm2 logs goalgpt-backend --lines 100

# Sistem kaynakları
htop
df -h
free -m

# Nginx (varsa)
nginx -t
systemctl status nginx
```

### Health Checks
```bash
# Backend health
curl https://partnergoalgpt.com/api/health

# Live matches
curl https://partnergoalgpt.com/api/matches/live

# WebSocket test
wscat -c wss://partnergoalgpt.com/ws
```

---

## YASAK (Deploy Sırasında)

### Backend
- [ ] Production'da `npm install` (SADECE `npm ci` kullan)
- [ ] .env dosyasını repo'ya commit etme
- [ ] Migration'ı test etmeden production'da çalıştırma
- [ ] PM2 restart yerine kill kullanma
- [ ] Health check'i beklemeden deploy tamamlandı sayma

### Mobile
- [ ] Production build'i staging channel'a yollama
- [ ] Build numarasını manuel artırma (autoIncrement kullan)
- [ ] Test edilmemiş build'i store'a submit etme
- [ ] EAS secrets'ı kod içine hardcode etme

### Genel
- [ ] Cuma günü deploy (hafta içi sabah tercih et)
- [ ] Tek başına kritik deploy (buddy system)
- [ ] Rollback planı olmadan deploy
- [ ] Monitoring'i kontrol etmeden deploy tamamlandı sayma

---

## Hızlı Referans

| İşlem | Komut |
|-------|-------|
| Backend logs | `pm2 logs goalgpt-backend` |
| Backend restart | `pm2 reload ecosystem.config.js` |
| Backend status | `pm2 status` |
| Mobile build | `eas build --profile production --platform all` |
| Mobile submit | `eas submit --platform ios --latest` |
| Health check | `curl https://partnergoalgpt.com/api/health` |
| SSH connect | `ssh root@142.93.103.128` |
