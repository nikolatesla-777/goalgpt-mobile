/**
 * BotFilterBar Component
 * Filter and sort controls for AI bots list
 */

import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export type SortOption = 'rank' | 'winRate' | 'accuracy' | 'predictions' | 'streak';
export type TierFilter = 'all' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type StatusFilter = 'all' | 'active' | 'inactive';

export interface BotFilterBarProps {
  sortBy: SortOption;
  tierFilter: TierFilter;
  statusFilter: StatusFilter;
  onSortChange: (sort: SortOption) => void;
  onTierChange: (tier: TierFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
}

// ============================================================================
// FILTER CHIP COMPONENT
// ============================================================================

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  color?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, isActive, onPress, color }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.chip,
          {
            backgroundColor: isActive ? theme.primary[500] : theme.background.elevated,
            borderColor: isActive ? theme.primary[500] : theme.border.primary,
          },
        ]}
      >
        <NeonText
          size="sm"
          style={{
            color: isActive ? theme.text.inverse : color || theme.text.primary,
            fontWeight: isActive ? '600' : '400',
          }}
        >
          {label}
        </NeonText>
      </View>
    </TouchableOpacity>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const BotFilterBar: React.FC<BotFilterBarProps> = ({
  sortBy,
  tierFilter,
  statusFilter,
  onSortChange,
  onTierChange,
  onStatusChange,
}) => {
  const { theme } = useTheme();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'rank', label: 'Sıralama' },
    { value: 'winRate', label: 'Başarı Oranı' },
    { value: 'accuracy', label: 'Doğruluk' },
    { value: 'predictions', label: 'Tahmin Sayısı' },
    { value: 'streak', label: 'Seri' },
  ];

  const tierOptions: { value: TierFilter; label: string; color?: string }[] = [
    { value: 'all', label: 'Tümü' },
    { value: 'bronze', label: 'Bronz', color: theme.levels.bronze.main },
    { value: 'silver', label: 'Gümüş', color: theme.levels.silver.main },
    { value: 'gold', label: 'Altın', color: theme.levels.gold.main },
    { value: 'platinum', label: 'Platin', color: theme.levels.platinum.main },
    { value: 'diamond', label: 'Elmas', color: theme.levels.diamond.main },
  ];

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Tümü' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Pasif' },
  ];

  return (
    <View style={styles.container}>
      {/* Sort By Section */}
      <View style={styles.section}>
        <NeonText size="sm" style={{ color: theme.text.tertiary, marginBottom: spacing[2] }}>
          Sırala:
        </NeonText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {sortOptions.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              isActive={sortBy === option.value}
              onPress={() => onSortChange(option.value)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Tier Filter Section */}
      <View style={styles.section}>
        <NeonText size="sm" style={{ color: theme.text.tertiary, marginBottom: spacing[2] }}>
          Seviye:
        </NeonText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {tierOptions.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              isActive={tierFilter === option.value}
              onPress={() => onTierChange(option.value)}
              color={option.color}
            />
          ))}
        </ScrollView>
      </View>

      {/* Status Filter Section */}
      <View style={styles.section}>
        <NeonText size="sm" style={{ color: theme.text.tertiary, marginBottom: spacing[2] }}>
          Durum:
        </NeonText>
        <View style={styles.inlineFilters}>
          {statusOptions.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              isActive={statusFilter === option.value}
              onPress={() => onStatusChange(option.value)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[3],
    gap: spacing[4],
  },
  section: {
    gap: spacing[2],
  },
  scrollContent: {
    gap: spacing[2],
    paddingHorizontal: spacing.md,
  },
  inlineFilters: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default BotFilterBar;
