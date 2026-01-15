/**
 * ErrorBoundary Component Tests
 * Tests for global error boundary
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '../../src/components/errors/ErrorBoundary';

// Mock Sentry
jest.mock('../../src/config/sentry.config', () => ({
  captureError: jest.fn(),
  setContext: jest.fn(),
}));

// Mock Button component
jest.mock('../../src/components/atoms/Button', () => ({
  Button: ({ children, onPress }: any) => {
    const { Pressable, Text } = require('react-native');
    return (
      <Pressable onPress={onPress} testID="error-boundary-button">
        <Text>{children}</Text>
      </Pressable>
    );
  },
}));

// ============================================================================
// TEST COMPONENTS
// ============================================================================

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean; errorMessage?: string }> = ({
  shouldThrow = true,
  errorMessage = 'Test error',
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <Text testID="success-component">Success</Text>;
};

// ============================================================================
// TESTS
// ============================================================================

describe('ErrorBoundary Component', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  // ============================================================================
  // RENDERING
  // ============================================================================

  describe('Rendering', () => {
    it('should render children when no error occurs', () => {
      const { getByTestId } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(getByTestId('success-component')).toBeTruthy();
    });

    it('should render fallback UI when error occurs', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(getByText('Oops! Something went wrong')).toBeTruthy();
      expect(getByText(/The app encountered an unexpected error/)).toBeTruthy();
    });

    it('should render error icon in fallback UI', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(getByText('💥')).toBeTruthy();
    });

    it('should render Try Again button in fallback UI', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(getByText('Try Again')).toBeTruthy();
    });

    it('should render help text in fallback UI', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(
        getByText(/If this problem persists, please contact support or restart the app/)
      ).toBeTruthy();
    });
  });

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  describe('Error Handling', () => {
    it('should catch and handle errors', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError errorMessage="Custom error message" />
        </ErrorBoundary>
      );

      expect(getByText('Oops! Something went wrong')).toBeTruthy();
    });

    it('should call onError callback when error occurs', () => {
      const onErrorMock = jest.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError errorMessage="Test error" />
        </ErrorBoundary>
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test error',
        }),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('should log error to console', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('ErrorBoundary caught an error');
    });
  });

  // ============================================================================
  // ERROR DETAILS (DEVELOPMENT)
  // ============================================================================

  describe('Error Details', () => {
    // Save original __DEV__
    const originalDev = (global as any).__DEV__;

    afterEach(() => {
      (global as any).__DEV__ = originalDev;
    });

    it('should show error details in development mode', () => {
      (global as any).__DEV__ = true;

      const { getByText, queryByText } = render(
        <ErrorBoundary showDetails={true}>
          <ThrowError errorMessage="Development error" />
        </ErrorBoundary>
      );

      expect(queryByText(/Error Details/)).toBeTruthy();
    });

    it('should hide error details in production mode', () => {
      (global as any).__DEV__ = false;

      const { queryByText } = render(
        <ErrorBoundary showDetails={false}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(queryByText(/Error Details/)).toBeNull();
    });

    it('should show error name and message in details', () => {
      const { getByText } = render(
        <ErrorBoundary showDetails={true}>
          <ThrowError errorMessage="Detailed error message" />
        </ErrorBoundary>
      );

      expect(getByText('Error')).toBeTruthy(); // Error name
      expect(getByText('Detailed error message')).toBeTruthy();
    });
  });

  // ============================================================================
  // RESET FUNCTIONALITY
  // ============================================================================

  describe('Reset Functionality', () => {
    it('should reset error state when Try Again is pressed', () => {
      let shouldThrow = true;

      const DynamicComponent = () => {
        if (shouldThrow) {
          throw new Error('Initial error');
        }
        return <Text testID="success-component">Success</Text>;
      };

      const { getByTestId, getByText } = render(
        <ErrorBoundary>
          <DynamicComponent />
        </ErrorBoundary>
      );

      // Verify error UI is shown
      expect(getByText('Oops! Something went wrong')).toBeTruthy();

      // Fix the error
      shouldThrow = false;

      // Press Try Again
      const tryAgainButton = getByTestId('error-boundary-button');
      fireEvent.press(tryAgainButton);

      // Verify children are rendered again
      expect(getByTestId('success-component')).toBeTruthy();
    });
  });

  // ============================================================================
  // CUSTOM FALLBACK
  // ============================================================================

  describe('Custom Fallback', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = (error: Error) => (
        <Text testID="custom-fallback">Custom Error: {error.message}</Text>
      );

      const { getByTestId, getByText } = render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError errorMessage="Custom error message" />
        </ErrorBoundary>
      );

      expect(getByTestId('custom-fallback')).toBeTruthy();
      expect(getByText('Custom Error: Custom error message')).toBeTruthy();
    });

    it('should pass reset function to custom fallback', () => {
      let shouldThrow = true;
      let resetFunction: (() => void) | null = null;

      const customFallback = (error: Error, errorInfo: any, reset: () => void) => {
        resetFunction = reset;
        return <Text testID="custom-fallback">Custom Fallback</Text>;
      };

      const DynamicComponent = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <Text testID="success-component">Success</Text>;
      };

      const { getByTestId } = render(
        <ErrorBoundary fallback={customFallback}>
          <DynamicComponent />
        </ErrorBoundary>
      );

      // Verify custom fallback is shown
      expect(getByTestId('custom-fallback')).toBeTruthy();

      // Fix error and call reset
      shouldThrow = false;
      expect(resetFunction).not.toBeNull();
      resetFunction!();

      // Verify children are rendered
      expect(getByTestId('success-component')).toBeTruthy();
    });
  });

  // ============================================================================
  // MULTIPLE ERRORS
  // ============================================================================

  describe('Multiple Errors', () => {
    it('should handle multiple consecutive errors', () => {
      let errorMessage = 'First error';

      const DynamicErrorComponent = () => {
        throw new Error(errorMessage);
      };

      const { getByText, getByTestId, rerender } = render(
        <ErrorBoundary>
          <DynamicErrorComponent />
        </ErrorBoundary>
      );

      // First error
      expect(getByText('Oops! Something went wrong')).toBeTruthy();

      // Change error message
      errorMessage = 'Second error';

      // Reset
      const tryAgainButton = getByTestId('error-boundary-button');
      fireEvent.press(tryAgainButton);

      // Should catch second error
      expect(getByText('Oops! Something went wrong')).toBeTruthy();
    });
  });

  // ============================================================================
  // NESTED ERROR BOUNDARIES
  // ============================================================================

  describe('Nested Error Boundaries', () => {
    it('should support nested error boundaries', () => {
      const InnerComponent = () => {
        throw new Error('Inner error');
      };

      const { getByText } = render(
        <ErrorBoundary>
          <Text>Outer boundary</Text>
          <ErrorBoundary>
            <InnerComponent />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner error boundary should catch the error
      expect(getByText('Oops! Something went wrong')).toBeTruthy();
      // Outer boundary children should still be visible
      expect(getByText('Outer boundary')).toBeTruthy();
    });
  });
});
