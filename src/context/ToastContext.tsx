/**
 * Toast Context
 * Global toast notification system
 * Provides toast state and show/hide methods
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer, ToastData, ToastType, ToastPosition } from '../components/feedback/Toast';

// ============================================================================
// TYPES
// ============================================================================

interface ShowToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
}

interface ToastContextValue {
  toasts: ToastData[];
  showToast: (options: ShowToastOptions) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface ToastProviderProps {
  children: ReactNode;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, maxToasts = 3 }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // ============================================================================
  // TOAST MANAGEMENT
  // ============================================================================

  const showToast = useCallback(
    (options: ShowToastOptions) => {
      const { message, type = 'info', duration = 3000, position = 'top' } = options;

      const id = `toast-${Date.now()}-${Math.random()}`;

      const newToast: ToastData = {
        id,
        message,
        type,
        duration,
        position,
      };

      setToasts((prev) => {
        // Limit number of toasts
        const updatedToasts = [...prev, newToast];
        if (updatedToasts.length > maxToasts) {
          // Remove oldest toast
          return updatedToasts.slice(-maxToasts);
        }
        return updatedToasts;
      });
    },
    [maxToasts]
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // ============================================================================
  // CONVENIENCE METHODS
  // ============================================================================

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: 'success', duration });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: 'error', duration });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: 'warning', duration });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: 'info', duration });
    },
    [showToast]
  );

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: ToastContextValue = {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
    hideAllToasts,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * useToast Hook
 * Access toast functions from any component
 *
 * @example
 * const toast = useToast();
 * toast.showSuccess('Profile updated!');
 * toast.showError('Failed to save');
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};

// ============================================================================
// EXPORT
// ============================================================================

export default ToastContext;
