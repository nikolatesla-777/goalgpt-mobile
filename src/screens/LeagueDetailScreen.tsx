/**
 * LeagueDetailScreen
 *
 * League/Competition detail page with fixtures and standings
 * Master Plan Phase 7-8 - Stack Screen
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, typography } from '../constants/tokens';
import {
  getLeagueDetail,
  getLeagueFixtures,
  getLeagueStandings,
  type LeagueDetail,
  type LeagueFixture,
} from '../services/leagues.service';
import type { TeamStanding } from '../services/teams.service';
import { CompactMatchCard } from '../components/molecules/CompactMatchCard';

// ============================================================================
// TYPES
// ============================================================================

type TabKey = 'fixtures' | 'standings';

export interface LeagueDetailScreenProps {
  /** League ID */
  leagueId: string | number;

  /** On back */
  onBack?: () => void;

  /** On fixture press */
  onFixturePress?: (matchId: string | number) => void;

  /** On team press */
  onTeamPress?: (teamId: string | number) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LeagueDetailScreen: React.FC<LeagueDetailScreenProps> = ({
  leagueId,
  onBack,
  onFixturePress,
  onTeamPress,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('fixtures');
  const [league, setLeague] = useState<LeagueDetail | null>(null);
  const [fixtures, setFixtures] = useState<LeagueFixture[]>([]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchData = useCallback(async () => {
    try {
      console.log('🔄 Fetching league data for ID:', leagueId);
      setError(null);
      setIsLoading(true);

      const [leagueData, fixturesData, standingsData] = await Promise.all([
        getLeagueDetail(leagueId),
        getLeagueFixtures(leagueId),
        getLeagueStandings(leagueId),
      ]);

      console.log('✅ League data fetched successfully');
      setLeague(leagueData);
      setFixtures(fixturesData);
      setStandings(standingsData);
    } catch (error: any) {
      console.error('❌ Failed to fetch league data:', error);
      setError(error.message || 'Failed to load league data');
    } finally {
      setIsLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, [fetchData]);

  // ============================================================================
  // RENDER HEADER
  // ============================================================================

  const renderHeader = () => {
    if (!league) return null;

    return (
      <View style={styles.header}>
        {/* League Logo & Info */}
        <View style={styles.leagueInfo}>
          {league.logo_url ? (
            <Image source={{ uri: league.logo_url }} style={styles.leagueLogo} resizeMode="contain" />
          ) : (
            <View style={styles.leagueLogoPlaceholder}>
              <Text style={styles.leagueLogoText}>🏆</Text>
            </View>
          )}
          <View style={styles.leagueTextInfo}>
            <Text style={styles.leagueName}>{league.name}</Text>
            {league.country && (
              <View style={styles.countryRow}>
                {league.country_flag && (
                  <Image
                    source={{ uri: league.country_flag }}
                    style={styles.countryFlag}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.countryText}>{league.country}</Text>
              </View>
            )}
            {league.season && <Text style={styles.seasonText}>Sezon: {league.season}</Text>}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'fixtures' && styles.tabActive]}
            onPress={() => setActiveTab('fixtures')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'fixtures' && styles.tabTextActive]}>
              Maçlar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'standings' && styles.tabActive]}
            onPress={() => setActiveTab('standings')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'standings' && styles.tabTextActive]}>
              Puan Durumu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ============================================================================
  // RENDER FIXTURES TAB
  // ============================================================================

  const renderFixturesTab = () => {
    if (fixtures.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚽</Text>
          <Text style={styles.emptyText}>Maç bulunamadı</Text>
        </View>
      );
    }

    // Group fixtures by date
    const fixturesByDate = fixtures.reduce((acc, fixture) => {
      const date = new Date(fixture.time || '').toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(fixture);
      return acc;
    }, {} as Record<string, LeagueFixture[]>);

    return (
      <View style={styles.tabContent}>
        {Object.entries(fixturesByDate).map(([date, dateFixtures]) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{date}</Text>
            {dateFixtures.map((fixture) => (
              <CompactMatchCard
                key={fixture.id}
                matchId={fixture.id}
                homeTeam={fixture.homeTeam}
                awayTeam={fixture.awayTeam}
                status={fixture.status}
                time={fixture.time}
                minute={fixture.minute}
                onPress={() => onFixturePress?.(fixture.id)}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  // ============================================================================
  // RENDER STANDINGS TAB
  // ============================================================================

  const renderStandingsTab = () => {
    if (standings.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>Puan durumu bulunamadı</Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.standingsTable}>
          {/* Header */}
          <View style={styles.standingsHeader}>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.standingsHeaderText, { flex: 2 }]}>Takım</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>O</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>G</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>B</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>M</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.6 }]}>A</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>P</Text>
          </View>

          {/* Rows */}
          {standings.map((standing, index) => {
            const isChampionsLeague = index < 4;
            const isEuropaLeague = index >= 4 && index < 6;
            const isRelegation = index >= standings.length - 3;

            return (
              <TouchableOpacity
                key={standing.team_id}
                style={[
                  styles.standingsRow,
                  isChampionsLeague && styles.standingsRowCL,
                  isEuropaLeague && styles.standingsRowEL,
                  isRelegation && styles.standingsRowRel,
                ]}
                onPress={() => onTeamPress?.(standing.team_id)}
                activeOpacity={0.7}
              >
                <View style={[styles.standingsRankCell, { flex: 0.5 }]}>
                  <View
                    style={[
                      styles.rankIndicator,
                      isChampionsLeague && { backgroundColor: '#4BC41E' },
                      isEuropaLeague && { backgroundColor: '#FFA500' },
                      isRelegation && { backgroundColor: '#FF3B30' },
                    ]}
                  />
                  <Text style={styles.standingsText}>{standing.rank}</Text>
                </View>
                <View style={[styles.standingsTeamCell, { flex: 2 }]}>
                  {standing.team_logo && (
                    <Image
                      source={{ uri: standing.team_logo }}
                      style={styles.standingsTeamLogo}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.standingsText} numberOfLines={1}>
                    {standing.team_name}
                  </Text>
                </View>
                <Text style={[styles.standingsText, { flex: 0.5 }]}>{standing.played}</Text>
                <Text style={[styles.standingsText, { flex: 0.5 }]}>{standing.won}</Text>
                <Text style={[styles.standingsText, { flex: 0.5 }]}>{standing.drawn}</Text>
                <Text style={[styles.standingsText, { flex: 0.5 }]}>{standing.lost}</Text>
                <Text style={[styles.standingsText, { flex: 0.6 }]}>
                  {standing.goal_difference > 0 ? '+' : ''}
                  {standing.goal_difference}
                </Text>
                <Text style={[styles.standingsText, styles.standingsPoints, { flex: 0.5 }]}>
                  {standing.points}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: '#4BC41E' }]} />
            <Text style={styles.legendText}>Şampiyonlar Ligi</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: '#FFA500' }]} />
            <Text style={styles.legendText}>Avrupa Ligi</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: '#FF3B30' }]} />
            <Text style={styles.legendText}>Düşme</Text>
          </View>
        </View>
      </View>
    );
  };

  // ============================================================================
  // RENDER LOADING
  // ============================================================================

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4BC41E" />
          <Text style={styles.loadingText}>Lig bilgileri yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================================
  // RENDER ERROR
  // ============================================================================

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={styles.centerContent}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={styles.retryButton} activeOpacity={0.7}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#4BC41E"
            colors={['#4BC41E']}
          />
        }
      >
        {renderHeader()}
        {activeTab === 'fixtures' && renderFixturesTab()}
        {activeTab === 'standings' && renderStandingsTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  leagueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  leagueLogo: {
    width: 80,
    height: 80,
  },
  leagueLogoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leagueLogoText: {
    fontSize: 40,
  },
  leagueTextInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  leagueName: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  countryFlag: {
    width: 20,
    height: 15,
  },
  countryText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  seasonText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
  },
  tabText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabTextActive: {
    fontFamily: typography.fonts.ui.semibold,
    color: '#4BC41E',
  },
  tabContent: {
    padding: spacing.lg,
  },
  dateGroup: {
    marginBottom: spacing.lg,
  },
  dateHeader: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  standingsTable: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  standingsHeader: {
    flexDirection: 'row',
    padding: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  standingsHeaderText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  standingsRow: {
    flexDirection: 'row',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  standingsRowCL: {
    borderLeftWidth: 3,
    borderLeftColor: '#4BC41E',
  },
  standingsRowEL: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFA500',
  },
  standingsRowRel: {
    borderLeftWidth: 3,
    borderLeftColor: '#FF3B30',
  },
  standingsRankCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  rankIndicator: {
    width: 3,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  standingsTeamCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  standingsTeamLogo: {
    width: 20,
    height: 20,
  },
  standingsText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  standingsPoints: {
    fontFamily: typography.fonts.mono.bold,
    color: '#4BC41E',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendIndicator: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.md,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  errorText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: '#4BC41E',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  retryButtonText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
    opacity: 0.3,
  },
  emptyText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default LeagueDetailScreen;
