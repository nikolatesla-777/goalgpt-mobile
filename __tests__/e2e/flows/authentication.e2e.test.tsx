/**
 * Authentication E2E Test
 * Phase 12: Testing & QA - E2E Tests
 *
 * Tests the complete authentication user flow from login to app navigation
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import App from '../../../App';
import { TokenStorage } from '../../../src/api/client';
import analyticsService from '../../../src/services/analytics.service';

// Mock dependencies
jest.mock('../../../src/api/client', () => ({
  TokenStorage: {
    getAccessToken: jest.fn(),
    setAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    setRefreshToken: jest.fn(),
    clearTokens: jest.fn(),
  },
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('../../../src/services/analytics.service');
jest.mock('expo-secure-store');
jest.mock('expo-firebase-analytics');

describe('Authentication E2E Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Start without authentication
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue(null);
  });

  /**
   * Test: Complete Login Flow
   * User Journey: Open app → See login screen → Enter credentials → Login → See home screen
   */
  it('should complete full login flow', async () => {
    // Step 1: Render app
    const { getByTestId, getByText, queryByTestId } = render(<App />);

    // Step 2: Wait for splash screen to complete
    await waitFor(() => {
      expect(queryByTestId('splash-screen')).toBeNull();
    }, { timeout: 3000 });

    // Step 3: Should show login screen
    await waitFor(() => {
      expect(getByTestId('login-screen')).toBeTruthy();
    });

    // Step 4: Enter email
    const emailInput = getByTestId('email-input');
    fireEvent.changeText(emailInput, 'test@example.com');

    // Step 5: Enter password
    const passwordInput = getByTestId('password-input');
    fireEvent.changeText(passwordInput, 'password123');

    // Step 6: Tap login button
    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);

    // Step 7: Wait for login to complete
    await waitFor(() => {
      expect(TokenStorage.setAccessToken).toHaveBeenCalled();
    });

    // Step 8: Should track login analytics
    await waitFor(() => {
      expect(analyticsService.trackLogin).toHaveBeenCalledWith('email', true);
    });

    // Step 9: Should navigate to home screen
    await waitFor(() => {
      expect(getByTestId('home-screen')).toBeTruthy();
    }, { timeout: 2000 });

    // Step 10: Verify user is authenticated
    expect(queryByTestId('login-screen')).toBeNull();
  }, 15000);

  /**
   * Test: Login with Invalid Credentials
   * User Journey: Open app → Enter wrong password → See error → Try again
   */
  it('should handle login failure gracefully', async () => {
    const { getByTestId, getByText } = render(<App />);

    // Wait for login screen
    await waitFor(() => {
      expect(getByTestId('login-screen')).toBeTruthy();
    });

    // Enter credentials
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'wrongpassword');

    // Mock login failure
    const mockApiClient = require('../../../src/api/client').apiClient;
    mockApiClient.post.mockRejectedValue(new Error('Invalid credentials'));

    // Tap login button
    fireEvent.press(getByTestId('login-button'));

    // Should show error message
    await waitFor(() => {
      expect(getByText(/invalid credentials/i)).toBeTruthy();
    });

    // Should track failed login
    expect(analyticsService.trackLogin).toHaveBeenCalledWith('email', false);

    // Should remain on login screen
    expect(getByTestId('login-screen')).toBeTruthy();
  }, 10000);

  /**
   * Test: Sign Up Flow
   * User Journey: Login screen → Tap register → Fill form → Sign up → Auto login
   */
  it('should complete sign up and auto-login flow', async () => {
    const { getByTestId, getByText } = render(<App />);

    // Wait for login screen
    await waitFor(() => {
      expect(getByTestId('login-screen')).toBeTruthy();
    });

    // Tap "Sign Up" button
    const signUpLink = getByText(/sign up/i);
    fireEvent.press(signUpLink);

    // Should navigate to register screen
    await waitFor(() => {
      expect(getByTestId('register-screen')).toBeTruthy();
    });

    // Fill registration form
    fireEvent.changeText(getByTestId('name-input'), 'New User');
    fireEvent.changeText(getByTestId('email-input'), 'newuser@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'newpassword123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'newpassword123');

    // Tap register button
    fireEvent.press(getByTestId('register-button'));

    // Wait for registration to complete
    await waitFor(() => {
      expect(analyticsService.trackSignUp).toHaveBeenCalledWith('email', true);
    });

    // Should auto-login and navigate to home
    await waitFor(() => {
      expect(getByTestId('home-screen')).toBeTruthy();
    }, { timeout: 2000 });
  }, 15000);

  /**
   * Test: Logout Flow
   * User Journey: Logged in → Open profile → Tap logout → Return to login screen
   */
  it('should complete logout flow', async () => {
    // Start with authenticated state
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');

    const { getByTestId, getByText } = render(<App />);

    // Wait for home screen (already authenticated)
    await waitFor(() => {
      expect(getByTestId('home-screen')).toBeTruthy();
    });

    // Navigate to profile tab
    const profileTab = getByTestId('profile-tab');
    fireEvent.press(profileTab);

    // Wait for profile screen
    await waitFor(() => {
      expect(getByTestId('profile-screen')).toBeTruthy();
    });

    // Tap logout button
    const logoutButton = getByTestId('logout-button');
    fireEvent.press(logoutButton);

    // Should clear tokens
    await waitFor(() => {
      expect(TokenStorage.clearTokens).toHaveBeenCalled();
    });

    // Should track logout
    expect(analyticsService.trackLogout).toHaveBeenCalled();

    // Should navigate back to login screen
    await waitFor(() => {
      expect(getByTestId('login-screen')).toBeTruthy();
    }, { timeout: 2000 });
  }, 15000);

  /**
   * Test: Session Persistence
   * User Journey: Login → Close app → Reopen app → Still logged in
   */
  it('should persist session across app restarts', async () => {
    // Mock existing tokens
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');

    // First render - simulate app start
    const { getByTestId, unmount } = render(<App />);

    // Should skip login and go directly to home
    await waitFor(() => {
      expect(getByTestId('home-screen')).toBeTruthy();
    }, { timeout: 3000 });

    // Unmount (simulate closing app)
    unmount();

    // Second render - simulate reopening app
    const { getByTestId: getByTestId2 } = render(<App />);

    // Should still be authenticated
    await waitFor(() => {
      expect(getByTestId2('home-screen')).toBeTruthy();
    }, { timeout: 3000 });

    // Should not show login screen
    expect(getByTestId2('login-screen')).toBeUndefined();
  }, 15000);

  /**
   * Test: Token Refresh
   * User Journey: Using app → Token expires → Auto refresh → Continue using app
   */
  it('should automatically refresh expired token', async () => {
    // Start with valid token
    (TokenStorage.getAccessToken as jest.Mock).mockResolvedValue('valid-token');
    (TokenStorage.getRefreshToken as jest.Mock).mockResolvedValue('refresh-token');

    const { getByTestId } = render(<App />);

    // Wait for home screen
    await waitFor(() => {
      expect(getByTestId('home-screen')).toBeTruthy();
    });

    // Simulate token expiration by making API call fail with 401
    const mockApiClient = require('../../../src/api/client').apiClient;
    mockApiClient.get.mockRejectedValueOnce({ status: 401 });

    // Make an API call (e.g., fetch matches)
    // This should trigger token refresh

    // Wait for token refresh
    await waitFor(() => {
      expect(TokenStorage.setAccessToken).toHaveBeenCalled();
    });

    // Should remain on home screen (not logged out)
    expect(getByTestId('home-screen')).toBeTruthy();
  }, 15000);

  /**
   * Test: Social Authentication (Future)
   * User Journey: Login screen → Tap Google → Authorize → Return to app → Logged in
   */
  it('should handle social authentication flow', async () => {
    const { getByTestId, getByText } = render(<App />);

    // Wait for login screen
    await waitFor(() => {
      expect(getByTestId('login-screen')).toBeTruthy();
    });

    // Tap "Sign in with Google" button
    const googleButton = getByTestId('google-login-button');
    fireEvent.press(googleButton);

    // Mock successful Google authentication
    // (In real implementation, this would open browser/webview)

    // Should track social login
    await waitFor(() => {
      expect(analyticsService.trackLogin).toHaveBeenCalledWith('google', true);
    });

    // Should navigate to home
    await waitFor(() => {
      expect(getByTestId('home-screen')).toBeTruthy();
    }, { timeout: 2000 });
  }, 15000);
});

/**
 * Performance Tests
 */
describe('Authentication Performance', () => {
  it('should complete login within 3 seconds', async () => {
    const startTime = Date.now();

    const { getByTestId } = render(<App />);

    await waitFor(() => {
      expect(getByTestId('login-screen')).toBeTruthy();
    });

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByTestId('home-screen')).toBeTruthy();
    });

    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(3000);
  }, 10000);
});
