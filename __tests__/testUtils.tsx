/**
 * Test Utilities
 * Reusable helpers for testing React components and hooks
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ============================================================================
// PROVIDERS
// ============================================================================

/**
 * Create a test QueryClient with sensible defaults
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry in tests
        gcTime: Infinity, // Don't garbage collect
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * All providers wrapper for testing
 */
export function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/**
 * Custom render function with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

/**
 * Generate mock match data
 */
export function createMockMatch(overrides = {}) {
  return {
    id: 1,
    home_team_id: 1,
    away_team_id: 2,
    home_team_name: 'Team A',
    away_team_name: 'Team B',
    home_team_logo: 'https://example.com/team-a.png',
    away_team_logo: 'https://example.com/team-b.png',
    home_scores: 0,
    away_scores: 0,
    status_id: 1,
    match_time: '2026-01-13T20:00:00Z',
    competition_name: 'Premier League',
    competition_logo: 'https://example.com/league.png',
    ...overrides,
  };
}

/**
 * Generate mock user data
 */
export function createMockUser(overrides = {}) {
  return {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    avatar: 'https://example.com/avatar.png',
    has_completed_onboarding: true,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * Generate mock XP data
 */
export function createMockXP(overrides = {}) {
  return {
    user_id: 'user-123',
    total_xp: 1000,
    level: 5,
    xp_to_next_level: 200,
    daily_streak: 7,
    last_login: '2026-01-13T00:00:00Z',
    ...overrides,
  };
}

/**
 * Generate mock credits data
 */
export function createMockCredits(overrides = {}) {
  return {
    user_id: 'user-123',
    balance: 500,
    lifetime_earned: 1000,
    lifetime_spent: 500,
    ...overrides,
  };
}

/**
 * Generate mock prediction data
 */
export function createMockPrediction(overrides = {}) {
  return {
    id: 1,
    match_id: 1,
    bot_name: 'AI Bot X',
    prediction_type: 'winner',
    prediction_value: 'home',
    confidence: 85,
    reasoning: 'Strong home form',
    created_at: '2026-01-13T00:00:00Z',
    ...overrides,
  };
}

// ============================================================================
// ASYNC UTILITIES
// ============================================================================

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  callback: () => boolean | Promise<boolean>,
  timeout = 3000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = await callback();
      if (result) return;
    } catch (error) {
      // Continue waiting
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error('Timeout waiting for condition');
}

/**
 * Wait for next tick
 */
export function waitForNextUpdate(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

// ============================================================================
// MOCK IMPLEMENTATIONS
// ============================================================================

/**
 * Mock AsyncStorage implementation
 */
export const mockAsyncStorage: {
  store: Map<string, string>;
  setItem: jest.Mock;
  getItem: jest.Mock;
  removeItem: jest.Mock;
  clear: jest.Mock;
  getAllKeys: jest.Mock;
} = {
  store: new Map<string, string>(),

  setItem: jest.fn(async (key: string, value: string): Promise<void> => {
    mockAsyncStorage.store.set(key, value);
  }),

  getItem: jest.fn(async (key: string): Promise<string | null> => {
    return mockAsyncStorage.store.get(key) || null;
  }),

  removeItem: jest.fn(async (key: string): Promise<void> => {
    mockAsyncStorage.store.delete(key);
  }),

  clear: jest.fn(async (): Promise<void> => {
    mockAsyncStorage.store.clear();
  }),

  getAllKeys: jest.fn(async (): Promise<string[]> => {
    return Array.from(mockAsyncStorage.store.keys());
  }),
};

/**
 * Mock SecureStore implementation
 */
export const mockSecureStore: {
  store: Map<string, string>;
  setItemAsync: jest.Mock;
  getItemAsync: jest.Mock;
  deleteItemAsync: jest.Mock;
} = {
  store: new Map<string, string>(),

  setItemAsync: jest.fn(async (key: string, value: string): Promise<void> => {
    mockSecureStore.store.set(key, value);
  }),

  getItemAsync: jest.fn(async (key: string): Promise<string | null> => {
    return mockSecureStore.store.get(key) || null;
  }),

  deleteItemAsync: jest.fn(async (key: string): Promise<void> => {
    mockSecureStore.store.delete(key);
  }),
};

/**
 * Mock API client
 */
export const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

/**
 * Mock WebSocket
 */
export class MockWebSocket {
  public url: string;
  public readyState: number = 0;
  public onopen: ((event: any) => void) | null = null;
  public onmessage: ((event: any) => void) | null = null;
  public onerror: ((event: any) => void) | null = null;
  public onclose: ((event: any) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    this.readyState = 1; // OPEN
    setTimeout(() => {
      if (this.onopen) {
        this.onopen({ type: 'open' });
      }
    }, 0);
  }

  send(data: string): void {
    // Mock send
  }

  close(): void {
    this.readyState = 3; // CLOSED
    if (this.onclose) {
      this.onclose({ type: 'close' });
    }
  }

  simulateMessage(data: any): void {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }

  simulateError(error: any): void {
    if (this.onerror) {
      this.onerror({ error });
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export everything from React Testing Library
export * from '@testing-library/react-native';

// Export custom render as default
export { renderWithProviders as render };
