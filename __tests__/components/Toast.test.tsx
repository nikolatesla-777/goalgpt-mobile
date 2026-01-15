/**
 * Toast Component Tests
 * Tests for temporary notification messages
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Toast, ToastContainer, ToastData } from '../../src/components/feedback/Toast';
import { ThemeProvider } from '../../src/context/ThemeContext';

// ============================================================================
// HELPERS
// ============================================================================

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const createMockToast = (overrides: Partial<ToastData> = {}): ToastData => ({
  id: 'toast-1',
  type: 'success',
  message: 'Test message',
  duration: 3000,
  position: 'top',
  ...overrides,
});

// ============================================================================
// TESTS
// ============================================================================

describe('Toast Component', () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // ============================================================================
  // RENDERING
  // ============================================================================

  describe('Rendering', () => {
    it('should render toast with message', () => {
      const toast = createMockToast({ message: 'Success message' });
      const { getByText } = renderWithTheme(
        <Toast toast={toast} onDismiss={mockOnDismiss} />
      );

      expect(getByText('Success message')).toBeTruthy();
    });

    it('should render success toast with icon', () => {
      const toast = createMockToast({ type: 'success' });
      const { getByText } = renderWithTheme(
        <Toast toast={toast} onDismiss={mockOnDismiss} />
      );

      expect(getByText('✅')).toBeTruthy();
    });

    it('should render error toast with icon', () => {
      const toast = createMockToast({ type: 'error' });
      const { getByText } = renderWithTheme(
        <Toast toast={toast} onDismiss={mockOnDismiss} />
      );

      expect(getByText('❌')).toBeTruthy();
    });

    it('should render warning toast with icon', () => {
      const toast = createMockToast({ type: 'warning' });
      const { getByText } = renderWithTheme(
        <Toast toast={toast} onDismiss={mockOnDismiss} />
      );

      expect(getByText('⚠️')).toBeTruthy();
    });

    it('should render info toast with icon', () => {
      const toast = createMockToast({ type: 'info' });
      const { getByText } = renderWithTheme(
        <Toast toast={toast} onDismiss={mockOnDismiss} />
      );

      expect(getByText('ℹ️')).toBeTruthy();
    });
  });

  // ============================================================================
  // INTERACTIONS
  // ============================================================================

  describe('Interactions', () => {
    it('should dismiss toast when pressed', async () => {
      const toast = createMockToast();
      const { getByText } = renderWithTheme(
        <Toast toast={toast} onDismiss={mockOnDismiss} />
      );

      const message = getByText('Test message');
      fireEvent.press(message);

      // Wait for animation to complete
      jest.advanceTimersByTime(200);

      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalledWith('toast-1');
      });
    });

    it('should auto-dismiss after duration', async () => {
      const toast = createMockToast({ duration: 3000 });
      renderWithTheme(<Toast toast={toast} onDismiss={mockOnDismiss} />);

      // Wait for duration + animation time
      jest.advanceTimersByTime(3200);

      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalledWith('toast-1');
      });
    });

    it('should use default duration of 3000ms', async () => {
      const toast = createMockToast({ duration: undefined });
      renderWithTheme(<Toast toast={toast} onDismiss={mockOnDismiss} />);

      // Wait for default duration
      jest.advanceTimersByTime(3200);

      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalled();
      });
    });
  });

  // ============================================================================
  // POSITIONING
  // ============================================================================

  describe('Positioning', () => {
    it('should default to top position', () => {
      const toast = createMockToast({ position: undefined });
      const { getByText } = renderWithTheme(
        <Toast toast={toast} onDismiss={mockOnDismiss} />
      );

      // Component renders without error
      expect(getByText('Test message')).toBeTruthy();
    });

    it('should support bottom position', () => {
      const toast = createMockToast({ position: 'bottom' });
      const { getByText } = renderWithTheme(
        <Toast toast={toast} onDismiss={mockOnDismiss} />
      );

      expect(getByText('Test message')).toBeTruthy();
    });
  });

  // ============================================================================
  // CLEANUP
  // ============================================================================

  describe('Cleanup', () => {
    it('should clear timer on unmount', () => {
      const toast = createMockToast();
      const { unmount } = renderWithTheme(
        <Toast toast={toast} onDismiss={mockOnDismiss} />
      );

      unmount();

      // Advance timers after unmount
      jest.advanceTimersByTime(3200);

      // Should not call onDismiss after unmount
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });
  });
});

// ============================================================================
// TOAST CONTAINER TESTS
// ============================================================================

describe('ToastContainer Component', () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // RENDERING
  // ============================================================================

  describe('Rendering', () => {
    it('should render empty container with no toasts', () => {
      const { queryByText } = renderWithTheme(
        <ToastContainer toasts={[]} onDismiss={mockOnDismiss} />
      );

      expect(queryByText(/./)).toBeNull();
    });

    it('should render single toast', () => {
      const toasts = [createMockToast({ message: 'Single toast' })];
      const { getByText } = renderWithTheme(
        <ToastContainer toasts={toasts} onDismiss={mockOnDismiss} />
      );

      expect(getByText('Single toast')).toBeTruthy();
    });

    it('should render multiple toasts', () => {
      const toasts = [
        createMockToast({ id: 'toast-1', message: 'First toast' }),
        createMockToast({ id: 'toast-2', message: 'Second toast' }),
        createMockToast({ id: 'toast-3', message: 'Third toast' }),
      ];
      const { getByText } = renderWithTheme(
        <ToastContainer toasts={toasts} onDismiss={mockOnDismiss} />
      );

      expect(getByText('First toast')).toBeTruthy();
      expect(getByText('Second toast')).toBeTruthy();
      expect(getByText('Third toast')).toBeTruthy();
    });
  });

  // ============================================================================
  // POSITIONING
  // ============================================================================

  describe('Positioning', () => {
    it('should group toasts by position', () => {
      const toasts = [
        createMockToast({ id: 'toast-1', message: 'Top toast 1', position: 'top' }),
        createMockToast({ id: 'toast-2', message: 'Bottom toast 1', position: 'bottom' }),
        createMockToast({ id: 'toast-3', message: 'Top toast 2', position: 'top' }),
      ];
      const { getByText } = renderWithTheme(
        <ToastContainer toasts={toasts} onDismiss={mockOnDismiss} />
      );

      expect(getByText('Top toast 1')).toBeTruthy();
      expect(getByText('Top toast 2')).toBeTruthy();
      expect(getByText('Bottom toast 1')).toBeTruthy();
    });

    it('should default position to top', () => {
      const toasts = [
        createMockToast({ id: 'toast-1', message: 'Default position', position: undefined }),
      ];
      const { getByText } = renderWithTheme(
        <ToastContainer toasts={toasts} onDismiss={mockOnDismiss} />
      );

      expect(getByText('Default position')).toBeTruthy();
    });
  });

  // ============================================================================
  // TOAST TYPES
  // ============================================================================

  describe('Toast Types', () => {
    it('should render different toast types', () => {
      const toasts = [
        createMockToast({ id: 'success', type: 'success', message: 'Success' }),
        createMockToast({ id: 'error', type: 'error', message: 'Error' }),
        createMockToast({ id: 'warning', type: 'warning', message: 'Warning' }),
        createMockToast({ id: 'info', type: 'info', message: 'Info' }),
      ];
      const { getByText } = renderWithTheme(
        <ToastContainer toasts={toasts} onDismiss={mockOnDismiss} />
      );

      expect(getByText('Success')).toBeTruthy();
      expect(getByText('Error')).toBeTruthy();
      expect(getByText('Warning')).toBeTruthy();
      expect(getByText('Info')).toBeTruthy();
      expect(getByText('✅')).toBeTruthy();
      expect(getByText('❌')).toBeTruthy();
      expect(getByText('⚠️')).toBeTruthy();
      expect(getByText('ℹ️')).toBeTruthy();
    });
  });

  // ============================================================================
  // INTERACTIONS
  // ============================================================================

  describe('Interactions', () => {
    it('should call onDismiss with correct id', async () => {
      const toasts = [
        createMockToast({ id: 'toast-1', message: 'First' }),
        createMockToast({ id: 'toast-2', message: 'Second' }),
      ];
      const { getByText } = renderWithTheme(
        <ToastContainer toasts={toasts} onDismiss={mockOnDismiss} />
      );

      fireEvent.press(getByText('First'));

      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalledWith('toast-1');
      });
    });
  });
});
