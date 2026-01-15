/**
 * LeagueHeader Component
 * Displays league/competition info with optional date/time
 * Used as context header for match cards and lists
 */

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, borderRadius } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export interface LeagueHeaderProps {
  /** League/Competition name */
  name: string;

  /** League logo URL */
  logoUrl?: string;

  /** Match date/time */
  dateTime?: string | Date;

  /** Competition round/matchday */
  round?: string;

  /** Show separator line */
  showSeparator?: boolean;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Custom container style */
  style?: ViewStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LeagueHeader: React.FC<LeagueHeaderProps> = ({
  name,
  logoUrl,
  dateTime,
  round,
  showSeparator = false,
  size = 'medium',
  style,
}) => {
  const { theme, isDark } = useTheme();

  // ============================================================================
  // HELPERS
  // ============================================================================

  const formatDateTime = (dt: string | Date): string => {
    const date = typeof dt === 'string' ? new Date(dt) : dt;

    // Check if today
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    // Check if tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    // Check if yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    if (isToday) return `Today, ${timeStr}`;
    if (isTomorrow) return `Tomorrow, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // ============================================================================
  // SIZE CONFIGURATIONS
  // ============================================================================

  const sizeConfig = {
    small: {
      logoSize: 16,
      nameSize: typography.sizes.xs,
      metaSize: typography.sizes.xs,
      spacing: spacing[2],
    },
    medium: {
      logoSize: 20,
      nameSize: typography.sizes.sm,
      metaSize: typography.sizes.xs,
      spacing: spacing[3],
    },
    large: {
      logoSize: 24,
      nameSize: typography.sizes.base,
      metaSize: typography.sizes.sm,
      spacing: spacing[4],
    },
  };

  const config = sizeConfig[size];

  // ============================================================================
  // STYLES
  // ============================================================================

  const containerStyle: ViewStyle = {
    paddingVertical: config.spacing,
  };

  const contentStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const logoContainerStyle: ViewStyle = {
    width: config.logoSize,
    height: config.logoSize,
    borderRadius: config.logoSize / 4,
    backgroundColor: isDark ? theme.background.tertiary : '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: config.spacing,
  };

  const logoStyle = {
    width: config.logoSize * 0.8,
    height: config.logoSize * 0.8,
  };

  const textContainerStyle: ViewStyle = {
    flex: 1,
  };

  const nameStyle: TextStyle = {
    ...typography.body2,
    fontSize: config.nameSize,
    fontFamily: typography.fonts.semiBold,
    color: theme.text.primary,
  };

  const metaContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
  };

  const metaTextStyle: TextStyle = {
    ...typography.caption,
    fontSize: config.metaSize,
    color: theme.text.tertiary,
  };

  const separatorStyle: ViewStyle = {
    height: 1,
    backgroundColor: theme.border.primary,
    marginTop: config.spacing,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={[containerStyle, style]}>
      <View style={contentStyle}>
        {/* League Logo */}
        {logoUrl && (
          <View style={logoContainerStyle}>
            <Image source={{ uri: logoUrl }} style={logoStyle} resizeMode="contain" />
          </View>
        )}

        {/* Text Content */}
        <View style={textContainerStyle}>
          {/* League Name */}
          <Text style={nameStyle} numberOfLines={1}>
            {name}
          </Text>

          {/* Meta Info (Date/Time, Round) */}
          {(dateTime || round) && (
            <View style={metaContainerStyle}>
              {dateTime && <Text style={metaTextStyle}>{formatDateTime(dateTime)}</Text>}

              {dateTime && round && (
                <Text style={[metaTextStyle, { marginHorizontal: spacing[2] }]}>•</Text>
              )}

              {round && <Text style={metaTextStyle}>{round}</Text>}
            </View>
          )}
        </View>
      </View>

      {/* Separator Line */}
      {showSeparator && <View style={separatorStyle} />}
    </View>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * CompactLeagueHeader
 * Small league header for lists
 */
export const CompactLeagueHeader: React.FC<Omit<LeagueHeaderProps, 'size'>> = (props) => (
  <LeagueHeader {...props} size="small" />
);

/**
 * LeagueHeaderWithSeparator
 * League header with bottom separator
 */
export const LeagueHeaderWithSeparator: React.FC<Omit<LeagueHeaderProps, 'showSeparator'>> = (
  props
) => <LeagueHeader {...props} showSeparator={true} />;

// ============================================================================
// EXPORT
// ============================================================================

export default LeagueHeader;
