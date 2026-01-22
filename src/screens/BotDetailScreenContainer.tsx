/**
 * BotDetailScreenContainer
 * 
 * Container component that fetches bot data and provides it to BotDetailScreen.
 * Extracted from AppNavigator to remove hardcoded mock data.
 * 
 * @module screens/BotDetailScreenContainer
 */

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NeonText } from '../components/atoms/NeonText';
import { getBotStats, BotStat } from '../services/botStats.service';
import { logger } from '../utils/logger';

// Lazy load BotDetailScreen
const BotDetailScreen = lazy(() => import('./BotDetailScreen').then(m => ({ default: m.BotDetailScreen })));

// ============================================================================
// TYPES
// ============================================================================

interface BotDetailScreenContainerProps {
    botId: number;
    navigation: any;
}

interface BotData {
    id: number;
    name: string;
    description: string;
    icon: string;
    totalPredictions: number;
    successRate: number;
    stats: {
        today: { total: number; wins: number; rate: number };
        yesterday: { total: number; wins: number; rate: number };
        monthly: { total: number; wins: number; rate: number };
        all: { total: number; wins: number; rate: number };
    };
}

// ============================================================================
// MOCK DATA (DEV ONLY)
// ============================================================================

const createMockBotData = (botId: number): BotData => ({
    id: botId,
    name: `Bot ${botId}`,
    description: 'AI-powered football prediction bot',
    icon: '🤖',
    totalPredictions: 450,
    successRate: 74.2,
    stats: {
        today: { total: 12, wins: 9, rate: 75 },
        yesterday: { total: 15, wins: 11, rate: 73.3 },
        monthly: { total: 234, wins: 174, rate: 74.4 },
        all: { total: 450, wins: 334, rate: 74.2 },
    },
});

const mockOtherBots = [
    { id: 2, name: 'Bot 2', icon: '🎯', successRate: 68.5, totalPredictions: 320 },
    { id: 3, name: 'Bot 3', icon: '⚡', successRate: 71.2, totalPredictions: 280 },
    { id: 4, name: 'Bot 4', icon: '🔥', successRate: 76.8, totalPredictions: 390 },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Maps BotStat API data to BotData format
 */
function mapBotStatToBotData(stat: BotStat): BotData {
    return {
        id: stat.bot_id,
        name: stat.bot_name,
        description: `AI-powered prediction bot with ${stat.win_rate.toFixed(1)}% success rate`,
        icon: '🤖',
        totalPredictions: stat.total_predictions,
        successRate: stat.win_rate,
        stats: {
            today: { total: 0, wins: 0, rate: stat.win_rate },
            yesterday: { total: 0, wins: 0, rate: stat.win_rate },
            monthly: { total: stat.total_predictions, wins: stat.total_wins, rate: stat.win_rate },
            all: { total: stat.total_predictions, wins: stat.total_wins, rate: stat.win_rate },
        },
    };
}

/**
 * Lazy load mock predictions for DEV mode only
 */
const getMockPredictions = async () => {
    if (__DEV__) {
        const { mockPredictions } = await import('../services/mockData');
        return mockPredictions;
    }
    return [];
};

// ============================================================================
// LOADING SKELETON
// ============================================================================

const BotDetailSkeleton: React.FC = () => (
    <View style={styles.skeleton}>
        <ActivityIndicator size="large" color="#4ade80" />
        <NeonText size="small" style={styles.skeletonText}>
            Bot bilgileri yükleniyor...
        </NeonText>
    </View>
);

// ============================================================================
// COMPONENT
// ============================================================================

export const BotDetailScreenContainer: React.FC<BotDetailScreenContainerProps> = ({
    botId,
    navigation
}) => {
    const [botData, setBotData] = useState<BotData | null>(null);
    const [otherBots, setOtherBots] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBotData = async () => {
            try {
                setIsLoading(true);

                // Fetch all bot stats
                const stats = await getBotStats();

                // Find the specific bot
                const botStat = stats.find(s => s.bot_id === botId);

                if (botStat) {
                    setBotData(mapBotStatToBotData(botStat));

                    // Set other bots (excluding current)
                    const others = stats
                        .filter(s => s.bot_id !== botId)
                        .slice(0, 3)
                        .map(s => ({
                            id: s.bot_id,
                            name: s.bot_name,
                            icon: '🤖',
                            successRate: s.win_rate,
                            totalPredictions: s.total_predictions,
                        }));
                    setOtherBots(others.length > 0 ? others : mockOtherBots);
                } else {
                    // Use mock data in DEV mode if bot not found
                    if (__DEV__) {
                        setBotData(createMockBotData(botId));
                        setOtherBots(mockOtherBots);
                    }
                }

                // Load predictions (mock for now, can be replaced with API call)
                const preds = await getMockPredictions();
                setPredictions(preds);

            } catch (error) {
                logger.error('Failed to fetch bot data', error as Error);

                // Fallback to mock in DEV
                if (__DEV__) {
                    setBotData(createMockBotData(botId));
                    setOtherBots(mockOtherBots);
                    const preds = await getMockPredictions();
                    setPredictions(preds);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchBotData();
    }, [botId]);

    if (isLoading || !botData) {
        return <BotDetailSkeleton />;
    }

    return (
        <Suspense fallback={<BotDetailSkeleton />}>
            <BotDetailScreen
                bot={botData}
                otherBots={otherBots}
                predictions={predictions}
                onBotSelect={(newBotId) => {
                    navigation.push('BotDetail', { botId: newBotId });
                }}
                onPredictionPress={(predictionId) => {
                    logger.debug('Prediction pressed', { predictionId });
                }}
                onBack={() => navigation.goBack()}
            />
        </Suspense>
    );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    skeleton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
    },
    skeletonText: {
        marginTop: 16,
        opacity: 0.6,
    },
});

export default BotDetailScreenContainer;
