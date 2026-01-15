/**
 * Navigation Type Definitions
 * Defines all navigation param lists for type-safe navigation
 */

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

// Main Bottom Tabs
export type MainTabParamList = {
  Home: undefined;
  Live: undefined;
  Predictions: undefined;
  Profile: undefined;
};

// Root Stack (Auth vs Main)
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
