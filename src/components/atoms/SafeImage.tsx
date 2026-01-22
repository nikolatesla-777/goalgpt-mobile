/**
 * SafeImage Component
 * 
 * Image component with built-in error handling and fallback.
 * Automatically shows a placeholder when image fails to load.
 * 
 * @module components/atoms/SafeImage
 */

import React, { useState, useCallback } from 'react';
import { Image, View, StyleSheet, ActivityIndicator, ImageProps, ImageStyle, StyleProp } from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

export interface SafeImageProps extends Omit<ImageProps, 'source'> {
    /** Image source (URI or require) */
    source: { uri: string } | number;
    /** Fallback source when primary fails */
    fallbackSource?: { uri: string } | number;
    /** Custom fallback component */
    fallbackComponent?: React.ReactNode;
    /** Show loading indicator while loading */
    showLoading?: boolean;
    /** Loading indicator color */
    loadingColor?: string;
    /** Style for the image */
    style?: StyleProp<ImageStyle>;
    /** Placeholder background color */
    placeholderColor?: string;
}

// Default placeholder (empty team logo style)
const DEFAULT_PLACEHOLDER_COLOR = 'rgba(255, 255, 255, 0.05)';

// ============================================================================
// COMPONENT
// ============================================================================

export const SafeImage: React.FC<SafeImageProps> = ({
    source,
    fallbackSource,
    fallbackComponent,
    showLoading = false,
    loadingColor = '#4ade80',
    style,
    placeholderColor = DEFAULT_PLACEHOLDER_COLOR,
    ...props
}) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handleError = useCallback(() => {
        setHasError(true);
        setIsLoading(false);
    }, []);

    const handleLoadStart = useCallback(() => {
        setIsLoading(true);
    }, []);

    const handleLoadEnd = useCallback(() => {
        setIsLoading(false);
    }, []);

    // ============================================================================
    // RENDER
    // ============================================================================

    // Show custom fallback component if provided
    if (hasError && fallbackComponent) {
        return <>{fallbackComponent}</>;
    }

    // Determine which source to use
    const imageSource = hasError && fallbackSource ? fallbackSource : source;

    // If no valid source available after error
    if (hasError && !fallbackSource && !fallbackComponent) {
        return (
            <View style={[styles.placeholder, { backgroundColor: placeholderColor }, style]}>
                {/* Empty placeholder with subtle icon */}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={imageSource}
                style={style}
                onError={handleError}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                {...props}
            />

            {/* Loading Indicator Overlay */}
            {showLoading && isLoading && !hasError && (
                <View style={[StyleSheet.absoluteFill, styles.loadingOverlay, { backgroundColor: placeholderColor }]}>
                    <ActivityIndicator size="small" color={loadingColor} />
                </View>
            )}
        </View>
    );
};

// ============================================================================
// PRESET VARIANTS
// ============================================================================

interface TeamLogoProps {
    uri: string;
    size?: number;
    showLoading?: boolean;
}

/**
 * SafeTeamLogo - Preset for team logos
 */
export const SafeTeamLogo: React.FC<TeamLogoProps> = ({ uri, size = 40, showLoading = true }) => (
    <SafeImage
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        showLoading={showLoading}
        placeholderColor="rgba(255, 255, 255, 0.08)"
        resizeMode="contain"
    />
);

/**
 * SafeLeagueLogo - Preset for league/country logos
 */
export const SafeLeagueLogo: React.FC<TeamLogoProps> = ({ uri, size = 24, showLoading = false }) => (
    <SafeImage
        source={{ uri }}
        style={{ width: size, height: size }}
        showLoading={showLoading}
        placeholderColor="rgba(255, 255, 255, 0.05)"
        resizeMode="contain"
    />
);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    loadingOverlay: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
});

export default SafeImage;
