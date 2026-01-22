/**
 * LoginScreen
 *
 * User login with email/password and social auth
 * Master Plan compliant - Authentication Layer
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/atoms/Button';
import { EmailInput, PasswordInput } from '../components/atoms/Input';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { typography, spacing } from '../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface LoginScreenProps {
  /** Callback when login is successful */
  onLoginSuccess?: () => void;

  /** Callback when navigate to register */
  onNavigateToRegister?: () => void;

  /** Callback when forgot password is pressed */
  onForgotPassword?: () => void;

  /** Callback for social auth */
  onSocialAuth?: (provider: 'google' | 'apple' | 'phone') => void;

  /** Callback for back navigation */
  onBack?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onForgotPassword,
  onSocialAuth,
  onBack,
}) => {
  const { theme } = useTheme();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen email ve şifrenizi girin');
      return;
    }

    try {
      await auth.signInWithEmail(email, password);
      // If successful, AuthContext will update state and trigger navigation
      onLoginSuccess?.();
    } catch (error: any) {
      // Error is already set in AuthContext state
      Alert.alert('Giriş Hatası', auth.error || 'Giriş yapılamadı');
    }
  };

  const handleSocialAuth = (provider: 'google' | 'apple' | 'phone') => {
    onSocialAuth?.(provider);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <LinearGradient
      colors={['#000000', '#0A2E16']} // Gradient from black to dark green
      start={{ x: 0.5, y: 0.2 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {/* Back Button */}
          {onBack && (
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require('../../assets/images/goalgpt-logo-new.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Welcome Back</Text>

            {/* Email Input */}
            <EmailInput
              label="Email or Username"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            {/* Password Input */}
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
            />

            {/* Forgot Password */}
            <TouchableOpacity onPress={onForgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              variant="primary"
              size="large"
              fullWidth
              onPress={handleLogin}
              disabled={!email || !password || auth.isLoading}
              style={styles.loginButton}
            >
              {auth.isLoading ? 'Logging in...' : 'Log In'}
            </Button>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Auth Buttons */}
            <View style={styles.socialButtonGroup}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialAuth('google')}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialAuth('apple')}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialAuth('phone')}
                activeOpacity={0.7}
              >
                <Ionicons name="call-outline" size={20} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Continue with Phone</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  backText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 17,
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4BC41E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  forgotPassword: {
    fontFamily: typography.fonts.ui.medium,
    fontSize: 14,
    color: '#4BC41E',
    textAlign: 'right',
    marginBottom: 24,
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    fontFamily: typography.fonts.ui.medium,
    fontSize: 13,
    color: '#8E8E93',
    marginHorizontal: 16,
  },
  socialButtonGroup: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  socialIcon: {
    fontSize: 20,
  },
  socialButtonText: {
    fontFamily: typography.fonts.ui.medium,
    fontSize: 15,
    color: '#FFFFFF',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 14,
    color: '#8E8E93',
  },
  signUpLink: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 14,
    color: '#4BC41E',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default LoginScreen;
