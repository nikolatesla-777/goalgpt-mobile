/**
 * App Entry Point - React Navigation
 * With Auth Flow & Push Notifications & Error Boundary
 */

import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  RobotoMono_400Regular,
  RobotoMono_700Bold,
} from '@expo-google-fonts/roboto-mono';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Error Boundary
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Context Providers
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { AnalyticsProvider } from './src/context/AnalyticsContext';

// Navigation
// import RootNavigator from './src/navigation/RootNavigator';
import { AppNavigator } from './src/navigation/AppNavigator';

// Firebase & Notifications
import { initializeFirebase } from './src/config/firebase.config';
import { setupNotificationCategories } from './src/services/notifications.service';

// Sentry
import { initializeSentry } from './src/config/sentry.config';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

// Initialize Sentry (do this before rendering anything)
initializeSentry();

export default function App() {
  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Nohemi-Regular': require('./assets/fonts/Nohemi/Nohemi-Regular.ttf'),
    'Nohemi-Medium': require('./assets/fonts/Nohemi/Nohemi-Medium.ttf'),
    'Nohemi-SemiBold': require('./assets/fonts/Nohemi/Nohemi-SemiBold.ttf'),
    'Nohemi-Bold': require('./assets/fonts/Nohemi/Nohemi-Bold.ttf'),
    'RobotoMono-Regular': RobotoMono_400Regular,
    'RobotoMono-Bold': RobotoMono_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Initialize Firebase & Notifications
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Firebase
        const firebaseApp = initializeFirebase();
        if (firebaseApp) {
          console.log('✅ Firebase initialized');
        }

        // Setup notification categories (iOS action buttons)
        await setupNotificationCategories();
        console.log('✅ Notification categories configured');
      } catch (error) {
        console.error('❌ App initialization error:', error);
      }
    };

    initializeApp();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AnalyticsProvider>
          <AuthProvider>
            <FavoritesProvider>
              <AppNavigator />
            </FavoritesProvider>
          </AuthProvider>
        </AnalyticsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
