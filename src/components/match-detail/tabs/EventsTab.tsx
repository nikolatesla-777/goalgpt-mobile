/**
 * EventsTab Component
 * Displays match events timeline (goals, cards, substitutions)
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

export type EventType =
  | 'goal'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'penalty'
  | 'own_goal'
  | 'var';

export interface MatchEvent {
  id: string | number;
  type: EventType;
  minute: number;
  additionalTime?: number;
  team: 'home' | 'away';
  player: string;
  secondPlayer?: string; // For substitutions (player out)
  assistPlayer?: string; // For goals
  description?: string;
}

export interface EventsTabProps {
  /** Match events */
  events?: MatchEvent[];

  /** Home team name */
  homeTeamName: string;

  /** Away team name */
  awayTeamName: string;

  /** Loading state */
  loading?: boolean;
}

// ============================================================================
// EVENT ICON HELPER
// ============================================================================

const getEventIcon = (type: EventType): string => {
  switch (type) {
    case 'goal':
      return '⚽';
    case 'penalty':
      return '⚽';
    case 'own_goal':
      return '🔴';
    case 'yellow_card':
      return '🟨';
    case 'red_card':
      return '🟥';
    case 'substitution':
      return '🔄';
    case 'var':
      return '📹';
    default:
      return '•';
  }
};

const getEventLabel = (type: EventType): string => {
  switch (type) {
    case 'goal':
      return 'GOL';
    case 'penalty':
      return 'PENALTI';
    case 'own_goal':
      return 'KENDI KALESİNE';
    case 'yellow_card':
      return 'SARI KART';
    case 'red_card':
      return 'KIRMIZI KART';
    case 'substitution':
      return 'DEĞİŞİKLİK';
    case 'var':
      return 'VAR';
    default:
      return '';
  }
};

const getEventColor = (type: EventType): 'primary' | 'success' | 'error' | 'warning' => {
  switch (type) {
    case 'goal':
    case 'penalty':
      return 'success';
    case 'own_goal':
    case 'red_card':
      return 'error';
    case 'yellow_card':
      return 'warning';
    default:
      return 'primary';
  }
};

// ============================================================================
// EVENT ITEM COMPONENT
// ============================================================================

interface EventItemProps {
  event: MatchEvent;
  homeTeamName: string;
  awayTeamName: string;
}

const EventItem: React.FC<EventItemProps> = ({ event, homeTeamName, awayTeamName }) => {
  const { theme } = useTheme();
  const isHome = event.team === 'home';

  const formatMinute = (): string => {
    if (event.additionalTime) {
      return `${event.minute}+${event.additionalTime}'`;
    }
    return `${event.minute}'`;
  };

  return (
    <View style={styles.eventItem}>
      {/* Timeline */}
      <View style={styles.timeline}>
        <View style={[styles.timelineDot, { backgroundColor: theme.primary[500] }]} />
        <View style={[styles.timelineLine, { backgroundColor: theme.border.primary }]} />
      </View>

      {/* Event Card */}
      <GlassCard
        intensity="light"
        style={{
          ...styles.eventCard,
          alignSelf: isHome ? 'flex-start' : 'flex-end',
        }}
      >
        {/* Minute */}
        <View style={styles.minuteBadge}>
          <NeonText size="xs" color={getEventColor(event.type)} glow="small">
            {formatMinute()}
          </NeonText>
        </View>

        {/* Event Icon & Type */}
        <View style={styles.eventHeader}>
          <NeonText size="lg">{getEventIcon(event.type)}</NeonText>
          <NeonText size="sm" color={getEventColor(event.type)} style={styles.eventType}>
            {getEventLabel(event.type)}
          </NeonText>
        </View>

        {/* Player Info */}
        <View style={styles.playerInfo}>
          <NeonText size="md" style={{ color: theme.text.primary, fontWeight: '600' }}>
            {event.player}
          </NeonText>

          {/* Team Badge */}
          <NeonText size="xs" style={{ color: theme.text.tertiary, marginTop: spacing[1] }}>
            {isHome ? homeTeamName : awayTeamName}
          </NeonText>

          {/* Assist */}
          {event.assistPlayer && (
            <NeonText size="sm" style={{ color: theme.text.secondary, marginTop: spacing[1] }}>
              Asist: {event.assistPlayer}
            </NeonText>
          )}

          {/* Substitution - Out Player */}
          {event.type === 'substitution' && event.secondPlayer && (
            <View style={styles.substitution}>
              <NeonText size="sm" style={{ color: theme.text.secondary }}>
                ↑ {event.player}
              </NeonText>
              <NeonText size="sm" style={{ color: theme.text.tertiary }}>
                ↓ {event.secondPlayer}
              </NeonText>
            </View>
          )}

          {/* Description */}
          {event.description && (
            <NeonText size="xs" style={{ color: theme.text.tertiary, marginTop: spacing[1] }}>
              {event.description}
            </NeonText>
          )}
        </View>
      </GlassCard>
    </View>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const EventsTab: React.FC<EventsTabProps> = ({
  events,
  homeTeamName,
  awayTeamName,
  loading = false,
}) => {
  const { theme } = useTheme();

  // Sort events by minute (descending - latest first)
  const sortedEvents = React.useMemo(() => {
    if (!events) return [];
    return [...events].sort((a, b) => {
      const aTotal = a.minute + (a.additionalTime || 0);
      const bTotal = b.minute + (b.additionalTime || 0);
      return bTotal - aTotal;
    });
  }, [events]);

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

  if (!events || events.length === 0) {
    return (
      <View style={styles.container}>
        <NoDataAvailable />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <NeonText size="md" color="primary">
          Maç Olayları
        </NeonText>
        <NeonText size="sm" style={{ color: theme.text.secondary, marginTop: spacing[1] }}>
          {sortedEvents.length} olay
        </NeonText>
      </View>

      {/* Events Timeline */}
      <View style={styles.timeline}>
        {sortedEvents.map((event, index) => (
          <EventItem
            key={event.id || index}
            event={event}
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
          />
        ))}

        {/* Kickoff Marker */}
        <View style={styles.kickoffMarker}>
          <View style={[styles.kickoffDot, { backgroundColor: theme.primary[500] }]} />
          <NeonText size="sm" color="primary" style={styles.kickoffText}>
            ⚽ Maç Başlangıcı
          </NeonText>
        </View>
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
  header: {
    marginBottom: spacing[6],
  },
  timeline: {
    position: 'relative',
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: spacing[4],
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: spacing[2],
  },
  timelineLine: {
    position: 'absolute',
    top: 20,
    left: 5.5,
    width: 1,
    height: '100%',
  },
  eventCard: {
    flex: 1,
    marginLeft: spacing[4],
    padding: spacing[4],
    maxWidth: '85%',
  },
  minuteBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    backgroundColor: 'rgba(75, 196, 30, 0.1)',
    borderRadius: borderRadius.sm,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  eventType: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  playerInfo: {
    marginTop: spacing[1],
  },
  substitution: {
    marginTop: spacing[2],
    gap: spacing[1],
  },
  kickoffMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[4],
  },
  kickoffDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  kickoffText: {
    marginLeft: spacing[4],
    fontWeight: '600',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default EventsTab;
