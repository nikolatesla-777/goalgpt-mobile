/**
 * OptimizedFlatList Component
 * Wrapper around FlatList with performance optimizations
 * - Automatic windowing
 * - Memo-ized rendering
 * - Optimized item layout
 * - Remove clipped subviews
 */

import React, { useMemo, useCallback } from 'react';
import { FlatList, FlatListProps, StyleSheet, View, Text } from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export interface OptimizedFlatListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  /** Data array */
  data: T[];
  /** Render item function */
  renderItem: (item: T, index: number) => React.ReactElement | null;
  /** Key extractor function */
  keyExtractor: (item: T, index: number) => string;
  /** Fixed item height (for better performance) */
  itemHeight?: number;
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  loading?: boolean;
  /** Show item separator */
  showSeparator?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function OptimizedFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  itemHeight,
  emptyMessage = 'No items found',
  loading = false,
  showSeparator = false,
  ...props
}: OptimizedFlatListProps<T>) {
  // ============================================================================
  // MEMOIZED RENDER ITEM
  // ============================================================================

  const renderItemMemoized = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      return renderItem(item, index);
    },
    [renderItem]
  );

  // ============================================================================
  // GET ITEM LAYOUT
  // ============================================================================

  /**
   * If itemHeight is provided, use getItemLayout for better performance
   * This allows FlatList to skip measuring items and improves scrolling
   */
  const getItemLayout = useMemo(() => {
    if (!itemHeight) return undefined;

    return (_data: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [itemHeight]);

  // ============================================================================
  // EMPTY COMPONENT
  // ============================================================================

  const renderEmptyComponent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }, [loading, emptyMessage]);

  // ============================================================================
  // ITEM SEPARATOR
  // ============================================================================

  const renderSeparator = useCallback(() => {
    if (!showSeparator) return null;
    return <View style={styles.separator} />;
  }, [showSeparator]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <FlatList
      // Data
      data={data}
      renderItem={renderItemMemoized}
      keyExtractor={keyExtractor}
      // Performance optimizations
      removeClippedSubviews={true} // Unmount components outside viewport
      maxToRenderPerBatch={10} // Render 10 items per batch
      windowSize={5} // Keep 5 screen heights worth of items in memory
      initialNumToRender={10} // Render 10 items initially
      updateCellsBatchingPeriod={50} // Update cells every 50ms
      getItemLayout={getItemLayout} // Pre-calculated item positions
      // UI
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={showSeparator ? renderSeparator : undefined}
      // Style
      contentContainerStyle={data.length === 0 ? styles.emptyContentContainer : undefined}
      {...props}
    />
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[6],
  },
  emptyText: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginHorizontal: spacing[4],
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default OptimizedFlatList;
