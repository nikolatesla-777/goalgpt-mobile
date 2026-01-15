import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LiveScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚽</Text>
      <Text style={styles.title}>Canlı Maçlar</Text>
      <Text style={styles.subtitle}>Canlı skorlar - Yakında gelecek</Text>
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
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#B3B3B3',
  },
});
