/**
 * RefreshableScrollView Component
 * ScrollView with pull-to-refresh functionality
 * Themed refresh control with loading states
 */

import React, { ReactNode } from 'react';
import { ScrollView, RefreshControl, ScrollViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

export interface RefreshableScrollViewProps extends ScrollViewProps {
  /** Children components */
  children: ReactNode;

  /** Is refreshing */
  refreshing: boolean;

  /** Refresh callback */
  onRefresh: () => void;

  /** Custom refresh control colors */
  tintColor?: string;

  /** Custom container style */
  style?: ViewStyle;

  /** Custom content container style */
  contentContainerStyle?: ViewStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const RefreshableScrollView: React.FC<RefreshableScrollViewProps> = ({
  children,
  refreshing,
  onRefresh,
  tintColor,
  style,
  contentContainerStyle,
  ...rest
}) => {
  const { theme, isDark } = useTheme();

  // ============================================================================
  // REFRESH CONTROL
  // ============================================================================

  const refreshControlComponent = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={tintColor || theme.primary[500]}
      colors={[theme.primary[500]]} // Android
      progressBackgroundColor={isDark ? theme.background.tertiary : theme.background.primary} // Android
    />
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      refreshControl={refreshControlComponent}
      showsVerticalScrollIndicator={false}
      {...rest}
    >
      {children}
    </ScrollView>
  );
};

// ============================================================================
// HOOK FOR REFRESH LOGIC
// ============================================================================

/**
 * useRefresh Hook
 * Manages refresh state and logic
 *
 * @example
 * ```tsx
 * const { refreshing, onRefresh } = useRefresh(async () => {
 *   await fetchData();
 * });
 *
 * <RefreshableScrollView refreshing={refreshing} onRefresh={onRefresh}>
 *   {content}
 * </RefreshableScrollView>
 * ```
 */
export const useRefresh = (refreshCallback: () => Promise<void>) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshCallback();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshCallback]);

  return { refreshing, onRefresh };
};

// ============================================================================
// EXPORT
// ============================================================================

export default RefreshableScrollView;
