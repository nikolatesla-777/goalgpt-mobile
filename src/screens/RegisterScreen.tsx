/**
 * RegisterScreen
 *
 * User registration with email/password and social auth
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/atoms/Button';
import { Input, EmailInput, PasswordInput } from '../components/atoms/Input';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { typography, spacing } from '../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface RegisterScreenProps {
  /** Callback when registration is successful */
  onRegisterSuccess?: () => void;

  /** Callback when navigate to login */
  onNavigateToLogin?: () => void;

  /** Callback for social auth */
  onSocialAuth?: (provider: 'google' | 'apple' | 'phone') => void;

  /** Callback for back navigation */
  onBack?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onSocialAuth,
  onBack,
}) => {
  const { theme } = useTheme();
  const auth = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await auth.signUpWithEmail(email, password, name);
      // If successful, AuthContext will update state and trigger navigation
      onRegisterSuccess?.();
    } catch (error: any) {
      // Error is already set in AuthContext state
      Alert.alert('Kayıt Hatası', auth.error || 'Kayıt olunamadı');
    }
  };

  const handleSocialAuth = (provider: 'google' | 'apple' | 'phone') => {
    onSocialAuth?.(provider);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
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
              <Text style={styles.backIcon}>←</Text>
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
            <Text style={styles.logo}>⚽</Text>
          </View>

        {/* Title */}
        <Text style={styles.title}>Create Account</Text>

        {/* Name Input */}
        <Input
          label="Full Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          leftIcon={<Text style={styles.inputIcon}>👤</Text>}
        />

        {/* Email Input */}
        <EmailInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />

        {/* Password Input */}
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          helperText="Minimum 6 characters"
        />

        {/* Confirm Password Input */}
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
        />

        {/* Terms & Conditions */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By signing up, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Register Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleRegister}
          disabled={!name || !email || !password || !confirmPassword || auth.isLoading}
          style={styles.registerButton}
        >
          {auth.isLoading ? 'Creating Account...' : 'Sign Up'}
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
            <Text style={styles.socialIcon}>🔴</Text>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialAuth('apple')}
            activeOpacity={0.7}
          >
            <Text style={styles.socialIcon}>🍎</Text>
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialAuth('phone')}
            activeOpacity={0.7}
          >
            <Text style={styles.socialIcon}>📱</Text>
            <Text style={styles.socialButtonText}>Continue with Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
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
  logo: {
    fontSize: 80,
  },
  title: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputIcon: {
    fontSize: 18,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#4BC41E',
    fontFamily: typography.fonts.ui.semibold,
  },
  registerButton: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 14,
    color: '#8E8E93',
  },
  loginLink: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 14,
    color: '#4BC41E',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default RegisterScreen;
