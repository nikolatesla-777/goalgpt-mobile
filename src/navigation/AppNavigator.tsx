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
import { logger } from '../utils/logger';

// ============================================================================
// LAZY LOADED SCREENS (Code Splitting)
// ============================================================================

// Auth Screens - Lazy Loaded
const SplashScreen = lazy(() => import('../screens/SplashScreen').then(m => ({ default: m.SplashScreen })));
const OnboardingScreen = lazy(() => import('../screens/OnboardingScreen')); // Simplified to use default export
const LoginScreen = lazy(() => import('../screens/LoginScreen').then(m => ({ default: m.LoginScreen })));
const RegisterScreen = lazy(() => import('../screens/RegisterScreen').then(m => ({ default: m.RegisterScreen })));

// Main App Screens - Lazy Loaded
// HomeScreen is eager loaded now (see top of file or added import)
// const HomeScreen = lazy(() => import('../screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
// Updated LiveScreen import logic to point to the new LivescoreScreen implementation
const LiveMatchesScreen = lazy(() => import('../screens/live/LiveScreen'));
const PredictionsScreen = lazy(() => import('../screens/predictions/PredictionsScreen'));
const MatchDetailScreenContainer = lazy(() => import('../screens/MatchDetailScreenContainer').then(m => ({ default: m.MatchDetailScreenContainer })));
const StoreScreen = lazy(() => import('../screens/StoreScreen').then(m => ({ default: m.StoreScreen })));
const ProfileScreen = lazy(() => import('../screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const BotDetailScreen = lazy(() => import('../screens/BotDetailScreen').then(m => ({ default: m.BotDetailScreen })));
const LegalScreen = lazy(() => import('../screens/LegalScreen'));
// Eager load BlogDetailScreen for now or lazy load it logic
const BlogDetailScreen = lazy(() => import('../screens/BlogDetailScreen').then(m => ({ default: m.BlogDetailScreen })));
const BlogListScreen = lazy(() => import('../screens/BlogListScreen').then(m => ({ default: m.BlogListScreen })));
// Container components (fetch data from context/API instead of hardcoded props)
const ProfileScreenContainer = lazy(() => import('../screens/ProfileScreenContainer').then(m => ({ default: m.ProfileScreenContainer })));
const BotDetailScreenContainer = lazy(() => import('../screens/BotDetailScreenContainer').then(m => ({ default: m.BotDetailScreenContainer })));
const DailyRewardsScreen = lazy(() => import('../screens/DailyRewardsScreen').then(m => ({ default: m.DailyRewardsScreen })));
// Animated Splash - Imported directly for speed/reliablity, code split ok too but we need it fast
import AnimatedSplash from '../screens/AnimatedSplash';

// Mock Data - Only imported in DEV mode for Bot Detail fallback
const getMockPredictions = async () => {
  if (__DEV__) {
    const { mockPredictions } = await import('../services/mockData');
    return mockPredictions;
  }
  return [];
};

// Eager load HomeScreen
import { HomeScreen } from '../screens/HomeScreen';

// ============================================================================
// LOADING FALLBACK COMPONENT
// ============================================================================

// ============================================================================
// LOADING FALLBACK COMPONENT
// ============================================================================

// Use the premium NavigationLoadingScreen instead of inline fallback
const LoadingFallback = () => (
  <NavigationLoadingScreen message="Loading..." />
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
  BlogDetail: { post: any; slug?: string };
  BlogList: undefined;
  Legal: undefined;
  DailyRewards: undefined;
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
                logger.info('Login successful');
                onSessionComplete?.();
              }}
              onNavigateToRegister={() => navigation.navigate('Register')}
              onForgotPassword={() => {
                logger.info('Forgot password');
                // In future: navigate to forgot password screen
              }}
              onSocialAuth={(provider) => {
                logger.info('Social auth:', { provider });
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
                logger.info('Register successful');
                onSessionComplete?.();
              }}
              onNavigateToLogin={() => navigation.navigate('Login')}
              onSocialAuth={(provider) => {
                logger.info('Social auth:', { provider });
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
      <Tab.Screen name="Home" component={HomeScreen} />

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
                logger.info('Plan selected:', { planId });
              }}
              onPurchase={(planId) => {
                logger.info('Purchase initiated:', { planId });
                // In future: integrate payment
              }}
            />
          </Suspense>
        )}
      </Tab.Screen>

      {/* Profile Tab */}
      <Tab.Screen name="Profile">
        {({ navigation }) => {
          // Use ProfileScreenContainer to get user data from auth context
          return (
            <Suspense fallback={<LoadingFallback />}>
              <ProfileScreenContainer
                navigation={navigation}
              />
            </Suspense>
          );
        }}
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
          const params = route.params as RootStackParamList['MatchDetail'];
          const matchId = params?.matchId;

          if (!matchId) {
            navigation.goBack();
            return null;
          }

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
          const params = route.params as RootStackParamList['BotDetail'];
          const botId = params?.botId;

          if (!botId) {
            navigation.goBack();
            return null;
          }

          return (
            <Suspense fallback={<LoadingFallback />}>
              <BotDetailScreenContainer
                botId={botId}
                navigation={navigation}
              />
            </Suspense>
          );
        }}
      </Stack.Screen>

      {/* Blog Detail */}
      <Stack.Screen name="BlogDetail">
        {({ route, navigation }) => {
          const params = route.params as RootStackParamList['BlogDetail'];
          // BlogDetailScreen handles missing params internally
          return (
            <Suspense fallback={<LoadingFallback />}>
              <BlogDetailScreen />
            </Suspense>
          );
        }}
      </Stack.Screen>

      {/* Blog List Screen */}
      <Stack.Screen name="BlogList">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <BlogListScreen />
          </Suspense>
        )}
      </Stack.Screen>

      {/* Legal Screen */}
      <Stack.Screen name="Legal">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <LegalScreen />
          </Suspense>
        )}
      </Stack.Screen>

      {/* Daily Rewards Screen */}
      <Stack.Screen name="DailyRewards">
        {({ navigation }) => (
          <Suspense fallback={<LoadingFallback />}>
            <DailyRewardsScreen onBack={() => navigation.goBack()} />
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
        logger.info('Initial deep link detected:', { url });
        setInitialUrl(url);
      }
      setIsReady(true);
    };

    checkInitialUrl();
  }, []);

  // Listen for deep links (app is running)
  useEffect(() => {
    const subscription = addDeepLinkListener((url) => {
      logger.info('Deep link received:', { url });

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
        logger.info('Processing initial deep link:', { url: initialUrl });

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
