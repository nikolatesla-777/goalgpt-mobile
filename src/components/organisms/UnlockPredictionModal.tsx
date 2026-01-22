/**
 * UnlockPredictionModal
 * 
 * Confirmation dialog for unlocking predictions with credits
 * Shows balance, cost, and error states
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/tokens';
import { UNLOCK_COST } from '../../hooks/usePredictionUnlock';

// ============================================================================
// TYPES
// ============================================================================

interface UnlockPredictionModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isUnlocking: boolean;
    currentBalance: number;
    predictionTeams?: string; // e.g., "Fenerbahçe vs Galatasaray" (now hidden)
    predictionBot?: string;   // e.g., "GoalBot"
    error?: string | null;
    // Navigation callbacks
    onDailyRewardPress?: () => void;
    onVipPress?: () => void;
    onWatchAdPress?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const UnlockPredictionModal: React.FC<UnlockPredictionModalProps> = ({
    visible,
    onClose,
    onConfirm,
    isUnlocking,
    currentBalance,
    predictionBot,
    error,
    onDailyRewardPress,
    onVipPress,
    onWatchAdPress,
}) => {
    const canAfford = currentBalance >= UNLOCK_COST;
    const remainingBalance = currentBalance - UNLOCK_COST;
    const missingCredits = UNLOCK_COST - currentBalance;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <LinearGradient
                        colors={[colors.brand.forestGreen, colors.brand.ultraDarkGreen]}
                        style={styles.content}
                    >
                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close" size={24} color={colors.neutral.lightGray} />
                        </TouchableOpacity>

                        {/* Current Balance Badge - Top Right */}
                        <View style={styles.balanceBadge}>
                            <Ionicons name="diamond" size={16} color={colors.brand.primary} />
                            <Text style={styles.balanceText}>{currentBalance}</Text>
                        </View>

                        {/* Icon */}
                        <View style={styles.iconContainer}>
                            {canAfford ? (
                                <Ionicons name="lock-open" size={48} color={colors.semantic.vip} />
                            ) : (
                                <Ionicons name="lock-closed" size={48} color={colors.semantic.live} />
                            )}
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>
                            {canAfford ? 'Tahmin Kilidi Aç' : 'Yetersiz Kredi'}
                        </Text>

                        {/* Bot Info Only - Subtitle Style */}
                        <View style={styles.botInfoSection}>
                            <Text style={styles.aiLabel}>Yapay Zeka Tahmini</Text>
                            {predictionBot && (
                                <View style={styles.botRow}>
                                    <FontAwesome5 name="robot" size={16} color={colors.brand.primary} />
                                    <Text style={styles.botName}>{predictionBot}</Text>
                                </View>
                            )}
                        </View>

                        {/* Cost Section */}
                        <View style={styles.costSection}>
                            <View style={styles.costRow}>
                                <Text style={styles.costLabel}>Kilit Açma Maliyeti:</Text>
                                <View style={styles.costValue}>
                                    <Ionicons name="diamond" size={18} color={colors.brand.primary} />
                                    <Text style={styles.costAmount}>{UNLOCK_COST}</Text>
                                </View>
                            </View>

                            <View style={styles.costRow}>
                                <Text style={styles.costLabel}>Mevcut Bakiye:</Text>
                                <View style={styles.costValue}>
                                    <Ionicons name="diamond" size={18} color={colors.brand.primary} />
                                    <Text style={[
                                        styles.costAmount,
                                        !canAfford && styles.costAmountInsufficient
                                    ]}>
                                        {currentBalance}
                                    </Text>
                                </View>
                            </View>

                            {canAfford ? (
                                <View style={[styles.costRow, styles.resultRow]}>
                                    <Text style={styles.resultLabel}>İşlem Sonrası:</Text>
                                    <View style={styles.costValue}>
                                        <Ionicons name="diamond" size={18} color={colors.brand.primary} />
                                        <Text style={styles.resultAmount}>{remainingBalance}</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={[styles.costRow, styles.missingRow]}>
                                    <Text style={styles.missingLabel}>Eksik:</Text>
                                    <View style={styles.costValue}>
                                        <Ionicons name="diamond" size={18} color={colors.semantic.live} />
                                        <Text style={styles.missingAmount}>{missingCredits}</Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Error Message */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <Ionicons name="warning" size={16} color={colors.semantic.live} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {/* Action Buttons */}
                        {canAfford ? (
                            <TouchableOpacity
                                onPress={onConfirm}
                                disabled={isUnlocking}
                                activeOpacity={0.8}
                                style={styles.actionButtonWrapper}
                            >
                                <LinearGradient
                                    colors={[colors.brand.primary, colors.brand.forestGreen]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.confirmButton}
                                >
                                    {isUnlocking ? (
                                        <ActivityIndicator size="small" color={colors.neutral.white} />
                                    ) : (
                                        <>
                                            <Ionicons name="lock-open" size={20} color={colors.neutral.white} />
                                            <Text style={styles.confirmButtonText}>Kilidi Aç</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.insufficientActions}>
                                {/* 1. Günlük Ödülünü Al */}
                                <TouchableOpacity
                                    style={styles.dailyRewardButton}
                                    onPress={onDailyRewardPress || onClose}
                                >
                                    <Ionicons name="gift" size={18} color={colors.semantic.vip} />
                                    <Text style={styles.dailyRewardButtonText}>Günlük Ödülünü Al</Text>
                                </TouchableOpacity>

                                {/* 2. VIP Ol */}
                                <TouchableOpacity
                                    style={styles.vipButton}
                                    onPress={onVipPress || onClose}
                                >
                                    <Ionicons name="star" size={18} color={colors.neutral.white} />
                                    <Text style={styles.vipButtonText}>VIP Ol</Text>
                                </TouchableOpacity>

                                {/* 3. Ödül Videosu İzle */}
                                <TouchableOpacity
                                    style={styles.watchAdButton}
                                    onPress={onWatchAdPress || onClose}
                                >
                                    <Ionicons name="play-circle" size={18} color={colors.neutral.white} />
                                    <Text style={styles.watchAdButtonText}>Ödül Videosu İzle</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Cancel */}
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>İptal</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.opacity.black80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        borderRadius: borderRadius.xxl,
        overflow: 'hidden',
    },
    content: {
        padding: spacing.xl,
        paddingTop: spacing.xxxl,
        borderWidth: 1,
        borderColor: colors.opacity.primary20,
        borderRadius: borderRadius.xxl,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    balanceBadge: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.opacity.black80,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
        gap: spacing.xs,
        zIndex: 10,
    },
    balanceText: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.body.medium,
        color: colors.brand.primary,
    },
    iconContainer: {
        marginBottom: spacing.lg,
    },
    title: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.heading.h3,
        color: colors.neutral.white,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    matchInfo: {
        fontFamily: typography.fonts.ui.medium,
        fontSize: typography.fontSize.body.medium,
        color: colors.neutral.lightGray,
        textAlign: 'center',
    },
    botRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
    },
    botName: {
        fontFamily: typography.fonts.ui.medium,
        fontSize: typography.fontSize.label.medium,
        color: colors.brand.primary,
    },
    costSection: {
        width: '100%',
        backgroundColor: colors.opacity.white05,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    costLabel: {
        fontFamily: typography.fonts.ui.regular,
        fontSize: typography.fontSize.body.small,
        color: colors.neutral.lightGray,
    },
    costValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    costAmount: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.body.medium,
        color: colors.neutral.white,
    },
    costAmountInsufficient: {
        color: colors.semantic.live,
    },
    resultRow: {
        borderTopWidth: 1,
        borderTopColor: colors.opacity.white10,
        paddingTop: spacing.sm,
        marginTop: spacing.xs,
        marginBottom: 0,
    },
    resultLabel: {
        fontFamily: typography.fonts.ui.medium,
        fontSize: typography.fontSize.body.small,
        color: colors.neutral.lightGray,
    },
    resultAmount: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.body.medium,
        color: colors.brand.primary,
    },
    missingRow: {
        borderTopWidth: 1,
        borderTopColor: colors.opacity.white10,
        paddingTop: spacing.sm,
        marginTop: spacing.xs,
        marginBottom: 0,
    },
    missingLabel: {
        fontFamily: typography.fonts.ui.medium,
        fontSize: typography.fontSize.body.small,
        color: colors.semantic.live,
    },
    missingAmount: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.body.medium,
        color: colors.semantic.live,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
    },
    errorText: {
        fontFamily: typography.fonts.ui.medium,
        fontSize: typography.fontSize.label.medium,
        color: colors.semantic.live,
        flex: 1,
    },
    actionButtonWrapper: {
        width: '100%',
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        gap: spacing.sm,
        borderRadius: borderRadius.xl,
    },
    confirmButtonText: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.button.large,
        color: colors.neutral.white,
    },
    insufficientActions: {
        width: '100%',
        gap: spacing.sm,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.opacity.white10,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.xl,
        gap: spacing.sm,
    },
    secondaryButtonText: {
        fontFamily: typography.fonts.ui.semibold,
        fontSize: typography.fontSize.button.medium,
        color: colors.semantic.vip,
    },
    vipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.brand.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.xl,
        gap: spacing.sm,
    },
    vipButtonText: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.button.medium,
        color: colors.neutral.white,
    },
    cancelButton: {
        marginTop: spacing.md,
        paddingVertical: spacing.sm,
    },
    cancelText: {
        fontFamily: typography.fonts.ui.medium,
        fontSize: typography.fontSize.label.medium,
        color: colors.neutral.lightGray,
    },
    // New styles for bot info section
    botInfoSection: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    aiLabel: {
        fontFamily: typography.fonts.ui.regular,
        fontSize: typography.fontSize.body.small,
        color: colors.neutral.lightGray,
        marginBottom: spacing.xs,
    },
    // New button styles
    dailyRewardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.opacity.white10,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.xl,
        gap: spacing.sm,
    },
    dailyRewardButtonText: {
        fontFamily: typography.fonts.ui.semibold,
        fontSize: typography.fontSize.button.medium,
        color: colors.semantic.vip,
    },
    watchAdButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(138, 43, 226, 0.8)', // Purple for video/ad
        paddingVertical: spacing.md,
        borderRadius: borderRadius.xl,
        gap: spacing.sm,
    },
    watchAdButtonText: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.button.medium,
        color: colors.neutral.white,
    },
});

export default UnlockPredictionModal;
