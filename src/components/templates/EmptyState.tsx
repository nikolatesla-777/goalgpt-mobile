/**
 * EmptyState Component
 * Displays empty state with icon, message, and optional action button
 * Used when there's no data to display
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../atoms/Button';
import { typography, spacing } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export interface EmptyStateProps {
  /** Icon/emoji to display */
  icon?: string;

  /** Title text */
  title: string;

  /** Description text */
  description?: string;

  /** Action button text */
  actionText?: string;

  /** Action button callback */
  onAction?: () => void;

  /** Action button variant */
  actionVariant?: 'primary' | 'secondary' | 'ghost';

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Custom container style */
  style?: ViewStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionText,
  onAction,
  actionVariant = 'primary',
  size = 'medium',
  style,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // SIZE CONFIGURATIONS
  // ============================================================================

  const sizeConfig = {
    small: {
      iconSize: 48,
      titleSize: typography.sizes.lg,
      descSize: typography.sizes.sm,
      spacing: spacing[4],
      buttonSize: 'small' as const,
    },
    medium: {
      iconSize: 64,
      titleSize: typography.sizes.xl,
      descSize: typography.sizes.base,
      spacing: spacing[6],
      buttonSize: 'medium' as const,
    },
    large: {
      iconSize: 80,
      titleSize: typography.sizes['2xl'],
      descSize: typography.sizes.lg,
      spacing: spacing[8],
      buttonSize: 'large' as const,
    },
  };

  const config = sizeConfig[size];

  // ============================================================================
  // STYLES
  // ============================================================================

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  };

  const iconContainerStyle: ViewStyle = {
    marginBottom: config.spacing,
  };

  const iconStyle: TextStyle = {
    fontSize: config.iconSize,
    textAlign: 'center',
  };

  const titleStyle: TextStyle = {
    ...typography.h3,
    fontSize: config.titleSize,
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: description ? spacing[3] : config.spacing,
  };

  const descriptionStyle: TextStyle = {
    ...typography.body1,
    fontSize: config.descSize,
    color: theme.text.secondary,
    textAlign: 'center',
    marginBottom: config.spacing,
    lineHeight: config.descSize * 1.5,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={[containerStyle, style]}>
      {/* Icon */}
      {icon && (
        <View style={iconContainerStyle}>
          <Text style={iconStyle}>{icon}</Text>
        </View>
      )}

      {/* Title */}
      <Text style={titleStyle}>{title}</Text>

      {/* Description */}
      {description && <Text style={descriptionStyle}>{description}</Text>}

      {/* Action Button */}
      {actionText && onAction && (
        <Button variant={actionVariant} size={config.buttonSize} onPress={onAction}>
          {actionText}
        </Button>
      )}
    </View>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * NoMatchesFound
 * Empty state for no matches
 */
export const NoMatchesFound: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (
  props
) => (
  <EmptyState
    icon="⚽"
    title="No Matches Found"
    description="There are no matches available at the moment. Check back later!"
    {...props}
  />
);

/**
 * NoResultsFound
 * Empty state for search with no results
 */
export const NoResultsFound: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (
  props
) => (
  <EmptyState
    icon="🔍"
    title="No Results Found"
    description="We couldn't find what you're looking for. Try adjusting your search."
    {...props}
  />
);

/**
 * NoDataAvailable
 * Generic empty state for missing data
 */
export const NoDataAvailable: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (
  props
) => (
  <EmptyState
    icon="📊"
    title="No Data Available"
    description="Data is not available at this time. Please try again later."
    {...props}
  />
);

/**
 * ComingSoon
 * Empty state for upcoming features
 */
export const ComingSoon: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (
  props
) => (
  <EmptyState
    icon="🚀"
    title="Coming Soon"
    description="This feature is under development. Stay tuned for updates!"
    {...props}
  />
);

/**
 * UnderMaintenance
 * Empty state for maintenance mode
 */
export const UnderMaintenance: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (
  props
) => (
  <EmptyState
    icon="🔧"
    title="Under Maintenance"
    description="We're making improvements to serve you better. Please check back soon."
    {...props}
  />
);

// ============================================================================
// EXPORT
// ============================================================================

export default EmptyState;
