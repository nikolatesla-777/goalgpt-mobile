/**
 * HomeHeader Component
 * 
 * Premium header with logo, VIP badge, subscription info, and action buttons.
 * Extracted from HomeScreen for modularity.
 * 
 * @module features/home/components/HomeHeader
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Crown, Bell, Funnel, MagnifyingGlass, CalendarBlank, Gift } from 'phosphor-react-native';
import { NeonText } from '../../../components/atoms/NeonText';
import { spacing } from '../../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface HomeHeaderProps {
    /** Number of unread notifications */
    notificationCount?: number;
    /** Subscription days remaining */
    subscriptionDays?: number;
    /** Subscription plan type */
    subscriptionPlan?: 'yearly' | 'monthly' | 'weekly';
    /** Is user VIP? */
    isVip?: boolean;
    /** Can claim daily reward? */
    canClaimDailyReward?: boolean;
    /** Called when daily rewards button is pressed */
    onDailyRewardsPress?: () => void;
    /** Called when notification bell is pressed */
    onNotificationPress?: () => void;
    /** Called when filter button is pressed */
    onFilterPress?: () => void;
    /** Called when search button is pressed */
    onSearchPress?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const HomeHeader: React.FC<HomeHeaderProps> = ({
    notificationCount = 0,
    subscriptionDays = 365,
    subscriptionPlan = 'yearly',
    isVip = true,
    canClaimDailyReward = false,
    onDailyRewardsPress,
    onNotificationPress,
    onFilterPress,
    onSearchPress,
}) => {
    const planLabels = {
        yearly: 'Yearly',
        monthly: 'Monthly',
        weekly: 'Weekly',
    };

    return (
        <View style={styles.header}>
            {/* Left Side - Logo and Info */}
            <View style={styles.headerLeft}>
                <Image
                    source={require('../../../../assets/goalgpt_logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
                <View style={styles.headerTitles}>
                    <View style={styles.titleRow}>
                        <NeonText size="large" weight="bold" color="white" style={styles.appTitle}>
                            GoalGPT
                        </NeonText>
                        {isVip && (
                            <View style={styles.vipBadge}>
                                <Crown size={12} weight="fill" color="white" />
                                <NeonText size="small" weight="bold" color="white" style={styles.vipText}>
                                    VIP
                                </NeonText>
                            </View>
                        )}
                    </View>
                    <View style={styles.subRow}>
                        <CalendarBlank size={14} color="white" weight="bold" />
                        <NeonText size="small" weight="bold" color="white" style={styles.subText}>
                            Day {subscriptionDays}
                        </NeonText>
                        <View style={styles.dividerVertical} />
                        <NeonText size="small" weight="bold" style={styles.planText}>
                            {planLabels[subscriptionPlan]}
                        </NeonText>
                    </View>
                </View>
            </View>

            {/* Right Side - Action Buttons */}
            <View style={styles.headerActions}>
                {/* Daily Rewards Button */}
                <TouchableOpacity
                    style={[styles.actionButton, canClaimDailyReward && styles.rewardButtonActive]}
                    onPress={onDailyRewardsPress}
                >
                    <Gift size={20} weight="fill" color={canClaimDailyReward ? '#FFD700' : '#4ade80'} />
                    {canClaimDailyReward && (
                        <View style={styles.rewardBadge}>
                            <NeonText size="small" weight="bold" style={styles.badgeText}>
                                !
                            </NeonText>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={onNotificationPress}>
                    <Bell size={20} weight="fill" color="#4ade80" />
                    {notificationCount > 0 && (
                        <View style={styles.badge}>
                            <NeonText size="small" weight="bold" style={styles.badgeText}>
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </NeonText>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.iconButton]} onPress={onFilterPress}>
                    <Funnel size={20} weight="bold" color="#4ade80" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
                    <MagnifyingGlass size={20} weight="bold" color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoImage: {
        width: 56,
        height: 56,
        borderRadius: 14,
    },
    headerTitles: {
        gap: 0,
        marginLeft: -4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    appTitle: {
        fontSize: 20,
        letterSpacing: -0.5,
    },
    vipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4ade80',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        gap: 4,
    },
    vipText: {
        fontSize: 10,
        marginTop: 1,
    },
    subRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    subText: {
        fontSize: 10,
    },
    dividerVertical: {
        width: 1,
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    planText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    iconButton: {
        borderWidth: 1,
        borderColor: '#222',
    },
    searchButton: {
        width: 48,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#222',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#fbbf24',
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    rewardBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#FF3B30',
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    rewardButtonActive: {
        borderWidth: 1,
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    badgeText: {
        fontSize: 9,
        lineHeight: 12,
        color: '#000000',
        fontWeight: '900',
    },
});
