/**
 * Error Handler Tests
 * Tests for standardized error handling and user-friendly messages
 */

import {
  parseError,
  handleError,
  logError,
  isNetworkError,
  isAuthError,
  isValidationError,
  isRetryableError,
  AppError,
} from '../../src/utils/errorHandler';
import { AxiosError } from 'axios';

// Mock Sentry
jest.mock('../../src/config/sentry.config', () => ({
  captureError: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

// ============================================================================
// SETUP
// ============================================================================

describe('Error Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // PARSE ERROR
  // ============================================================================

  describe('parseError()', () => {
    it('should parse Axios network error (no response)', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Network Error',
        code: 'ERR_NETWORK',
        response: undefined,
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.type).toBe('network');
      expect(result.message).toBe('İnternet bağlantınızı kontrol edin ve tekrar deneyin');
    });

    it('should parse Axios timeout error', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'timeout of 5000ms exceeded',
        code: 'ECONNABORTED',
        response: undefined,
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.type).toBe('network');
      expect(result.message).toBe('İstek zaman aşımına uğradı, lütfen tekrar deneyin');
    });

    it('should parse 400 Bad Request', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Invalid parameters' },
        },
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.type).toBe('validation');
      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('Invalid parameters');
    });

    it('should parse 401 Unauthorized', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {},
        },
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.type).toBe('auth');
      expect(result.statusCode).toBe(401);
      expect(result.message).toBe('Oturum süreniz doldu, lütfen tekrar giriş yapın');
    });

    it('should parse 403 Forbidden', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: {},
        },
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.type).toBe('auth');
      expect(result.statusCode).toBe(403);
      expect(result.message).toBe('Bu işlemi yapmaya yetkiniz yok');
    });

    it('should parse 404 Not Found', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {},
        },
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.type).toBe('notFound');
      expect(result.statusCode).toBe(404);
      expect(result.message).toBe('Aradığınız içerik bulunamadı');
    });

    it('should parse 422 Validation Error', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 422,
          data: { message: 'Validation failed' },
        },
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.type).toBe('validation');
      expect(result.statusCode).toBe(422);
      expect(result.message).toBe('Validation failed');
    });

    it('should parse 500 Server Error', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
        },
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.type).toBe('server');
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe('Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin');
    });

    it('should parse 502 Bad Gateway', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 502,
          data: {},
        },
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.type).toBe('server');
      expect(result.statusCode).toBe(502);
    });

    it('should extract error message from response data', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Custom error message' },
        },
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.message).toBe('Custom error message');
    });

    it('should extract error message from nested error object', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            error: {
              message: 'Nested error message',
            },
          },
        },
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.message).toBe('Nested error message');
    });

    it('should extract first error from errors array', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 422,
          data: {
            errors: [
              { message: 'First validation error' },
              { message: 'Second validation error' },
            ],
          },
        },
      } as AxiosError;

      const result = parseError(axiosError);

      expect(result.message).toBe('First validation error');
    });

    it('should parse Error objects', () => {
      const error = new Error('Test error message');

      const result = parseError(error);

      expect(result.type).toBe('unknown');
      expect(result.message).toBe('Test error message');
      expect(result.originalError).toBe(error);
    });

    it('should parse string errors', () => {
      const error = 'String error message';

      const result = parseError(error);

      expect(result.type).toBe('unknown');
      expect(result.message).toBe('String error message');
    });

    it('should parse unknown error types', () => {
      const error = { random: 'object' };

      const result = parseError(error);

      expect(result.type).toBe('unknown');
      expect(result.message).toBe('Beklenmeyen bir hata oluştu');
      expect(result.originalError).toBe(error);
    });
  });

  // ============================================================================
  // HANDLE ERROR
  // ============================================================================

  describe('handleError()', () => {
    it('should return user-friendly error message', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {},
        },
      } as AxiosError;

      const message = handleError(axiosError);

      expect(message).toBe('Aradığınız içerik bulunamadı');
    });

    it('should return custom error message if provided', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Custom validation error' },
        },
      } as AxiosError;

      const message = handleError(axiosError);

      expect(message).toBe('Custom validation error');
    });

    it('should accept context parameter', () => {
      const error = new Error('Test error');

      const message = handleError(error, 'fetchMatches');

      expect(message).toBe('Test error');
      // Context is used in logError (tested separately)
    });
  });

  // ============================================================================
  // ERROR TYPE CHECKS
  // ============================================================================

  describe('isNetworkError()', () => {
    it('should return true for network errors', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Network Error',
        response: undefined,
      } as AxiosError;

      expect(isNetworkError(axiosError)).toBe(true);
    });

    it('should return false for non-network errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {},
        },
      } as AxiosError;

      expect(isNetworkError(axiosError)).toBe(false);
    });
  });

  describe('isAuthError()', () => {
    it('should return true for 401 errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {},
        },
      } as AxiosError;

      expect(isAuthError(axiosError)).toBe(true);
    });

    it('should return true for 403 errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: {},
        },
      } as AxiosError;

      expect(isAuthError(axiosError)).toBe(true);
    });

    it('should return false for non-auth errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
        },
      } as AxiosError;

      expect(isAuthError(axiosError)).toBe(false);
    });
  });

  describe('isValidationError()', () => {
    it('should return true for 400 errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {},
        },
      } as AxiosError;

      expect(isValidationError(axiosError)).toBe(true);
    });

    it('should return true for 422 errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 422,
          data: {},
        },
      } as AxiosError;

      expect(isValidationError(axiosError)).toBe(true);
    });

    it('should return false for non-validation errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
        },
      } as AxiosError;

      expect(isValidationError(axiosError)).toBe(false);
    });
  });

  describe('isRetryableError()', () => {
    it('should return true for network errors', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Network Error',
        response: undefined,
      } as AxiosError;

      expect(isRetryableError(axiosError)).toBe(true);
    });

    it('should return true for 502 errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 502,
          data: {},
        },
      } as AxiosError;

      expect(isRetryableError(axiosError)).toBe(true);
    });

    it('should return true for 503 errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 503,
          data: {},
        },
      } as AxiosError;

      expect(isRetryableError(axiosError)).toBe(true);
    });

    it('should return true for 504 errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 504,
          data: {},
        },
      } as AxiosError;

      expect(isRetryableError(axiosError)).toBe(true);
    });

    it('should return false for 500 errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
        },
      } as AxiosError;

      expect(isRetryableError(axiosError)).toBe(false);
    });

    it('should return false for 4xx errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {},
        },
      } as AxiosError;

      expect(isRetryableError(axiosError)).toBe(false);
    });
  });

  // ============================================================================
  // LOG ERROR
  // ============================================================================

  describe('logError()', () => {
    it('should log error to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const error: AppError = {
        type: 'server',
        message: 'Server error',
        statusCode: 500,
      };

      logError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        '🔴 Error:',
        expect.objectContaining({
          type: 'server',
          message: 'Server error',
          statusCode: 500,
        })
      );

      consoleSpy.mockRestore();
    });

    it('should log error with context', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const error: AppError = {
        type: 'network',
        message: 'Network error',
      };

      logError(error, 'fetchMatches');

      expect(consoleSpy).toHaveBeenCalledWith(
        '🔴 Error in fetchMatches:',
        expect.any(Object)
      );

      consoleSpy.mockRestore();
    });
  });
});
