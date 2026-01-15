/**
 * LeagueFilter Component
 * Horizontal scrollable chips for filtering by league
 */

import React from 'react';
import { View, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export interface League {
  id: number;
  name: string;
  logo?: string;
  country?: string;
}

export interface LeagueFilterProps {
  /** Available leagues to filter */
  leagues: League[];

  /** Currently selected league ID (null for 'All') */
  selectedLeagueId: number | null;

  /** Called when a league is selected */
  onLeagueSelect: (leagueId: number | null) => void;

  /** Show 'All' option */
  showAll?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LeagueFilter: React.FC<LeagueFilterProps> = ({
  leagues,
  selectedLeagueId,
  onLeagueSelect,
  showAll = true,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // PREPARE DATA
  // ============================================================================

  const filterItems = React.useMemo(() => {
    const items = showAll
      ? [{ id: null, name: 'Tümü', logo: undefined, country: undefined }, ...leagues]
      : leagues;

    return items;
  }, [leagues, showAll]);

  // ============================================================================
  // RENDER CHIP
  // ============================================================================

  const renderChip = ({
    item,
  }: {
    item: League | { id: null; name: string; logo?: string; country?: string };
  }) => {
    const isSelected = item.id === selectedLeagueId;

    return (
      <Pressable
        onPress={() => onLeagueSelect(item.id)}
        style={({ pressed }) => [
          styles.chip,
          {
            backgroundColor: isSelected ? theme.primary[500] : theme.background.tertiary,
            borderColor: isSelected ? theme.primary[500] : theme.border.primary,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        {/* League Logo */}
        {item.logo && (
          <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="contain" />
        )}

        {/* League Name */}
        <NeonText
          size="sm"
          color={isSelected ? 'primary' : undefined}
          style={{
            color: isSelected ? theme.text.inverse : theme.text.primary,
            fontWeight: '600',
          }}
        >
          {item.name}
        </NeonText>

        {/* Selected Indicator */}
        {isSelected && <View style={styles.selectedDot} />}
      </Pressable>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!leagues || leagues.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filterItems}
        renderItem={renderChip}
        keyExtractor={(item) => item.id?.toString() ?? 'all'}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing[3],
  },
  listContent: {
    paddingHorizontal: spacing.md,
    gap: spacing[2],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    minHeight: 40,
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: spacing[2],
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginLeft: spacing[2],
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default LeagueFilter;
