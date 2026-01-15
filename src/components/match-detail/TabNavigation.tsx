/**
 * TabNavigation Component
 * 7-tab navigation for match detail screen
 * Stats, Events, H2H, Standings, Lineup, Trend, AI
 */

import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export type TabKey = 'stats' | 'events' | 'h2h' | 'standings' | 'lineup' | 'trend' | 'ai';

export interface Tab {
  key: TabKey;
  label: string;
  icon?: string;
}

export interface TabNavigationProps {
  /** Currently active tab */
  activeTab: TabKey;

  /** Called when tab is pressed */
  onTabChange: (tab: TabKey) => void;

  /** Custom tabs configuration */
  tabs?: Tab[];
}

// ============================================================================
// DEFAULT TABS
// ============================================================================

const DEFAULT_TABS: Tab[] = [
  { key: 'stats', label: 'İstatistikler', icon: '📊' },
  { key: 'events', label: 'Olaylar', icon: '⚽' },
  { key: 'h2h', label: 'Karşılaşma', icon: '🔄' },
  { key: 'standings', label: 'Puan Durumu', icon: '🏆' },
  { key: 'lineup', label: 'Kadro', icon: '👥' },
  { key: 'trend', label: 'Trend', icon: '📈' },
  { key: 'ai', label: 'AI Tahmin', icon: '🤖' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  tabs = DEFAULT_TABS,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // RENDER TAB
  // ============================================================================

  const renderTab = (tab: Tab) => {
    const isActive = activeTab === tab.key;

    return (
      <Pressable
        key={tab.key}
        onPress={() => onTabChange(tab.key)}
        style={({ pressed }) => [
          styles.tab,
          {
            backgroundColor: isActive ? theme.primary[500] : theme.background.tertiary,
            borderColor: isActive ? theme.primary[500] : theme.border.primary,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        {/* Icon */}
        {tab.icon && (
          <NeonText size="sm" style={styles.tabIcon}>
            {tab.icon}
          </NeonText>
        )}

        {/* Label */}
        <NeonText
          size="sm"
          color={isActive ? 'primary' : undefined}
          style={{
            color: isActive ? theme.text.inverse : theme.text.primary,
            fontWeight: isActive ? '600' : '400',
          }}
        >
          {tab.label}
        </NeonText>

        {/* Active Indicator */}
        {isActive && (
          <View style={[styles.activeIndicator, { backgroundColor: theme.text.inverse }]} />
        )}
      </Pressable>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map(renderTab)}
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.1)',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing[2],
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    minHeight: 40,
    position: 'relative',
  },
  tabIcon: {
    marginRight: spacing[2],
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -spacing[3] - 1,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default TabNavigation;
