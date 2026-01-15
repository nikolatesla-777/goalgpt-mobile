/**
 * ScreenLayout Template
 * Base layout template for all screens with header, content, and optional footer
 * Provides consistent structure and spacing across the app
 */

import React, { ReactNode } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export interface ScreenLayoutProps {
  /** Screen content */
  children: ReactNode;

  /** Optional header component */
  header?: ReactNode;

  /** Optional footer component */
  footer?: ReactNode;

  /** Enable scrolling */
  scrollable?: boolean;

  /** Use SafeAreaView */
  useSafeArea?: boolean;

  /** Content padding */
  contentPadding?: keyof typeof spacing;

  /** Background variant */
  background?: 'primary' | 'secondary' | 'tertiary';

  /** Custom container style */
  style?: ViewStyle;

  /** Custom content style */
  contentStyle?: ViewStyle;

  /** Show status bar */
  showStatusBar?: boolean;

  /** Status bar style */
  statusBarStyle?: 'light-content' | 'dark-content' | 'auto';
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  header,
  footer,
  scrollable = true,
  useSafeArea = true,
  contentPadding = 'md',
  background = 'primary',
  style,
  contentStyle,
  showStatusBar = true,
  statusBarStyle = 'auto',
}) => {
  const { theme, isDark } = useTheme();

  // ============================================================================
  // STYLES
  // ============================================================================

  const getBackgroundColor = () => {
    switch (background) {
      case 'primary':
        return theme.background.primary;
      case 'secondary':
        return theme.background.secondary;
      case 'tertiary':
        return theme.background.tertiary;
      default:
        return theme.background.primary;
    }
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: getBackgroundColor(),
  };

  const contentContainerStyle: ViewStyle = {
    flex: 1,
    padding: spacing[contentPadding],
  };

  const scrollContentStyle: ViewStyle = {
    flexGrow: 1,
    padding: spacing[contentPadding],
  };

  const footerStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderTopWidth: 1,
    borderTopColor: theme.border.primary,
  };

  // Determine status bar style
  const getStatusBarStyle = (): 'light-content' | 'dark-content' => {
    if (statusBarStyle === 'auto') {
      return isDark ? 'light-content' : 'dark-content';
    }
    return statusBarStyle;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const Container = useSafeArea ? SafeAreaView : View;

  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <Container style={[containerStyle, style]}>
      {/* Status Bar */}
      {showStatusBar && (
        <StatusBar
          barStyle={getStatusBarStyle()}
          backgroundColor={getBackgroundColor()}
          translucent={Platform.OS === 'android'}
        />
      )}

      {/* Header */}
      {header && <View>{header}</View>}

      {/* Main Content */}
      <ContentWrapper
        style={scrollable ? undefined : [contentContainerStyle, contentStyle]}
        contentContainerStyle={scrollable ? [scrollContentStyle, contentStyle] : undefined}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ContentWrapper>

      {/* Footer */}
      {footer && <View style={footerStyle}>{footer}</View>}
    </Container>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * FixedScreenLayout
 * Non-scrollable screen layout
 */
export const FixedScreenLayout: React.FC<Omit<ScreenLayoutProps, 'scrollable'>> = (props) => (
  <ScreenLayout {...props} scrollable={false} />
);

/**
 * PaddedScreenLayout
 * Screen with extra padding
 */
export const PaddedScreenLayout: React.FC<Omit<ScreenLayoutProps, 'contentPadding'>> = (props) => (
  <ScreenLayout {...props} contentPadding="lg" />
);

/**
 * CompactScreenLayout
 * Screen with minimal padding
 */
export const CompactScreenLayout: React.FC<Omit<ScreenLayoutProps, 'contentPadding'>> = (props) => (
  <ScreenLayout {...props} contentPadding="sm" />
);

/**
 * NoPaddingScreenLayout
 * Screen with no content padding
 */
export const NoPaddingScreenLayout: React.FC<Omit<ScreenLayoutProps, 'contentPadding'>> = (
  props
) => <ScreenLayout {...props} contentPadding={0 as any} />;

// ============================================================================
// EXPORT
// ============================================================================

export default ScreenLayout;
