/**
 * Deep Linking Service
 *
 * Handles deep links from:
 * - Custom URL scheme (goalgpt://)
 * - Universal Links (https://goalgpt.com)
 * - App Links (https://goalgpt.com)
 *
 * Supports:
 * - Match detail: goalgpt://match/12345
 * - Bot detail: goalgpt://bot/1
 * - Team detail: goalgpt://team/456
 * - League detail: goalgpt://league/78
 * - Tab navigation: goalgpt://tab/predictions
 */

import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { addBreadcrumb } from '../config/sentry.config';
import { trackEvent } from './analytics.service';

// ============================================================================
// TYPES
// ============================================================================

export type DeepLinkType =
  | 'match'
  | 'bot'
  | 'team'
  | 'league'
  | 'tab'
  | 'profile'
  | 'store'
  | 'unknown';

export interface DeepLinkData {
  type: DeepLinkType;
  id?: string | number;
  tab?: string;
  params?: Record<string, any>;
}

export interface DeepLinkConfig {
  scheme: string;
  prefixes: string[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Deep link configuration
 */
export const DEEP_LINK_CONFIG: DeepLinkConfig = {
  scheme: 'goalgpt',
  prefixes: [
    'goalgpt://',
    'https://goalgpt.com',
    'https://www.goalgpt.com',
    'https://partnergoalgpt.com',
    'https://www.partnergoalgpt.com',
  ],
};

/**
 * URL configuration for Expo Linking
 */
export const LINKING_CONFIG = {
  prefixes: DEEP_LINK_CONFIG.prefixes,
  config: {
    screens: {
      // Auth Stack
      Splash: 'splash',
      Onboarding: 'onboarding',
      Login: 'login',
      Register: 'register',

      // Main Tabs
      MainTabs: {
        screens: {
          Home: 'home',
          LiveMatches: 'matches',
          Predictions: 'predictions',
          Store: 'store',
          Profile: 'profile',
        },
      },

      // Stack Screens
      MatchDetail: 'match/:matchId',
      BotDetail: 'bot/:botId',
      TeamDetail: 'team/:teamId',
      LeagueDetail: 'league/:leagueId',
    },
  },
};

// ============================================================================
// URL PARSING
// ============================================================================

/**
 * Parse deep link URL into structured data
 */
export function parseDeepLink(url: string): DeepLinkData | null {
  try {
    // Parse URL
    const parsed = Linking.parse(url);
    const { hostname, path, queryParams } = parsed;

    // Log parsed URL
    console.log('🔗 Parsing deep link:', {
      url,
      hostname,
      path,
      queryParams,
    });

    // Add breadcrumb
    addBreadcrumb('Deep link parsed', 'navigation', 'info', {
      url,
      path,
    });

    // Extract path segments
    const segments = path?.split('/').filter(Boolean) || [];

    if (segments.length === 0) {
      // Root URL - go to home
      return {
        type: 'tab',
        tab: 'Home',
      };
    }

    const [type, id] = segments;

    // Match detail: /match/:id
    if (type === 'match' && id) {
      return {
        type: 'match',
        id,
        params: queryParams,
      };
    }

    // Bot detail: /bot/:id
    if (type === 'bot' && id) {
      return {
        type: 'bot',
        id,
        params: queryParams,
      };
    }

    // Team detail: /team/:id
    if (type === 'team' && id) {
      return {
        type: 'team',
        id,
        params: queryParams,
      };
    }

    // League detail: /league/:id
    if (type === 'league' && id) {
      return {
        type: 'league',
        id,
        params: queryParams,
      };
    }

    // Tab navigation: /tab/:name or direct tab names
    if (type === 'tab' && id) {
      return {
        type: 'tab',
        tab: id,
        params: queryParams,
      };
    }

    // Direct tab names
    const tabNames = ['home', 'matches', 'predictions', 'store', 'profile'];
    if (tabNames.includes(type.toLowerCase())) {
      return {
        type: 'tab',
        tab: capitalizeFirstLetter(type),
        params: queryParams,
      };
    }

    // Unknown link
    console.warn('⚠️ Unknown deep link format:', url);
    return {
      type: 'unknown',
      params: { url },
    };
  } catch (error) {
    console.error('❌ Failed to parse deep link:', error);
    return null;
  }
}

/**
 * Build deep link URL
 */
export function buildDeepLink(data: DeepLinkData): string {
  const { type, id, tab, params } = data;

  let path = '';

  switch (type) {
    case 'match':
      path = `match/${id}`;
      break;
    case 'bot':
      path = `bot/${id}`;
      break;
    case 'team':
      path = `team/${id}`;
      break;
    case 'league':
      path = `league/${id}`;
      break;
    case 'tab':
      path = tab?.toLowerCase() || 'home';
      break;
    case 'profile':
      path = 'profile';
      break;
    case 'store':
      path = 'store';
      break;
    default:
      path = '';
  }

  // Build query string
  let queryString = '';
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params as any).toString();
    queryString = `?${query}`;
  }

  // Return custom scheme URL
  return `${DEEP_LINK_CONFIG.scheme}://${path}${queryString}`;
}

/**
 * Build universal link URL (HTTPS)
 */
export function buildUniversalLink(data: DeepLinkData): string {
  const deepLink = buildDeepLink(data);
  // Replace scheme with HTTPS domain
  return deepLink.replace(`${DEEP_LINK_CONFIG.scheme}://`, 'https://goalgpt.com/');
}

// ============================================================================
// LINK HANDLING
// ============================================================================

/**
 * Handle incoming deep link
 */
export function handleDeepLink(
  url: string,
  navigationRef: any,
  isAuthenticated: boolean
): boolean {
  try {
    // Parse link
    const linkData = parseDeepLink(url);

    if (!linkData) {
      console.warn('⚠️ Could not parse deep link:', url);
      return false;
    }

    // Track analytics
    trackEvent('deep_link_opened', {
      type: linkData.type,
      url,
      authenticated: isAuthenticated,
    });

    // Add breadcrumb
    addBreadcrumb('Deep link handled', 'navigation', 'info', {
      type: linkData.type,
      id: linkData.id,
    });

    // Navigate based on link type
    return navigateFromDeepLink(linkData, navigationRef, isAuthenticated);
  } catch (error) {
    console.error('❌ Failed to handle deep link:', error);
    return false;
  }
}

/**
 * Navigate based on parsed deep link data
 */
function navigateFromDeepLink(
  linkData: DeepLinkData,
  navigationRef: any,
  isAuthenticated: boolean
): boolean {
  if (!navigationRef) {
    console.warn('⚠️ Navigation ref not available');
    return false;
  }

  // If not authenticated and link requires auth, go to login
  const requiresAuth = ['match', 'bot', 'team', 'league', 'profile', 'store'];
  if (!isAuthenticated && requiresAuth.includes(linkData.type)) {
    navigationRef.navigate('Login');
    // Future enhancement: Store deep link and handle after successful login
    // This allows users to continue to the intended destination after auth
    return true;
  }

  try {
    switch (linkData.type) {
      case 'match':
        if (linkData.id) {
          navigationRef.navigate('MatchDetail', { matchId: linkData.id });
          return true;
        }
        break;

      case 'bot':
        if (linkData.id) {
          navigationRef.navigate('BotDetail', { botId: Number(linkData.id) });
          return true;
        }
        break;

      case 'team':
        if (linkData.id) {
          navigationRef.navigate('TeamDetail', { teamId: linkData.id });
          return true;
        }
        break;

      case 'league':
        if (linkData.id) {
          navigationRef.navigate('LeagueDetail', { leagueId: linkData.id });
          return true;
        }
        break;

      case 'tab':
        if (linkData.tab) {
          const tabName = capitalizeFirstLetter(linkData.tab);
          navigationRef.navigate('MainTabs', { screen: tabName });
          return true;
        }
        break;

      case 'profile':
        navigationRef.navigate('MainTabs', { screen: 'Profile' });
        return true;

      case 'store':
        navigationRef.navigate('MainTabs', { screen: 'Store' });
        return true;

      default:
        // Unknown type - go to home
        navigationRef.navigate('MainTabs', { screen: 'Home' });
        return true;
    }
  } catch (error) {
    console.error('❌ Failed to navigate from deep link:', error);
    return false;
  }

  return false;
}

// ============================================================================
// LISTENERS
// ============================================================================

/**
 * Add deep link listener
 */
export function addDeepLinkListener(
  handler: (url: string) => void
): Linking.URLListener {
  const listener = ({ url }: { url: string }) => {
    console.log('🔗 Deep link received:', url);
    handler(url);
  };

  // Add listener
  const subscription = Linking.addEventListener('url', listener);

  return subscription;
}

/**
 * Get initial deep link URL (if app was opened from link)
 */
export async function getInitialDeepLink(): Promise<string | null> {
  try {
    const url = await Linking.getInitialURL();

    if (url) {
      console.log('🔗 Initial deep link:', url);

      // Track analytics
      trackEvent('deep_link_initial', { url });

      // Add breadcrumb
      addBreadcrumb('Initial deep link', 'navigation', 'info', { url });
    }

    return url;
  } catch (error) {
    console.error('❌ Failed to get initial deep link:', error);
    return null;
  }
}

/**
 * Can open URL (check if URL can be handled)
 */
export async function canOpenURL(url: string): Promise<boolean> {
  try {
    const supported = await Linking.canOpenURL(url);
    return supported;
  } catch (error) {
    console.error('❌ Failed to check if URL can be opened:', error);
    return false;
  }
}

/**
 * Open URL in browser or external app
 */
export async function openURL(url: string): Promise<boolean> {
  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);

      // Track analytics
      trackEvent('external_url_opened', { url });

      return true;
    } else {
      console.warn(`⚠️ Cannot open URL: ${url}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to open URL:', error);
    return false;
  }
}

// ============================================================================
// SHARE LINKS
// ============================================================================

/**
 * Create shareable match link
 */
export function createMatchShareLink(matchId: string | number): string {
  return buildUniversalLink({
    type: 'match',
    id: matchId,
  });
}

/**
 * Create shareable bot link
 */
export function createBotShareLink(botId: number): string {
  return buildUniversalLink({
    type: 'bot',
    id: botId,
  });
}

/**
 * Create shareable team link
 */
export function createTeamShareLink(teamId: string | number): string {
  return buildUniversalLink({
    type: 'team',
    id: teamId,
  });
}

/**
 * Create shareable league link
 */
export function createLeagueShareLink(leagueId: string | number): string {
  return buildUniversalLink({
    type: 'league',
    id: leagueId,
  });
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Capitalize first letter of string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Check if URL is deep link
 */
export function isDeepLink(url: string): boolean {
  return DEEP_LINK_CONFIG.prefixes.some(prefix => url.startsWith(prefix));
}

/**
 * Get deep link scheme
 */
export function getDeepLinkScheme(): string {
  return DEEP_LINK_CONFIG.scheme;
}

/**
 * Get deep link prefixes
 */
export function getDeepLinkPrefixes(): string[] {
  return DEEP_LINK_CONFIG.prefixes;
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  // Configuration
  DEEP_LINK_CONFIG,
  LINKING_CONFIG,

  // Parsing
  parseDeepLink,
  buildDeepLink,
  buildUniversalLink,

  // Handling
  handleDeepLink,

  // Listeners
  addDeepLinkListener,
  getInitialDeepLink,

  // URL utilities
  canOpenURL,
  openURL,
  isDeepLink,

  // Share links
  createMatchShareLink,
  createBotShareLink,
  createTeamShareLink,
  createLeagueShareLink,

  // Getters
  getDeepLinkScheme,
  getDeepLinkPrefixes,
};
