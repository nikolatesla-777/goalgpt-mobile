/**
 * Input Component
 *
 * A versatile text input with focus states, validation, and error handling
 * Master Plan v1.0 compliant - supports text, password, search, email, phone types
 * Includes glassmorphism backgrounds and neon focus states
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { typography, spacing, borderRadius } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export type InputType = 'text' | 'password' | 'search' | 'email' | 'phone';

export interface InputProps extends TextInputProps {
  /** Input type */
  type?: InputType;

  /** Input label */
  label?: string;

  /** Helper text (shown below input) */
  helperText?: string;

  /** Error message (takes precedence over helperText) */
  error?: string;

  /** Left icon component */
  leftIcon?: React.ReactNode;

  /** Right icon component */
  rightIcon?: React.ReactNode;

  /** Enable right icon press */
  onRightIconPress?: () => void;

  /** Disabled state */
  disabled?: boolean;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Custom input style */
  inputStyle?: TextStyle;

  /** Custom label style */
  labelStyle?: TextStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
  containerStyle,
  inputStyle,
  labelStyle,
  value,
  onFocus,
  onBlur,
  secureTextEntry,
  ...rest
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // ============================================================================
  // TYPE-SPECIFIC CONFIG
  // ============================================================================

  const getTypeConfig = () => {
    switch (type) {
      case 'password':
        return {
          textInputProps: {
            secureTextEntry: !showPassword,
            autoCapitalize: 'none' as const,
            autoCorrect: false,
          },
          rightIcon: (
            <Text style={{ fontSize: 18 }}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          ),
          onRightIconPress: () => setShowPassword(!showPassword),
        };
      case 'search':
        return {
          textInputProps: {
            autoCapitalize: 'none' as const,
          },
          leftIcon: <Text style={{ fontSize: 18 }}>🔍</Text>,
          rightIcon: value ? (
            <Text style={{ fontSize: 16 }}>✕</Text>
          ) : null,
        };
      case 'email':
        return {
          textInputProps: {
            keyboardType: 'email-address' as const,
            autoCapitalize: 'none' as const,
            autoCorrect: false,
          },
          leftIcon: <Text style={{ fontSize: 16 }}>✉️</Text>,
        };
      case 'phone':
        return {
          textInputProps: {
            keyboardType: 'phone-pad' as const,
          },
          leftIcon: <Text style={{ fontSize: 16 }}>📱</Text>,
        };
      default:
        return {
          textInputProps: {},
        };
    }
  };

  const typeConfig = getTypeConfig();
  const finalLeftIcon = leftIcon || typeConfig.leftIcon;
  const finalRightIcon = rightIcon || typeConfig.rightIcon;
  const finalOnRightIconPress = onRightIconPress || typeConfig.onRightIconPress;

  // ============================================================================
  // STYLES
  // ============================================================================

  // Container styles
  const baseContainerStyle: ViewStyle = {
    marginBottom: spacing.md,
  };

  // Label styles
  const baseLabelStyle: TextStyle = {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF', // Always white for dark theme
    marginBottom: spacing.sm,
  };

  // Input wrapper styles
  const inputWrapperStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Darker, more visible background
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: error
      ? theme.colors.error
      : isFocused
      ? theme.colors.primary
      : 'rgba(255, 255, 255, 0.1)', // More visible border
    paddingHorizontal: spacing.md,
    minHeight: 52,
    ...(isFocused && {
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    }),
  };

  // Input styles
  const baseInputStyle: TextStyle = {
    flex: 1,
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF', // Always white for dark theme
    paddingVertical: spacing.sm,
  };

  // Disabled styles
  const disabledStyle: ViewStyle = {
    opacity: 0.4,
  };

  // Helper/Error text styles
  const helperTextStyle: TextStyle = {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: error ? '#FF3B30' : '#8E8E93', // Red for error, gray for helper
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  };

  // Icon styles
  const iconWrapperStyle: ViewStyle = {
    marginHorizontal: spacing.xs,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={[baseContainerStyle, containerStyle]}>
      {/* Label */}
      {label && <Text style={[baseLabelStyle, labelStyle]}>{label}</Text>}

      {/* Input Wrapper */}
      <View style={[inputWrapperStyle, disabled && disabledStyle]}>
        {/* Left Icon */}
        {finalLeftIcon && <View style={iconWrapperStyle}>{finalLeftIcon}</View>}

        {/* Text Input */}
        <TextInput
          value={value}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[baseInputStyle, inputStyle]}
          placeholderTextColor="rgba(255, 255, 255, 0.4)" // More visible placeholder
          secureTextEntry={secureTextEntry ?? typeConfig.textInputProps?.secureTextEntry}
          {...(typeConfig.textInputProps || {})}
          {...rest}
        />

        {/* Right Icon */}
        {finalRightIcon &&
          (finalOnRightIconPress ? (
            <TouchableOpacity
              onPress={finalOnRightIconPress}
              disabled={disabled}
              style={iconWrapperStyle}
            >
              {finalRightIcon}
            </TouchableOpacity>
          ) : (
            <View style={iconWrapperStyle}>{finalRightIcon}</View>
          ))}
      </View>

      {/* Helper Text / Error */}
      {(helperText || error) && <Text style={helperTextStyle}>{error || helperText}</Text>}
    </View>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * SearchInput
 * Input with search icon and clear button
 */
export const SearchInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input type="search" placeholder="Search..." {...props} />
);

/**
 * PasswordInput
 * Input with password visibility toggle
 */
export const PasswordInput: React.FC<Omit<InputProps, 'type' | 'secureTextEntry'>> = (props) => (
  <Input type="password" placeholder="Enter password" {...props} />
);

/**
 * EmailInput
 * Input configured for email entry
 */
export const EmailInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input type="email" placeholder="Enter email" {...props} />
);

/**
 * PhoneInput
 * Input configured for phone number entry
 */
export const PhoneInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input type="phone" placeholder="Enter phone number" {...props} />
);

// ============================================================================
// EXPORT
// ============================================================================

export default Input;
