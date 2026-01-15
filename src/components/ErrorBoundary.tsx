/**
 * ErrorBoundary Component
 *
 * React error boundary for catching navigation and rendering errors
 * - Catches JavaScript errors in component tree
 * - Displays fallback UI
 * - Logs errors to Sentry
 * - Provides retry mechanism
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import { spacing, typography } from '../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
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

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    // Log to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.resetError);
      }

      // Default fallback UI
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              {/* Error Icon */}
              <Text style={styles.errorIcon}>⚠️</Text>

              {/* Title */}
              <Text style={styles.title}>Oops! Something went wrong</Text>

              {/* Description */}
              <Text style={styles.description}>
                We're sorry, but something unexpected happened. The error has been reported to our team.
              </Text>

              {/* Error Details (collapsible) */}
              <View style={styles.errorDetails}>
                <Text style={styles.errorDetailsTitle}>Error Details:</Text>
                <Text style={styles.errorMessage}>{error.message}</Text>
                {errorInfo && (
                  <Text style={styles.errorStack} numberOfLines={10}>
                    {errorInfo.componentStack}
                  </Text>
                )}
              </View>

              {/* Actions */}
              <TouchableOpacity
                style={styles.retryButton}
                onPress={this.resetError}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => {
                  // Copy error to clipboard or open support
                  console.log('Report error:', error);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.reportButtonText}>Report Issue</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
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
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  errorDetails: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  errorDetailsTitle: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontFamily: typography.fonts.mono.regular,
    fontSize: 12,
    color: '#FF6B6B',
    marginBottom: spacing.sm,
  },
  errorStack: {
    fontFamily: typography.fonts.mono.regular,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 14,
  },
  retryButton: {
    backgroundColor: '#4BC41E',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    minWidth: 200,
  },
  retryButtonText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  reportButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  reportButtonText: {
    fontFamily: typography.fonts.ui.medium,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default ErrorBoundary;
