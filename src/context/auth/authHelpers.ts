/**
 * Auth Helpers
 * 
 * Extracted from AuthContext to reduce duplication.
 * Contains analytics, Sentry, and tracking utilities.
 * 
 * @module context/auth/authHelpers
 */

import { setUser as setSentryUser, clearUser as clearSentryUser } from '../../config/sentry.config';
import {
    setAnalyticsUserId,
    setUserLevel,
    setUserSubscriptionStatus,
    trackLogin,
    trackSignUp,
} from '../../services/analytics.service';
import { logger } from '../../utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export interface UserAnalyticsData {
    id: string;
    email?: string | null;
    username?: string | null;
    xp?: {
        level: string;
    };
    subscription?: {
        status: 'active' | 'expired' | 'cancelled';
    };
}

export type AuthMethod = 'email' | 'google' | 'apple' | 'phone';

// ============================================================================
// ANALYTICS SETUP (Previously duplicated 7x in AuthContext)
// ============================================================================

/**
 * Setup user analytics tracking
 * Consolidates the analytics setup code that was previously duplicated 7 times
 */
export function setupUserAnalytics(user: UserAnalyticsData): void {
    try {
        setAnalyticsUserId(user.id);

        if (user.xp?.level) {
            setUserLevel(user.xp.level);
        }

        if (user.subscription?.status) {
            setUserSubscriptionStatus(
                user.subscription.status === 'active' ? 'premium' : 'free'
            );
        }

        logger.debug('User analytics setup complete', { userId: user.id });
    } catch (error) {
        logger.warn('Analytics setup failed (non-fatal)', { error });
    }
}

/**
 * Setup Sentry user context
 */
export function setupSentryContext(user: UserAnalyticsData): void {
    try {
        setSentryUser({
            id: user.id,
            email: user.email || undefined,
            username: user.username || undefined,
        });

        logger.debug('Sentry user context set', { userId: user.id });
    } catch (error) {
        logger.warn('Sentry setup failed (non-fatal)', { error });
    }
}

/**
 * Clear all user context (logout)
 */
export function clearUserContext(): void {
    try {
        clearSentryUser();
        logger.debug('User context cleared');
    } catch (error) {
        logger.warn('Error clearing user context', { error });
    }
}

/**
 * Track authentication event
 */
export function trackAuthEvent(
    type: 'login' | 'signup',
    method: AuthMethod
): void {
    try {
        if (type === 'login') {
            trackLogin(method);
        } else {
            trackSignUp(method);
        }

        logger.debug('Auth event tracked', { type, method });
    } catch (error) {
        logger.warn('Auth tracking failed (non-fatal)', { error });
    }
}

// ============================================================================
// COMBINED SETUP (For refactored auth methods)
// ============================================================================

/**
 * Complete user setup after successful authentication
 * Combines analytics, Sentry, and tracking into a single call
 * 
 * @param user - User data
 * @param method - Authentication method used
 * @param isNewUser - Whether this is a new registration
 */
export function completeUserSetup(
    user: UserAnalyticsData,
    method: AuthMethod,
    isNewUser: boolean = false
): void {
    setupUserAnalytics(user);
    setupSentryContext(user);
    trackAuthEvent(isNewUser ? 'signup' : 'login', method);
}

/**
 * Refresh user context without tracking auth events
 * Used by refreshUser and refreshUserSilently methods
 * 
 * @param user - User data
 */
export function refreshUserContext(user: UserAnalyticsData): void {
    setupUserAnalytics(user);
    setupSentryContext(user);
}
