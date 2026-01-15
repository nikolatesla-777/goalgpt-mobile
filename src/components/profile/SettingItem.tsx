/**
 * SettingItem Component
 * Individual setting row with icon, label, and action
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export type SettingType = 'navigation' | 'toggle' | 'display';

export interface SettingItemProps {
  icon: string;
  label: string;
  description?: string;
  type?: SettingType;
  value?: boolean | string;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showArrow?: boolean;
  danger?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  description,
  type = 'navigation',
  value,
  onPress,
  onToggle,
  showArrow = true,
  danger = false,
}) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (type === 'toggle' && onToggle && typeof value === 'boolean') {
      onToggle(!value);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.background.tertiary,
          borderColor: theme.border.primary,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={type === 'toggle' && !onToggle}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: theme.background.elevated }]}>
        <NeonText size="lg">{icon}</NeonText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <NeonText
          size="md"
          style={{
            color: danger ? theme.error.main : theme.text.primary,
            fontWeight: '500',
          }}
        >
          {label}
        </NeonText>
        {description && (
          <NeonText size="xs" style={{ color: theme.text.tertiary, marginTop: spacing[1] }}>
            {description}
          </NeonText>
        )}
      </View>

      {/* Action */}
      <View style={styles.action}>
        {type === 'toggle' && typeof value === 'boolean' && onToggle && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{
              false: theme.background.elevated,
              true: theme.primary[500] + '80',
            }}
            thumbColor={value ? theme.primary[500] : theme.text.tertiary}
            ios_backgroundColor={theme.background.elevated}
          />
        )}

        {type === 'display' && typeof value === 'string' && (
          <NeonText size="sm" style={{ color: theme.text.secondary }}>
            {value}
          </NeonText>
        )}

        {type === 'navigation' && showArrow && (
          <NeonText size="lg" style={{ color: theme.text.tertiary }}>
            ›
          </NeonText>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing[2],
    gap: spacing[3],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default SettingItem;
