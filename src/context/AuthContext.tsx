/**
 * Auth Context Provider
 * Manages global authentication state across the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import {
  initializeFirebase,
  signInWithGoogle,
  signInWithApple,
  signOut as firebaseSignOut,
} from '../services/firebase.service';
import apiClient, { TokenStorage } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';
import { cacheManager } from '../utils/cacheManager';
import { setUser as setSentryUser, clearUser as clearSentryUser } from '../config/sentry.config';
import {
  trackLogin,
  trackSignUp,
  setAnalyticsUserId,
  setUserLevel,
  setUserSubscriptionStatus,
} from '../services/analytics.service';
import { logger } from '../utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  username: string | null;
  profilePhotoUrl: string | null;
  referralCode: string;
  createdAt: string;
  xp?: {
    xpPoints: number;
    level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'vip_elite';
    levelProgress: number;
  };
  credits?: {
    balance: number;
    lifetimeEarned: number;
  };
  subscription?: {
    status: 'active' | 'expired' | 'cancelled';
    expiredAt: string | null;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  // Auth methods
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;

  // Onboarding
  completeOnboarding: () => Promise<void>;

  // Utility
  clearError: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  USER: '@goalgpt_user',
  ONBOARDING_COMPLETED: '@goalgpt_onboarding_completed',
} as const;

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    hasCompletedOnboarding: false,
    error: null,
  });

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication on app start
   */
  async function initializeAuth(): Promise<void> {
    try {
      // Initialize Firebase (wrap in try-catch to prevent crashes)
      try {
        initializeFirebase();
      } catch (firebaseError) {
        logger.warn('Firebase initialization failed (non-fatal)', firebaseError);
      }

      // Check if tokens exist
      const accessToken = await TokenStorage.getAccessToken();

      if (!accessToken) {
        // No tokens, user is not authenticated
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
        }));
        return;
      }

      // Load cached user data
      const cachedUser = await loadUserFromCache();

      // Check onboarding status
      const onboardingCompleted = await checkOnboardingStatus();

      // Set Sentry user context if user exists (wrap in try-catch)
      if (cachedUser) {
        try {
          setSentryUser({
            id: cachedUser.id,
            email: cachedUser.email || undefined,
            username: cachedUser.username || undefined,
          });

          // Set analytics user ID and properties (wrap in try-catch)
          setAnalyticsUserId(cachedUser.id);
          if (cachedUser.xp?.level) {
            setUserLevel(cachedUser.xp.level);
          }
          if (cachedUser.subscription?.status) {
            setUserSubscriptionStatus(
              cachedUser.subscription.status === 'active' ? 'premium' : 'free'
            );
          }
        } catch (analyticsError) {
          logger.warn('Analytics setup failed (non-fatal)', analyticsError);
        }
      }

      setState((prev) => ({
        ...prev,
        user: cachedUser,
        isAuthenticated: !!cachedUser,
        hasCompletedOnboarding: onboardingCompleted,
        isLoading: false,
      }));

      // Refresh user data from backend (async)
      if (cachedUser) {
        refreshUserSilently();
      }
    } catch (error: any) {
      logger.error('Auth initialization error', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        error: error.message,
      }));
    }
  }

  // ============================================================================
  // SIGN IN METHODS
  // ============================================================================

  /**
   * Email/Password Sign In
   */
  async function handleEmailSignIn(email: string, password: string): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const deviceInfo = await getDeviceInfo();

      // Call backend email login endpoint
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
        deviceInfo,
      });

      // Store tokens
      await TokenStorage.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );

      // Cache user data
      await saveUserToCache(response.data.user);

      // Set Sentry user context
      setSentryUser({
        id: response.data.user.id,
        email: response.data.user.email || undefined,
        username: response.data.user.username || undefined,
      });

      // Track analytics event
      trackLogin('email');

      // Set analytics user ID and properties
      setAnalyticsUserId(response.data.user.id);
      if (response.data.user.xp?.level) {
        setUserLevel(response.data.user.xp.level);
      }
      if (response.data.user.subscription?.status) {
        setUserSubscriptionStatus(
          response.data.user.subscription.status === 'active' ? 'premium' : 'free'
        );
      }

      setState((prev) => ({
        ...prev,
        user: response.data.user,
        isAuthenticated: true,
        hasCompletedOnboarding: true, // Email users have already onboarded
        isLoading: false,
        error: null,
      }));

      logger.info('Email sign in successful', response.data.user.email);
    } catch (error: any) {
      logger.error('Email sign in error', error);
      const errorMessage = error.response?.data?.message || error.message || 'Giriş yapılamadı';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }

  /**
   * Email/Password Sign Up
   */
  async function handleEmailSignUp(email: string, password: string, name?: string): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const deviceInfo = await getDeviceInfo();

      // Call backend email register endpoint
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        name,
        deviceInfo,
      });

      // Store tokens
      await TokenStorage.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );

      // Cache user data
      await saveUserToCache(response.data.user);

      // Set Sentry user context
      setSentryUser({
        id: response.data.user.id,
        email: response.data.user.email || undefined,
        username: response.data.user.username || undefined,
      });

      // Track analytics event (new user)
      trackSignUp('email');

      // Set analytics user ID and properties
      setAnalyticsUserId(response.data.user.id);
      if (response.data.user.xp?.level) {
        setUserLevel(response.data.user.xp.level);
      }
      if (response.data.user.subscription?.status) {
        setUserSubscriptionStatus(
          response.data.user.subscription.status === 'active' ? 'premium' : 'free'
        );
      }

      setState((prev) => ({
        ...prev,
        user: response.data.user,
        isAuthenticated: true,
        hasCompletedOnboarding: false, // New users need onboarding
        isLoading: false,
        error: null,
      }));

      logger.info('Email sign up successful', response.data.user.email);
    } catch (error: any) {
      logger.error('Email sign up error', error);
      const errorMessage = error.response?.data?.message || error.message || 'Kayıt olunamadı';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }

  /**
   * Google Sign In
   * @param idToken - Google ID token obtained from OAuth flow
   */
  async function handleGoogleSignIn(idToken: string): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const deviceInfo = await getDeviceInfo();
      const result = await signInWithGoogle(idToken, deviceInfo);

      // Cache user data
      await saveUserToCache(result.user);

      // Set Sentry user context
      setSentryUser({
        id: result.user.id,
        email: result.user.email || undefined,
        username: result.user.username || undefined,
      });

      // Check if new user (needs onboarding)
      const isNewUser = result.user.isNewUser === true;

      // Track analytics event
      if (isNewUser) {
        trackSignUp('google');
      } else {
        trackLogin('google');
      }

      // Set analytics user ID and properties
      setAnalyticsUserId(result.user.id);
      if (result.user.xp?.level) {
        setUserLevel(result.user.xp.level);
      }
      if (result.user.subscription?.status) {
        setUserSubscriptionStatus(
          result.user.subscription.status === 'active' ? 'premium' : 'free'
        );
      }

      setState((prev) => ({
        ...prev,
        user: result.user,
        isAuthenticated: true,
        hasCompletedOnboarding: !isNewUser,
        isLoading: false,
        error: null,
      }));

      logger.info('Google sign in successful', result.user.email);
    } catch (error: any) {
      logger.error('Google sign in error', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Google ile giriş yapılamadı',
      }));
      throw error;
    }
  }

  /**
   * Apple Sign In
   */
  async function handleAppleSignIn(): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const deviceInfo = await getDeviceInfo();
      const result = await signInWithApple(deviceInfo);

      // Cache user data
      await saveUserToCache(result.user);

      // Set Sentry user context
      setSentryUser({
        id: result.user.id,
        email: result.user.email || undefined,
        username: result.user.username || undefined,
      });

      // Check if new user (needs onboarding)
      const isNewUser = result.user.isNewUser === true;

      // Track analytics event
      if (isNewUser) {
        trackSignUp('apple');
      } else {
        trackLogin('apple');
      }

      // Set analytics user ID and properties
      setAnalyticsUserId(result.user.id);
      if (result.user.xp?.level) {
        setUserLevel(result.user.xp.level);
      }
      if (result.user.subscription?.status) {
        setUserSubscriptionStatus(
          result.user.subscription.status === 'active' ? 'premium' : 'free'
        );
      }

      setState((prev) => ({
        ...prev,
        user: result.user,
        isAuthenticated: true,
        hasCompletedOnboarding: !isNewUser,
        isLoading: false,
        error: null,
      }));

      logger.info('Apple sign in successful', result.user.email);
    } catch (error: any) {
      logger.error('Apple sign in error', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Apple ile giriş yapılamadı',
      }));
      throw error;
    }
  }

  /**
   * Phone Sign In
   * Note: This is called after OTP verification in phone-login screen
   */
  async function handlePhoneSignIn(phone: string): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const deviceInfo = await getDeviceInfo();

      // Call backend phone login endpoint
      const response = await apiClient.post(API_ENDPOINTS.AUTH.PHONE_LOGIN, {
        phone,
        deviceInfo,
      });

      // Store tokens
      await TokenStorage.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );

      // Cache user data
      await saveUserToCache(response.data.user);

      // Set Sentry user context
      setSentryUser({
        id: response.data.user.id,
        email: response.data.user.email || undefined,
        username: response.data.user.username || undefined,
      });

      // Existing phone users have already onboarded
      const hasOnboarded = !response.data.user.isNewUser;
      const isNewUser = response.data.user.isNewUser === true;

      // Track analytics event
      if (isNewUser) {
        trackSignUp('phone');
      } else {
        trackLogin('phone');
      }

      // Set analytics user ID and properties
      setAnalyticsUserId(response.data.user.id);
      if (response.data.user.xp?.level) {
        setUserLevel(response.data.user.xp.level);
      }
      if (response.data.user.subscription?.status) {
        setUserSubscriptionStatus(
          response.data.user.subscription.status === 'active' ? 'premium' : 'free'
        );
      }

      setState((prev) => ({
        ...prev,
        user: response.data.user,
        isAuthenticated: true,
        hasCompletedOnboarding: hasOnboarded,
        isLoading: false,
        error: null,
      }));

      logger.info('Phone sign in successful', phone);
    } catch (error: any) {
      logger.error('Phone sign in error', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Telefon ile giriş yapılamadı',
      }));
      throw error;
    }
  }

  // ============================================================================
  // SIGN OUT
  // ============================================================================

  /**
   * Sign out and clear all data
   */
  async function handleSignOut(): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Sign out from Firebase
      await firebaseSignOut();

      // Clear cached data
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.ONBOARDING_COMPLETED]);

      // Clear user-specific cache (stats, settings, predictions)
      await cacheManager.clearUserCache();

      // Clear Sentry user context
      clearSentryUser();

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        hasCompletedOnboarding: false,
        error: null,
      });

      logger.info('Sign out successful');
    } catch (error: any) {
      logger.error('Sign out error', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Çıkış yapılamadı',
      }));
      throw error;
    }
  }

  // ============================================================================
  // REFRESH USER DATA
  // ============================================================================

  /**
   * Refresh user data from backend
   */
  async function refreshUser(): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      const user = response.data.user;

      // Cache updated user data
      await saveUserToCache(user);

      // Set Sentry user context
      setSentryUser({
        id: user.id,
        email: user.email || undefined,
        username: user.username || undefined,
      });

      // Set analytics user ID and properties
      setAnalyticsUserId(user.id);
      if (user.xp?.level) {
        setUserLevel(user.xp.level);
      }
      if (user.subscription?.status) {
        setUserSubscriptionStatus(user.subscription.status === 'active' ? 'premium' : 'free');
      }

      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
        error: null,
      }));

      logger.info('User data refreshed');
    } catch (error: any) {
      logger.error('Refresh user error', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Kullanıcı bilgileri güncellenemedi',
      }));
      throw error;
    }
  }

  /**
   * Refresh user data silently (no loading state)
   */
  async function refreshUserSilently(): Promise<void> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      const user = response.data.user;

      // Cache updated user data
      await saveUserToCache(user);

      // Set Sentry user context
      setSentryUser({
        id: user.id,
        email: user.email || undefined,
        username: user.username || undefined,
      });

      // Set analytics user ID and properties
      setAnalyticsUserId(user.id);
      if (user.xp?.level) {
        setUserLevel(user.xp.level);
      }
      if (user.subscription?.status) {
        setUserSubscriptionStatus(user.subscription.status === 'active' ? 'premium' : 'free');
      }

      setState((prev) => ({
        ...prev,
        user,
      }));

      logger.debug('User data refreshed silently');
    } catch (error: any) {
      logger.warn('Silent refresh failed', error);
      // Don't throw error, this is a background operation
    }
  }

  // ============================================================================
  // ONBOARDING
  // ============================================================================

  /**
   * Mark onboarding as completed
   */
  async function completeOnboarding(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      setState((prev) => ({
        ...prev,
        hasCompletedOnboarding: true,
      }));
      logger.info('Onboarding completed');
    } catch (error: any) {
      logger.error('Complete onboarding error', error);
      throw error;
    }
  }

  // ============================================================================
  // UTILITY
  // ============================================================================

  /**
   * Clear error state
   */
  function clearError(): void {
    setState((prev) => ({ ...prev, error: null }));
  }

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: AuthContextValue = {
    ...state,
    signInWithEmail: handleEmailSignIn,
    signUpWithEmail: handleEmailSignUp,
    signInWithGoogle: handleGoogleSignIn,
    signInWithApple: handleAppleSignIn,
    signInWithPhone: handlePhoneSignIn,
    signOut: handleSignOut,
    refreshUser,
    completeOnboarding,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * useAuth hook
 * Access authentication state and methods
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Save user to AsyncStorage cache
 */
async function saveUserToCache(user: User): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    logger.error('Save user to cache error', error);
  }
}

/**
 * Load user from AsyncStorage cache
 */
async function loadUserFromCache(): Promise<User | null> {
  try {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    logger.error('Load user from cache error', error);
    return null;
  }
}

/**
 * Check if onboarding is completed
 */
async function checkOnboardingStatus(): Promise<boolean> {
  try {
    const status = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return status === 'true';
  } catch (error) {
    logger.error('Check onboarding status error', error);
    return false;
  }
}

/**
 * Get device information for auth requests
 */
async function getDeviceInfo(): Promise<{
  deviceId: string;
  platform: string;
  appVersion: string;
}> {
  return {
    deviceId: Constants.deviceId || 'unknown',
    platform: Platform.OS,
    appVersion: Constants.expoConfig?.version || '2.0.0',
  };
}
