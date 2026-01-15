/**
 * Error Handler Utility
 * Standardized error handling and user-friendly error messages
 * Handles API errors, network errors, and other common error types
 */

import { AxiosError } from 'axios';
import { captureError, addBreadcrumb } from '../config/sentry.config';

// ============================================================================
// TYPES
// ============================================================================

export interface AppError {
  type: 'network' | 'server' | 'validation' | 'auth' | 'notFound' | 'unknown';
  message: string;
  statusCode?: number;
  originalError?: any;
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'İnternet bağlantınızı kontrol edin ve tekrar deneyin',
  TIMEOUT_ERROR: 'İstek zaman aşımına uğradı, lütfen tekrar deneyin',

  // Server errors
  SERVER_ERROR: 'Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin',
  BAD_REQUEST: 'Geçersiz istek gönderildi',

  // Auth errors
  UNAUTHORIZED: 'Oturum süreniz doldu, lütfen tekrar giriş yapın',
  FORBIDDEN: 'Bu işlemi yapmaya yetkiniz yok',

  // Not found
  NOT_FOUND: 'Aradığınız içerik bulunamadı',

  // Validation
  VALIDATION_ERROR: 'Lütfen girdiğiniz bilgileri kontrol edin',

  // Unknown
  UNKNOWN_ERROR: 'Beklenmeyen bir hata oluştu',
};

// ============================================================================
// ERROR PARSER
// ============================================================================

/**
 * Parse an error into a standardized AppError
 */
export const parseError = (error: any): AppError => {
  // Handle AxiosError (API errors)
  if (isAxiosError(error)) {
    return parseAxiosError(error);
  }

  // Handle Error objects
  if (error instanceof Error) {
    return {
      type: 'unknown',
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      originalError: error,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      type: 'unknown',
      message: error,
      originalError: error,
    };
  }

  // Handle unknown error types
  return {
    type: 'unknown',
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    originalError: error,
  };
};

/**
 * Parse Axios errors (API errors)
 */
const parseAxiosError = (error: AxiosError): AppError => {
  // Network error (no response)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        type: 'network',
        message: ERROR_MESSAGES.TIMEOUT_ERROR,
        originalError: error,
      };
    }

    return {
      type: 'network',
      message: ERROR_MESSAGES.NETWORK_ERROR,
      originalError: error,
    };
  }

  const { status, data } = error.response;

  // Extract error message from API response
  const apiMessage = extractApiErrorMessage(data);

  // Handle specific HTTP status codes
  switch (status) {
    case 400:
      return {
        type: 'validation',
        message: apiMessage || ERROR_MESSAGES.BAD_REQUEST,
        statusCode: status,
        originalError: error,
      };

    case 401:
      return {
        type: 'auth',
        message: apiMessage || ERROR_MESSAGES.UNAUTHORIZED,
        statusCode: status,
        originalError: error,
      };

    case 403:
      return {
        type: 'auth',
        message: apiMessage || ERROR_MESSAGES.FORBIDDEN,
        statusCode: status,
        originalError: error,
      };

    case 404:
      return {
        type: 'notFound',
        message: apiMessage || ERROR_MESSAGES.NOT_FOUND,
        statusCode: status,
        originalError: error,
      };

    case 422:
      return {
        type: 'validation',
        message: apiMessage || ERROR_MESSAGES.VALIDATION_ERROR,
        statusCode: status,
        originalError: error,
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: 'server',
        message: apiMessage || ERROR_MESSAGES.SERVER_ERROR,
        statusCode: status,
        originalError: error,
      };

    default:
      return {
        type: 'unknown',
        message: apiMessage || ERROR_MESSAGES.UNKNOWN_ERROR,
        statusCode: status,
        originalError: error,
      };
  }
};

/**
 * Extract error message from API response
 */
const extractApiErrorMessage = (data: any): string | null => {
  if (!data) return null;

  // Common API error message patterns
  if (typeof data === 'string') return data;
  if (data.message) return data.message;
  if (data.error) {
    if (typeof data.error === 'string') return data.error;
    if (data.error.message) return data.error.message;
  }
  if (data.errors) {
    // Handle validation errors array
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      if (typeof firstError === 'string') return firstError;
      if (firstError.message) return firstError.message;
    }
  }

  return null;
};

/**
 * Check if error is an AxiosError
 */
const isAxiosError = (error: any): error is AxiosError => {
  return error && error.isAxiosError === true;
};

// ============================================================================
// ERROR LOGGING
// ============================================================================

/**
 * Log error to console and analytics service
 */
export const logError = (error: AppError, context?: string): void => {
  console.error(`🔴 Error${context ? ` in ${context}` : ''}:`, {
    type: error.type,
    message: error.message,
    statusCode: error.statusCode,
  });

  if (__DEV__) {
    console.error('🔴 Original Error:', error.originalError);
  }

  // Send to Sentry error tracking service
  try {
    // Add breadcrumb for error context
    addBreadcrumb(
      `Error occurred${context ? ` in ${context}` : ''}`,
      'error',
      'error',
      {
        errorType: error.type,
        statusCode: error.statusCode,
        message: error.message,
      }
    );

    // Only capture certain error types in Sentry
    // Skip network errors and 4xx client errors (not bugs)
    const shouldCapture =
      error.type === 'server' || // 5xx errors (backend issues)
      error.type === 'unknown' || // Unexpected errors
      (error.type === 'auth' && error.statusCode === 401); // Auth failures

    if (shouldCapture && error.originalError) {
      captureError(
        error.originalError instanceof Error
          ? error.originalError
          : new Error(error.message),
        {
          errorType: error.type,
          statusCode: error.statusCode,
          context: context || 'unknown',
          userMessage: error.message,
        }
      );
    }
  } catch (sentryError) {
    // Fallback if Sentry fails
    console.error('❌ Failed to log error to Sentry:', sentryError);
  }
};

// ============================================================================
// ERROR HANDLERS
// ============================================================================

/**
 * Handle error and return user-friendly message
 */
export const handleError = (error: any, context?: string): string => {
  const appError = parseError(error);
  logError(appError, context);
  return appError.message;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  const appError = parseError(error);
  return appError.type === 'network';
};

/**
 * Check if error is an auth error
 */
export const isAuthError = (error: any): boolean => {
  const appError = parseError(error);
  return appError.type === 'auth';
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: any): boolean => {
  const appError = parseError(error);
  return appError.type === 'validation';
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: any): boolean => {
  const appError = parseError(error);

  // Retry network errors and some server errors
  if (appError.type === 'network') return true;
  if (appError.type === 'server' && appError.statusCode) {
    // Retry 502, 503, 504 (temporary server issues)
    return [502, 503, 504].includes(appError.statusCode);
  }

  return false;
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  parseError,
  handleError,
  logError,
  isNetworkError,
  isAuthError,
  isValidationError,
  isRetryableError,
};
