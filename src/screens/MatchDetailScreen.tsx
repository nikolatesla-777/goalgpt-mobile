/**
 * MatchDetailScreen
 *
 * Full screen template for match detail page
 * Combines Day 3 organisms into a complete match view
 * Features: Header, Stats, Timeline, Predictions tabs
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MatchDetailHeader } from '../components/organisms/MatchDetailHeader';
import { StatsList } from '../components/organisms/StatsList';
import { MatchTimeline } from '../components/organisms/MatchTimeline';
import { PredictionsList } from '../components/organisms/PredictionsList';
import { GlassCard } from '../components/atoms/GlassCard';
import { NeonText } from '../components/atoms/NeonText';
import { FavoriteButton } from '../components/atoms/FavoriteButton';
import { ShareButton } from '../components/ShareButton';
import { useShare } from '../hooks/useShare';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, typography } from '../constants/tokens';
import type { BadgeStatus } from '../components/molecules/LiveBadge';
import type { MatchStat } from '../components/organisms/StatsList';
import type { MatchEvent } from '../components/organisms/MatchTimeline';
import type { PredictionItem } from '../components/organisms/PredictionsList';

// ============================================================================
// TYPES
// ============================================================================

type TabKey = 'overview' | 'analysis' | 'lineup' | 'community';
type AnalysisSubTab = 'statistics' | 'h2h' | 'standings' | 'trend';
type CommunitySubTab = 'predictions' | 'forum';

export interface LineupPlayer {
  id: string | number;
  name: string;
  number: number;
  position: string;
  rating?: number;
}

export interface TeamLineup {
  formation?: string;
  startingXI?: LineupPlayer[];
  substitutes?: LineupPlayer[];
}

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

export interface MatchDetailScreenProps {
  matchId: string | number;
  // Match data (in real app, fetched via matchId)
  homeTeam: {
    id: string | number;
    name: string;
    logo?: string;
    score?: number;
    countryFlag?: string;
  };
  awayTeam: {
    id: string | number;
    name: string;
    logo?: string;
    score?: number;
    countryFlag?: string;
  };
  status: BadgeStatus;
  minute?: number;
  time?: string;
  league?: string;
  leagueLogo?: string;
  date?: string;
  stadium?: string;
  referee?: string;
  // Tab data
  stats?: MatchStat[];
  events?: MatchEvent[];
  predictions?: PredictionItem[];
  homeLineup?: TeamLineup;
  awayLineup?: TeamLineup;
  // Callbacks
  onBack?: () => void;
  onFavoriteToggle?: (id: string | number) => void;
}

// ============================================================================
// TABS CONFIG
// ============================================================================

const TABS: Tab[] = [
  { key: 'overview', label: 'Overview', icon: '⚡' },
  { key: 'analysis', label: 'Analysis', icon: '📊' },
  { key: 'lineup', label: 'Lineup', icon: '👥' },
  { key: 'community', label: 'Community', icon: '💬' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const MatchDetailScreen: React.FC<MatchDetailScreenProps> = ({
  matchId,
  homeTeam,
  awayTeam,
  status,
  minute,
  time,
  league,
  leagueLogo,
  date,
  stadium,
  referee,
  stats = [],
  events = [],
  predictions = [],
  homeLineup,
  awayLineup,
  onBack,
  onFavoriteToggle,
}) => {
  const { theme } = useTheme();
  const { shareMatch, isSharing } = useShare();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [analysisSubTab, setAnalysisSubTab] = useState<AnalysisSubTab>('statistics');
  const [communitySubTab, setCommunitySubTab] = useState<CommunitySubTab>('predictions');

  // Handle share match
  const handleShare = () => {
    const score =
      homeTeam.score !== undefined && awayTeam.score !== undefined
        ? { home: homeTeam.score, away: awayTeam.score }
        : undefined;

    const matchStatus = status === 'live' ? 'Live' : status === 'finished' ? 'Finished' : undefined;

    shareMatch(matchId, homeTeam.name, awayTeam.name, score, league, matchStatus);
  };

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
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // ============================================================================
  // RENDER OVERVIEW TAB
  // ============================================================================

  const renderOverviewTab = () => {
    return (
      <View style={styles.tabContent}>
        {/* Quick Stats */}
        <GlassCard intensity="default" padding={spacing.md} style={styles.section}>
          <NeonText color="brand" glow="small" size="small" weight="bold" style={styles.sectionTitle}>
            Quick Stats
          </NeonText>
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{stats.find(s => s.label === 'Possession')?.homeValue || '0'}%</Text>
              <Text style={styles.quickStatLabel}>Possession</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{stats.find(s => s.label === 'Shots')?.homeValue || '0'}</Text>
              <Text style={styles.quickStatLabel}>Shots</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{stats.find(s => s.label === 'Corners')?.homeValue || '0'}</Text>
              <Text style={styles.quickStatLabel}>Corners</Text>
            </View>
          </View>
        </GlassCard>

        {/* Match Timeline */}
        <MatchTimeline
          events={events}
          homeTeamName={homeTeam.name}
          awayTeamName={awayTeam.name}
          title="Match Events"
          emptyMessage="No events yet. Check back during the match!"
        />

        {/* Live Commentary (if live) */}
        {status === 'live' && (
          <GlassCard intensity="default" padding={spacing.md} style={styles.section}>
            <NeonText color="brand" glow="small" size="small" weight="bold" style={styles.sectionTitle}>
              Live Commentary
            </NeonText>
            <Text style={styles.commentaryText}>
              {minute}' - Match in progress...
            </Text>
          </GlassCard>
        )}
      </View>
    );
  };

  // ============================================================================
  // RENDER ANALYSIS TAB
  // ============================================================================

  const renderAnalysisSubTabs = () => {
    const subTabs: { key: AnalysisSubTab; label: string }[] = [
      { key: 'statistics', label: 'Stats' },
      { key: 'h2h', label: 'H2H' },
      { key: 'standings', label: 'Table' },
      { key: 'trend', label: 'Trend' },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subTabBar}
      >
        {subTabs.map((tab) => {
          const isActive = analysisSubTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.subTab, isActive && styles.subTabActive]}
              onPress={() => setAnalysisSubTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.subTabLabel, isActive && styles.subTabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderAnalysisTab = () => {
    return (
      <View>
        {renderAnalysisSubTabs()}

        <View style={styles.tabContent}>
          {analysisSubTab === 'statistics' && (
            <StatsList
              stats={stats}
              title="Match Statistics"
              emptyMessage="Statistics will be available once the match starts"
            />
          )}

          {analysisSubTab === 'h2h' && (
            <GlassCard intensity="default" padding={spacing.lg} style={styles.comingSoon}>
              <Text style={styles.comingSoonIcon}>⚔️</Text>
              <Text style={styles.comingSoonText}>Head-to-Head</Text>
              <Text style={styles.comingSoonSubtext}>Last 10 meetings coming soon...</Text>
            </GlassCard>
          )}

          {analysisSubTab === 'standings' && (
            <GlassCard intensity="default" padding={spacing.lg} style={styles.comingSoon}>
              <Text style={styles.comingSoonIcon}>📊</Text>
              <Text style={styles.comingSoonText}>League Table</Text>
              <Text style={styles.comingSoonSubtext}>Standings coming soon...</Text>
            </GlassCard>
          )}

          {analysisSubTab === 'trend' && (
            <GlassCard intensity="default" padding={spacing.lg} style={styles.comingSoon}>
              <Text style={styles.comingSoonIcon}>📈</Text>
              <Text style={styles.comingSoonText}>Match Trend</Text>
              <Text style={styles.comingSoonSubtext}>Minute-by-minute analysis coming soon...</Text>
            </GlassCard>
          )}
        </View>
      </View>
    );
  };

  // ============================================================================
  // RENDER LINEUP TAB
  // ============================================================================

  const renderPlayerList = (players: LineupPlayer[] | undefined, title: string) => {
    if (!players || players.length === 0) return null;

    return (
      <View style={styles.playerSection}>
        <Text style={styles.playerSectionTitle}>{title}</Text>
        {players.map((player) => (
          <View key={player.id} style={styles.playerRow}>
            <View style={styles.playerNumberBadge}>
              <Text style={styles.playerNumber}>{player.number}</Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerPosition}>{player.position}</Text>
            </View>
            {player.rating && (
              <View style={styles.playerRating}>
                <Text style={styles.ratingText}>{player.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderLineupTab = () => {
    const hasLineupData = homeLineup || awayLineup;

    if (!hasLineupData) {
      return (
        <View style={styles.tabContent}>
          <GlassCard intensity="default" padding={spacing.lg} style={styles.comingSoon}>
            <Text style={styles.comingSoonIcon}>👥</Text>
            <Text style={styles.comingSoonText}>Team Lineups</Text>
            <Text style={styles.comingSoonSubtext}>Lineup information will be available closer to kickoff</Text>
          </GlassCard>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        {/* Home Team Lineup */}
        {homeLineup && (
          <GlassCard intensity="default" padding={spacing.md} style={styles.section}>
            <View style={styles.lineupHeader}>
              <NeonText color="brand" glow="small" size="small" weight="bold">
                {homeTeam.name}
              </NeonText>
              {homeLineup.formation && (
                <View style={styles.formationBadge}>
                  <Text style={styles.formationText}>{homeLineup.formation}</Text>
                </View>
              )}
            </View>
            {renderPlayerList(homeLineup.startingXI, 'Starting XI')}
            {renderPlayerList(homeLineup.substitutes, 'Substitutes')}
          </GlassCard>
        )}

        {/* Away Team Lineup */}
        {awayLineup && (
          <GlassCard intensity="default" padding={spacing.md} style={styles.section}>
            <View style={styles.lineupHeader}>
              <NeonText color="brand" glow="small" size="small" weight="bold">
                {awayTeam.name}
              </NeonText>
              {awayLineup.formation && (
                <View style={styles.formationBadge}>
                  <Text style={styles.formationText}>{awayLineup.formation}</Text>
                </View>
              )}
            </View>
            {renderPlayerList(awayLineup.startingXI, 'Starting XI')}
            {renderPlayerList(awayLineup.substitutes, 'Substitutes')}
          </GlassCard>
        )}
      </View>
    );
  };

  // ============================================================================
  // RENDER COMMUNITY TAB
  // ============================================================================

  const renderCommunitySubTabs = () => {
    const subTabs: { key: CommunitySubTab; label: string }[] = [
      { key: 'predictions', label: 'AI Predictions' },
      { key: 'forum', label: 'Forum' },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subTabBar}
      >
        {subTabs.map((tab) => {
          const isActive = communitySubTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.subTab, isActive && styles.subTabActive]}
              onPress={() => setCommunitySubTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.subTabLabel, isActive && styles.subTabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderCommunityTab = () => {
    return (
      <View>
        {renderCommunitySubTabs()}

        <View style={styles.tabContent}>
          {communitySubTab === 'predictions' && (
            <View style={{ minHeight: 400 }}>
              <PredictionsList
                predictions={predictions}
                title="AI Predictions for this Match"
                emptyMessage="No AI predictions available for this match"
                onPredictionPress={(id) => console.log('Prediction:', id)}
                onFavoriteToggle={onFavoriteToggle}
              />
            </View>
          )}

          {communitySubTab === 'forum' && (
            <GlassCard intensity="default" padding={spacing.lg} style={styles.comingSoon}>
              <Text style={styles.comingSoonIcon}>💬</Text>
              <Text style={styles.comingSoonText}>Match Forum</Text>
              <Text style={styles.comingSoonSubtext}>Community discussions coming soon...</Text>
            </GlassCard>
          )}
        </View>
      </View>
    );
  };

  // ============================================================================
  // RENDER TAB CONTENT
  // ============================================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'analysis':
        return renderAnalysisTab();
      case 'lineup':
        return renderLineupTab();
      case 'community':
        return renderCommunityTab();
      default:
        return null;
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header with Back Button & Favorite */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <Text style={styles.backIcon}>←</Text>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerRight}>
            <ShareButton
              onPress={handleShare}
              loading={isSharing}
              size="medium"
              color="#FFFFFF"
              style={styles.shareButton}
            />
            <FavoriteButton
              type="match"
              item={{
                matchId,
                homeTeam: {
                  id: homeTeam.id,
                  name: homeTeam.name,
                  logo: homeTeam.logo,
                },
                awayTeam: {
                  id: awayTeam.id,
                  name: awayTeam.name,
                  logo: awayTeam.logo,
                },
                league,
                date,
                status,
                homeScore: homeTeam.score,
                awayScore: awayTeam.score,
              }}
              size="medium"
              onToggle={(isFavorited) => {
                console.log('Match favorite toggled:', isFavorited);
                onFavoriteToggle?.(matchId);
              }}
            />
          </View>
        </View>

        {/* Full Page ScrollView */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Match Header */}
          <View style={styles.headerContainer}>
            <MatchDetailHeader
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              status={status}
              minute={minute}
              time={time}
              league={league}
              leagueLogo={leagueLogo}
              date={date}
              stadium={stadium}
              referee={referee}
            />
          </View>

          {/* Horizontal Scrollable Tab Bar */}
          {renderTabBar()}

          {/* Tab Content */}
          <View style={styles.tabContentWrapper}>
            {renderTabContent()}
          </View>
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    backgroundColor: '#000000',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  backText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 17,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    padding: spacing.lg,
  },
  tabBarContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.2)',
    paddingVertical: spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    position: 'relative',
    minWidth: 100,
  },
  tabActive: {
    // Active state handled by indicator
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
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
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: spacing.md,
    right: spacing.md,
    height: 3,
    backgroundColor: '#4BC41E',
    borderRadius: 2,
  },
  tabContentWrapper: {
    flex: 1,
  },
  tabContent: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 24,
    color: '#4BC41E',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  commentaryText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.sm,
  },
  subTabBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  subTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  subTabActive: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    borderColor: '#4BC41E',
  },
  subTabLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  subTabLabelActive: {
    fontFamily: typography.fonts.ui.semibold,
    color: '#4BC41E',
  },
  lineupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formationBadge: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4BC41E',
  },
  formationText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: typography.fontSize.button.small,
    color: '#4BC41E',
  },
  playerSection: {
    marginBottom: spacing.lg,
  },
  playerSectionTitle: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: spacing.md,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  playerNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    borderWidth: 1,
    borderColor: '#4BC41E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  playerNumber: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 14,
    color: '#4BC41E',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  playerPosition: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playerRating: {
    backgroundColor: 'rgba(75, 196, 30, 0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4BC41E',
  },
  ratingText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 12,
    color: '#4BC41E',
  },
  comingSoon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
    opacity: 0.3,
  },
  comingSoonText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: typography.fontSize.button.large,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: spacing.xs,
  },
  comingSoonSubtext: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default MatchDetailScreen;
