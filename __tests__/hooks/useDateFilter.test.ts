/**
 * useDateFilter Hook Tests
 *
 * Unit tests for date filtering utility functions and hooks
 */

import { getDateBoundaries, isDateInRange, filterByDate } from '../../src/hooks/useDateFilter';

// ============================================================================
// TEST DATA
// ============================================================================

const createPrediction = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return {
        id: `pred-${daysAgo}`,
        created_at: date.toISOString(),
        prediction: 'Test Prediction',
    };
};

// ============================================================================
// TESTS: getDateBoundaries
// ============================================================================

describe('getDateBoundaries', () => {
    it('should return today at midnight', () => {
        const { today } = getDateBoundaries();
        const now = new Date();

        expect(today.getFullYear()).toBe(now.getFullYear());
        expect(today.getMonth()).toBe(now.getMonth());
        expect(today.getDate()).toBe(now.getDate());
        expect(today.getHours()).toBe(0);
        expect(today.getMinutes()).toBe(0);
        expect(today.getSeconds()).toBe(0);
    });

    it('should return yesterday as today minus 1 day', () => {
        const { today, yesterday } = getDateBoundaries();
        const diff = today.getTime() - yesterday.getTime();

        expect(diff).toBe(24 * 60 * 60 * 1000); // 1 day in milliseconds
    });

    it('should return correct month start', () => {
        const { monthStart } = getDateBoundaries();
        const now = new Date();

        expect(monthStart.getFullYear()).toBe(now.getFullYear());
        expect(monthStart.getMonth()).toBe(now.getMonth());
        expect(monthStart.getDate()).toBe(1);
    });
});

// ============================================================================
// TESTS: isDateInRange
// ============================================================================

describe('isDateInRange', () => {
    it('should correctly identify today dates', () => {
        const todayDate = new Date();
        const boundaries = getDateBoundaries();

        expect(isDateInRange(todayDate, 'today', boundaries)).toBe(true);
        expect(isDateInRange(todayDate, 'yesterday', boundaries)).toBe(false);
        expect(isDateInRange(todayDate, 'monthly', boundaries)).toBe(true);
    });

    it('should correctly identify yesterday dates', () => {
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        yesterdayDate.setHours(12, 0, 0, 0); // Midday yesterday
        const boundaries = getDateBoundaries();

        expect(isDateInRange(yesterdayDate, 'today', boundaries)).toBe(false);
        expect(isDateInRange(yesterdayDate, 'yesterday', boundaries)).toBe(true);
        expect(isDateInRange(yesterdayDate, 'monthly', boundaries)).toBe(true);
    });

    it('should correctly identify monthly dates', () => {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const boundaries = getDateBoundaries();

        // Two weeks ago should pass monthly if still in same month
        const isInSameMonth = twoWeeksAgo.getMonth() === new Date().getMonth();
        expect(isDateInRange(twoWeeksAgo, 'monthly', boundaries)).toBe(isInSameMonth);
    });

    it('should handle invalid dates gracefully', () => {
        const invalidDate = new Date('invalid');
        const boundaries = getDateBoundaries();

        expect(isDateInRange(invalidDate, 'today', boundaries)).toBe(false);
        expect(isDateInRange(invalidDate, 'yesterday', boundaries)).toBe(false);
        expect(isDateInRange(invalidDate, 'monthly', boundaries)).toBe(false);
    });
});

// ============================================================================
// TESTS: filterByDate
// ============================================================================

describe('filterByDate', () => {
    // Create test data
    const predictions = [
        createPrediction(0),  // Today
        createPrediction(1),  // Yesterday
        createPrediction(2),  // 2 days ago
        createPrediction(7),  // 1 week ago
        createPrediction(35), // Over a month ago
    ];

    it('should filter items from today', () => {
        const result = filterByDate(predictions, 'today');

        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.some(p => p.id === 'pred-0')).toBe(true);
        expect(result.some(p => p.id === 'pred-1')).toBe(false);
    });

    it('should filter items from yesterday', () => {
        const result = filterByDate(predictions, 'yesterday');

        expect(result.some(p => p.id === 'pred-1')).toBe(true);
        expect(result.some(p => p.id === 'pred-0')).toBe(false);
    });

    it('should filter items from this month', () => {
        const result = filterByDate(predictions, 'monthly');

        // Should include recent items
        expect(result.some(p => p.id === 'pred-0')).toBe(true);
        expect(result.some(p => p.id === 'pred-1')).toBe(true);

        // Should not include items from over a month ago
        expect(result.some(p => p.id === 'pred-35')).toBe(false);
    });

    it('should return empty array for empty input', () => {
        const result = filterByDate([], 'today');

        expect(result).toEqual([]);
    });

    it('should handle items with invalid dates', () => {
        const itemsWithInvalidDate = [
            { id: 'valid', created_at: new Date().toISOString() },
            { id: 'invalid', created_at: 'not-a-date' },
        ];

        const result = filterByDate(itemsWithInvalidDate, 'today');

        expect(result.some(p => p.id === 'valid')).toBe(true);
        expect(result.some(p => p.id === 'invalid')).toBe(false);
    });
});
