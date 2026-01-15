import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signInWithGoogle, signInWithApple, isLoading } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Google Sign In will be implemented with proper OAuth flow
      Alert.alert('Google Sign In', 'Google sign in will be implemented with OAuth flow');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithApple();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Apple sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const openTerms = async () => {
    try {
      await Linking.openURL('https://goalgpt.com/terms');
    } catch (error) {
      Alert.alert('Error', 'Unable to open Terms of Service');
    }
  };

  const openPrivacy = async () => {
    try {
      await Linking.openURL('https://goalgpt.com/privacy');
    } catch (error) {
      Alert.alert('Error', 'Unable to open Privacy Policy');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Giriş Yap</Text>
        <Text style={styles.subtitle}>Devam etmek için giriş yapın</Text>

        {/* Social Login Buttons */}
        <View style={styles.socialButtons}>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleSignIn}
              disabled={loading || isLoading}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Apple ile Devam Et</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            disabled={loading || isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={24} color="#FFFFFF" />
            <Text style={styles.socialButtonText}>Google ile Devam Et</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
        )}

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.terms}>
            Devam ederek{' '}
            <Text style={styles.termsLink} onPress={openTerms}>
              Kullanım Şartları
            </Text>
            {' '}ve{' '}
            <Text style={styles.termsLink} onPress={openPrivacy}>
              Gizlilik Politikası
            </Text>
            'nı kabul etmiş olursunuz.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Hesabınız yok mu? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerLink}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#B3B3B3',
    marginBottom: 40,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    backgroundColor: '#1E2732',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 24,
  },
  termsContainer: {
    marginTop: 16,
  },
  terms: {
    color: '#B3B3B3',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#2196F3',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    color: '#B3B3B3',
    fontSize: 14,
  },
  footerLink: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
});
