/**
 * TeamHeader Component
 *
 * Molecule component for team display
 * Logo + Name + Optional Country Flag
 * Master Plan v1.0 compliant
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { typography, spacing } from '../../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface TeamHeaderProps {
  /** Team name */
  name: string;

  /** Team logo (emoji or URL) */
  logo?: string;

  /** Country flag emoji */
  countryFlag?: string;

  /** Layout direction */
  direction?: 'horizontal' | 'vertical';

  /** Align */
  align?: 'left' | 'center' | 'right';

  /** Size */
  size?: 'small' | 'medium' | 'large';
}

// ============================================================================
// COMPONENT
// ============================================================================

export const TeamHeader: React.FC<TeamHeaderProps> = ({
  name,
  logo,
  countryFlag,
  direction = 'vertical',
  align = 'center',
  size = 'medium',
}) => {
  // ============================================================================
  // SIZE CONFIG
  // ============================================================================

  const sizeConfig = {
    small: {
      logoSize: 24,
      nameSize: typography.fontSize.button.small,
      flagSize: 14,
      spacing: spacing.xs,
    },
    medium: {
      logoSize: 32,
      nameSize: typography.fontSize.button.medium,
      flagSize: 16,
      spacing: spacing.sm,
    },
    large: {
      logoSize: 48,
      nameSize: typography.fontSize.button.large,
      flagSize: 20,
      spacing: spacing.md,
    },
  };

  const config = sizeConfig[size];

  // ============================================================================
  // STYLES
  // ============================================================================

  const containerStyle = [
    styles.container,
    direction === 'horizontal' ? styles.horizontal : styles.vertical,
    align === 'left' && styles.alignLeft,
    align === 'center' && styles.alignCenter,
    align === 'right' && styles.alignRight,
  ];

  const logoStyle = {
    fontSize: config.logoSize,
    marginBottom: direction === 'vertical' ? config.spacing : 0,
    marginRight: direction === 'horizontal' ? config.spacing : 0,
  };

  const nameStyle = {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: config.nameSize,
    color: '#FFFFFF',
  };

  const flagStyle = {
    fontSize: config.flagSize,
    marginLeft: spacing.xs,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={containerStyle}>
      {/* Logo */}
      {logo && (
        <Image
          source={{ uri: logo }}
          style={{
            width: config.logoSize,
            height: config.logoSize,
            marginBottom: direction === 'vertical' ? config.spacing : 0,
            marginRight: direction === 'horizontal' ? config.spacing : 0,
          }}
          resizeMode="contain"
        />
      )}

      {/* Name + Flag */}
      <View style={styles.nameContainer}>
        <Text style={nameStyle} numberOfLines={1}>
          {name}
        </Text>
        {countryFlag && <Text style={flagStyle}>{countryFlag}</Text>}
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    // Base container
  },
  vertical: {
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default TeamHeader;
