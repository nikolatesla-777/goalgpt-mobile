/**
 * TeamBadge Component
 * Displays team logo and name with optional stats
 * Supports various layouts and sizes
 */

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, borderRadius } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export type TeamBadgeLayout = 'horizontal' | 'vertical';
export type TeamBadgeSize = 'small' | 'medium' | 'large';

export interface TeamBadgeProps {
  /** Team name */
  name: string;

  /** Team logo URL */
  logoUrl?: string;

  /** Team short name (3 letters) */
  shortName?: string;

  /** Layout direction */
  layout?: TeamBadgeLayout;

  /** Size variant */
  size?: TeamBadgeSize;

  /** Show full name */
  showFullName?: boolean;

  /** Optional stat text (e.g., "W", "L", "D") */
  stat?: string;

  /** Stat color */
  statColor?: 'success' | 'error' | 'warning';

  /** Align content (for horizontal layout) */
  align?: 'left' | 'center' | 'right';

  /** Custom container style */
  style?: ViewStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const TeamBadge: React.FC<TeamBadgeProps> = ({
  name,
  logoUrl,
  shortName,
  layout = 'horizontal',
  size = 'medium',
  showFullName = true,
  stat,
  statColor = 'success',
  align = 'left',
  style,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // SIZE CONFIGURATIONS
  // ============================================================================

  const sizeConfig = {
    small: {
      logoSize: 24,
      nameSize: typography.sizes.sm,
      shortNameSize: typography.sizes.xs,
      statSize: typography.sizes.xs,
      spacing: spacing[2],
    },
    medium: {
      logoSize: 32,
      nameSize: typography.sizes.base,
      shortNameSize: typography.sizes.sm,
      statSize: typography.sizes.sm,
      spacing: spacing[3],
    },
    large: {
      logoSize: 48,
      nameSize: typography.sizes.lg,
      shortNameSize: typography.sizes.base,
      statSize: typography.sizes.base,
      spacing: spacing[4],
    },
  };

  const config = sizeConfig[size];

  // ============================================================================
  // HELPERS
  // ============================================================================

  const displayName = showFullName ? name : shortName || name;

  const getStatColor = () => {
    switch (statColor) {
      case 'success':
        return theme.success.main;
      case 'error':
        return theme.error.main;
      case 'warning':
        return theme.warning.main;
      default:
        return theme.text.tertiary;
    }
  };

  // ============================================================================
  // STYLES
  // ============================================================================

  const containerStyle: ViewStyle = {
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
  };

  const logoContainerStyle: ViewStyle = {
    width: config.logoSize,
    height: config.logoSize,
    borderRadius: config.logoSize / 2,
    backgroundColor: theme.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: layout === 'horizontal' ? config.spacing : 0,
    marginBottom: layout === 'vertical' ? config.spacing : 0,
  };

  const logoStyle = {
    width: config.logoSize,
    height: config.logoSize,
  };

  const logoFallbackStyle: TextStyle = {
    fontSize: config.logoSize * 0.5,
    color: theme.text.tertiary,
  };

  const nameContainerStyle: ViewStyle = {
    flex: layout === 'horizontal' ? 1 : undefined,
    alignItems: layout === 'vertical' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
  };

  const nameStyle: TextStyle = {
    ...typography.body1,
    fontSize: config.nameSize,
    fontFamily: typography.fonts.semiBold,
    color: theme.text.primary,
    textAlign: layout === 'vertical' ? 'center' : align === 'right' ? 'right' : 'left',
  };

  const statContainerStyle: ViewStyle = {
    marginLeft: layout === 'horizontal' ? spacing[2] : 0,
    marginTop: layout === 'vertical' ? spacing[1] : 0,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    backgroundColor: `${getStatColor()}20`,
  };

  const statStyle: TextStyle = {
    ...typography.caption,
    fontSize: config.statSize,
    fontFamily: typography.fonts.bold,
    color: getStatColor(),
  };

  // ============================================================================
  // RENDER LOGO
  // ============================================================================

  const renderLogo = () => (
    <View style={logoContainerStyle}>
      {logoUrl ? (
        <Image source={{ uri: logoUrl }} style={logoStyle} resizeMode="contain" />
      ) : (
        <Text style={logoFallbackStyle}>{shortName?.[0] || name[0] || '?'}</Text>
      )}
    </View>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={[containerStyle, style]}>
      {/* Team Logo */}
      {renderLogo()}

      {/* Team Name Container */}
      <View style={nameContainerStyle}>
        {/* Team Name */}
        <Text style={nameStyle} numberOfLines={1} ellipsizeMode="tail">
          {displayName}
        </Text>

        {/* Stat Badge (vertical layout only) */}
        {stat && layout === 'vertical' && (
          <View style={statContainerStyle}>
            <Text style={statStyle}>{stat}</Text>
          </View>
        )}
      </View>

      {/* Stat Badge (horizontal layout) */}
      {stat && layout === 'horizontal' && (
        <View style={statContainerStyle}>
          <Text style={statStyle}>{stat}</Text>
        </View>
      )}
    </View>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * CompactTeamBadge
 * Small horizontal team badge for lists
 */
export const CompactTeamBadge: React.FC<Omit<TeamBadgeProps, 'size' | 'showFullName'>> = (
  props
) => <TeamBadge {...props} size="small" showFullName={false} />;

/**
 * VerticalTeamBadge
 * Vertical team badge for centered displays
 */
export const VerticalTeamBadge: React.FC<Omit<TeamBadgeProps, 'layout'>> = (props) => (
  <TeamBadge {...props} layout="vertical" align="center" />
);

/**
 * TeamBadgeWithStat
 * Team badge with form stat (W/L/D)
 */
interface TeamBadgeWithStatProps extends Omit<TeamBadgeProps, 'stat' | 'statColor'> {
  form: 'W' | 'L' | 'D';
}

export const TeamBadgeWithForm: React.FC<TeamBadgeWithStatProps> = ({ form, ...props }) => {
  const statColor = form === 'W' ? 'success' : form === 'L' ? 'error' : 'warning';
  return <TeamBadge {...props} stat={form} statColor={statColor} />;
};

// ============================================================================
// EXPORT
// ============================================================================

export default TeamBadge;
