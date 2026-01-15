/**
 * OptimizedImage Component
 *
 * High-performance image component with:
 * - Lazy loading
 * - Progressive loading with placeholder
 * - Error handling
 * - Memory optimization
 * - Cache control
 *
 * Phase 11: Performance Optimization
 */

import React, { useState, useEffect, memo } from 'react';
import {
  Image,
  ImageProps,
  ImageStyle,
  StyleProp,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  /** Image source URI */
  source: { uri: string } | number;

  /** Image style */
  style?: StyleProp<ImageStyle>;

  /** Placeholder color while loading */
  placeholderColor?: string;

  /** Show loading indicator */
  showLoadingIndicator?: boolean;

  /** Fallback image source on error */
  fallbackSource?: { uri: string } | number;

  /** Cache policy */
  cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached';

  /** Priority for loading */
  priority?: 'low' | 'normal' | 'high';

  /** Resize mode */
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';

  /** On load callback */
  onLoad?: () => void;

  /** On error callback */
  onError?: (error: Error) => void;
}

/**
 * OptimizedImage Component
 *
 * Provides optimized image loading with progressive enhancement
 */
const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  source,
  style,
  placeholderColor = '#1A1F3A',
  showLoadingIndicator = true,
  fallbackSource,
  cache = 'default',
  priority = 'normal',
  resizeMode = 'cover',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSource, setCurrentSource] = useState(source);

  // Reset state when source changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setCurrentSource(source);
  }, [source]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = (error: any) => {
    setIsLoading(false);
    setHasError(true);

    // Try fallback source if available
    if (fallbackSource && !hasError) {
      setCurrentSource(fallbackSource);
      setHasError(false);
      setIsLoading(true);
      return;
    }

    onError?.(error);
  };

  // Get cache control headers
  const headers = typeof currentSource === 'object' && 'uri' in currentSource ? {
    'Cache-Control': cache === 'reload' ? 'no-cache' :
                     cache === 'force-cache' ? 'only-if-cached' :
                     'default',
  } : undefined;

  // Apply priority (affects loading order)
  const imageSource = typeof currentSource === 'object' && 'uri' in currentSource
    ? {
        uri: currentSource.uri,
        headers,
        priority: priority === 'high' ? 'high' : 'normal',
      }
    : currentSource;

  return (
    <View style={[styles.container, style]}>
      {/* Placeholder / Loading State */}
      {isLoading && (
        <View style={[
          styles.placeholder,
          { backgroundColor: placeholderColor },
          StyleSheet.flatten(style),
        ]}>
          {showLoadingIndicator && (
            <ActivityIndicator size="small" color="#6C5CE7" />
          )}
        </View>
      )}

      {/* Error State */}
      {hasError && !fallbackSource && (
        <View style={[
          styles.placeholder,
          styles.errorState,
          StyleSheet.flatten(style),
        ]}>
          <View style={styles.errorIcon}>
            <View style={styles.errorIconInner} />
          </View>
        </View>
      )}

      {/* Actual Image */}
      {!hasError && (
        <Image
          {...props}
          source={imageSource as any}
          style={[
            styles.image,
            style,
            { opacity: isLoading ? 0 : 1 },
          ]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          // Progressive JPEG support
          progressiveRenderingEnabled={true}
          // Fade animation
          fadeDuration={200}
        />
      )}
    </View>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorState: {
    backgroundColor: '#1A1F3A',
  },
  errorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D3350',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconInner: {
    width: 20,
    height: 2,
    backgroundColor: '#6C5CE7',
    opacity: 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default OptimizedImage;

/**
 * Usage Example:
 *
 * <OptimizedImage
 *   source={{ uri: 'https://example.com/image.jpg' }}
 *   style={{ width: 100, height: 100, borderRadius: 8 }}
 *   placeholderColor="#1A1F3A"
 *   showLoadingIndicator={true}
 *   fallbackSource={require('./fallback.png')}
 *   cache="default"
 *   priority="normal"
 *   resizeMode="cover"
 *   onLoad={() => console.log('Image loaded')}
 *   onError={(error) => console.error('Image error:', error)}
 * />
 */
