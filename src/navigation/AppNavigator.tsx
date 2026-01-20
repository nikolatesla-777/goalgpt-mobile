/**
 * AppNavigator
 *
 * Main navigation structure
 * Bottom Tabs + Stack Navigation
 *
 * Phase 11: Optimized with code splitting and lazy loading
 */

import React, { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { CustomTabBar } from './CustomTabBar';
import { setNavigationRef } from '../services/notificationHandler';
import {
  LINKING_CONFIG,
  getInitialDeepLink,
  addDeepLinkListener,
  handleDeepLink,
} from '../services/deepLinking.service';
import { NavigationLoadingScreen } from '../components/NavigationLoadingScreen';
import { useNavigationTracking } from '../hooks/useScreenTracking';
import analyticsService from '../services/analytics.service';

// ============================================================================
// LAZY LOADED SCREENS (Code Splitting)
// ============================================================================

// Auth Screens - Lazy Loaded
const SplashScreen = lazy(() => import('../screens/SplashScreen').then(m => ({ default: m.SplashScreen })));
const OnboardingScreen = lazy(() => import('../screens/OnboardingScreen').then(m => ({ default: m.OnboardingScreen })));
const LoginScreen = lazy(() => import('../screens/LoginScreen').then(m => ({ default: m.LoginScreen })));
const RegisterScreen = lazy(() => import('../screens/RegisterScreen').then(m => ({ default: m.RegisterScreen })));

// Main App Screens - Lazy Loaded
const HomeScreen = lazy(() => import('../screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
// Updated LiveScreen import logic to point to the new LivescoreScreen implementation
const LiveMatchesScreen = lazy(() => import('../screens/live/LiveScreen'));
const PredictionsScreen = lazy(() => import('../screens/predictions/PredictionsScreen'));
const MatchDetailScreenContainer = lazy(() => import('../screens/MatchDetailScreenContainer').then(m => ({ default: m.MatchDetailScreenContainer })));
const StoreScreen = lazy(() => import('../screens/StoreScreen').then(m => ({ default: m.StoreScreen })));
const ProfileScreen = lazy(() => import('../screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const BotDetailScreen = lazy(() => import('../screens/BotDetailScreen').then(m => ({ default: m.BotDetailScreen })));
const LegalScreen = lazy(() => import('../screens/LegalScreen'));
// Animated Splash - Imported directly for speed/reliablity, code split ok too but we need it fast
import AnimatedSplash from '../screens/AnimatedSplash';

// Mock Data (for Bot Detail only - other screens use real API)
import { mockPredictions } from '../services/mockData';

// ============================================================================
// LOADING FALLBACK COMPONENT
// ============================================================================

const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E27' }}>
    <ActivityIndicator size="large" color="#6C5CE7" />
  </View>
);

// ============================================================================
// TYPES
// ============================================================================

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  MatchDetail: { matchId: string | number };
  BotDetail: { botId: number };
  Legal: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  LiveMatches: undefined;
  Predictions: undefined;
  Store: undefined;
  Profile: undefined;
};

// ============================================================================
// NAVIGATORS
// ============================================================================

const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// ============================================================================
// AUTH STACK NAVIGATOR
// ============================================================================

interface AuthStackNavigatorProps {
  onSessionComplete?: () => void;
}

const AuthStackNavigator = ({ onSessionComplete }: AuthStackNavigatorProps) => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Onboarding"
    >
      {/* Onboarding Screen - First screen after AnimatedSplash */}
      <AuthStack.Screen name="Onboarding">
        {({ navigation }) => (
          <Suspense fallback={<LoadingFallback />}>
            <OnboardingScreen
              onComplete={() => {
                navigation.navigate('Login');
              }}
              onSkip={() => {
                navigation.navigate('Login');
              }}
            />
          </Suspense>
        )}
      </AuthStack.Screen>

      {/* Login Screen */}
      <AuthStack.Screen name="Login">
        {({ navigation }) => (
          <Suspense fallback={<LoadingFallback />}>
            <LoginScreen
              onLoginSuccess={() => {
                // Mark session onboarding as complete, then auth state change will show main app
                console.log('Login successful');
                onSessionComplete?.();
              }}
              onNavigateToRegister={() => navigation.navigate('Register')}
              onForgotPassword={() => {
                console.log('Forgot password');
                // In future: navigate to forgot password screen
              }}
              onSocialAuth={(provider) => {
                console.log('Social auth:', provider);
                // In future: implement social auth
              }}
              onBack={() => navigation.goBack()}
            />
          </Suspense>
        )}
      </AuthStack.Screen>

      {/* Register Screen */}
      <AuthStack.Screen name="Register">
        {({ navigation }) => (
          <Suspense fallback={<LoadingFallback />}>
            <RegisterScreen
              onRegisterSuccess={() => {
                // Mark session onboarding as complete after registration too
                console.log('Register successful');
                onSessionComplete?.();
              }}
              onNavigateToLogin={() => navigation.navigate('Login')}
              onSocialAuth={(provider) => {
                console.log('Social auth:', provider);
                // In future: implement social auth
              }}
              onBack={() => navigation.goBack()}
            />
          </Suspense>
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
};

// ============================================================================
// MAIN TABS NAVIGATOR
// ============================================================================

const MainTabsNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Home Tab */}
      <Tab.Screen name="Home">
        {({ navigation }) => (
          <Suspense fallback={<LoadingFallback />}>
            <HomeScreen
              onMatchPress={(matchId) => {
                // Navigate to match detail (stack screen)
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate('MatchDetail', { matchId });
                }
              }}
              onPredictionPress={(predictionId) => {
                console.log('Prediction pressed:', predictionId);
                // Navigate to predictions tab
                navigation.navigate('Predictions');
              }}
              onSeeAllMatches={() => {
                // Navigate to live matches tab
                navigation.navigate('LiveMatches');
              }}
              onSeeAllPredictions={() => {
                // Navigate to predictions tab
                navigation.navigate('Predictions');
              }}
            />
          </Suspense>
        )}
      </Tab.Screen>

      {/* Live Matches Tab */}
      <Tab.Screen name="LiveMatches">
        {({ navigation }) => (
          <Suspense fallback={<LoadingFallback />}>
            <LiveMatchesScreen
              onMatchPress={(matchId) => {
                // Navigate to match detail (stack screen)
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate('MatchDetail', { matchId });
                }
              }}
            />
          </Suspense>
        )}
      </Tab.Screen>

      {/* Predictions Tab */}
      <Tab.Screen name="Predictions">
        {({ navigation }) => (
          <Suspense fallback={<LoadingFallback />}>
            <PredictionsScreen
              onBotPress={(botId) => {
                // Navigate to bot detail (stack screen)
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate('BotDetail', { botId });
                }
              }}
            />
          </Suspense>
        )}
      </Tab.Screen>

      {/* Store Tab */}
      <Tab.Screen name="Store">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <StoreScreen
              currentPlan="free"
              onSelectPlan={(planId) => {
                console.log('Plan selected:', planId);
              }}
              onPurchase={(planId) => {
                console.log('Purchase initiated:', planId);
                // In future: integrate payment
              }}
            />
          </Suspense>
        )}
      </Tab.Screen>

      {/* Profile Tab */}
      <Tab.Screen name="Profile">
        {({ navigation }) => (
          <Suspense fallback={<LoadingFallback />}>
            <ProfileScreen
              profile={{
                id: '1',
                name: 'Utku Bozbay',
                email: 'utku@goalgpt.com',
                vipStatus: 'free',
                dayCounter: 47,
                stats: {
                  totalPredictions: 234,
                  winRate: 78.5,
                  currentStreak: 12,
                  level: 8,
                  xp: 1250,
                  xpToNextLevel: 2000,
                },
                badges: ['🏆', '🔥', '⭐', '💎', '🎯'],
                favoriteTeams: ['Barcelona', 'Real Madrid', 'Man United'],
              }}
              onEditProfile={() => {
                console.log('Edit profile');
              }}
              onSettings={() => {
                console.log('Settings');
              }}
              onLogout={() => {
                console.log('Logout');
              }}
              onNavigate={(section) => {
                console.log('Navigate to:', section);
                // Navigate to Legal screen when legal section is selected
                if (section === 'legal') {
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate('Legal');
                  }
                }
              }}
            />
          </Suspense>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// ============================================================================
// ROOT STACK NAVIGATOR
// ============================================================================

const RootStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Tabs */}
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} />

      {/* Match Detail */}
      <Stack.Screen name="MatchDetail">
        {({ route, navigation }) => {
          // @ts-ignore - route params typing
          const { matchId } = route.params;

          return (
            <Suspense fallback={<LoadingFallback />}>
              <MatchDetailScreenContainer
                matchId={matchId}
                onBack={() => navigation.goBack()}
              />
            </Suspense>
          );
        }}
      </Stack.Screen>

      {/* Bot Detail */}
      <Stack.Screen name="BotDetail">
        {({ route, navigation }) => {
          // @ts-ignore - route params typing
          const { botId } = route.params;

          // Mock bot data
          const mockBot = {
            id: botId,
            name: `Bot ${botId}`,
            description: 'AI-powered football prediction bot',
            icon: '🤖',
            totalPredictions: 450,
            successRate: 74.2,
            stats: {
              today: { total: 12, wins: 9, rate: 75 },
              yesterday: { total: 15, wins: 11, rate: 73.3 },
              monthly: { total: 234, wins: 174, rate: 74.4 },
              all: { total: 450, wins: 334, rate: 74.2 },
            },
          };

          const mockOtherBots = [
            { id: 2, name: 'Bot 2', icon: '🎯', successRate: 68.5, totalPredictions: 320 },
            { id: 3, name: 'Bot 3', icon: '⚡', successRate: 71.2, totalPredictions: 280 },
            { id: 4, name: 'Bot 4', icon: '🔥', successRate: 76.8, totalPredictions: 390 },
          ];

          return (
            <Suspense fallback={<LoadingFallback />}>
              <BotDetailScreen
                bot={mockBot}
                otherBots={mockOtherBots}
                predictions={mockPredictions}
                onBotSelect={(newBotId) => {
                  navigation.push('BotDetail', { botId: newBotId });
                }}
                onPredictionPress={(predictionId) => {
                  console.log('Prediction pressed:', predictionId);
                }}
                onBack={() => navigation.goBack()}
              />
            </Suspense>
          );
        }}
      </Stack.Screen>

      {/* Legal Screen */}
      <Stack.Screen name="Legal">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <LegalScreen />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// ============================================================================
// APP NAVIGATOR
// ============================================================================

export const AppNavigator = () => {
  const auth = useAuth();
  const navigationRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [initialUrl, setInitialUrl] = useState<string | null>(null);

  // Controls the custom Animated Splash visibility
  const [showSplash, setShowSplash] = useState(true);

  // Tracks if user has completed onboarding THIS SESSION
  // This resets on every app launch, ensuring onboarding is shown each time
  const [sessionOnboardingComplete, setSessionOnboardingComplete] = useState(false);

  // Track navigation state changes
  // NOTE: Temporarily disabled - needs to be inside NavigationContainer
  // useNavigationTracking();

  // Set navigation ref for notifications and deep linking
  useEffect(() => {
    if (navigationRef.current) {
      setNavigationRef(navigationRef.current);
    }
  }, []);

  // Handle initial deep link (cold start)
  useEffect(() => {
    const checkInitialUrl = async () => {
      const url = await getInitialDeepLink();
      if (url) {
        console.log('🔗 Initial deep link detected:', url);
        setInitialUrl(url);
      }
      setIsReady(true);
    };

    checkInitialUrl();
  }, []);

  // Listen for deep links (app is running)
  useEffect(() => {
    const subscription = addDeepLinkListener((url) => {
      console.log('🔗 Deep link received:', url);

      // Track deep link
      analyticsService.trackDeepLink(url, 'unknown', undefined, 'app_running');

      if (navigationRef.current && isReady) {
        handleDeepLink(url, navigationRef.current, auth.isAuthenticated);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isReady, auth.isAuthenticated]);

  // Handle initial deep link after navigation is ready
  useEffect(() => {
    if (isReady && initialUrl && navigationRef.current) {
      // Small delay to ensure navigation is fully mounted
      setTimeout(() => {
        console.log('🔗 Processing initial deep link:', initialUrl);

        // Track initial deep link
        analyticsService.trackDeepLink(initialUrl, 'unknown', undefined, 'cold_start');

        handleDeepLink(initialUrl, navigationRef.current, auth.isAuthenticated);
        setInitialUrl(null);
      }, 1000);
    }
  }, [isReady, initialUrl, auth.isAuthenticated]);

  // 1. Show Animated Splash first (Overlay)
  if (showSplash) {
    return (
      <AnimatedSplash
        onComplete={() => setShowSplash(false)}
      />
    );
  }

  // 2. Show loading while checking auth state or initializing navigation
  if (auth.isLoading || !isReady) {
    return <NavigationLoadingScreen message="Initializing..." />;
  }

  // 3. Navigation logic:
  // - If session onboarding NOT complete: always show AuthStackNavigator (Onboarding -> Login)
  // - If session onboarding complete AND authenticated: show RootStackNavigator (main app)
  // - If session onboarding complete but NOT authenticated: show AuthStackNavigator (Login)
  const showMainApp = sessionOnboardingComplete && auth.isAuthenticated;

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LINKING_CONFIG}
      onReady={() => setIsReady(true)}
    >
      {showMainApp ? (
        <RootStackNavigator />
      ) : (
        <AuthStackNavigator onSessionComplete={() => setSessionOnboardingComplete(true)} />
      )}
    </NavigationContainer>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default AppNavigator;
