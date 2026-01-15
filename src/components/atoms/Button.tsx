/**
 * Button Component
 *
 * Primary action component with multiple variants and states
 * Supports: Primary, Secondary, Ghost, VIP variants
 * Includes: Press animations, loading states, neon glow
 * EXPO GO COMPATIBLE - Uses Animated API
 */

import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PressableProps,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { animation } from '../../constants/tokens';

// TYPES
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'vip';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'large',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  style,
  onPress,
  ...pressableProps
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: animation.scale.pressed,
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  };

  const sizeConfig = {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: theme.typography.fontSize.button.small,
      borderRadius: theme.borderRadius.md,
    },
    medium: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      fontSize: theme.typography.fontSize.button.medium,
      borderRadius: theme.borderRadius.lg,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      fontSize: theme.typography.fontSize.button.large,
      borderRadius: theme.borderRadius.xl,
    },
  };

  const config = sizeConfig[size];

  const containerStyle: ViewStyle = {
    paddingVertical: config.paddingVertical,
    paddingHorizontal: config.paddingHorizontal,
    borderRadius: config.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...(fullWidth && { width: '100%' }),
    opacity: disabled || loading ? animation.opacity.disabled : 1,
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          ...theme.shadows.button.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.overlay,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'vip':
        return {
          ...theme.shadows.button.vip,
        };
      default:
        return {};
    }
  };

  const textStyle: TextStyle = {
    fontFamily: theme.typography.fonts.ui.semibold,
    fontSize: config.fontSize,
    textAlign: 'center',
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF'; // Always white on green background
      case 'secondary':
        return '#FFFFFF'; // Always white for dark theme
      case 'ghost':
        return '#8E8E93'; // Gray for ghost buttons
      case 'vip':
        return '#000000'; // Black on gold background
      default:
        return '#FFFFFF';
    }
  };

  const iconGap = size === 'small' ? 6 : size === 'medium' ? 8 : 10;
  const isInteractive = !disabled && !loading;

  const content = (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={{ marginRight: iconGap }}
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <Animated.View style={{ marginRight: iconGap }}>
          {icon}
        </Animated.View>
      )}
      <Text style={[textStyle, { color: getTextColor() }]}>
        {children}
      </Text>
      {!loading && icon && iconPosition === 'right' && (
        <Animated.View style={{ marginLeft: iconGap }}>
          {icon}
        </Animated.View>
      )}
    </>
  );

  if (variant === 'vip') {
    return (
      <AnimatedPressable
        onPress={isInteractive ? onPress : undefined}
        onPressIn={isInteractive ? handlePressIn : undefined}
        onPressOut={isInteractive ? handlePressOut : undefined}
        disabled={disabled || loading}
        style={[{ transform: [{ scale: scaleAnim }] }, style]}
        {...pressableProps}
      >
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[containerStyle, getVariantStyle()]}
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={isInteractive ? onPress : undefined}
      onPressIn={isInteractive ? handlePressIn : undefined}
      onPressOut={isInteractive ? handlePressOut : undefined}
      disabled={disabled || loading}
      style={[
        { transform: [{ scale: scaleAnim }] },
        containerStyle,
        getVariantStyle(),
        style,
      ]}
      {...pressableProps}
    >
      {content}
    </AnimatedPressable>
  );
};

export default Button;
