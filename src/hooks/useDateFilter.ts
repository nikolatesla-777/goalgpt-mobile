/**
 * useDateFilter Hook
 * 
 * Provides date filtering utilities for predictions and other time-based data.
 * Consolidates the date filtering logic that was previously duplicated 3x in HomeScreen.
 * 
 * @module hooks/useDateFilter
 */

import { useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type DateFilter = 'today' | 'yesterday' | 'monthly';

export interface DateBoundaries {
    today: Date;
    yesterday: Date;
    monthStart: Date;
}

export interface DateFilterableItem {
    created_at: string;
}

// ============================================================================
// UTILITY FUNCTIONS (Pure, testable)
// ============================================================================

/**
 * Get date boundaries for filtering
 * Memoization-friendly: call once per render cycle
 */
export function getDateBoundaries(): DateBoundaries {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return { today, yesterday, monthStart };
}

/**
 * Check if a date string falls within the given filter range
 * Handles invalid dates gracefully
 */
export function isDateInRange(
    dateString: string,
    dateFilter: DateFilter,
    boundaries: DateBoundaries
): boolean {
    const { today, yesterday, monthStart } = boundaries;
    const date = new Date(dateString);

    // Edge case: Invalid date
    if (isNaN(date.getTime())) {
        return false;
    }

    switch (dateFilter) {
        case 'today':
            return date >= today;
        case 'yesterday':
            return date >= yesterday && date < today;
        case 'monthly':
            return date >= monthStart;
        default:
            return true;
    }
}

/**
 * Filter items by date
 * Generic function that works with any item that has a created_at field
 */
export function filterByDate<T extends DateFilterableItem>(
    items: T[],
    dateFilter: DateFilter,
    boundaries?: DateBoundaries
): T[] {
    const bounds = boundaries || getDateBoundaries();
    return items.filter(item => isDateInRange(item.created_at, dateFilter, bounds));
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to get current date boundaries (memoized)
 * Re-calculates when component mounts or when force-refreshed
 */
export function useDateBoundaries(): DateBoundaries {
    return useMemo(() => getDateBoundaries(), []);
}

/**
 * Hook to filter items by date filter
 * 
 * @param items - Array of items with created_at field
 * @param dateFilter - 'today' | 'yesterday' | 'monthly'
 * @returns Filtered array
 * 
 * @example
 * ```tsx
 * const filteredPredictions = useDateFilteredItems(predictions, dateFilter);
 * ```
 */
export function useDateFilteredItems<T extends DateFilterableItem>(
    items: T[],
    dateFilter: DateFilter
): T[] {
    const boundaries = useDateBoundaries();

    return useMemo(() => {
        return filterByDate(items, dateFilter, boundaries);
    }, [items, dateFilter, boundaries]);
}

/**
 * Hook that provides both filtered items and the boundaries
 * Useful when you need to perform additional filtering on the same boundaries
 * 
 * @example
 * ```tsx
 * const { filteredItems, boundaries } = useDateFilter(predictions, dateFilter);
 * const stats = calculateStats(filteredItems);
 * ```
 */
export function useDateFilter<T extends DateFilterableItem>(
    items: T[],
    dateFilter: DateFilter
): {
    filteredItems: T[];
    boundaries: DateBoundaries;
} {
    const boundaries = useDateBoundaries();

    const filteredItems = useMemo(() => {
        return filterByDate(items, dateFilter, boundaries);
    }, [items, dateFilter, boundaries]);

    return { filteredItems, boundaries };
}
