/**
 * Deep Linking Configuration for Expo Router
 * Handles navigation to specific screens from external links
 */

import { LinkingOptions } from '@react-navigation/native';

/**
 * Deep link URL patterns
 *
 * Custom Scheme:
 * - goalgpt://match/123
 * - goalgpt://team/456
 * - goalgpt://competition/789
 * - goalgpt://player/101
 * - goalgpt://ai-bots
 * - goalgpt://profile
 *
 * Universal/App Links:
 * - https://goalgpt.com/match/123
 * - https://goalgpt.com/team/456
 * - https://goalgpt.com/competition/789
 * - https://goalgpt.com/player/101
 */

export const linkingConfig: LinkingOptions<any> = {
  prefixes: [
    'goalgpt://', // Custom scheme
    'https://goalgpt.com', // Universal link (iOS)
    'https://www.goalgpt.com', // Universal link with www
  ],
  config: {
    screens: {
      // Tab screens
      '(tabs)': {
        screens: {
          index: '', // Home/Matches
          'ai-bots': 'ai-bots',
          profile: 'profile',
        },
      },

      // Match detail screen with nested tabs
      'match/[id]': {
        path: 'match/:id',
        parse: {
          id: (id: string) => id,
        },
        screens: {
          stats: 'stats',
          events: 'events',
          h2h: 'h2h',
          standings: 'standings',
          lineup: 'lineup',
          trend: 'trend',
          ai: 'ai',
        },
      },

      // Team detail screen with nested tabs
      'team/[id]': {
        path: 'team/:id',
        parse: {
          id: (id: string) => id,
        },
        screens: {
          overview: 'overview',
          fixtures: 'fixtures',
          standings: 'standings',
          players: 'players',
        },
      },

      // Competition detail screen with nested tabs
      'competition/[id]': {
        path: 'competition/:id',
        parse: {
          id: (id: string) => id,
        },
        screens: {
          overview: 'overview',
          fixtures: 'fixtures',
          standings: 'standings',
        },
      },

      // Player detail screen
      'player/[id]': {
        path: 'player/:id',
        parse: {
          id: (id: string) => id,
        },
      },

      // AI Bot detail screen
      'ai-bot/[name]': {
        path: 'ai-bot/:name',
        parse: {
          name: (name: string) => decodeURIComponent(name),
        },
      },

      // Auth screens
      'auth/login': 'auth/login',
      'auth/register': 'auth/register',
      'auth/forgot-password': 'auth/forgot-password',

      // Onboarding
      onboarding: 'onboarding',

      // 404 fallback
      '+not-found': '*',
    },
  },
};

/**
 * Parse deep link URL and extract route information
 */
export function parseDeepLink(url: string): {
  screen: string;
  params?: Record<string, string>;
} | null {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.replace(/^\//, ''); // Remove leading slash
    const segments = path.split('/').filter(Boolean);

    if (segments.length === 0) {
      return { screen: '(tabs)' };
    }

    const [resource, id, tab] = segments;

    switch (resource) {
      case 'match':
        if (id) {
          return {
            screen: 'match/[id]',
            params: { id, tab: tab || 'stats' },
          };
        }
        break;

      case 'team':
        if (id) {
          return {
            screen: 'team/[id]',
            params: { id, tab: tab || 'overview' },
          };
        }
        break;

      case 'competition':
        if (id) {
          return {
            screen: 'competition/[id]',
            params: { id, tab: tab || 'overview' },
          };
        }
        break;

      case 'player':
        if (id) {
          return {
            screen: 'player/[id]',
            params: { id },
          };
        }
        break;

      case 'ai-bot':
        if (id) {
          return {
            screen: 'ai-bot/[name]',
            params: { name: id },
          };
        }
        break;

      case 'ai-bots':
        return { screen: '(tabs)/ai-bots' };

      case 'profile':
        return { screen: '(tabs)/profile' };

      case 'onboarding':
        return { screen: 'onboarding' };

      default:
        return null;
    }

    return null;
  } catch (error) {
    console.error('Failed to parse deep link:', error);
    return null;
  }
}

/**
 * Generate deep link URL for a specific screen
 */
export function generateDeepLink(
  screen: string,
  params?: Record<string, string | number>
): string {
  const baseUrl = 'https://goalgpt.com';

  switch (screen) {
    case 'match':
      return `${baseUrl}/match/${params?.id}${params?.tab ? `/${params.tab}` : ''}`;

    case 'team':
      return `${baseUrl}/team/${params?.id}${params?.tab ? `/${params.tab}` : ''}`;

    case 'competition':
      return `${baseUrl}/competition/${params?.id}${params?.tab ? `/${params.tab}` : ''}`;

    case 'player':
      return `${baseUrl}/player/${params?.id}`;

    case 'ai-bot':
      return `${baseUrl}/ai-bot/${encodeURIComponent(params?.name as string)}`;

    case 'ai-bots':
      return `${baseUrl}/ai-bots`;

    case 'profile':
      return `${baseUrl}/profile`;

    case 'onboarding':
      return `${baseUrl}/onboarding`;

    default:
      return baseUrl;
  }
}

/**
 * Get custom scheme URL (for internal app navigation)
 */
export function getCustomSchemeUrl(
  screen: string,
  params?: Record<string, string | number>
): string {
  const baseUrl = 'goalgpt://';

  switch (screen) {
    case 'match':
      return `${baseUrl}match/${params?.id}${params?.tab ? `/${params.tab}` : ''}`;

    case 'team':
      return `${baseUrl}team/${params?.id}${params?.tab ? `/${params.tab}` : ''}`;

    case 'competition':
      return `${baseUrl}competition/${params?.id}${params?.tab ? `/${params.tab}` : ''}`;

    case 'player':
      return `${baseUrl}player/${params?.id}`;

    case 'ai-bot':
      return `${baseUrl}ai-bot/${encodeURIComponent(params?.name as string)}`;

    case 'ai-bots':
      return `${baseUrl}ai-bots`;

    case 'profile':
      return `${baseUrl}profile`;

    default:
      return baseUrl;
  }
}

export default linkingConfig;
