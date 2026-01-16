/**
 * ErrorState Component
 * Displays error states with retry functionality
 * Handles network errors, server errors, and generic errors
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../atoms/Button';
import { typography, spacing } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export type ErrorType = 'network' | 'server' | 'notFound' | 'unauthorized' | 'generic';

export interface ErrorStateProps {
  /** Error type */
  type?: ErrorType;

  /** Custom error title */
  title?: string;

  /** Custom error message */
  message?: string;

  /** Ionicons icon name */
  icon?: keyof typeof Ionicons.glyphMap;

  /** Retry button text */
  retryText?: string;

  /** Retry callback */
  onRetry?: () => void;

  /** Show retry button */
  showRetry?: boolean;

  /** Secondary action button text */
  secondaryActionText?: string;

  /** Secondary action callback */
  onSecondaryAction?: () => void;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Custom container style */
  style?: ViewStyle;
}

// ============================================================================
// ERROR CONFIGURATIONS
// ============================================================================

const errorConfigs: Record<ErrorType, { icon: keyof typeof Ionicons.glyphMap; title: string; message: string }> = {
  network: {
    icon: 'wifi-outline',
    title: 'Connection Error',
    message:
      'Unable to connect to the server. Please check your internet connection and try again.',
  },
  server: {
    icon: 'warning-outline',
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
  },
  notFound: {
    icon: 'search-outline',
    title: 'Not Found',
    message: "We couldn't find what you're looking for. It may have been moved or deleted.",
  },
  unauthorized: {
    icon: 'lock-closed-outline',
    title: 'Access Denied',
    message: "You don't have permission to access this content. Please log in and try again.",
  },
  generic: {
    icon: 'close-circle-outline',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'generic',
  title,
  message,
  icon,
  retryText = 'Try Again',
  onRetry,
  showRetry = true,
  secondaryActionText,
  onSecondaryAction,
  size = 'medium',
  style,
}) => {
  const { theme } = useTheme();

  // Get error config
  const config = errorConfigs[type];

  // Use custom values or fall back to config
  const displayIcon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  // ============================================================================
  // SIZE CONFIGURATIONS
  // ============================================================================

  const sizeConfig = {
    small: {
      iconSize: 48,
      titleSize: typography.sizes.lg,
      messageSize: typography.sizes.sm,
      spacing: spacing[4],
      buttonSize: 'small' as const,
    },
    medium: {
      iconSize: 64,
      titleSize: typography.sizes.xl,
      messageSize: typography.sizes.base,
      spacing: spacing[6],
      buttonSize: 'medium' as const,
    },
    large: {
      iconSize: 80,
      titleSize: typography.sizes['2xl'],
      messageSize: typography.sizes.lg,
      spacing: spacing[8],
      buttonSize: 'large' as const,
    },
  };

  const sizeSettings = sizeConfig[size];

  // ============================================================================
  // STYLES
  // ============================================================================

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  };

  const iconContainerStyle: ViewStyle = {
    marginBottom: sizeSettings.spacing,
  };

  const iconStyle: TextStyle = {
    fontSize: sizeSettings.iconSize,
    textAlign: 'center',
  };

  const titleStyle: TextStyle = {
    ...typography.h3,
    fontSize: sizeSettings.titleSize,
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: spacing[3],
  };

  const messageStyle: TextStyle = {
    ...typography.body1,
    fontSize: sizeSettings.messageSize,
    color: theme.text.secondary,
    textAlign: 'center',
    marginBottom: sizeSettings.spacing,
    lineHeight: sizeSettings.messageSize * 1.5,
  };

  const buttonContainerStyle: ViewStyle = {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: spacing[3],
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={[containerStyle, style]}>
      {/* Icon */}
      {displayIcon && (
        <View style={iconContainerStyle}>
          <Ionicons name={displayIcon} size={sizeSettings.iconSize} color={theme.status.error} />
        </View>
      )}

      {/* Title */}
      <Text style={titleStyle}>{displayTitle}</Text>

      {/* Message */}
      <Text style={messageStyle}>{displayMessage}</Text>

      {/* Buttons */}
      <View style={buttonContainerStyle}>
        {/* Retry Button */}
        {showRetry && onRetry && (
          <Button variant="primary" size={sizeSettings.buttonSize} onPress={onRetry} fullWidth>
            {retryText}
          </Button>
        )}

        {/* Secondary Action */}
        {secondaryActionText && onSecondaryAction && (
          <Button
            variant="ghost"
            size={sizeSettings.buttonSize}
            onPress={onSecondaryAction}
            fullWidth
          >
            {secondaryActionText}
          </Button>
        )}
      </View>
    </View>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * NetworkError
 * Error state for network/connection issues
 */
export const NetworkError: React.FC<Omit<ErrorStateProps, 'type'>> = (props) => (
  <ErrorState {...props} type="network" />
);

/**
 * ServerError
 * Error state for server/backend issues
 */
export const ServerError: React.FC<Omit<ErrorStateProps, 'type'>> = (props) => (
  <ErrorState {...props} type="server" />
);

/**
 * NotFoundError
 * Error state for 404/not found
 */
export const NotFoundError: React.FC<Omit<ErrorStateProps, 'type'>> = (props) => (
  <ErrorState {...props} type="notFound" />
);

/**
 * UnauthorizedError
 * Error state for unauthorized access
 */
export const UnauthorizedError: React.FC<Omit<ErrorStateProps, 'type'>> = (props) => (
  <ErrorState {...props} type="unauthorized" />
);

/**
 * GenericError
 * Generic error state
 */
export const GenericError: React.FC<Omit<ErrorStateProps, 'type'>> = (props) => (
  <ErrorState {...props} type="generic" />
);

// ============================================================================
// EXPORT
// ============================================================================

export default ErrorState;
