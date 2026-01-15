# GoalGPT Mobile App

React Native mobile application for GoalGPT football prediction platform.

## Tech Stack

- **Framework:** React Native + Expo
- **Navigation:** Expo Router (file-based routing)
- **Language:** TypeScript
- **State Management:** React Context + Hooks
- **API Client:** Axios
- **Styling:** StyleSheet (native React Native styles)
- **Subscriptions:** RevenueCat
- **Push Notifications:** Firebase Cloud Messaging
- **Analytics:** Firebase Analytics
- **Error Tracking:** Sentry
- **Deep Linking:** Branch.io

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli eas-cli`)
- iOS: Xcode 14+ (macOS only)
- Android: Android Studio

## Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
\`\`\`

## Project Structure

\`\`\`
goalgpt-mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/             # Bottom tab navigation
│   ├── (auth)/             # Authentication flow
│   ├── (onboarding)/       # First-time user flow
│   └── match/[id].tsx      # Dynamic routes
├── src/
│   ├── components/         # Reusable components
│   ├── api/                # API client
│   ├── hooks/              # Custom hooks
│   ├── context/            # React Context providers
│   ├── services/           # Third-party services
│   ├── constants/          # Theme, config
│   ├── types/              # TypeScript types
│   └── utils/              # Helper functions
└── assets/                 # Images, fonts, animations
\`\`\`

## Environment Variables

Copy \`.env.example\` to \`.env\` and fill in your API keys.

\`\`\`bash
cp .env.example .env
# Edit .env with your credentials
\`\`\`

## Development

\`\`\`bash
# Start Expo dev server
npm start

# Run on specific platform
npm run ios
npm run android

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Format code
npm run format
\`\`\`

## Build & Deploy

\`\`\`bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
\`\`\`

## Testing

\`\`\`bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
\`\`\`

## Features

### Core Features
- 🔐 Multi-method authentication (Google, Apple, Phone)
- ⚽ Live match scores and updates
- 🔮 AI-powered match predictions
- 💬 Match comments and social features

### Gamification
- 🏆 XP levels (Bronze → Silver → Gold → Platinum → Diamond → VIP Elite)
- 🎖️ Badges and achievements
- 🔥 Daily login streaks
- 🎁 Daily reward wheel
- 📊 Leaderboards

### Monetization
- 💎 RevenueCat subscriptions
- 📺 AdMob rewarded video ads
- 💰 Virtual currency (Goal Credits)
- 🤝 Referral program
- 👔 Partner/Bayi program

## Architecture

### Navigation
- **Expo Router**: File-based routing system
- **Tab Navigation**: 4 main tabs (Home, Live Scores, Predictions, Profile)
- **Stack Navigation**: Auth flow, onboarding, detail screens
- **Deep Linking**: Branch.io integration for sharing

### State Management
- **React Context**: Global state (auth, subscription, gamification, credits)
- **React Query**: Server state caching and synchronization
- **AsyncStorage**: Local persistence

### API Communication
- **Axios**: HTTP client with interceptors
- **WebSocket**: Real-time live score updates
- **Token Refresh**: Automatic JWT refresh on 401

## Phase 5 Status

✅ **COMPLETED:**
- Project initialization
- Folder structure setup
- Core dependencies installation
- Design system (theme, colors, typography)
- API client with authentication
- Navigation structure (Expo Router)
- Environment configuration
- Basic UI components (Button, Card, Input, Spinner)
- Development tools (ESLint, Prettier, TypeScript)

🔄 **IN PROGRESS:**
- Testing & verification

📋 **UPCOMING:**
- Phase 6: Authentication implementation
- Phase 7: Core features (matches, predictions)
- Phase 8: Gamification UI
- Phase 9: Social features
- Phase 10: Third-party integrations

## Contributing

This is a private project. Internal team members only.

## License

Proprietary - GoalGPT © 2026

---

**Last Updated:** 2026-01-12
**Version:** 2.0.0 (Phase 5)
