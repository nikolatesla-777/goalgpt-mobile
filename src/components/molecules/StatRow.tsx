/**
 * StatRow Component
 *
 * Molecule component for displaying match statistics
 * Shows home vs away team stats with progress bar
 * Master Plan v1.0 compliant
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, typography } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface StatRowProps {
  /** Stat label (e.g., "Possession", "Shots", "Corners") */
  label: string;

  /** Home team value */
  homeValue: number | string;

  /** Away team value */
  awayValue: number | string;

  /** Show as percentage with progress bar */
  showProgress?: boolean;

  /** Highlight higher value */
  highlightHigher?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const StatRow: React.FC<StatRowProps> = ({
  label,
  homeValue,
  awayValue,
  showProgress = false,
  highlightHigher = true,
}) => {
  const { theme } = useTheme();

  // Calculate percentages for progress bar
  const homeNum = typeof homeValue === 'string' ? parseFloat(homeValue) : homeValue;
  const awayNum = typeof awayValue === 'string' ? parseFloat(awayValue) : awayValue;
  const total = homeNum + awayNum;
  const homePercent = total > 0 ? (homeNum / total) * 100 : 50;
  const awayPercent = total > 0 ? (awayNum / total) * 100 : 50;

  // Determine which side is higher
  const homeIsHigher = homeNum > awayNum;
  const awayIsHigher = awayNum > homeNum;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={styles.container}>
      {/* Values Row */}
      <View style={styles.valuesRow}>
        {/* Home Value */}
        <Text
          style={[
            styles.value,
            highlightHigher && homeIsHigher && styles.valueHighlighted,
          ]}
        >
          {homeValue}
          {showProgress && '%'}
        </Text>

        {/* Label */}
        <Text style={styles.label}>{label}</Text>

        {/* Away Value */}
        <Text
          style={[
            styles.value,
            highlightHigher && awayIsHigher && styles.valueHighlighted,
          ]}
        >
          {awayValue}
          {showProgress && '%'}
        </Text>
      </View>

      {/* Progress Bar */}
      {showProgress && (
        <View style={styles.progressContainer}>
          {/* Home Progress */}
          <View
            style={[
              styles.progressBar,
              styles.progressHome,
              { width: `${homePercent}%` },
              homeIsHigher && styles.progressHighlighted,
            ]}
          />

          {/* Away Progress */}
          <View
            style={[
              styles.progressBar,
              styles.progressAway,
              { width: `${awayPercent}%` },
              awayIsHigher && styles.progressHighlighted,
            ]}
          />
        </View>
      )}
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  valuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 16,
    color: '#8E8E93',
    width: 60,
    textAlign: 'center',
  },
  valueHighlighted: {
    color: '#4BC41E',
  },
  label: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressHome: {
    backgroundColor: 'rgba(142, 142, 147, 0.5)',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  progressAway: {
    backgroundColor: 'rgba(142, 142, 147, 0.5)',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  progressHighlighted: {
    backgroundColor: '#4BC41E',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default StatRow;
