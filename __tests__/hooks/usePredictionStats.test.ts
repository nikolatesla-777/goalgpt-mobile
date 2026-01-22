/**
 * usePredictionStats Hook Tests
 *
 * Unit tests for prediction statistics calculation functions
 */

import { calculatePredictionStats } from '../../src/hooks/usePredictionStats';

// ============================================================================
// TEST DATA
// ============================================================================

const createPrediction = (result: 'won' | 'lost' | 'pending' | 'void') => ({
    id: `pred-${Math.random()}`,
    result,
    prediction: 'Test Prediction',
    created_at: new Date().toISOString(),
});

// ============================================================================
// TESTS: calculatePredictionStats
// ============================================================================

describe('calculatePredictionStats', () => {
    describe('empty and edge cases', () => {
        it('should return zeros for empty array', () => {
            const result = calculatePredictionStats([]);

            expect(result.total).toBe(0);
            expect(result.wins).toBe(0);
            expect(result.losses).toBe(0);
            expect(result.pending).toBe(0);
            expect(result.winRate).toBe(0);
        });

        it('should handle only pending predictions', () => {
            const predictions = [
                createPrediction('pending'),
                createPrediction('pending'),
                createPrediction('pending'),
            ];

            const result = calculatePredictionStats(predictions);

            expect(result.total).toBe(3);
            expect(result.wins).toBe(0);
            expect(result.losses).toBe(0);
            expect(result.pending).toBe(3);
            expect(result.winRate).toBe(0); // No completed predictions
        });

        it('should handle only void predictions', () => {
            const predictions = [
                createPrediction('void'),
                createPrediction('void'),
            ];

            const result = calculatePredictionStats(predictions);

            expect(result.total).toBe(2);
            expect(result.wins).toBe(0);
            expect(result.losses).toBe(0);
            expect(result.winRate).toBe(0);
        });
    });

    describe('win rate calculations', () => {
        it('should calculate 100% win rate correctly', () => {
            const predictions = [
                createPrediction('won'),
                createPrediction('won'),
                createPrediction('won'),
            ];

            const result = calculatePredictionStats(predictions);

            expect(result.total).toBe(3);
            expect(result.wins).toBe(3);
            expect(result.losses).toBe(0);
            expect(result.winRate).toBe(100);
        });

        it('should calculate 0% win rate correctly', () => {
            const predictions = [
                createPrediction('lost'),
                createPrediction('lost'),
                createPrediction('lost'),
            ];

            const result = calculatePredictionStats(predictions);

            expect(result.total).toBe(3);
            expect(result.wins).toBe(0);
            expect(result.losses).toBe(3);
            expect(result.winRate).toBe(0);
        });

        it('should calculate mixed win rate correctly', () => {
            const predictions = [
                createPrediction('won'),
                createPrediction('won'),
                createPrediction('won'),
                createPrediction('lost'),
            ];

            const result = calculatePredictionStats(predictions);

            expect(result.total).toBe(4);
            expect(result.wins).toBe(3);
            expect(result.losses).toBe(1);
            expect(result.winRate).toBe(75); // 3/4 = 75%
        });

        it('should exclude pending from win rate calculation', () => {
            const predictions = [
                createPrediction('won'),
                createPrediction('lost'),
                createPrediction('pending'),
                createPrediction('pending'),
            ];

            const result = calculatePredictionStats(predictions);

            expect(result.total).toBe(4);
            expect(result.wins).toBe(1);
            expect(result.losses).toBe(1);
            expect(result.pending).toBe(2);
            // Win rate should be based on completed (won + lost) only = 1/2 = 50%
            expect(result.winRate).toBe(50);
        });

        it('should round win rate to one decimal place', () => {
            const predictions = [
                createPrediction('won'),
                createPrediction('won'),
                createPrediction('lost'),
            ];

            const result = calculatePredictionStats(predictions);

            // 2/3 = 66.666... should round to 66.7
            expect(result.winRate).toBeCloseTo(66.7, 1);
        });
    });

    describe('comprehensive count validation', () => {
        it('should count all prediction types correctly', () => {
            const predictions = [
                createPrediction('won'),
                createPrediction('won'),
                createPrediction('won'),
                createPrediction('lost'),
                createPrediction('lost'),
                createPrediction('pending'),
                createPrediction('void'),
            ];

            const result = calculatePredictionStats(predictions);

            expect(result.total).toBe(7);
            expect(result.wins).toBe(3);
            expect(result.losses).toBe(2);
            expect(result.pending).toBe(1);
            // 3 wins out of 5 completed (3 won + 2 lost) = 60%
            expect(result.winRate).toBe(60);
        });
    });
});
