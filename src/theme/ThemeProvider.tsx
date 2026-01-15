/**
 * ThemeProvider Component
 *
 * Provides theme context throughout the app
 * Supports dark/light mode switching
 * Persists user preference in AsyncStorage
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeMode, getTheme, defaultTheme } from './theme';

// ============================================
// CONTEXT
// ============================================

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@goalgpt_theme_mode';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // ALWAYS use dark theme (Master Plan requirement)
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [isLoading, setIsLoading] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      // ALWAYS force dark theme for GoalGPT 2.0
      setThemeModeState('dark');
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      // Default to dark theme
      setThemeModeState('dark');
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const theme = getTheme(themeMode);

  const value: ThemeContextValue = {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

/**
 * useTheme Hook
 *
 * Access theme throughout the app
 *
 * @example
 * const { theme, themeMode, toggleTheme } = useTheme();
 *
 * <View style={{ backgroundColor: theme.colors.background }}>
 *   <Text style={{ color: theme.colors.text.primary }}>Hello</Text>
 * </View>
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// ============================================
// EXPORT
// ============================================

export default ThemeProvider;
