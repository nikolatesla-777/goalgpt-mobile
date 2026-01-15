/**
 * MatchStatusBadge Component
 * Displays match status with color coding
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export interface MatchStatusBadgeProps {
  statusId: number;
  minute?: number;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getStatusInfo = (statusId: number, minute?: number) => {
  switch (statusId) {
    case 1: // Not Started
      return {
        text: 'Başlamadı',
        color: 'secondary' as const,
        showDot: false,
      };
    case 2: // First Half
      return {
        text: minute ? `${minute}'` : 'İlk Yarı',
        color: 'live' as const,
        showDot: true,
      };
    case 3: // Half Time
      return {
        text: 'Devre Arası',
        color: 'warning' as const,
        showDot: false,
      };
    case 4: // Second Half
      return {
        text: minute ? `${minute}'` : 'İkinci Yarı',
        color: 'live' as const,
        showDot: true,
      };
    case 5: // Extra Time
      return {
        text: minute ? `${minute + 90}'` : 'Uzatma',
        color: 'live' as const,
        showDot: true,
      };
    case 7: // Penalties
      return {
        text: 'Penaltılar',
        color: 'live' as const,
        showDot: true,
      };
    case 8: // Ended
      return {
        text: 'Bitti',
        color: 'ended' as const,
        showDot: false,
      };
    case 9: // Postponed
      return {
        text: 'Ertelendi',
        color: 'error' as const,
        showDot: false,
      };
    case 10: // Cancelled
      return {
        text: 'İptal',
        color: 'error' as const,
        showDot: false,
      };
    default:
      return {
        text: 'Bilinmiyor',
        color: 'secondary' as const,
        showDot: false,
      };
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

export const MatchStatusBadge: React.FC<MatchStatusBadgeProps> = ({
  statusId,
  minute,
  size = 'md',
}) => {
  const { theme } = useTheme();
  const status = getStatusInfo(statusId, minute);

  const getBackgroundColor = () => {
    switch (status.color) {
      case 'live':
        return theme.live.background;
      case 'warning':
        return theme.warning.bg;
      case 'error':
        return theme.error.bg;
      case 'ended':
        return theme.background.elevated;
      default:
        return theme.background.tertiary;
    }
  };

  const getTextColor = () => {
    switch (status.color) {
      case 'live':
        return theme.live.text;
      case 'warning':
        return theme.warning.main;
      case 'error':
        return theme.error.main;
      case 'ended':
        return theme.text.tertiary;
      default:
        return theme.text.secondary;
    }
  };

  const getDotColor = () => {
    switch (status.color) {
      case 'live':
        return theme.live.indicator;
      case 'warning':
        return theme.warning.main;
      case 'error':
        return theme.error.main;
      default:
        return theme.text.tertiary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: spacing[1],
          gap: spacing[1],
        };
      case 'lg':
        return {
          padding: spacing[3],
          gap: spacing[2],
        };
      default:
        return {
          padding: spacing[2],
          gap: spacing[1],
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'xs' as const;
      case 'lg':
        return 'md' as const;
      default:
        return 'sm' as const;
    }
  };

  const getDotSize = () => {
    switch (size) {
      case 'sm':
        return 5;
      case 'lg':
        return 9;
      default:
        return 7;
    }
  };

  const sizeStyles = getSizeStyles();
  const dotSize = getDotSize();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          paddingHorizontal: sizeStyles.padding,
          paddingVertical: sizeStyles.padding,
          gap: sizeStyles.gap,
        },
      ]}
    >
      {status.showDot && (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: getDotColor(),
            },
          ]}
        />
      )}
      <NeonText
        size={getTextSize()}
        style={{
          color: getTextColor(),
          fontWeight: '600',
        }}
      >
        {status.text}
      </NeonText>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  dot: {
    // Size is dynamic based on prop
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default MatchStatusBadge;
