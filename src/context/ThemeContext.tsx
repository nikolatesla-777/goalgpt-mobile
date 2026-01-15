/**
 * ThemeContext
 * Provides theme switching functionality with AsyncStorage persistence
 * Supports both light and dark themes with OLED optimization
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { theme, darkTheme, lightTheme, ThemeMode, Theme } from '../constants/theme';

// ============================================================================
// TYPES
// ============================================================================

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  setSystemTheme: () => void;
  isSystemTheme: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const THEME_STORAGE_KEY = '@goalgpt:theme_preference';
const SYSTEM_THEME = 'system';

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get system theme preference
  const systemColorScheme = Appearance.getColorScheme() || 'dark';

  // State
  const [themeMode, setThemeMode] = useState<ThemeMode | 'system'>('system');
  const [isReady, setIsReady] = useState(false);

  // Derived values
  const effectiveTheme: ThemeMode = themeMode === 'system' ? systemColorScheme : themeMode;

  const currentTheme = effectiveTheme === 'dark' ? darkTheme : lightTheme;

  // ============================================================================
  // LOAD THEME FROM STORAGE
  // ============================================================================

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (savedTheme) {
        setThemeMode(savedTheme as ThemeMode | 'system');
      } else {
        // Default to system theme if no preference saved
        setThemeMode('system');
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      setThemeMode('system');
    } finally {
      setIsReady(true);
    }
  };

  // ============================================================================
  // SAVE THEME TO STORAGE
  // ============================================================================

  const saveThemePreference = async (mode: ThemeMode | 'system') => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // ============================================================================
  // LISTEN TO SYSTEM THEME CHANGES
  // ============================================================================

  useEffect(() => {
    // Only listen to system theme changes if user has selected system theme
    if (themeMode !== 'system') return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // System theme changed, trigger re-render
      // The effectiveTheme will automatically update
      console.log('System theme changed to:', colorScheme);
    });

    return () => subscription.remove();
  }, [themeMode]);

  // ============================================================================
  // THEME ACTIONS
  // ============================================================================

  /**
   * Toggle between light and dark theme
   * If currently using system theme, switches to the opposite of current system theme
   */
  const toggleTheme = () => {
    const newMode: ThemeMode = effectiveTheme === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    saveThemePreference(newMode);
  };

  /**
   * Set theme to a specific mode
   */
  const setThemePreference = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveThemePreference(mode);
  };

  /**
   * Set theme to follow system preference
   */
  const setSystemTheme = () => {
    setThemeMode('system');
    saveThemePreference('system');
  };

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: ThemeContextType = {
    theme: currentTheme,
    themeMode: effectiveTheme,
    isDark: effectiveTheme === 'dark',
    isLight: effectiveTheme === 'light',
    toggleTheme,
    setTheme: setThemePreference,
    setSystemTheme,
    isSystemTheme: themeMode === 'system',
  };

  // Don't render children until theme is loaded
  if (!isReady) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access theme context
 * @throws {Error} If used outside ThemeProvider
 * @returns {ThemeContextType} Theme context value
 *
 * @example
 * ```tsx
 * const { theme, isDark, toggleTheme } = useTheme();
 *
 * // Access theme colors
 * <View style={{ backgroundColor: theme.background.primary }}>
 *   <Text style={{ color: theme.text.primary }}>Hello</Text>
 * </View>
 *
 * // Toggle theme
 * <Button onPress={toggleTheme} title="Toggle Theme" />
 *
 * // Set specific theme
 * <Button onPress={() => setTheme('dark')} title="Dark Mode" />
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

// ============================================================================
// HELPER HOOK FOR STYLED COMPONENTS
// ============================================================================

/**
 * Hook to create theme-aware styles
 * @param styleFactory Function that takes theme and returns styles
 * @returns Styles based on current theme
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const styles = useThemedStyles((theme) => ({
 *     container: {
 *       backgroundColor: theme.background.primary,
 *       padding: theme.spacing.md,
 *     },
 *     text: {
 *       color: theme.text.primary,
 *       fontSize: theme.typography.sizes.md,
 *     },
 *   }));
 *
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.text}>Themed Component</Text>
 *     </View>
 *   );
 * };
 * ```
 */
export const useThemedStyles = <T,>(styleFactory: (theme: Theme) => T): T => {
  const { theme } = useTheme();
  return styleFactory(theme);
};

// ============================================================================
// EXPORT
// ============================================================================

export default ThemeContext;
