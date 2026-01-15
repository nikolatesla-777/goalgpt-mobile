/**
 * AuthButton Component
 * Primary action button for authentication screens
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export interface AuthButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const AuthButton: React.FC<AuthButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.background.elevated,
          borderColor: theme.border.primary,
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.primary[500],
          borderWidth: 2,
        };
      default: // primary
        return {
          backgroundColor: theme.primary[500],
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.text.primary;
      case 'outline':
        return theme.primary[500];
      default: // primary
        return '#FFFFFF';
    }
  };

  const buttonStyle = getButtonStyle();
  const textColor = getTextColor();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        {
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && (
            <NeonText size="lg" style={{ marginRight: spacing[2] }}>
              {icon}
            </NeonText>
          )}
          <NeonText
            size="md"
            style={{
              color: textColor,
              fontWeight: 'bold',
            }}
          >
            {label}
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
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.lg,
    minHeight: 56,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default AuthButton;
