/**
 * DailyRewardsScreen
 * 
 * 7-Day Daily Reward System
 * Based on GoalGPT Brandbook with green theme
 * 
 * v2: Fixed emojis → Icons, Gradient Button, Logic fixes
 */

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/tokens';
import { useDailyRewards, DailyReward, TOTAL_CREDITS } from '../hooks/useDailyRewards';

// ============================================================================
// TYPES
// ============================================================================

interface DailyRewardsScreenProps {
    onBack?: () => void;
}

// ============================================================================
// DAY CARD COMPONENT
// ============================================================================

interface DayCardProps {
    reward: DailyReward;
    isCompleted: boolean;
    isCurrent: boolean;
    isLocked: boolean;
}

const DayCard: React.FC<DayCardProps> = ({ reward, isCompleted, isCurrent, isLocked }) => {
    const getStatusIcon = () => {
        if (isCompleted) {
            return <Ionicons name="checkmark-circle" size={20} color={colors.semantic.win} />;
        }
        if (isCurrent) {
            return <Ionicons name="gift" size={20} color={colors.semantic.vip} />;
        }
        return <Ionicons name="lock-closed" size={20} color={colors.neutral.lightGray} />;
    };

    const getCardStyle = () => {
        if (isCurrent) {
            return [styles.dayCard, styles.dayCardCurrent];
        }
        if (isCompleted) {
            return [styles.dayCard, styles.dayCardCompleted];
        }
        return [styles.dayCard, styles.dayCardLocked];
    };

    return (
        <View style={getCardStyle()}>
            <View style={styles.dayCardHeader}>
                {getStatusIcon()}
                <Text style={[styles.dayCardLabel, isCurrent && styles.dayCardLabelCurrent]}>
                    {isCurrent ? 'Bugün' : `Gün ${reward.day}`}
                </Text>
            </View>

            {reward.isJackpot ? (
                <MaterialCommunityIcons
                    name="trophy-award"
                    size={28}
                    color={colors.semantic.vip}
                    style={styles.dayCardIconStyle}
                />
            ) : (
                <FontAwesome5
                    name="coins"
                    size={24}
                    color={isCurrent ? colors.semantic.vip : colors.brand.primary}
                    style={styles.dayCardIconStyle}
                />
            )}

            <Text style={[styles.dayCardType, isCurrent && styles.dayCardTypeCurrent]}>
                {reward.isJackpot ? 'Jackpot!' : 'Bonus'}
            </Text>

            <View style={styles.dayCardAmountRow}>
                <Ionicons name="diamond" size={14} color={colors.brand.lightGreen} />
                <Text style={[styles.dayCardAmount, isCurrent && styles.dayCardAmountCurrent]}>
                    {reward.credits}
                </Text>
            </View>

            <Text style={styles.dayCardXP}>+{reward.xp} XP</Text>
        </View>
    );
};

// ============================================================================
// SUCCESS MODAL COMPONENT
// ============================================================================

interface SuccessModalProps {
    visible: boolean;
    reward: DailyReward | null;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, reward, onClose }) => {
    if (!reward) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <LinearGradient
                        colors={[colors.brand.forestGreen, colors.brand.ultraDarkGreen]}
                        style={styles.modalGradient}
                    >
                        <Ionicons name="checkmark-circle" size={64} color={colors.semantic.vip} />

                        <Text style={styles.modalTitle}>Tebrikler!</Text>
                        <Text style={styles.modalSubtitle}>Bugünkü Ödülün</Text>

                        <View style={styles.modalRewardRow}>
                            <Text style={styles.modalRewardAmount}>{reward.credits}</Text>
                            <View style={styles.modalRewardLabelRow}>
                                <Ionicons name="diamond" size={20} color={colors.brand.lightGreen} />
                                <Text style={styles.modalRewardLabel}>Kredi</Text>
                            </View>
                        </View>

                        <View style={styles.modalXPRow}>
                            <Text style={styles.modalXPAmount}>+{reward.xp} XP</Text>
                        </View>

                        {reward.isJackpot && (
                            <View style={styles.modalJackpotRow}>
                                <MaterialCommunityIcons name="trophy-award" size={24} color={colors.semantic.vip} />
                                <Text style={styles.modalJackpot}>JACKPOT! Haftalık seriyi tamamladın!</Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.modalButton} onPress={onClose} activeOpacity={0.8}>
                            <LinearGradient
                                colors={[colors.brand.primary, colors.brand.forestGreen]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.modalButtonText}>Harika!</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.modalReminder}>
                            Yarın tekrar gel ve ödül kazan!
                        </Text>
                    </LinearGradient>
                </View>

                <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
                    <Ionicons name="close-circle" size={32} color={colors.neutral.lightGray} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

// ============================================================================
// MAIN SCREEN COMPONENT
// ============================================================================

export const DailyRewardsScreen: React.FC<DailyRewardsScreenProps> = ({ onBack }) => {
    const {
        status,
        isLoading,
        isClaiming,
        calendar,
        totalCredits,
        claimReward,
        claimResult,
        clearClaimResult,
        isDayCompleted,
        isCurrentDay,
        getRewardForDay,
    } = useDailyRewards();

    const [showSuccess, setShowSuccess] = useState(false);

    // Calculate current reward from calendar (fallback if API doesn't provide it)
    const currentReward = useMemo(() => {
        if (status?.nextReward) {
            return status.nextReward;
        }
        // Fallback: Get from calendar based on currentDay
        const day = status?.currentDay || 1;
        return getRewardForDay(day);
    }, [status, getRewardForDay]);

    // Handle claim
    const handleClaim = async () => {
        const result = await claimReward();
        if (result?.success) {
            setShowSuccess(true);
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setShowSuccess(false);
        clearClaimResult();
    };

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.brand.primary} />
                    <Text style={styles.loadingText}>Yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const canClaim = status?.canClaim ?? false;
    const claimedToday = status?.claimedToday ?? false;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    {onBack && (
                        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
                            <Ionicons name="chevron-back" size={28} color={colors.neutral.white} />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.subtitle}>7 gün üst üste giriş yap ve kazan</Text>
                        <View style={styles.totalRewardRow}>
                            <Ionicons name="diamond" size={24} color={colors.semantic.vip} />
                            <Text style={styles.totalReward}>{totalCredits} Kredi</Text>
                        </View>
                    </View>

                    {/* Today's Reward Card */}
                    <View style={styles.todayCard}>
                        <LinearGradient
                            colors={[colors.brand.forestGreen, colors.brand.ultraDarkGreen]}
                            style={styles.todayCardGradient}
                        >
                            <View style={styles.todayHeader}>
                                <View style={styles.todayBadge}>
                                    <Ionicons name="gift" size={16} color={colors.semantic.vip} />
                                    <Text style={styles.todayBadgeText}>Bugün</Text>
                                </View>
                                <TouchableOpacity>
                                    <Ionicons name="information-circle-outline" size={24} color={colors.neutral.lightGray} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.todayRewardSection}>
                                {currentReward.isJackpot ? (
                                    <MaterialCommunityIcons
                                        name="trophy-award"
                                        size={64}
                                        color={colors.semantic.vip}
                                        style={styles.todayIcon}
                                    />
                                ) : (
                                    <FontAwesome5
                                        name="coins"
                                        size={48}
                                        color={colors.semantic.vip}
                                        style={styles.todayIcon}
                                    />
                                )}

                                <Text style={styles.todayLabel}>Bugünkü Bonus</Text>

                                <View style={styles.todayAmountRow}>
                                    <Ionicons name="diamond" size={28} color={colors.brand.lightGreen} />
                                    <Text style={styles.todayAmount}>{currentReward.credits}</Text>
                                </View>

                                <Text style={styles.todayXP}>+{currentReward.xp} XP</Text>
                            </View>

                            {/* Claim Button - Gradient Style */}
                            <TouchableOpacity
                                onPress={handleClaim}
                                disabled={!canClaim || isClaiming}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={
                                        canClaim && !isClaiming
                                            ? [colors.brand.primary, colors.brand.forestGreen]
                                            : [colors.neutral.mediumGray, colors.neutral.darkGray]
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.claimButton}
                                >
                                    {isClaiming ? (
                                        <ActivityIndicator size="small" color={colors.neutral.white} />
                                    ) : (
                                        <Text style={styles.claimButtonText}>
                                            {claimedToday ? 'Yarın Tekrar Gel!' : 'Ödülünü Al'}
                                        </Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    {/* Day Calendar */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.calendarScroll}
                        contentContainerStyle={styles.calendarContent}
                    >
                        {calendar.map((reward) => (
                            <DayCard
                                key={reward.day}
                                reward={reward}
                                isCompleted={isDayCompleted(reward.day)}
                                isCurrent={isCurrentDay(reward.day)}
                                isLocked={!isDayCompleted(reward.day) && !isCurrentDay(reward.day)}
                            />
                        ))}
                    </ScrollView>

                    {/* Info Text */}
                    <View style={styles.infoRow}>
                        <Ionicons name="information-circle" size={16} color={colors.neutral.lightGray} />
                        <Text style={styles.infoText}>
                            Her gün giriş yap, ödüllerini topla! 7. günde büyük jackpot seni bekliyor!
                        </Text>
                    </View>

                    {/* Streak Info */}
                    {status && status.streak > 0 && (
                        <View style={styles.streakBadge}>
                            <Ionicons name="flame" size={20} color={colors.semantic.live} />
                            <Text style={styles.streakText}>{status.streak} günlük seri!</Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            {/* Success Modal */}
            <SuccessModal
                visible={showSuccess}
                reward={claimResult?.reward || currentReward}
                onClose={handleModalClose}
            />
        </SafeAreaView>
    );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.neutral.black,
    },
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontFamily: typography.fonts.ui.regular,
        fontSize: typography.fontSize.body.medium,
        color: colors.neutral.lightGray,
        marginTop: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxxl,
    },
    titleSection: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    subtitle: {
        fontFamily: typography.fonts.ui.regular,
        fontSize: typography.fontSize.body.medium,
        color: colors.neutral.lightGray,
        marginBottom: spacing.sm,
    },
    totalRewardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    totalReward: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.display.small,
        color: colors.semantic.vip,
    },

    // Today's Card
    todayCard: {
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.xxl,
        overflow: 'hidden',
        marginBottom: spacing.xl,
    },
    todayCardGradient: {
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.opacity.primary15,
        borderRadius: borderRadius.xxl,
    },
    todayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    todayBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.opacity.primary20,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        gap: spacing.xs,
    },
    todayBadgeText: {
        fontFamily: typography.fonts.ui.semibold,
        fontSize: typography.fontSize.label.medium,
        color: colors.semantic.vip,
    },
    todayRewardSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    todayIcon: {
        marginBottom: spacing.md,
    },
    todayLabel: {
        fontFamily: typography.fonts.ui.medium,
        fontSize: typography.fontSize.body.medium,
        color: colors.neutral.lightGray,
        marginBottom: spacing.sm,
    },
    todayAmountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    todayAmount: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: 56,
        color: colors.neutral.white,
    },
    todayXP: {
        fontFamily: typography.fonts.ui.semibold,
        fontSize: typography.fontSize.body.large,
        color: colors.brand.primary,
        marginTop: spacing.xs,
    },
    claimButton: {
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
    },
    claimButtonText: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.button.large,
        color: colors.neutral.white,
    },

    // Calendar
    calendarScroll: {
        marginBottom: spacing.xl,
    },
    calendarContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    dayCard: {
        width: 80,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    dayCardLocked: {
        backgroundColor: colors.opacity.white05,
    },
    dayCardCompleted: {
        backgroundColor: colors.opacity.primary15,
    },
    dayCardCurrent: {
        backgroundColor: colors.brand.forestGreen,
        borderWidth: 2,
        borderColor: colors.brand.primary,
    },
    dayCardHeader: {
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    dayCardLabel: {
        fontFamily: typography.fonts.ui.medium,
        fontSize: typography.fontSize.label.small,
        color: colors.neutral.lightGray,
        marginTop: spacing.xs,
    },
    dayCardLabelCurrent: {
        color: colors.semantic.vip,
    },
    dayCardIconStyle: {
        marginVertical: spacing.xs,
    },
    dayCardType: {
        fontFamily: typography.fonts.ui.regular,
        fontSize: typography.fontSize.label.tiny,
        color: colors.neutral.lightGray,
    },
    dayCardTypeCurrent: {
        color: colors.neutral.white,
    },
    dayCardAmountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: spacing.xs,
    },
    dayCardAmount: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.body.medium,
        color: colors.neutral.white,
    },
    dayCardAmountCurrent: {
        color: colors.semantic.vip,
    },
    dayCardXP: {
        fontFamily: typography.fonts.ui.regular,
        fontSize: typography.fontSize.label.tiny,
        color: colors.brand.primary,
    },

    // Info
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xxl,
        marginBottom: spacing.lg,
        gap: spacing.xs,
    },
    infoText: {
        fontFamily: typography.fonts.ui.regular,
        fontSize: typography.fontSize.label.medium,
        color: colors.neutral.lightGray,
        textAlign: 'center',
        flex: 1,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.opacity.white10,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.round,
        alignSelf: 'center',
        gap: spacing.xs,
    },
    streakText: {
        fontFamily: typography.fonts.ui.semibold,
        fontSize: typography.fontSize.body.medium,
        color: colors.semantic.live,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.opacity.black80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContent: {
        width: '100%',
        borderRadius: borderRadius.xxl,
        overflow: 'hidden',
    },
    modalGradient: {
        padding: spacing.xxl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.brand.primary,
        borderRadius: borderRadius.xxl,
    },
    modalTitle: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.heading.h2,
        color: colors.semantic.vip,
        marginTop: spacing.lg,
    },
    modalSubtitle: {
        fontFamily: typography.fonts.ui.regular,
        fontSize: typography.fontSize.body.medium,
        color: colors.neutral.lightGray,
        marginTop: spacing.xs,
        marginBottom: spacing.xl,
    },
    modalRewardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    modalRewardAmount: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: 64,
        color: colors.semantic.vip,
    },
    modalRewardLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    modalRewardLabel: {
        fontFamily: typography.fonts.ui.medium,
        fontSize: typography.fontSize.heading.h3,
        color: colors.neutral.white,
    },
    modalXPRow: {
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
    },
    modalXPAmount: {
        fontFamily: typography.fonts.ui.semibold,
        fontSize: typography.fontSize.body.large,
        color: colors.brand.primary,
    },
    modalJackpotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    modalJackpot: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.body.medium,
        color: colors.semantic.vip,
        textAlign: 'center',
    },
    modalButton: {
        width: '100%',
        marginTop: spacing.md,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xxxl,
        alignItems: 'center',
        borderRadius: borderRadius.xl,
    },
    modalButtonText: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.button.large,
        color: colors.neutral.white,
    },
    modalReminder: {
        fontFamily: typography.fonts.ui.regular,
        fontSize: typography.fontSize.label.medium,
        color: colors.neutral.lightGray,
        marginTop: spacing.lg,
    },
    modalCloseButton: {
        marginTop: spacing.xl,
    },
});

export default DailyRewardsScreen;
