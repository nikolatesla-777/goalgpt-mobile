/**
 * AITab Component
 * Displays AI predictions for the match
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, borderRadius } from '../../../constants/theme';
import { GlassCard } from '../../atoms/GlassCard';
import { NeonText } from '../../atoms/NeonText';
import { NoDataAvailable } from '../../templates/EmptyState';

// ============================================================================
// TYPES
// ============================================================================

export interface AIPrediction {
  id: number;
  botName: string;
  botAvatar?: string;
  prediction: 'HOME_WIN' | 'DRAW' | 'AWAY_WIN';
  confidence: number; // 0-100
  predictedScore?: {
    home: number;
    away: number;
  };
  reasoning?: string;
  timestamp: string;
}

export interface AITabProps {
  /** AI predictions */
  predictions?: AIPrediction[];

  /** Home team name */
  homeTeamName: string;

  /** Away team name */
  awayTeamName: string;

  /** Loading state */
  loading?: boolean;
}

// ============================================================================
// PREDICTION CARD COMPONENT
// ============================================================================

interface PredictionCardProps {
  prediction: AIPrediction;
  homeTeamName: string;
  awayTeamName: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  homeTeamName,
  awayTeamName,
}) => {
  const { theme } = useTheme();

  const getPredictionText = (): string => {
    switch (prediction.prediction) {
      case 'HOME_WIN':
        return `${homeTeamName} Kazanır`;
      case 'AWAY_WIN':
        return `${awayTeamName} Kazanır`;
      case 'DRAW':
        return 'Beraberlik';
      default:
        return 'Bilinmiyor';
    }
  };

  const getPredictionColor = (): 'primary' | 'success' | 'warning' => {
    switch (prediction.prediction) {
      case 'HOME_WIN':
        return 'success';
      case 'AWAY_WIN':
        return 'primary';
      case 'DRAW':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getConfidenceColor = (): string => {
    if (prediction.confidence >= 75) return theme.primary[500];
    if (prediction.confidence >= 50) return theme.warning.main;
    return theme.text.secondary;
  };

  return (
    <GlassCard intensity="light" style={styles.predictionCard}>
      {/* Bot Info */}
      <View style={styles.botHeader}>
        <View style={[styles.botAvatar, { backgroundColor: theme.primary[500] }]}>
          <NeonText size="lg">{prediction.botAvatar || '🤖'}</NeonText>
        </View>
        <View style={styles.botInfo}>
          <NeonText size="md" color="primary" style={{ fontWeight: '600' }}>
            {prediction.botName}
          </NeonText>
          <NeonText size="xs" style={{ color: theme.text.tertiary, marginTop: spacing[1] }}>
            {new Date(prediction.timestamp).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </NeonText>
        </View>
      </View>

      {/* Prediction */}
      <View style={styles.predictionSection}>
        <NeonText size="lg" color={getPredictionColor()} style={styles.predictionText}>
          {getPredictionText()}
        </NeonText>

        {/* Predicted Score */}
        {prediction.predictedScore && (
          <NeonText size="2xl" color="primary" style={styles.predictedScore}>
            {prediction.predictedScore.home} - {prediction.predictedScore.away}
          </NeonText>
        )}
      </View>

      {/* Confidence Bar */}
      <View style={styles.confidenceSection}>
        <View style={styles.confidenceHeader}>
          <NeonText size="sm" style={{ color: theme.text.secondary }}>
            Güven Skoru
          </NeonText>
          <NeonText size="sm" style={{ color: getConfidenceColor(), fontWeight: '600' }}>
            {prediction.confidence}%
          </NeonText>
        </View>

        <View style={[styles.confidenceBar, { backgroundColor: theme.background.elevated }]}>
          <View
            style={[
              styles.confidenceFill,
              {
                width: `${prediction.confidence}%`,
                backgroundColor: getConfidenceColor(),
              },
            ]}
          />
        </View>
      </View>

      {/* Reasoning */}
      {prediction.reasoning && (
        <View style={styles.reasoningSection}>
          <NeonText size="sm" style={{ ...styles.reasoningLabel, color: theme.text.tertiary }}>
            Analiz:
          </NeonText>
          <NeonText size="sm" style={{ color: theme.text.secondary, lineHeight: 20 }}>
            {prediction.reasoning}
          </NeonText>
        </View>
      )}
    </GlassCard>
  );
};

// ============================================================================
// SUMMARY COMPONENT
// ============================================================================

interface SummaryProps {
  predictions: AIPrediction[];
  homeTeamName: string;
  awayTeamName: string;
}

const Summary: React.FC<SummaryProps> = ({ predictions, homeTeamName, awayTeamName }) => {
  const { theme } = useTheme();

  // Calculate predictions distribution
  const homeWinCount = predictions.filter((p) => p.prediction === 'HOME_WIN').length;
  const drawCount = predictions.filter((p) => p.prediction === 'DRAW').length;
  const awayWinCount = predictions.filter((p) => p.prediction === 'AWAY_WIN').length;

  const total = predictions.length;
  const homeWinPercent = (homeWinCount / total) * 100;
  const drawPercent = (drawCount / total) * 100;
  const awayWinPercent = (awayWinCount / total) * 100;

  // Calculate average confidence
  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / total;

  return (
    <GlassCard intensity="medium" style={styles.summaryCard}>
      <NeonText size="md" color="primary" style={styles.summaryTitle}>
        AI Tahmin Özeti
      </NeonText>

      {/* Total Predictions */}
      <View style={styles.summaryRow}>
        <NeonText size="sm" style={{ color: theme.text.secondary }}>
          Toplam Tahmin
        </NeonText>
        <NeonText size="lg" color="primary">
          {total}
        </NeonText>
      </View>

      {/* Distribution */}
      <View style={styles.distributionSection}>
        <View style={styles.distributionRow}>
          <NeonText size="sm" style={{ flex: 1, color: theme.text.primary }}>
            {homeTeamName} Kazanır
          </NeonText>
          <NeonText size="md" color="success" style={{ fontWeight: '600' }}>
            {homeWinCount}
          </NeonText>
        </View>

        <View style={styles.distributionRow}>
          <NeonText size="sm" style={{ flex: 1, color: theme.text.primary }}>
            Beraberlik
          </NeonText>
          <NeonText size="md" style={{ color: theme.warning.main, fontWeight: '600' }}>
            {drawCount}
          </NeonText>
        </View>

        <View style={styles.distributionRow}>
          <NeonText size="sm" style={{ flex: 1, color: theme.text.primary }}>
            {awayTeamName} Kazanır
          </NeonText>
          <NeonText size="md" color="primary" style={{ fontWeight: '600' }}>
            {awayWinCount}
          </NeonText>
        </View>
      </View>

      {/* Percentage Bar */}
      <View style={[styles.percentageBar, { backgroundColor: theme.background.elevated }]}>
        <View
          style={[
            styles.homeWinBar,
            {
              width: `${homeWinPercent}%`,
              backgroundColor: theme.success.main,
            },
          ]}
        />
        <View
          style={[
            styles.drawBar,
            {
              width: `${drawPercent}%`,
              backgroundColor: theme.warning.main,
            },
          ]}
        />
        <View
          style={[
            styles.awayWinBar,
            {
              width: `${awayWinPercent}%`,
              backgroundColor: theme.primary[500],
            },
          ]}
        />
      </View>

      {/* Average Confidence */}
      <View style={styles.avgConfidenceSection}>
        <NeonText size="sm" style={{ color: theme.text.secondary }}>
          Ortalama Güven Skoru
        </NeonText>
        <NeonText size="xl" color="primary" style={{ fontWeight: 'bold' }}>
          {Math.round(avgConfidence)}%
        </NeonText>
      </View>
    </GlassCard>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const AITab: React.FC<AITabProps> = ({
  predictions,
  homeTeamName,
  awayTeamName,
  loading = false,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <View style={styles.container}>
        <NoDataAvailable size="small" />
      </View>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <View style={styles.container}>
        <NoDataAvailable />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Summary */}
      <Summary predictions={predictions} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />

      {/* Individual Predictions */}
      <View style={styles.predictionsSection}>
        <NeonText size="md" color="primary" style={styles.sectionTitle}>
          Tüm AI Tahminleri
        </NeonText>

        {predictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  summaryCard: {
    padding: spacing.lg,
    marginBottom: spacing[4],
  },
  summaryTitle: {
    marginBottom: spacing[4],
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  distributionSection: {
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  percentageBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  homeWinBar: {
    height: '100%',
  },
  drawBar: {
    height: '100%',
  },
  awayWinBar: {
    height: '100%',
  },
  avgConfidenceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 196, 30, 0.1)',
  },
  predictionsSection: {
    gap: spacing[3],
  },
  sectionTitle: {
    marginBottom: spacing[2],
    fontWeight: '600',
  },
  predictionCard: {
    padding: spacing.lg,
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  botAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botInfo: {
    flex: 1,
    marginLeft: spacing[3],
  },
  predictionSection: {
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.1)',
  },
  predictionText: {
    fontWeight: 'bold',
    marginBottom: spacing[2],
  },
  predictedScore: {
    fontWeight: 'bold',
  },
  confidenceSection: {
    marginBottom: spacing[4],
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  confidenceBar: {
    height: 8,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
  },
  reasoningSection: {
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 196, 30, 0.1)',
  },
  reasoningLabel: {
    marginBottom: spacing[2],
    fontWeight: '600',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default AITab;
