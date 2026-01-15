/**
 * TrendTab Component
 * Displays minute-by-minute trends and momentum
 */

import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, borderRadius } from '../../../constants/theme';
import { GlassCard } from '../../atoms/GlassCard';
import { NeonText } from '../../atoms/NeonText';
import { NoDataAvailable } from '../../templates/EmptyState';

// ============================================================================
// TYPES
// ============================================================================

export interface TrendDataPoint {
  minute: number;
  homeScore: number;
  awayScore: number;
  event?: string; // e.g., "GOAL", "CARD", etc.
  eventTeam?: 'home' | 'away';
}

export interface MomentumData {
  minute: number;
  homeMomentum: number; // 0-100
  awayMomentum: number; // 0-100
}

export interface TrendTabProps {
  /** Trend data points */
  trendData?: TrendDataPoint[];

  /** Momentum data */
  momentum?: MomentumData[];

  /** Home team name */
  homeTeamName: string;

  /** Away team name */
  awayTeamName: string;

  /** Loading state */
  loading?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.md * 4;
const CHART_HEIGHT = 200;

// ============================================================================
// SCORE TIMELINE COMPONENT
// ============================================================================

interface ScoreTimelineProps {
  data: TrendDataPoint[];
  homeTeamName: string;
  awayTeamName: string;
}

const ScoreTimeline: React.FC<ScoreTimelineProps> = ({ data, homeTeamName, awayTeamName }) => {
  const { theme } = useTheme();

  // Get max score for scaling
  const maxScore = Math.max(
    ...data.map((d) => Math.max(d.homeScore, d.awayScore)),
    5 // Minimum scale
  );

  // Get max minute
  const maxMinute = Math.max(...data.map((d) => d.minute), 90);

  return (
    <View style={styles.chartContainer}>
      <NeonText size="sm" color="primary" style={styles.chartTitle}>
        Skor Gelişimi
      </NeonText>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: theme.primary[500] }]} />
          <NeonText size="xs" style={{ color: theme.text.tertiary }}>
            {homeTeamName}
          </NeonText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: theme.text.tertiary }]} />
          <NeonText size="xs" style={{ color: theme.text.tertiary }}>
            {awayTeamName}
          </NeonText>
        </View>
      </View>

      {/* Chart */}
      <View style={[styles.chart, { height: CHART_HEIGHT }]}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          {[maxScore, Math.floor(maxScore / 2), 0].map((value) => (
            <NeonText
              key={value}
              size="xs"
              style={{ ...styles.yAxisLabel, color: theme.text.tertiary }}
            >
              {value}
            </NeonText>
          ))}
        </View>

        {/* Chart area */}
        <View style={styles.chartArea}>
          {/* Grid lines */}
          <View style={styles.gridLines}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.gridLine, { backgroundColor: theme.border.primary }]} />
            ))}
          </View>

          {/* Data points */}
          <View style={styles.dataLayer}>
            {data.map((point, index) => {
              const x = (point.minute / maxMinute) * CHART_WIDTH;
              const homeY = CHART_HEIGHT - (point.homeScore / maxScore) * CHART_HEIGHT;
              const awayY = CHART_HEIGHT - (point.awayScore / maxScore) * CHART_HEIGHT;

              return (
                <View key={index}>
                  {/* Home score point */}
                  <View
                    style={[
                      styles.dataPoint,
                      {
                        left: x,
                        top: homeY,
                        backgroundColor: theme.primary[500],
                      },
                    ]}
                  />

                  {/* Away score point */}
                  <View
                    style={[
                      styles.dataPoint,
                      {
                        left: x,
                        top: awayY,
                        backgroundColor: theme.text.tertiary,
                      },
                    ]}
                  />

                  {/* Event marker */}
                  {point.event && (
                    <View
                      style={[
                        styles.eventMarker,
                        {
                          left: x,
                          top: point.eventTeam === 'home' ? homeY : awayY,
                        },
                      ]}
                    >
                      <NeonText size="xs">{point.event === 'GOAL' ? '⚽' : '●'}</NeonText>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* X-axis labels */}
      <View style={styles.xAxis}>
        {[0, 45, 90].map((minute) => (
          <NeonText
            key={minute}
            size="xs"
            style={{ ...styles.xAxisLabel, color: theme.text.tertiary }}
          >
            {minute}'
          </NeonText>
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// MOMENTUM BAR COMPONENT
// ============================================================================

interface MomentumBarProps {
  data: MomentumData[];
  homeTeamName: string;
  awayTeamName: string;
}

const MomentumBar: React.FC<MomentumBarProps> = ({ data, homeTeamName, awayTeamName }) => {
  const { theme } = useTheme();

  // Get latest momentum
  const latest = data[data.length - 1];
  const homePercent = latest ? latest.homeMomentum : 50;
  const awayPercent = latest ? latest.awayMomentum : 50;

  return (
    <View style={styles.momentumContainer}>
      <NeonText size="sm" color="primary" style={styles.chartTitle}>
        Momentum
      </NeonText>

      {/* Team names */}
      <View style={styles.momentumHeader}>
        <NeonText size="sm" color="primary">
          {homeTeamName}
        </NeonText>
        <NeonText size="sm" style={{ color: theme.text.secondary }}>
          {awayTeamName}
        </NeonText>
      </View>

      {/* Bar */}
      <View style={[styles.momentumBar, { backgroundColor: theme.background.elevated }]}>
        <View
          style={[
            styles.momentumFill,
            {
              width: `${homePercent}%`,
              backgroundColor: theme.primary[500],
            },
          ]}
        />
      </View>

      {/* Percentages */}
      <View style={styles.momentumPercentages}>
        <NeonText size="lg" color="primary">
          {Math.round(homePercent)}%
        </NeonText>
        <NeonText size="lg" style={{ color: theme.text.secondary }}>
          {Math.round(awayPercent)}%
        </NeonText>
      </View>

      {/* Description */}
      <NeonText size="xs" style={{ ...styles.momentumDescription, color: theme.text.tertiary }}>
        Son 10 dakikalık momentum dağılımı
      </NeonText>
    </View>
  );
};

// ============================================================================
// KEY MOMENTS COMPONENT
// ============================================================================

interface KeyMomentsProps {
  data: TrendDataPoint[];
}

const KeyMoments: React.FC<KeyMomentsProps> = ({ data }) => {
  const { theme } = useTheme();

  const keyMoments = data.filter((point) => point.event);

  if (keyMoments.length === 0) {
    return null;
  }

  return (
    <View style={styles.keyMomentsContainer}>
      <NeonText size="sm" color="primary" style={styles.chartTitle}>
        Önemli Anlar
      </NeonText>

      <View style={styles.momentsList}>
        {keyMoments.map((moment, index) => (
          <View
            key={index}
            style={[
              styles.momentItem,
              {
                backgroundColor: theme.background.tertiary,
                borderColor: theme.border.primary,
              },
            ]}
          >
            <View style={[styles.minuteBadge, { backgroundColor: theme.primary[500] }]}>
              <NeonText size="xs" style={{ color: theme.text.inverse, fontWeight: '600' }}>
                {moment.minute}'
              </NeonText>
            </View>

            <NeonText size="sm" style={{ flex: 1, color: theme.text.primary }}>
              {moment.event === 'GOAL' ? '⚽ GOL' : moment.event}
            </NeonText>

            <NeonText size="sm" color="primary">
              {moment.homeScore} - {moment.awayScore}
            </NeonText>
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const TrendTab: React.FC<TrendTabProps> = ({
  trendData,
  momentum,
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

  if (!trendData || trendData.length === 0) {
    return (
      <View style={styles.container}>
        <NoDataAvailable />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Score Timeline */}
      <GlassCard intensity="light" style={styles.card}>
        <ScoreTimeline data={trendData} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />
      </GlassCard>

      {/* Momentum Bar */}
      {momentum && momentum.length > 0 && (
        <GlassCard intensity="light" style={styles.card}>
          <MomentumBar data={momentum} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />
        </GlassCard>
      )}

      {/* Key Moments */}
      <GlassCard intensity="light" style={styles.card}>
        <KeyMoments data={trendData} />
      </GlassCard>
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
    gap: spacing[4],
  },
  card: {
    padding: spacing.lg,
  },
  chartContainer: {
    marginBottom: spacing[2],
  },
  chartTitle: {
    marginBottom: spacing[3],
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  chart: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  yAxis: {
    width: 30,
    justifyContent: 'space-between',
    paddingRight: spacing[2],
  },
  yAxisLabel: {
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    opacity: 0.2,
  },
  dataLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginTop: -4,
  },
  eventMarker: {
    position: 'absolute',
    marginLeft: -8,
    marginTop: -20,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
  },
  xAxisLabel: {
    flex: 1,
    textAlign: 'center',
  },
  momentumContainer: {
    marginBottom: spacing[2],
  },
  momentumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  momentumBar: {
    height: 40,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing[3],
  },
  momentumFill: {
    height: '100%',
  },
  momentumPercentages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  momentumDescription: {
    textAlign: 'center',
  },
  keyMomentsContainer: {
    marginBottom: spacing[2],
  },
  momentsList: {
    gap: spacing[2],
  },
  momentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing[3],
  },
  minuteBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default TrendTab;
