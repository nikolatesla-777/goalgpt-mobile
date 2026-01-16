/**
 * PredictionsScreen
 *
 * Full screen template for AI predictions feed
 * Shows bot predictions with filtering options
 * Features: Predictions list, filters (result/tier/favorites), pull-to-refresh
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PredictionsList } from '../components/organisms/PredictionsList';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, typography } from '../constants/tokens';
import type { PredictionItem } from '../components/organisms/PredictionsList';
import type { PredictionResult, PredictionTier } from '../components/molecules/PredictionCard';
import { getMatchedPredictions } from '../services/predictions.service';
import Toast from 'react-native-toast-message';
import { useWebSocket } from '../hooks/useWebSocket';
import { WebSocketStatusIndicator } from '../components/atoms/WebSocketStatusIndicator';

// ============================================================================
// TYPES
// ============================================================================

type ResultFilter = PredictionResult | 'all';
type TierFilter = PredictionTier | 'all';

interface FilterChip {
  key: string;
  label: string;
  icon: string;
  active: boolean;
}

export interface PredictionsScreenProps {
  /** Array of predictions (optional - will fetch if not provided) */
  predictions?: PredictionItem[];

  /** Loading state */
  isLoading?: boolean;

  /** Refreshing state */
  isRefreshing?: boolean;

  /** On refresh callback */
  onRefresh?: () => void;

  /** On prediction press */
  onPredictionPress?: (id: string | number) => void;

  /** On favorite toggle */
  onFavoriteToggle?: (id: string | number) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const PredictionsScreen: React.FC<PredictionsScreenProps> = ({
  predictions: propPredictions,
  isLoading: propIsLoading = false,
  isRefreshing: propIsRefreshing = false,
  onRefresh: propOnRefresh,
  onPredictionPress,
  onFavoriteToggle,
}) => {
  const { theme } = useTheme();
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Local state for API data
  const [predictions, setPredictions] = useState<PredictionItem[]>(propPredictions || []);
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WebSocket connection
  const { isConnected, on } = useWebSocket();

  // Track previous prediction results for settlement detection
  const previousResultsRef = useRef<Map<string | number, PredictionResult>>(new Map());

  // Fetch predictions
  const fetchPredictions = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const fetchedPredictions = await getMatchedPredictions();
      setPredictions(fetchedPredictions);
    } catch (error: any) {
      console.error('Failed to fetch predictions:', error);
      setError(error.message || 'Failed to load predictions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    if (!propPredictions && !propIsLoading) {
      fetchPredictions();
    }
  }, [propPredictions, propIsLoading, fetchPredictions]);

  // Update local state when props change
  useEffect(() => {
    if (propPredictions) setPredictions(propPredictions);
    if (propIsLoading !== undefined) setIsLoading(propIsLoading);
  }, [propPredictions, propIsLoading]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    if (propOnRefresh) {
      propOnRefresh();
    } else {
      setIsRefreshing(true);
      await fetchPredictions();
      setIsRefreshing(false);
    }
  }, [propOnRefresh, fetchPredictions]);

  // ============================================================================
  // SETTLEMENT DETECTION & TOAST NOTIFICATIONS
  // ============================================================================

  // Detect prediction settlements and show toast notifications
  useEffect(() => {
    if (!predictions || predictions.length === 0) return;

    predictions.forEach((prediction) => {
      const prevResult = previousResultsRef.current.get(prediction.id);
      const currentResult = prediction.result;

      // Check if this is a new settlement (was pending, now win/lose)
      const wasPending = !prevResult || prevResult === 'pending';
      const isNowSettled = currentResult === 'win' || currentResult === 'lose';

      if (wasPending && isNowSettled) {
        const isWin = currentResult === 'win';

        // Show toast notification
        Toast.show({
          type: isWin ? 'success' : 'error',
          text1: isWin ? '🏆 Kazandınız!' : '😔 Kaybettiniz',
          text2: `${prediction.botName || 'Bot'} · ${prediction.prediction}`,
          text2Style: { fontSize: 12 },
          visibilityTime: isWin ? 5000 : 3000,
          position: 'top',
        });

        console.log(`[PredictionsScreen] Settlement detected:`, {
          id: prediction.id,
          result: currentResult,
          botName: prediction.botName,
          prediction: prediction.prediction,
        });
      }

      // Update previous result
      previousResultsRef.current.set(prediction.id, currentResult);
    });
  }, [predictions]);

  // ============================================================================
  // WEBSOCKET PREDICTION UPDATE LISTENER
  // ============================================================================

  // Listen for real-time prediction updates via WebSocket
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = on('prediction:update', (data: any) => {
      console.log('[PredictionsScreen] Real-time prediction update:', data);

      // Refetch predictions to get latest data
      fetchPredictions();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isConnected, on, fetchPredictions]);

  // ============================================================================
  // RENDER FILTER CHIPS
  // ============================================================================

  const renderFilterChips = () => {
    const resultChips: FilterChip[] = [
      { key: 'all', label: 'All', icon: '📊', active: resultFilter === 'all' },
      { key: 'win', label: 'Won', icon: '✅', active: resultFilter === 'win' },
      { key: 'lose', label: 'Lost', icon: '❌', active: resultFilter === 'lose' },
      { key: 'pending', label: 'Pending', icon: '⏳', active: resultFilter === 'pending' },
    ];

    const tierChips: FilterChip[] = [
      { key: 'all', label: 'All Tiers', icon: '🎯', active: tierFilter === 'all' },
      { key: 'free', label: 'Free', icon: '🆓', active: tierFilter === 'free' },
      { key: 'premium', label: 'Premium', icon: '💎', active: tierFilter === 'premium' },
      { key: 'vip', label: 'VIP', icon: '👑', active: tierFilter === 'vip' },
    ];

    return (
      <View style={styles.filterSection}>
        {/* Result Filters */}
        <View style={styles.filterRow}>
          <Text style={styles.filterTitle}>Result:</Text>
          <View style={styles.chipsRow}>
            {resultChips.map((chip) => (
              <TouchableOpacity
                key={chip.key}
                style={[styles.filterChip, chip.active && styles.filterChipActive]}
                onPress={() => setResultFilter(chip.key as ResultFilter)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipIcon}>{chip.icon}</Text>
                <Text style={[styles.chipLabel, chip.active && styles.chipLabelActive]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tier Filters */}
        <View style={styles.filterRow}>
          <Text style={styles.filterTitle}>Tier:</Text>
          <View style={styles.chipsRow}>
            {tierChips.map((chip) => (
              <TouchableOpacity
                key={chip.key}
                style={[styles.filterChip, chip.active && styles.filterChipActive]}
                onPress={() => setTierFilter(chip.key as TierFilter)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipIcon}>{chip.icon}</Text>
                <Text style={[styles.chipLabel, chip.active && styles.chipLabelActive]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Favorites Toggle */}
        <TouchableOpacity
          style={[styles.favoritesToggle, showFavoritesOnly && styles.favoritesToggleActive]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
          activeOpacity={0.7}
        >
          <Text style={styles.favoritesIcon}>{showFavoritesOnly ? '⭐' : '☆'}</Text>
          <Text style={[styles.favoritesLabel, showFavoritesOnly && styles.favoritesLabelActive]}>
            Show Favorites Only
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // ============================================================================
  // RENDER CONTENT
  // ============================================================================

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={fetchPredictions}
            style={styles.retryButton}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isLoading && predictions.length === 0) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4BC41E" />
          <Text style={styles.loadingText}>Loading predictions...</Text>
        </View>
      );
    }

    return (
      <PredictionsList
        predictions={predictions}
        filterByResult={resultFilter}
        filterByTier={tierFilter}
        showFavoritesOnly={showFavoritesOnly}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onPredictionPress={onPredictionPress}
        onFavoriteToggle={onFavoriteToggle}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* WebSocket Connection Status */}
      {!isConnected && (
        <View style={styles.connectionBanner}>
          <Text style={styles.connectionText}>⚠️ Bağlantı kesildi - Yeniden bağlanılıyor...</Text>
        </View>
      )}

      <View style={styles.container}>
        {/* Filter Section */}
        {renderFilterChips()}

        {/* Predictions List */}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  connectionBanner: {
    backgroundColor: '#DC2626',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  connectionText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.small,
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  filterSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.2)',
    padding: spacing.lg,
    gap: spacing.md,
  },
  filterRow: {
    gap: spacing.sm,
  },
  filterTitle: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    borderColor: '#4BC41E',
  },
  chipIcon: {
    fontSize: 14,
  },
  chipLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  chipLabelActive: {
    fontFamily: typography.fonts.ui.semibold,
    color: '#4BC41E',
  },
  favoritesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  favoritesToggleActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: '#FFD700',
  },
  favoritesIcon: {
    fontSize: 20,
  },
  favoritesLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  favoritesLabelActive: {
    fontFamily: typography.fonts.ui.semibold,
    color: '#FFD700',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.md,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  errorText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: '#4BC41E',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  retryButtonText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default PredictionsScreen;
