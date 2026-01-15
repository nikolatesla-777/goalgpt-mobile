/**
 * MatchTimeline Component
 *
 * Organism component for match events timeline
 * Shows goals, cards, substitutions in chronological order
 * Master Plan v1.0 compliant
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { typography, spacing, glassmorphism } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export type EventType =
  | 'goal'
  | 'penalty'
  | 'own_goal'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'var'
  | 'penalty_missed'
  | 'kickoff'
  | 'halftime'
  | 'fulltime';

export type TeamSide = 'home' | 'away';

export interface MatchEvent {
  id: string | number;
  type: EventType;
  minute: number;
  minuteExtra?: number; // e.g., 45+2
  team: TeamSide;
  playerName?: string;
  playerOut?: string; // For substitutions
  description?: string;
}

export interface MatchTimelineProps {
  /** Array of match events */
  events: MatchEvent[];

  /** Home team name */
  homeTeamName?: string;

  /** Away team name */
  awayTeamName?: string;

  /** Section title */
  title?: string;

  /** Empty state message */
  emptyMessage?: string;

  /** Show in scrollable container */
  scrollable?: boolean;
}

// ============================================================================
// EVENT CONFIG
// ============================================================================

const EVENT_CONFIG: Record<EventType, { icon: string; color: string; label: string }> = {
  goal: { icon: '⚽', color: '#4BC41E', label: 'Goal' },
  penalty: { icon: '⚽', color: '#4BC41E', label: 'Penalty Goal' },
  own_goal: { icon: '⚽', color: '#FF453A', label: 'Own Goal' },
  yellow_card: { icon: '🟨', color: '#FFD60A', label: 'Yellow Card' },
  red_card: { icon: '🟥', color: '#FF453A', label: 'Red Card' },
  substitution: { icon: '🔄', color: '#64D2FF', label: 'Substitution' },
  var: { icon: '📺', color: '#BF5AF2', label: 'VAR' },
  penalty_missed: { icon: '❌', color: '#FF453A', label: 'Penalty Missed' },
  kickoff: { icon: '🏁', color: '#8E8E93', label: 'Kick Off' },
  halftime: { icon: '⏸️', color: '#8E8E93', label: 'Half Time' },
  fulltime: { icon: '🏁', color: '#8E8E93', label: 'Full Time' },
};

// ============================================================================
// COMPONENT
// ============================================================================

export const MatchTimeline: React.FC<MatchTimelineProps> = ({
  events,
  homeTeamName = 'Home',
  awayTeamName = 'Away',
  title = 'Match Timeline',
  emptyMessage = 'No events yet',
  scrollable = false,
}) => {
  // Sort events by minute (descending - latest first)
  const sortedEvents = [...events].sort((a, b) => {
    const aMinute = a.minute + (a.minuteExtra || 0);
    const bMinute = b.minute + (b.minuteExtra || 0);
    return bMinute - aMinute;
  });

  // ============================================================================
  // RENDER EVENT ITEM
  // ============================================================================

  const renderEventItem = (event: MatchEvent) => {
    const config = EVENT_CONFIG[event.type];
    const isHomeTeam = event.team === 'home';
    const teamName = isHomeTeam ? homeTeamName : awayTeamName;

    // Format minute display
    const minuteDisplay = event.minuteExtra
      ? `${event.minute}+${event.minuteExtra}'`
      : `${event.minute}'`;

    return (
      <View key={event.id} style={styles.eventItem}>
        {/* Timeline Line */}
        <View style={styles.timelineColumn}>
          <View style={styles.timelineLine} />
          <View style={[styles.timelineDot, { backgroundColor: config.color }]} />
          <View style={styles.timelineLine} />
        </View>

        {/* Event Content */}
        <View style={[styles.eventCard, isHomeTeam ? styles.eventCardLeft : styles.eventCardRight]}>
          {/* Minute Badge */}
          <View style={[styles.minuteBadge, { borderColor: config.color }]}>
            <Text style={styles.minuteText}>{minuteDisplay}</Text>
          </View>

          {/* Event Info */}
          <View style={styles.eventInfo}>
            {/* Icon + Type */}
            <View style={styles.eventHeader}>
              <Text style={styles.eventIcon}>{config.icon}</Text>
              <Text style={[styles.eventType, { color: config.color }]}>
                {config.label}
              </Text>
            </View>

            {/* Team */}
            <Text style={styles.teamText}>{teamName}</Text>

            {/* Player Name */}
            {event.playerName && (
              <Text style={styles.playerName}>
                {event.playerName}
              </Text>
            )}

            {/* Substitution Details */}
            {event.type === 'substitution' && event.playerOut && (
              <View style={styles.substitutionDetails}>
                <Text style={styles.substitutionIcon}>🔼</Text>
                <Text style={styles.substitutionPlayer}>{event.playerName}</Text>
                <Text style={styles.substitutionIcon}>🔽</Text>
                <Text style={styles.substitutionPlayer}>{event.playerOut}</Text>
              </View>
            )}

            {/* Description */}
            {event.description && (
              <Text style={styles.descriptionText}>{event.description}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  // ============================================================================
  // RENDER EMPTY STATE
  // ============================================================================

  if (sortedEvents.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.glassCard}>
          <View style={styles.header}>
            <Text style={styles.titleIcon}>⚡</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⚽</Text>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        </View>
      </View>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  const Container = scrollable ? ScrollView : View;

  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titleIcon}>⚡</Text>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.eventCount}>
            <Text style={styles.eventCountText}>{sortedEvents.length}</Text>
          </View>
        </View>

        {/* Timeline */}
        <Container
          style={scrollable ? styles.scrollContainer : undefined}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.timelineContainer}>
            {sortedEvents.map(renderEventItem)}
          </View>
        </Container>
      </View>
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
  glassCard: {
    ...glassmorphism.default,
    borderRadius: 16,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  titleIcon: {
    fontSize: 24,
  },
  title: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: typography.fontSize.button.large,
    color: '#FFFFFF',
    flex: 1,
  },
  eventCount: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  eventCountText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: typography.fontSize.button.small,
    color: '#4BC41E',
  },
  scrollContainer: {
    maxHeight: 500,
  },
  timelineContainer: {
    paddingVertical: spacing.sm,
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineColumn: {
    width: 24,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginVertical: 2,
  },
  eventCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 3,
  },
  eventCardLeft: {
    borderLeftColor: '#4BC41E',
  },
  eventCardRight: {
    borderLeftColor: '#64D2FF',
  },
  minuteBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  minuteText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: typography.fontSize.button.small,
    color: '#FFFFFF',
  },
  eventInfo: {
    gap: spacing.xs,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventIcon: {
    fontSize: 20,
  },
  eventType: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
  },
  teamText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  playerName: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
  },
  substitutionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  substitutionIcon: {
    fontSize: 14,
  },
  substitutionPlayer: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  descriptionText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
    opacity: 0.3,
  },
  emptyText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default MatchTimeline;
