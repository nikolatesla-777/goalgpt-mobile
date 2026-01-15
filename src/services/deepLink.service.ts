/**
 * Deep Link Service
 * Handles incoming deep links and attribution tracking
 */

import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { parseDeepLink } from '../config/linking.config';
import { isDev } from '../config/env';

// ============================================================================
// TYPES
// ============================================================================

interface DeepLinkEvent {
  url: string;
  screen?: string;
  params?: Record<string, string>;
  timestamp: number;
  source?: 'push_notification' | 'share' | 'external' | 'direct';
}

interface DeepLinkAnalytics {
  totalClicks: number;
  screens: Record<string, number>;
  sources: Record<string, number>;
  lastClick?: DeepLinkEvent;
}

// ============================================================================
// DEEP LINK SERVICE
// ============================================================================

class DeepLinkService {
  private listeners: Array<(event: DeepLinkEvent) => void> = [];
  private analytics: DeepLinkAnalytics = {
    totalClicks: 0,
    screens: {},
    sources: {},
  };

  /**
   * Initialize deep link handling
   */
  async initialize(): Promise<void> {
    try {
      // Handle initial URL (app opened from deep link)
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        this.handleDeepLink(initialUrl, 'direct');
      }

      // Listen for incoming deep links while app is running
      Linking.addEventListener('url', (event) => {
        this.handleDeepLink(event.url, 'external');
      });

      if (isDev) {
        console.log('🔗 Deep link service initialized');
      }
    } catch (error) {
      console.error('Failed to initialize deep link service:', error);
    }
  }

  /**
   * Handle incoming deep link
   */
  private handleDeepLink(url: string, source: DeepLinkEvent['source'] = 'external'): void {
    try {
      if (isDev) {
        console.log('🔗 Deep link received:', url);
      }

      // Parse the deep link
      const parsed = parseDeepLink(url);

      if (!parsed) {
        console.warn('Failed to parse deep link:', url);
        return;
      }

      // Create event
      const event: DeepLinkEvent = {
        url,
        screen: parsed.screen,
        params: parsed.params,
        timestamp: Date.now(),
        source,
      };

      // Track analytics
      this.trackAnalytics(event);

      // Notify listeners
      this.notifyListeners(event);

      // Navigate to screen
      this.navigateToScreen(parsed.screen, parsed.params);
    } catch (error) {
      console.error('Failed to handle deep link:', error);
    }
  }

  /**
   * Navigate to screen based on deep link
   */
  private navigateToScreen(screen: string, params?: Record<string, string>): void {
    try {
      // Build navigation path
      let path = screen;

      // Replace route params
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          path = path.replace(`[${key}]`, value);
        });

        // Add query params (for tab navigation, etc.)
        const queryParams = Object.entries(params)
          .filter(([key]) => !path.includes(key))
          .map(([key, value]) => `${key}=${value}`)
          .join('&');

        if (queryParams) {
          path += `?${queryParams}`;
        }
      }

      // Navigate using Expo Router
      router.push(path as any);

      if (isDev) {
        console.log('🔗 Navigated to:', path);
      }
    } catch (error) {
      console.error('Failed to navigate from deep link:', error);
    }
  }

  /**
   * Track deep link analytics
   */
  private trackAnalytics(event: DeepLinkEvent): void {
    this.analytics.totalClicks++;
    this.analytics.lastClick = event;

    if (event.screen) {
      this.analytics.screens[event.screen] = (this.analytics.screens[event.screen] || 0) + 1;
    }

    if (event.source) {
      this.analytics.sources[event.source] = (this.analytics.sources[event.source] || 0) + 1;
    }

    if (isDev) {
      console.log('📊 Deep link analytics updated:', this.analytics);
    }
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(event: DeepLinkEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Deep link listener error:', error);
      }
    });
  }

  /**
   * Add deep link listener
   */
  addListener(listener: (event: DeepLinkEvent) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get analytics data
   */
  getAnalytics(): DeepLinkAnalytics {
    return { ...this.analytics };
  }

  /**
   * Reset analytics
   */
  resetAnalytics(): void {
    this.analytics = {
      totalClicks: 0,
      screens: {},
      sources: {},
    };
  }

  /**
   * Test deep link (development only)
   */
  testDeepLink(url: string): void {
    if (!isDev) {
      console.warn('testDeepLink is only available in development');
      return;
    }

    this.handleDeepLink(url, 'direct');
  }

  /**
   * Open external URL
   */
  async openURL(url: string): Promise<void> {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open URL:', url);
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  }

  /**
   * Parse URL from clipboard
   */
  async parseClipboardURL(): Promise<string | null> {
    try {
      const url = await Linking.getInitialURL();
      return url;
    } catch (error) {
      console.error('Failed to get clipboard URL:', error);
      return null;
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const deepLinkService = new DeepLinkService();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if URL is a deep link
 */
export function isDeepLink(url: string): boolean {
  return (
    url.startsWith('goalgpt://') ||
    url.startsWith('https://goalgpt.com') ||
    url.startsWith('https://www.goalgpt.com')
  );
}

/**
 * Extract deep link parameters
 */
export function extractDeepLinkParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};

    // Get query parameters
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  } catch (error) {
    return {};
  }
}

/**
 * Build deep link URL with UTM parameters
 */
export function buildDeepLinkWithUTM(
  url: string,
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  }
): string {
  try {
    const urlObj = new URL(url);

    if (utm.source) urlObj.searchParams.set('utm_source', utm.source);
    if (utm.medium) urlObj.searchParams.set('utm_medium', utm.medium);
    if (utm.campaign) urlObj.searchParams.set('utm_campaign', utm.campaign);
    if (utm.content) urlObj.searchParams.set('utm_content', utm.content);

    return urlObj.toString();
  } catch (error) {
    return url;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default deepLinkService;
