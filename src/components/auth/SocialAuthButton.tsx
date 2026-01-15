/**
 * SocialAuthButton Component
 * Button for social authentication providers
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export type SocialProvider = 'google' | 'apple' | 'facebook';

export interface SocialAuthButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PROVIDER_CONFIG = {
  google: {
    icon: '🔍',
    label: 'Google ile Devam Et',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    borderColor: '#E0E0E0',
  },
  apple: {
    icon: '',
    label: 'Apple ile Devam Et',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    borderColor: '#000000',
  },
  facebook: {
    icon: '📘',
    label: 'Facebook ile Devam Et',
    backgroundColor: '#1877F2',
    textColor: '#FFFFFF',
    borderColor: '#1877F2',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  provider,
  onPress,
  loading = false,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const config = PROVIDER_CONFIG[provider];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={config.textColor} />
      ) : (
        <>
          <NeonText size="lg" style={{ marginRight: spacing[2] }}>
            {config.icon}
          </NeonText>
          <NeonText
            size="md"
            style={{
              color: config.textColor,
              fontWeight: '600',
            }}
          >
            {config.label}
          </NeonText>
        </>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    minHeight: 56,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default SocialAuthButton;
