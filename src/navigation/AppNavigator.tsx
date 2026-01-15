/**
 * AppNavigator
 *
 * Main navigation structure
 * Bottom Tabs + Stack Navigation
 */

import React, { useRef, useEffect, useState } from 'react';
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

// Auth Screens
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { TestLoginScreen } from '../screens/TestLoginScreen';

// Main App Screens
import { HomeScreen } from '../screens/HomeScreen';
import { LiveMatchesScreen } from '../screens/LiveMatchesScreen';
import PredictionsScreen from '../screens/predictions/PredictionsScreen';
import { MatchDetailScreenContainer } from '../screens/MatchDetailScreenContainer';
import { StoreScreen } from '../screens/StoreScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BotDetailScreen } from '../screens/BotDetailScreen';

// Mock Data (for Bot Detail only - other screens use real API)
import { mockPredictions } from '../services/mockData';

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

const AuthStackNavigator = () => {
  const [showOnboarding, setShowOnboarding] = React.useState(true);

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Splash Screen */}
      <AuthStack.Screen name="Splash">
        {({ navigation }) => (
          <SplashScreen
            onComplete={() => {
              // After splash, navigate to onboarding or login
              if (showOnboarding) {
                navigation.navigate('Onboarding');
              } else {
                navigation.navigate('Login');
              }
            }}
          />
        )}
      </AuthStack.Screen>

      {/* Onboarding Screen */}
      <AuthStack.Screen name="Onboarding">
        {({ navigation }) => (
          <OnboardingScreen
            onComplete={() => {
              setShowOnboarding(false);
              navigation.navigate('Login');
            }}
            onSkip={() => {
              setShowOnboarding(false);
              navigation.navigate('Login');
            }}
          />
        )}
      </AuthStack.Screen>

      {/* Login Screen */}
      <AuthStack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen
            onLoginSuccess={() => {
              // AuthContext will handle state update
              console.log('Login successful');
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
        )}
      </AuthStack.Screen>

      {/* Register Screen */}
      <AuthStack.Screen name="Register">
        {({ navigation }) => (
          <RegisterScreen
            onRegisterSuccess={() => {
              // AuthContext will handle state update
              console.log('Register successful');
            }}
            onNavigateToLogin={() => navigation.navigate('Login')}
            onSocialAuth={(provider) => {
              console.log('Social auth:', provider);
              // In future: implement social auth
            }}
            onBack={() => navigation.goBack()}
          />
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
        )}
      </Tab.Screen>

      {/* Live Matches Tab */}
      <Tab.Screen name="LiveMatches">
        {({ navigation }) => (
          <LiveMatchesScreen
            onMatchPress={(matchId) => {
              // Navigate to match detail (stack screen)
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('MatchDetail', { matchId });
              }
            }}
          />
        )}
      </Tab.Screen>

      {/* Predictions Tab */}
      <Tab.Screen name="Predictions">
        {({ navigation }) => (
          <PredictionsScreen
            onBotPress={(botId) => {
              // Navigate to bot detail (stack screen)
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('BotDetail', { botId });
              }
            }}
          />
        )}
      </Tab.Screen>

      {/* Store Tab */}
      <Tab.Screen name="Store">
        {() => (
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
        )}
      </Tab.Screen>

      {/* Profile Tab */}
      <Tab.Screen name="Profile">
        {({ navigation }) => (
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
            }}
          />
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
            <MatchDetailScreenContainer
              matchId={matchId}
              onBack={() => navigation.goBack()}
            />
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
          );
        }}
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

  // Show loading while checking auth state or initializing navigation
  if (auth.isLoading || !isReady) {
    return <NavigationLoadingScreen message="Initializing..." />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LINKING_CONFIG}
      onReady={() => setIsReady(true)}
    >
      {auth.isAuthenticated ? (
        <RootStackNavigator />
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default AppNavigator;
