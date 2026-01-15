/**
 * ShareButton Component
 *
 * Reusable share button with consistent styling
 * - Icon button
 * - Loading state
 * - Customizable size and color
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ============================================================================
// TYPES
// ============================================================================

export interface ShareButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'icon' | 'button';
  label?: string;
  color?: string;
  style?: ViewStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ShareButton: React.FC<ShareButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
  size = 'medium',
  variant = 'icon',
  label = 'Share',
  color = '#FFFFFF',
  style,
}) => {
  // Size mapping
  const sizeMap = {
    small: 20,
    medium: 24,
    large: 28,
  };

  const iconSize = sizeMap[size];
  const buttonSize = iconSize + 16;

  // Determine if button is pressable
  const isDisabled = disabled || loading;

  // Render icon button
  if (variant === 'icon') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[
          styles.iconButton,
          {
            width: buttonSize,
            height: buttonSize,
            opacity: isDisabled ? 0.5 : 1,
          },
          style,
        ]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <Ionicons
            name="share-outline"
            size={iconSize}
            color={color}
          />
        )}
      </TouchableOpacity>
    );
  }

  // Render button with label
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.labelButton,
        {
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <>
          <Ionicons
            name="share-outline"
            size={iconSize}
            color={color}
            style={styles.icon}
          />
          <Text style={[styles.label, { color }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  labelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ShareButton;
