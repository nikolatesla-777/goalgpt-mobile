/**
 * FavoritesScreen
 *
 * View all favorites with tabs (Matches, Predictions, Teams)
 * Users can manage and access their bookmarked items
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../context/FavoritesContext';
import { FavoriteButton } from '../components/atoms/FavoriteButton';
import { spacing, typography } from '../constants/tokens';
import type { MatchFavorite, PredictionFavorite, TeamFavorite } from '../types/favorites.types';

// ============================================================================
// TYPES
// ============================================================================

type TabKey = 'matches' | 'predictions' | 'teams';

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

export interface FavoritesScreenProps {
  onMatchPress?: (matchId: string | number) => void;
  onPredictionPress?: (predictionId: string | number) => void;
  onTeamPress?: (teamId: string | number) => void;
}

// ============================================================================
// TABS CONFIG
// ============================================================================

const TABS: Tab[] = [
  { key: 'matches', label: 'Matches', icon: '⚽' },
  { key: 'predictions', label: 'Predictions', icon: '🤖' },
  { key: 'teams', label: 'Teams', icon: '👥' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  onMatchPress,
  onPredictionPress,
  onTeamPress,
}) => {
  const favorites = useFavorites();
  const [activeTab, setActiveTab] = useState<TabKey>('matches');

  // ============================================================================
  // RENDER TAB BAR
  // ============================================================================

  const renderTabBar = () => {
    return (
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = (() => {
              switch (tab.key) {
                case 'matches':
                  return favorites.matches.length;
                case 'predictions':
                  return favorites.predictions.length;
                case 'teams':
                  return favorites.teams.length;
                default:
                  return 0;
              }
            })();

            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // ============================================================================
  // RENDER MATCH CARD
  // ============================================================================

  const renderMatchCard = ({ item }: { item: MatchFavorite }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onMatchPress?.(item.matchId)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.leagueInfo}>
            <Text style={styles.leagueText}>{item.league || 'League'}</Text>
            {item.date && <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>}
          </View>
          <FavoriteButton
            type="match"
            item={{
              matchId: item.matchId,
              homeTeam: item.homeTeam,
              awayTeam: item.awayTeam,
              league: item.league,
              date: item.date,
              status: item.status,
              homeScore: item.homeScore,
              awayScore: item.awayScore,
            }}
            size="small"
          />
        </View>

        <View style={styles.matchInfo}>
          <View style={styles.team}>
            <Text style={styles.teamName}>{item.homeTeam.name}</Text>
            {item.homeScore !== undefined && (
              <Text style={styles.score}>{item.homeScore}</Text>
            )}
          </View>
          <Text style={styles.vs}>vs</Text>
          <View style={styles.team}>
            <Text style={styles.teamName}>{item.awayTeam.name}</Text>
            {item.awayScore !== undefined && (
              <Text style={styles.score}>{item.awayScore}</Text>
            )}
          </View>
        </View>

        {item.status && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ============================================================================
  // RENDER PREDICTION CARD
  // ============================================================================

  const renderPredictionCard = ({ item }: { item: PredictionFavorite }) => {
    const tierColor =
      item.tier === 'vip' ? '#FFD700' : item.tier === 'premium' ? '#4BC41E' : '#808080';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPredictionPress?.(item.predictionId)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.tierBadge, { backgroundColor: `${tierColor}20`, borderColor: `${tierColor}40` }]}>
            <Text style={[styles.tierText, { color: tierColor }]}>
              {item.tier?.toUpperCase() || 'FREE'}
            </Text>
          </View>
          <FavoriteButton
            type="prediction"
            item={{
              predictionId: item.predictionId,
              matchId: item.matchId,
              market: item.market,
              prediction: item.prediction,
              confidence: item.confidence,
              tier: item.tier,
              result: item.result,
              homeTeam: item.homeTeam,
              awayTeam: item.awayTeam,
            }}
            size="small"
          />
        </View>

        {item.homeTeam && item.awayTeam && (
          <Text style={styles.predictionMatch}>
            {item.homeTeam} vs {item.awayTeam}
          </Text>
        )}

        <View style={styles.predictionInfo}>
          <Text style={styles.market}>{item.market}</Text>
          <Text style={styles.prediction}>{item.prediction}</Text>
        </View>

        <View style={styles.predictionFooter}>
          {item.confidence !== undefined && (
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{item.confidence}% confidence</Text>
            </View>
          )}
          {item.result && (
            <View
              style={[
                styles.resultBadge,
                item.result === 'win' && styles.resultWin,
                item.result === 'lose' && styles.resultLose,
                item.result === 'pending' && styles.resultPending,
              ]}
            >
              <Text style={styles.resultText}>{item.result.toUpperCase()}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // ============================================================================
  // RENDER TEAM CARD
  // ============================================================================

  const renderTeamCard = ({ item }: { item: TeamFavorite }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onTeamPress?.(item.teamId)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.teamCardName}>{item.name}</Text>
          <FavoriteButton
            type="team"
            item={{
              teamId: item.teamId,
              name: item.name,
              logo: item.logo,
              league: item.league,
            }}
            size="small"
          />
        </View>

        {item.league && (
          <Text style={styles.teamLeague}>{item.league}</Text>
        )}
      </TouchableOpacity>
    );
  };

  // ============================================================================
  // RENDER EMPTY STATE
  // ============================================================================

  const renderEmptyState = () => {
    const message = (() => {
      switch (activeTab) {
        case 'matches':
          return 'No favorite matches yet';
        case 'predictions':
          return 'No favorite predictions yet';
        case 'teams':
          return 'No favorite teams yet';
        default:
          return 'No favorites yet';
      }
    })();

    const icon = (() => {
      switch (activeTab) {
        case 'matches':
          return '⚽';
        case 'predictions':
          return '🤖';
        case 'teams':
          return '👥';
        default:
          return '📭';
      }
    })();

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{icon}</Text>
        <Text style={styles.emptyText}>{message}</Text>
        <Text style={styles.emptyHint}>
          Tap the heart icon on any item to add it to your favorites
        </Text>
      </View>
    );
  };

  // ============================================================================
  // RENDER TAB CONTENT
  // ============================================================================

  const renderTabContent = () => {
    if (favorites.isLoading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4BC41E" />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'matches':
        if (favorites.matches.length === 0) {
          return renderEmptyState();
        }
        return (
          <FlatList
            data={favorites.matches}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMatchCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );

      case 'predictions':
        if (favorites.predictions.length === 0) {
          return renderEmptyState();
        }
        return (
          <FlatList
            data={favorites.predictions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPredictionCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );

      case 'teams':
        if (favorites.teams.length === 0) {
          return renderEmptyState();
        }
        return (
          <FlatList
            data={favorites.teams}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTeamCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );

      default:
        return renderEmptyState();
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Favorites</Text>
        </View>

        {/* Tab Bar */}
        {renderTabBar()}

        {/* Content */}
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.2)',
  },
  headerTitle: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 24,
    color: '#FFFFFF',
  },
  tabBarContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.2)',
    paddingVertical: spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabActive: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    borderColor: '#4BC41E',
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabLabelActive: {
    fontFamily: typography.fonts.ui.semibold,
    color: '#4BC41E',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: 'rgba(75, 196, 30, 0.3)',
  },
  badgeText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  badgeTextActive: {
    color: '#4BC41E',
  },
  listContent: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: 'rgba(23, 80, 61, 0.25)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  leagueInfo: {
    flex: 1,
  },
  leagueText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  dateText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  team: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamName: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
    flex: 1,
  },
  vs: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: spacing.sm,
  },
  score: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 18,
    color: '#4BC41E',
    marginLeft: spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 10,
    color: '#4BC41E',
  },
  tierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  tierText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 10,
  },
  predictionMatch: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: spacing.xs,
  },
  predictionInfo: {
    marginBottom: spacing.sm,
  },
  market: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
  },
  prediction: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
  },
  predictionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 10,
    color: '#4BC41E',
  },
  resultBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resultWin: {
    backgroundColor: 'rgba(75, 196, 30, 0.3)',
  },
  resultLose: {
    backgroundColor: 'rgba(255, 59, 48, 0.3)',
  },
  resultPending: {
    backgroundColor: 'rgba(255, 149, 0, 0.3)',
  },
  resultText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 10,
    color: '#FFFFFF',
  },
  teamCardName: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
    flex: 1,
  },
  teamLeague: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.xs,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
    opacity: 0.3,
  },
  emptyText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.large,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyHint: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default FavoritesScreen;
