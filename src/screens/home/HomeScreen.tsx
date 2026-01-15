import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { FeaturedMatches } from '../../components/home/FeaturedMatches';
import { LiveMatchesSection } from '../../components/home/LiveMatchesSection';
import { UpcomingMatchesSection } from '../../components/home/UpcomingMatchesSection';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Mock data - will be replaced with real API calls
  const featuredMatches = [];
  const liveMatches = [];
  const upcomingMatches = [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚽ GoalGPT</Text>
        <Text style={styles.headerSubtitle}>AI Destekli Futbol Tahminleri</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2196F3" />}
      >
        {/* Featured Matches */}
        {featuredMatches.length > 0 && (
          <View style={styles.section}>
            <FeaturedMatches matches={featuredMatches} />
          </View>
        )}

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <View style={styles.section}>
            <LiveMatchesSection matches={liveMatches} />
          </View>
        )}

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <View style={styles.section}>
            <UpcomingMatchesSection matches={upcomingMatches} />
          </View>
        )}

        {/* Empty State */}
        {featuredMatches.length === 0 && liveMatches.length === 0 && upcomingMatches.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>Maç bulunamadı</Text>
            <Text style={styles.emptyText}>Şu anda gösterilecek maç yok</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#0F1419',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2732',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#B3B3B3',
  },
});
