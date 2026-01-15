/**
 * LeagueFilterChips Component
 * Horizontal scrollable league filter chips
 */

import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';
import { TeamBadge } from '../molecules/TeamBadge';

// ============================================================================
// TYPES
// ============================================================================

export interface League {
  id: number;
  name: string;
  logoUrl?: string;
  country?: string;
  matchCount?: number;
}

export interface LeagueFilterChipsProps {
  leagues: League[];
  selectedLeagueId: number | null;
  onSelectLeague: (leagueId: number | null) => void;
  showMatchCount?: boolean;
}

// ============================================================================
// FILTER CHIP COMPONENT
// ============================================================================

interface FilterChipProps {
  league: League | { id: null; name: string; matchCount?: number };
  isSelected: boolean;
  onPress: () => void;
  showMatchCount?: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({
  league,
  isSelected,
  onPress,
  showMatchCount = false,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.chip,
          {
            backgroundColor: isSelected ? theme.primary[500] : theme.background.elevated,
            borderColor: isSelected ? theme.primary[500] : theme.border.primary,
          },
        ]}
      >
        {/* Logo (if available and not "All") */}
        {league.id !== null && 'logoUrl' in league && league.logoUrl && (
          <TeamBadge
            name={league.name}
            logoUrl={league.logoUrl}
            size="small"
            showFullName={false}
          />
        )}

        {/* Name */}
        <NeonText
          size="sm"
          style={{
            color: isSelected ? theme.text.inverse : theme.text.primary,
            fontWeight: isSelected ? '600' : '400',
          }}
        >
          {league.name}
        </NeonText>

        {/* Match Count */}
        {showMatchCount && league.matchCount !== undefined && league.matchCount > 0 && (
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: isSelected ? theme.text.inverse + '20' : theme.primary[500] + '20',
              },
            ]}
          >
            <NeonText
              size="small"
              style={{
                color: isSelected ? theme.text.inverse : theme.primary[500],
                fontWeight: '600',
              }}
            >
              {league.matchCount}
            </NeonText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const LeagueFilterChips: React.FC<LeagueFilterChipsProps> = ({
  leagues,
  selectedLeagueId,
  onSelectLeague,
  showMatchCount = true,
}) => {
  const { theme } = useTheme();

  // Calculate total match count
  const totalMatchCount = React.useMemo(() => {
    return leagues.reduce((sum, league) => sum + (league.matchCount || 0), 0);
  }, [leagues]);

  // Sort leagues by match count (descending)
  const sortedLeagues = React.useMemo(() => {
    return [...leagues].sort((a, b) => (b.matchCount || 0) - (a.matchCount || 0));
  }, [leagues]);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <NeonText size="sm" style={{ color: theme.text.tertiary }}>
          Ligler
        </NeonText>
        {showMatchCount && (
          <NeonText size="small" style={{ color: theme.text.tertiary }}>
            {totalMatchCount} Canlı Maç
          </NeonText>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* "All" Chip */}
        <FilterChip
          league={{ id: null, name: 'Tümü', matchCount: totalMatchCount }}
          isSelected={selectedLeagueId === null}
          onPress={() => onSelectLeague(null)}
          showMatchCount={showMatchCount}
        />

        {/* League Chips */}
        {sortedLeagues.map((league) => (
          <FilterChip
            key={league.id}
            league={league}
            isSelected={selectedLeagueId === league.id}
            onPress={() => onSelectLeague(league.id)}
            showMatchCount={showMatchCount}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[3],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing[2],
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing[2],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  countBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default LeagueFilterChips;
