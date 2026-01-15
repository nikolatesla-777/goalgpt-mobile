/**
 * ErrorBoundary Component
 * Global error boundary to catch React rendering errors
 * Prevents app crashes and shows fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { spacing, typography, colors } from '../../constants/theme';
import { captureError, setContext } from '../../config/sentry.config';

// ============================================================================
// TYPES
// ============================================================================

interface Props {
  children: ReactNode;
  /** Custom fallback component */
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  /** Error callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Whether to show error details in development */
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ============================================================================
// COMPONENT
// ============================================================================

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // ============================================================================
  // ERROR BOUNDARY LIFECYCLE
  // ============================================================================

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error('🔴 ErrorBoundary caught an error:', error);
    console.error('🔴 Error Info:', errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to Sentry error tracking service
    try {
      // Add component stack to Sentry context
      setContext('react_error', {
        componentStack: errorInfo.componentStack,
      });

      // Capture the error
      captureError(error, {
        errorInfo: errorInfo.componentStack,
        boundary: 'ErrorBoundary',
      });
    } catch (sentryError) {
      // Fallback if Sentry fails
      console.error('❌ Failed to log error to Sentry:', sentryError);
    }
  }

  // ============================================================================
  // HANDLERS
  // ============================================================================

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showDetails = __DEV__ } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo!, this.resetError);
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Icon */}
            <Text style={styles.icon}>💥</Text>

            {/* Title */}
            <Text style={styles.title}>Oops! Something went wrong</Text>

            {/* Message */}
            <Text style={styles.message}>
              The app encountered an unexpected error. Don't worry, your data is safe.
            </Text>

            {/* Error Details (Development Only) */}
            {showDetails && error && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Error Details (Dev Only):</Text>
                <View style={styles.errorBox}>
                  <Text style={styles.errorName}>{error.name}</Text>
                  <Text style={styles.errorMessage}>{error.message}</Text>
                  {error.stack && (
                    <Text style={styles.errorStack} numberOfLines={10}>
                      {error.stack}
                    </Text>
                  )}
                </View>

                {errorInfo && errorInfo.componentStack && (
                  <View style={[styles.errorBox, styles.componentStack]}>
                    <Text style={styles.detailsTitle}>Component Stack:</Text>
                    <Text style={styles.errorStack} numberOfLines={10}>
                      {errorInfo.componentStack}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Actions */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={this.resetError} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
            </View>

            {/* Help Text */}
            <Text style={styles.helpText}>
              If this problem persists, please contact support or restart the app.
            </Text>
          </ScrollView>
        </View>
      );
    }

    return children;
  }
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
  },
  icon: {
    fontSize: 80,
    marginBottom: spacing[6],
  },
  title: {
    ...typography.h2,
    fontSize: typography.sizes['2xl'],
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing[4],
    fontWeight: 'bold',
  },
  message: {
    ...typography.body1,
    fontSize: typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: typography.sizes.base * 1.5,
  },
  detailsContainer: {
    width: '100%',
    marginTop: spacing[4],
    marginBottom: spacing[6],
  },
  detailsTitle: {
    ...typography.h4,
    fontSize: typography.sizes.sm,
    color: '#FFB800',
    marginBottom: spacing[2],
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
    borderRadius: 8,
    padding: spacing[3],
    marginBottom: spacing[3],
  },
  componentStack: {
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderColor: 'rgba(255, 184, 0, 0.3)',
  },
  errorName: {
    ...typography.body2,
    fontSize: typography.sizes.sm,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: spacing[1],
    fontFamily: 'RobotoMono-Bold',
  },
  errorMessage: {
    ...typography.body2,
    fontSize: typography.sizes.sm,
    color: '#FFB800',
    marginBottom: spacing[2],
    fontFamily: 'RobotoMono-Regular',
  },
  errorStack: {
    ...typography.caption,
    fontSize: typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'RobotoMono-Regular',
    lineHeight: typography.sizes.xs * 1.4,
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: '600',
    fontFamily: 'Nohemi-SemiBold',
  },
  helpText: {
    ...typography.caption,
    fontSize: typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: spacing[2],
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default ErrorBoundary;
