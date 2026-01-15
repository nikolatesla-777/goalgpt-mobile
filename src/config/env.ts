// src/config/env.ts
// GoalGPT Mobile App - Environment Configuration

import Constants from 'expo-constants';

// Environment variable type definitions
interface EnvironmentVariables {
  // Backend API
  apiUrl: string;
  wsUrl: string;

  // RevenueCat
  revenueCatIOSKey?: string;
  revenueCatAndroidKey?: string;

  // Firebase
  firebaseIOSApiKey?: string;
  firebaseAndroidApiKey?: string;
  firebaseProjectId?: string;
  firebaseMessagingSenderId?: string;
  firebaseAppIdIOS?: string;
  firebaseAppIdAndroid?: string;

  // Google OAuth
  googleIOSClientId?: string;
  googleAndroidClientId?: string;
  googleWebClientId?: string;

  // Apple Sign In
  appleServiceId?: string;
  appleTeamId?: string;
  appleKeyId?: string;

  // AdMob
  admobAppIdIOS?: string;
  admobAppIdAndroid?: string;
  admobIOSRewardedAdUnit?: string;
  admobAndroidRewardedAdUnit?: string;

  // Branch.io
  branchKey?: string;

  // Sentry
  sentryDsn?: string;
  sentryEnvironment?: string;

  // App Config
  appVersion: string;
  appBundleIdIOS: string;
  appPackageNameAndroid: string;

  // Feature Flags
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
  enableGamification: boolean;
}

// Get environment variable from expo-constants extra config
function getEnvVar(key: string, defaultValue?: string): string | undefined {
  const value = Constants.expoConfig?.extra?.[key];
  return value !== undefined ? value : defaultValue;
}

// Parse boolean environment variable
function parseBool(value: string | undefined, defaultValue: boolean = false): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

// Environment configuration object
export const env: EnvironmentVariables = {
  // Backend API (from app.json extra config)
  apiUrl: getEnvVar('apiUrl') || 'http://localhost:3000',
  wsUrl: getEnvVar('wsUrl') || 'ws://localhost:3000/ws',

  // RevenueCat
  revenueCatIOSKey: getEnvVar('revenueCatIOSKey'),
  revenueCatAndroidKey: getEnvVar('revenueCatAndroidKey'),

  // Firebase
  firebaseIOSApiKey: getEnvVar('firebaseIOSApiKey'),
  firebaseAndroidApiKey: getEnvVar('firebaseAndroidApiKey'),
  firebaseProjectId: getEnvVar('firebaseProjectId'),
  firebaseMessagingSenderId: getEnvVar('firebaseMessagingSenderId'),
  firebaseAppIdIOS: getEnvVar('firebaseAppIdIOS'),
  firebaseAppIdAndroid: getEnvVar('firebaseAppIdAndroid'),

  // Google OAuth
  googleIOSClientId: getEnvVar('googleIOSClientId'),
  googleAndroidClientId: getEnvVar('googleAndroidClientId'),
  googleWebClientId: getEnvVar('googleWebClientId'),

  // Apple Sign In
  appleServiceId: getEnvVar('appleServiceId'),
  appleTeamId: getEnvVar('appleTeamId'),
  appleKeyId: getEnvVar('appleKeyId'),

  // AdMob
  admobAppIdIOS: getEnvVar('admobAppIdIOS'),
  admobAppIdAndroid: getEnvVar('admobAppIdAndroid'),
  admobIOSRewardedAdUnit: getEnvVar('admobIOSRewardedAdUnit'),
  admobAndroidRewardedAdUnit: getEnvVar('admobAndroidRewardedAdUnit'),

  // Branch.io
  branchKey: getEnvVar('branchKey'),

  // Sentry
  sentryDsn: getEnvVar('sentryDsn'),
  sentryEnvironment: getEnvVar('sentryEnvironment', 'development'),

  // App Config
  appVersion: Constants.expoConfig?.version || '2.0.0',
  appBundleIdIOS: Constants.expoConfig?.ios?.bundleIdentifier || 'com.goalgpt.mobile',
  appPackageNameAndroid: Constants.expoConfig?.android?.package || 'com.goalgpt.mobile',

  // Feature Flags
  enableAnalytics: parseBool(getEnvVar('enableAnalytics'), true),
  enableCrashReporting: parseBool(getEnvVar('enableCrashReporting'), true),
  enableGamification: parseBool(getEnvVar('enableGamification'), true),
};

// Validation function to check required environment variables
export function validateEnv(): { isValid: boolean; missingVars: string[] } {
  const requiredVars: (keyof EnvironmentVariables)[] = ['apiUrl', 'wsUrl'];

  const missingVars: string[] = [];

  requiredVars.forEach((key) => {
    if (!env[key]) {
      missingVars.push(key);
    }
  });

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

// Helper to check if running in development mode
export const isDev = __DEV__;

// Helper to check if running in production mode
export const isProd = !__DEV__;

// Helper to check platform
export const isIOS = Constants.platform?.ios !== undefined;
export const isAndroid = Constants.platform?.android !== undefined;

export default env;
