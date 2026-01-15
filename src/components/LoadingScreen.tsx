import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Loading screen component for Suspense fallback
 * Used when lazy-loading screens to show loading state
 */
export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2196F3" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0F1E',
  },
});
