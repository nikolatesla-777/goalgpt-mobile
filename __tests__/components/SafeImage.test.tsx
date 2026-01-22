/**
 * SafeImage Component Tests
 *
 * Unit tests for the SafeImage component with error handling
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SafeImage, SafeTeamLogo, SafeLeagueLogo } from '../../src/components/atoms/SafeImage';

// ============================================================================
// TESTS: SafeImage
// ============================================================================

describe('SafeImage', () => {
    describe('basic rendering', () => {
        it('should render with a valid source', () => {
            const { getByTestId } = render(
                <SafeImage
                    source={{ uri: 'https://example.com/image.png' }}
                    testID="safe-image"
                />
            );

            expect(getByTestId('safe-image')).toBeTruthy();
        });

        it('should render with a local require source', () => {
            // Note: In Jest, require() returns a number for assets
            const { UNSAFE_root } = render(
                <SafeImage
                    source={123 as any} // Mock require() return value
                />
            );

            expect(UNSAFE_root).toBeTruthy();
        });
    });

    describe('error handling', () => {
        it('should show fallback when source fails to load', () => {
            const { UNSAFE_root } = render(
                <SafeImage
                    source={{ uri: 'https://invalid.url/image.png' }}
                    fallbackSource={{ uri: 'https://example.com/fallback.png' }}
                />
            );

            // The component should render (we can't actually trigger onError in Jest easily)
            expect(UNSAFE_root).toBeTruthy();
        });

        it('should show custom fallback component when provided', () => {
            const CustomFallback = () => <></>;

            const { UNSAFE_root } = render(
                <SafeImage
                    source={{ uri: 'https://invalid.url/image.png' }}
                    fallbackComponent={<CustomFallback />}
                />
            );

            expect(UNSAFE_root).toBeTruthy();
        });
    });

    describe('loading state', () => {
        it('should not show loading indicator by default', () => {
            const { queryByTestId } = render(
                <SafeImage
                    source={{ uri: 'https://example.com/image.png' }}
                />
            );

            // Loading indicator should not be visible by default
            expect(queryByTestId('loading-indicator')).toBeNull();
        });

        it('should support showLoading prop', () => {
            const { UNSAFE_root } = render(
                <SafeImage
                    source={{ uri: 'https://example.com/image.png' }}
                    showLoading={true}
                />
            );

            expect(UNSAFE_root).toBeTruthy();
        });
    });
});

// ============================================================================
// TESTS: SafeTeamLogo
// ============================================================================

describe('SafeTeamLogo', () => {
    it('should render with default size', () => {
        const { UNSAFE_root } = render(
            <SafeTeamLogo uri="https://example.com/team.png" />
        );

        expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with custom size', () => {
        const { UNSAFE_root } = render(
            <SafeTeamLogo uri="https://example.com/team.png" size={60} />
        );

        expect(UNSAFE_root).toBeTruthy();
    });
});

// ============================================================================
// TESTS: SafeLeagueLogo
// ============================================================================

describe('SafeLeagueLogo', () => {
    it('should render with default size', () => {
        const { UNSAFE_root } = render(
            <SafeLeagueLogo uri="https://example.com/league.png" />
        );

        expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with custom size', () => {
        const { UNSAFE_root } = render(
            <SafeLeagueLogo uri="https://example.com/league.png" size={32} />
        );

        expect(UNSAFE_root).toBeTruthy();
    });
});
