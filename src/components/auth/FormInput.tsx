/**
 * FormInput Component
 * Themed text input for authentication forms
 */

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  leftIcon?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'email' | 'password' | 'username' | 'name';
  editable?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  leftIcon,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete = 'off',
  editable = true,
}) => {
  const { theme } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      {/* Label */}
      <NeonText
        size="sm"
        style={{
          color: hasError ? theme.error.main : theme.text.secondary,
          marginBottom: spacing[2],
          fontWeight: '600',
        }}
      >
        {label}
      </NeonText>

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.background.elevated,
            borderColor: hasError
              ? theme.error.main
              : isFocused
                ? theme.primary[500]
                : theme.border.primary,
            borderWidth: isFocused || hasError ? 2 : 1,
          },
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.iconContainer}>
            <NeonText size="lg">{leftIcon}</NeonText>
          </View>
        )}

        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text.primary,
              flex: 1,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.text.tertiary}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={false}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Password Visibility Toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsSecure(!isSecure)}
            activeOpacity={0.7}
          >
            <NeonText size="lg">{isSecure ? '👁️' : '👁️‍🗨️'}</NeonText>
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {hasError && (
        <NeonText
          size="xs"
          style={{
            color: theme.error.main,
            marginTop: spacing[2],
          }}
        >
          {error}
        </NeonText>
      )}
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[3],
    minHeight: 56,
  },
  iconContainer: {
    paddingHorizontal: spacing[2],
  },
  input: {
    fontSize: 16,
    paddingVertical: spacing[3],
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default FormInput;
