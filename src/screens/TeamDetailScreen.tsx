/**
 * TeamDetailScreen
 *
 * Team detail page with fixtures, standings, and squad
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
  getTeamDetail,
  getTeamFixtures,
  getTeamStandings,
  getTeamPlayers,
  type TeamDetail,
  type TeamFixture,
  type TeamStanding,
  type Player,
} from '../services/teams.service';

// ============================================================================
// TYPES
// ============================================================================

type TabKey = 'fixtures' | 'standings' | 'squad';

export interface TeamDetailScreenProps {
  /** Team ID */
  teamId: string | number;

  /** On back */
  onBack?: () => void;

  /** On fixture press */
  onFixturePress?: (matchId: string | number) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const TeamDetailScreen: React.FC<TeamDetailScreenProps> = ({
  teamId,
  onBack,
  onFixturePress,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('fixtures');
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [fixtures, setFixtures] = useState<TeamFixture[]>([]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [competitionName, setCompetitionName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchData = useCallback(async () => {
    try {
      console.log('🔄 Fetching team data for ID:', teamId);
      setError(null);
      setIsLoading(true);

      const [teamData, fixturesData, standingsData, playersData] = await Promise.all([
        getTeamDetail(teamId),
        getTeamFixtures(teamId),
        getTeamStandings(teamId),
        getTeamPlayers(teamId),
      ]);

      console.log('✅ Team data fetched successfully');
      setTeam(teamData);
      setFixtures(fixturesData);
      setStandings(standingsData.standings);
      setCompetitionName(standingsData.competition_name);
      setPlayers(playersData);
    } catch (error: any) {
      console.error('❌ Failed to fetch team data:', error);
      setError(error.message || 'Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

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
    if (!team) return null;

    return (
      <View style={styles.header}>
        {/* Team Logo & Info */}
        <View style={styles.teamInfo}>
          {team.logo_url ? (
            <Image source={{ uri: team.logo_url }} style={styles.teamLogo} resizeMode="contain" />
          ) : (
            <View style={styles.teamLogoPlaceholder}>
              <Text style={styles.teamLogoText}>⚽</Text>
            </View>
          )}
          <View style={styles.teamTextInfo}>
            <Text style={styles.teamName}>{team.name}</Text>
            {team.country && (
              <View style={styles.countryRow}>
                {team.country_flag && (
                  <Image
                    source={{ uri: team.country_flag }}
                    style={styles.countryFlag}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.countryText}>{team.country}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Team Stats */}
        {team.founded || team.stadium ? (
          <View style={styles.teamStats}>
            {team.founded && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Kuruluş</Text>
                <Text style={styles.statValue}>{team.founded}</Text>
              </View>
            )}
            {team.stadium && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Stadyum</Text>
                <Text style={styles.statValue} numberOfLines={1}>
                  {team.stadium}
                </Text>
              </View>
            )}
          </View>
        ) : null}

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
          <TouchableOpacity
            style={[styles.tab, activeTab === 'squad' && styles.tabActive]}
            onPress={() => setActiveTab('squad')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'squad' && styles.tabTextActive]}>
              Kadro
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

    return (
      <View style={styles.tabContent}>
        {fixtures.map((fixture) => (
          <TouchableOpacity
            key={fixture.id}
            style={styles.fixtureCard}
            onPress={() => onFixturePress?.(fixture.id)}
            activeOpacity={0.7}
          >
            {/* Competition */}
            <View style={styles.fixtureCompetition}>
              {fixture.competition.logo_url && (
                <Image
                  source={{ uri: fixture.competition.logo_url }}
                  style={styles.competitionLogo}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.competitionName}>{fixture.competition.name}</Text>
            </View>

            {/* Teams */}
            <View style={styles.fixtureTeams}>
              <View style={styles.fixtureTeam}>
                {fixture.home_team.logo_url && (
                  <Image
                    source={{ uri: fixture.home_team.logo_url }}
                    style={styles.fixtureTeamLogo}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.fixtureTeamName}>{fixture.home_team.name}</Text>
              </View>

              <View style={styles.fixtureScore}>
                {fixture.home_score !== undefined ? (
                  <>
                    <Text style={styles.scoreText}>{fixture.home_score}</Text>
                    <Text style={styles.scoreDivider}>-</Text>
                    <Text style={styles.scoreText}>{fixture.away_score}</Text>
                  </>
                ) : (
                  <Text style={styles.vsText}>VS</Text>
                )}
              </View>

              <View style={styles.fixtureTeam}>
                {fixture.away_team.logo_url && (
                  <Image
                    source={{ uri: fixture.away_team.logo_url }}
                    style={styles.fixtureTeamLogo}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.fixtureTeamName}>{fixture.away_team.name}</Text>
              </View>
            </View>

            {/* Date */}
            <Text style={styles.fixtureDate}>
              {new Date(fixture.date).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
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
        {competitionName && <Text style={styles.competitionTitle}>{competitionName}</Text>}
        <View style={styles.standingsTable}>
          {/* Header */}
          <View style={styles.standingsHeader}>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.standingsHeaderText, { flex: 2 }]}>Takım</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>O</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>G</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>B</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>M</Text>
            <Text style={[styles.standingsHeaderText, { flex: 0.5 }]}>P</Text>
          </View>

          {/* Rows */}
          {standings.map((standing) => {
            const isCurrentTeam = standing.team_id === Number(teamId);
            return (
              <View
                key={standing.team_id}
                style={[styles.standingsRow, isCurrentTeam && styles.standingsRowHighlight]}
              >
                <Text style={[styles.standingsText, { flex: 0.5 }]}>{standing.rank}</Text>
                <View style={[styles.standingsTeamCell, { flex: 2 }]}>
                  {standing.team_logo && (
                    <Image
                      source={{ uri: standing.team_logo }}
                      style={styles.standingsTeamLogo}
                      resizeMode="contain"
                    />
                  )}
                  <Text
                    style={[
                      styles.standingsText,
                      isCurrentTeam && styles.standingsTextBold,
                    ]}
                    numberOfLines={1}
                  >
                    {standing.team_name}
                  </Text>
                </View>
                <Text style={[styles.standingsText, { flex: 0.5 }]}>{standing.played}</Text>
                <Text style={[styles.standingsText, { flex: 0.5 }]}>{standing.won}</Text>
                <Text style={[styles.standingsText, { flex: 0.5 }]}>{standing.drawn}</Text>
                <Text style={[styles.standingsText, { flex: 0.5 }]}>{standing.lost}</Text>
                <Text
                  style={[
                    styles.standingsText,
                    styles.standingsPoints,
                    { flex: 0.5 },
                  ]}
                >
                  {standing.points}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // ============================================================================
  // RENDER SQUAD TAB
  // ============================================================================

  const renderSquadTab = () => {
    if (players.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyText}>Oyuncu bulunamadı</Text>
        </View>
      );
    }

    // Group players by position
    const groupedPlayers = players.reduce((acc, player) => {
      const pos = player.position || 'Unknown';
      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(player);
      return acc;
    }, {} as Record<string, Player[]>);

    return (
      <View style={styles.tabContent}>
        {Object.entries(groupedPlayers).map(([position, posPlayers]) => (
          <View key={position} style={styles.positionGroup}>
            <Text style={styles.positionTitle}>{position}</Text>
            {posPlayers.map((player) => (
              <View key={player.id} style={styles.playerCard}>
                <View style={styles.playerInfo}>
                  {player.number && (
                    <View style={styles.playerNumber}>
                      <Text style={styles.playerNumberText}>{player.number}</Text>
                    </View>
                  )}
                  <Text style={styles.playerName}>{player.name}</Text>
                </View>
                {player.goals !== undefined && player.goals > 0 && (
                  <Text style={styles.playerStats}>{player.goals} ⚽</Text>
                )}
              </View>
            ))}
          </View>
        ))}
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
          <Text style={styles.loadingText}>Takım bilgileri yükleniyor...</Text>
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
        {activeTab === 'squad' && renderSquadTab()}
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
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  teamLogo: {
    width: 80,
    height: 80,
  },
  teamLogoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamLogoText: {
    fontSize: 40,
  },
  teamTextInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  teamName: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
  teamStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 14,
    color: '#FFFFFF',
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
  fixtureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  fixtureCompetition: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  competitionLogo: {
    width: 16,
    height: 16,
  },
  competitionName: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  fixtureTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  fixtureTeam: {
    flex: 1,
    alignItems: 'center',
  },
  fixtureTeamLogo: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  fixtureTeamName: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  fixtureScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  scoreText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 24,
    color: '#FF3B30',
  },
  scoreDivider: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  vsText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  fixtureDate: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  competitionTitle: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  standingsTable: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    overflow: 'hidden',
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
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  standingsRow: {
    flexDirection: 'row',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  standingsRowHighlight: {
    backgroundColor: 'rgba(75, 196, 30, 0.1)',
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
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  standingsTextBold: {
    fontFamily: typography.fonts.ui.bold,
  },
  standingsPoints: {
    fontFamily: typography.fonts.mono.bold,
    color: '#4BC41E',
  },
  positionGroup: {
    marginBottom: spacing.lg,
  },
  positionTitle: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 16,
    color: '#4BC41E',
    marginBottom: spacing.sm,
  },
  playerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  playerNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerNumberText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 14,
    color: '#4BC41E',
  },
  playerName: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  playerStats: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 12,
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

export default TeamDetailScreen;
