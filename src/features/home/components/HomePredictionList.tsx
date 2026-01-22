/**
 * HomePredictionList Component
 * 
 * Renders the list of prediction cards with empty state handling.
 * Supports locked state for FREE users who haven't unlocked predictions.
 * 
 * @module features/home/components/HomePredictionList
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MobilePredictionCard } from '../../../components/organisms/MobilePredictionCard';
import { UnlockPredictionModal } from '../../../components/organisms/UnlockPredictionModal';
import { NeonText } from '../../../components/atoms/NeonText';
import { AIPrediction } from '../../../services/predictions.service';
import { BotStat } from '../../../services/botStats.service';
import { spacing } from '../../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface HomePredictionListProps {
    /** List of predictions to display */
    predictions: AIPrediction[];
    /** Map of bot name to stats for win rate lookup */
    botStatsMap: Record<string, BotStat>;
    /** List of favorite prediction IDs */
    favorites: string[];
    /** Called when a prediction card is pressed */
    onPredictionPress: (matchId: string) => void;
    /** Called when favorite is toggled */
    onToggleFavorite: (predictionId: string) => void;
    /** Called when bot info is pressed */
    onBotInfoPress: (botName: string) => void;
    /** Whether user is VIP (has subscription) */
    isUserVip?: boolean;
    /** Set of unlocked prediction IDs */
    unlockedPredictionIds?: Set<string>;
    /** User's current credit balance */
    creditBalance?: number;
    /** Called when unlock is confirmed */
    onUnlockPrediction?: (predictionId: string) => Promise<{ success: boolean; message: string }>;
    /** Whether unlock is in progress */
    isUnlocking?: boolean;
    /** Navigation callbacks for unlock modal buttons */
    onDailyRewardPress?: () => void;
    onVipPress?: () => void;
    onWatchAdPress?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const HomePredictionList: React.FC<HomePredictionListProps> = ({
    predictions,
    botStatsMap,
    favorites,
    onPredictionPress,
    onToggleFavorite,
    onBotInfoPress,
    isUserVip = false,
    unlockedPredictionIds = new Set(),
    creditBalance = 0,
    onUnlockPrediction,
    isUnlocking = false,
    onDailyRewardPress,
    onVipPress,
    onWatchAdPress,
}) => {
    // Modal state for unlock confirmation
    const [unlockModalVisible, setUnlockModalVisible] = useState(false);
    const [selectedPrediction, setSelectedPrediction] = useState<AIPrediction | null>(null);
    const [unlockError, setUnlockError] = useState<string | null>(null);

    // Check if prediction is locked
    const isPredictionLocked = (prediction: AIPrediction): boolean => {
        // VIP users have full access
        if (isUserVip) return false;

        // Check if this prediction is already unlocked
        if (unlockedPredictionIds.has(prediction.id)) return false;

        // VIP predictions are locked for FREE users who haven't unlocked
        if (prediction.access_type === 'VIP') return true;

        return false;
    };

    // Handle unlock button press
    const handleUnlockPress = (prediction: AIPrediction) => {
        setSelectedPrediction(prediction);
        setUnlockError(null);
        setUnlockModalVisible(true);
    };

    // Handle unlock confirmation
    const handleUnlockConfirm = async () => {
        if (!selectedPrediction || !onUnlockPrediction) return;

        const result = await onUnlockPrediction(selectedPrediction.id);

        if (result.success) {
            setUnlockModalVisible(false);
            setSelectedPrediction(null);
        } else {
            setUnlockError(result.message);
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setUnlockModalVisible(false);
        setSelectedPrediction(null);
        setUnlockError(null);
    };

    if (predictions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <NeonText size="medium" style={styles.emptyText}>
                    Bu kriterlere uygun tahmin bulunamadı.
                </NeonText>
            </View>
        );
    }

    return (
        <View style={styles.listContainer}>
            {predictions.map((prediction) => {
                const botName = prediction.canonical_bot_name || 'AI Bot';
                const botStat = botStatsMap[botName] || botStatsMap[botName.toLowerCase()];
                const winRate = botStat ? botStat.win_rate.toFixed(1) : '85.0';
                const isLocked = isPredictionLocked(prediction);

                return (
                    <MobilePredictionCard
                        key={prediction.id}
                        prediction={prediction}
                        isVip={prediction.access_type === 'VIP'}
                        isLocked={isLocked}
                        isFavorite={favorites.includes(prediction.id)}
                        onToggleFavorite={() => onToggleFavorite(prediction.id)}
                        botWinRate={winRate}
                        onPress={() => {
                            // If locked, show unlock modal instead of navigating
                            if (isLocked) {
                                handleUnlockPress(prediction);
                            } else if (prediction.match_id) {
                                onPredictionPress(prediction.match_id);
                            }
                        }}
                        onBotInfoPress={() => onBotInfoPress(botName)}
                        onUnlockPress={() => handleUnlockPress(prediction)}
                        creditBalance={creditBalance}
                    />
                );
            })}

            {/* Unlock Confirmation Modal */}
            <UnlockPredictionModal
                visible={unlockModalVisible}
                onClose={handleModalClose}
                onConfirm={handleUnlockConfirm}
                isUnlocking={isUnlocking}
                currentBalance={creditBalance}
                predictionBot={selectedPrediction?.canonical_bot_name}
                error={unlockError}
                onDailyRewardPress={() => {
                    handleModalClose();
                    onDailyRewardPress?.();
                }}
                onVipPress={() => {
                    handleModalClose();
                    onVipPress?.();
                }}
                onWatchAdPress={() => {
                    handleModalClose();
                    onWatchAdPress?.();
                }}
            />
        </View>
    );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: spacing.lg,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    emptyText: {
        opacity: 0.5,
        textAlign: 'center',
    },
});
