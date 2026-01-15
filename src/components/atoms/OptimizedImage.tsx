/**
 * OptimizedImage Component
 * Wrapper around expo-image with performance optimizations
 * - Automatic caching
 * - Progressive loading with blur placeholder
 * - Error fallback
 * - Lazy loading support
 */

import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { colors } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  /** Image source URI */
  source: string | { uri: string } | number;
  /** Show loading indicator */
  showLoading?: boolean;
  /** Fallback image on error */
  fallbackSource?: string | { uri: string } | number;
  /** Placeholder blur hash */
  placeholder?: string;
  /** Cache policy */
  cachePolicy?: 'memory' | 'disk' | 'memory-disk';
}

// ============================================================================
// COMPONENT
// ============================================================================

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  showLoading = true,
  fallbackSource,
  placeholder,
  cachePolicy = 'memory-disk',
  contentFit = 'cover',
  transition = 200,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Convert source to proper format
  const imageSource = typeof source === 'string' ? { uri: source } : source;
  const fallback = typeof fallbackSource === 'string' ? { uri: fallbackSource } : fallbackSource;

  // Handle load events
  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // If error and fallback exists, show fallback
  const finalSource = hasError && fallback ? fallback : imageSource;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={finalSource}
        style={styles.image}
        contentFit={contentFit}
        transition={transition}
        placeholder={placeholder}
        cachePolicy={cachePolicy}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...props}
      />

      {/* Loading Indicator */}
      {isLoading && showLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
        </View>
      )}

      {/* Error Placeholder */}
      {hasError && !fallback && (
        <View style={styles.errorContainer}>
          <View style={styles.errorPlaceholder} />
        </View>
      )}
    </View>
  );
};

// ============================================================================
// PRESET COMPONENTS
// ============================================================================

/**
 * Team Logo Image
 * Optimized for team logos with fallback
 */
export const TeamLogoImage: React.FC<Omit<OptimizedImageProps, 'contentFit' | 'cachePolicy'>> = (
  props
) => {
  return (
    <OptimizedImage
      {...props}
      contentFit="contain"
      cachePolicy="memory-disk"
      fallbackSource={require('../../../assets/images/default-team-logo.png')}
    />
  );
};

/**
 * Competition Logo Image
 * Optimized for competition logos
 */
export const CompetitionLogoImage: React.FC<
  Omit<OptimizedImageProps, 'contentFit' | 'cachePolicy'>
> = (props) => {
  return (
    <OptimizedImage
      {...props}
      contentFit="contain"
      cachePolicy="memory-disk"
      fallbackSource={require('../../../assets/images/default-competition-logo.png')}
    />
  );
};

/**
 * Player Photo Image
 * Optimized for player photos
 */
export const PlayerPhotoImage: React.FC<
  Omit<OptimizedImageProps, 'contentFit' | 'cachePolicy'>
> = (props) => {
  return (
    <OptimizedImage
      {...props}
      contentFit="cover"
      cachePolicy="memory-disk"
      fallbackSource={require('../../../assets/images/default-player.png')}
    />
  );
};

/**
 * Blog/News Image
 * Optimized for blog and news images with progressive loading
 */
export const NewsImage: React.FC<Omit<OptimizedImageProps, 'cachePolicy'>> = (props) => {
  return (
    <OptimizedImage
      {...props}
      cachePolicy="disk" // Cache longer for news images
      placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4" // Blurhash placeholder
    />
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  errorPlaceholder: {
    width: '50%',
    height: '50%',
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default OptimizedImage;
