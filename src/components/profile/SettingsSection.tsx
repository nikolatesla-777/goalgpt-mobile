/**
 * SettingsSection Component
 * Groups related settings with a title
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';
import { SettingItem, SettingItemProps } from './SettingItem';

// ============================================================================
// TYPES
// ============================================================================

export interface SettingsSectionProps {
  title: string;
  settings: SettingItemProps[];
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, settings }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <NeonText size="lg" color="primary" style={styles.title}>
        {title}
      </NeonText>

      {/* Settings List */}
      <View style={styles.list}>
        {settings.map((setting, index) => (
          <SettingItem key={index} {...setting} />
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  title: {
    marginBottom: spacing[3],
    fontWeight: '600',
    paddingHorizontal: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default SettingsSection;
