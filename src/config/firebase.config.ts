/**
 * Firebase Configuration
 *
 * Setup Firebase for push notifications and analytics
 * Uses Firebase JS SDK (Expo compatible)
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ============================================================================
// TYPES
// ============================================================================

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Firebase configuration from environment variables
 *
 * IMPORTANT: Set these in your .env file
 */
const firebaseConfig: FirebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || '',
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || '',
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || '',
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || '',
  messagingSenderId: Constants.expoConfig?.extra?.firebaseSenderId || '',
  appId: Constants.expoConfig?.extra?.firebaseAppId || '',
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId,
};

// ============================================================================
// INITIALIZATION
// ============================================================================

let firebaseApp: FirebaseApp | null = null;

/**
 * Initialize Firebase
 *
 * Call this once at app startup
 */
export const initializeFirebase = (): FirebaseApp | null => {
  try {
    // Check if already initialized
    if (getApps().length > 0) {
      firebaseApp = getApps()[0];
      console.log('✅ Firebase already initialized');
      return firebaseApp;
    }

    // Validate configuration
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn('⚠️ Firebase configuration missing. Push notifications will not work.');
      console.warn('Please set Firebase environment variables in app.json');
      return null;
    }

    // Initialize Firebase
    firebaseApp = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
    console.log('📱 Project ID:', firebaseConfig.projectId);

    return firebaseApp;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
    return null;
  }
};

/**
 * Get Firebase app instance
 */
export const getFirebaseApp = (): FirebaseApp | null => {
  if (!firebaseApp && getApps().length > 0) {
    firebaseApp = getApps()[0];
  }
  return firebaseApp;
};

/**
 * Check if Firebase is initialized
 */
export const isFirebaseInitialized = (): boolean => {
  return getApps().length > 0;
};

// ============================================================================
// WEB MESSAGING (for testing in browser)
// ============================================================================

/**
 * Setup Firebase Cloud Messaging for web
 * (Used for testing in Expo web)
 */
export const setupWebMessaging = async (): Promise<void> => {
  if (Platform.OS !== 'web') return;

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('Firebase Messaging not supported in this browser');
      return;
    }

    const app = getFirebaseApp();
    if (!app) return;

    const messaging = getMessaging(app);

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log('📬 Message received (web):', payload);
      // Show notification using Expo Notifications
    });

    console.log('✅ Web messaging setup complete');
  } catch (error) {
    console.error('Failed to setup web messaging:', error);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  initialize: initializeFirebase,
  getApp: getFirebaseApp,
  isInitialized: isFirebaseInitialized,
  setupWebMessaging,
};
