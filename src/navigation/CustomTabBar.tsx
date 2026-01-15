/**
 * CustomTabBar Component
 *
 * Custom bottom tab bar with neon theme
 * Glassmorphism background with active indicators
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography, spacing } from '../constants/tokens';

// ============================================================================
// COMPONENT
// ============================================================================

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 8 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Get tab config
        const tabConfig = getTabConfig(route.name);

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            {/* Icon */}
            <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
              <Text style={[styles.icon, isFocused && styles.iconActive]}>
                {tabConfig.icon}
              </Text>
            </View>

            {/* Label */}
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {tabConfig.label}
            </Text>

            {/* Active Indicator */}
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ============================================================================
// TAB CONFIG
// ============================================================================

interface TabConfig {
  icon: string;
  label: string;
}

const getTabConfig = (routeName: string): TabConfig => {
  const configs: Record<string, TabConfig> = {
    Home: { icon: '🏠', label: 'Home' },
    LiveMatches: { icon: '⚽', label: 'Live' },
    Predictions: { icon: '🤖', label: 'AI' },
    Store: { icon: '🏪', label: 'Store' },
    Profile: { icon: '👤', label: 'Profile' },
  };

  return configs[routeName] || { icon: '❓', label: routeName };
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 196, 30, 0.2)',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(75, 196, 30, 0.15)',
  },
  icon: {
    fontSize: 24,
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  labelActive: {
    fontFamily: typography.fonts.ui.semibold,
    color: '#4BC41E',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#4BC41E',
    borderRadius: 2,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default CustomTabBar;
