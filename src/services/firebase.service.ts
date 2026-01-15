/**
 * Firebase Service Wrapper
 * Handles Firebase Authentication for Google, Apple, and Phone
 */

import { initializeApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
  ConfirmationResult,
  UserCredential,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import firebaseConfig from '../../firebase.config.json';
import apiClient, { TokenStorage } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';
import { initAnalytics } from './analytics.service';

// Environment-based config
const environment = __DEV__ ? 'development' : 'production';
const config = firebaseConfig[environment] as FirebaseOptions;

// Firebase instances
let firebaseApp: FirebaseApp;
let auth: Auth;

// RecaptchaVerifier instance for phone auth
let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Initialize Firebase
 */
export function initializeFirebase(): void {
  if (!firebaseApp) {
    firebaseApp = initializeApp(config);
    auth = getAuth(firebaseApp);
    console.log('✅ Firebase initialized:', config.projectId);

    // Initialize Analytics
    initAnalytics(firebaseApp);
  }
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
}

// ============================================================================
// GOOGLE SIGN IN
// ============================================================================

/**
 * Google Sign In - Send ID token to backend
 * Note: ID token is obtained by the UI component using Google.useAuthRequest hook
 */
export async function signInWithGoogle(
  idToken: string,
  deviceInfo: {
    deviceId: string;
    platform: string;
    appVersion: string;
  }
): Promise<{
  user: any;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}> {
  try {
    // Send to backend for verification
    const response = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE_SIGNIN, {
      idToken,
      deviceInfo,
    });

    // Store tokens
    await TokenStorage.setTokens(
      response.data.tokens.accessToken,
      response.data.tokens.refreshToken
    );

    return {
      user: response.data.user,
      tokens: response.data.tokens,
    };
  } catch (error: any) {
    console.error('❌ Google Sign In Error:', error);
    throw new Error(error.message || 'Google Sign In failed');
  }
}

// ============================================================================
// APPLE SIGN IN
// ============================================================================

/**
 * Apple Sign In Flow (iOS 13+ only)
 * 1. Opens Apple Sign In dialog
 * 2. Gets identity token
 * 3. Sends to backend for verification
 * 4. Returns JWT tokens from backend
 */
export async function signInWithApple(deviceInfo: {
  deviceId: string;
  platform: string;
  appVersion: string;
}): Promise<{
  user: any;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}> {
  try {
    // Check if Apple Sign In is available (iOS 13+)
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign In is only available on iOS');
    }

    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Apple Sign In is not available on this device (iOS 13+ required)');
    }

    // Request Apple Sign In
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Extract data
    const { identityToken, email, fullName } = credential;

    if (!identityToken) {
      throw new Error('No identity token received from Apple');
    }

    // Construct full name (only provided on first sign-in)
    const name = fullName
      ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
      : undefined;

    // Send to backend for verification
    const response = await apiClient.post(API_ENDPOINTS.AUTH.APPLE_SIGNIN, {
      idToken: identityToken,
      email: email || undefined,
      name: name || undefined,
      deviceInfo,
    });

    // Store tokens
    await TokenStorage.setTokens(
      response.data.tokens.accessToken,
      response.data.tokens.refreshToken
    );

    return {
      user: response.data.user,
      tokens: response.data.tokens,
    };
  } catch (error: any) {
    console.error('❌ Apple Sign In Error:', error);

    // Handle cancellation
    if (error.code === 'ERR_CANCELED') {
      throw new Error('Apple Sign In was cancelled');
    }

    throw new Error(error.message || 'Apple Sign In failed');
  }
}

// ============================================================================
// PHONE AUTHENTICATION
// ============================================================================

/**
 * Initialize RecaptchaVerifier for phone auth (Web only)
 * For native apps, this is handled automatically
 */
export function initializeRecaptcha(containerId: string): void {
  if (Platform.OS === 'web' && !recaptchaVerifier) {
    const auth = getFirebaseAuth();
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('✅ reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.warn('⚠️ reCAPTCHA expired, please try again');
      },
    });
  }
}

/**
 * Send OTP to phone number
 * Returns confirmation result for verification
 */
export async function sendPhoneOTP(phoneNumber: string): Promise<ConfirmationResult> {
  try {
    const auth = getFirebaseAuth();

    // Initialize recaptcha if needed
    if (Platform.OS === 'web' && !recaptchaVerifier) {
      throw new Error('RecaptchaVerifier not initialized. Call initializeRecaptcha first.');
    }

    // Send OTP
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier!);

    console.log('✅ OTP sent to:', phoneNumber);
    return confirmationResult;
  } catch (error: any) {
    console.error('❌ Send OTP Error:', error);

    // Handle Firebase errors
    if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Geçersiz telefon numarası. +905XXXXXXXXX formatında olmalıdır.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.');
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('SMS kotası aşıldı. Lütfen daha sonra tekrar deneyin.');
    }

    throw new Error(error.message || 'OTP gönderilemedi');
  }
}

/**
 * Verify OTP code
 * Returns JWT tokens from backend
 */
export async function verifyPhoneOTP(
  confirmationResult: ConfirmationResult,
  otpCode: string,
  deviceInfo: {
    deviceId: string;
    platform: string;
    appVersion: string;
  }
): Promise<{
  user: any;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}> {
  try {
    // Verify OTP with Firebase
    const userCredential = await confirmationResult.confirm(otpCode);

    // Get phone number
    const phoneNumber = userCredential.user.phoneNumber;

    if (!phoneNumber) {
      throw new Error('Phone number not found in Firebase user');
    }

    // Send to backend for verification and user creation
    const response = await apiClient.post(API_ENDPOINTS.AUTH.PHONE_LOGIN, {
      phone: phoneNumber,
      deviceInfo,
    });

    // Store tokens
    await TokenStorage.setTokens(
      response.data.tokens.accessToken,
      response.data.tokens.refreshToken
    );

    return {
      user: response.data.user,
      tokens: response.data.tokens,
    };
  } catch (error: any) {
    console.error('❌ Verify OTP Error:', error);

    // Handle Firebase errors
    if (error.code === 'auth/invalid-verification-code') {
      throw new Error('Geçersiz doğrulama kodu. Lütfen tekrar deneyin.');
    } else if (error.code === 'auth/code-expired') {
      throw new Error('Doğrulama kodu süresi dolmuş. Lütfen yeni kod isteyin.');
    }

    throw new Error(error.message || 'OTP doğrulanamadı');
  }
}

// ============================================================================
// LOGOUT
// ============================================================================

/**
 * Sign out from Firebase and clear local storage
 */
export async function signOut(): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    await TokenStorage.clearTokens();
    console.log('✅ Signed out successfully');
  } catch (error: any) {
    console.error('❌ Sign Out Error:', error);
    throw new Error(error.message || 'Sign out failed');
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format phone number to E.164 format
 * Example: 5551234567 → +905551234567
 */
export function formatPhoneNumber(phone: string, countryCode: string = '+90'): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Remove leading zero if exists
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Add country code
  if (!cleaned.startsWith(countryCode.replace('+', ''))) {
    cleaned = countryCode + cleaned;
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  return cleaned;
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  // E.164 format: +[country code][number]
  // Length: 10-15 digits (including country code)
  const e164Regex = /^\+[1-9]\d{9,14}$/;
  return e164Regex.test(phone);
}
