/**
 * MatchDetailScreenContainer
 *
 * Container component that fetches match detail data and passes to MatchDetailScreen
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMatchDetail } from '../hooks/useMatchDetail';
import { MatchDetailScreen } from './MatchDetailScreen';
import { spacing, typography } from '../constants/tokens';
import type { BadgeStatus } from '../components/molecules/LiveBadge';

export interface MatchDetailScreenContainerProps {
  matchId: string | number;
  onBack?: () => void;
}

export const MatchDetailScreenContainer: React.FC<MatchDetailScreenContainerProps> = ({
  matchId,
  onBack,
}) => {
  const {
    isLoadingMatch,
    matchError,
    match,
    h2h,
    lineup,
    stats,
    trend,
    refetch,
  } = useMatchDetail(matchId);

  // Loading state
  if (isLoadingMatch) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4BC41E" />
          <Text style={styles.loadingText}>Loading match details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (matchError || !match) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>
            {matchError || 'Match not found'}
          </Text>
          <TouchableOpacity onPress={refetch} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Transform backend data to screen props format
  const status: BadgeStatus =
    match.status_id === 2 || match.status_id === 4 || match.status_id === 5 || match.status_id === 7
      ? 'live'
      : match.status_id === 3
      ? 'halftime'
      : match.status_id === 8
      ? 'finished'
      : 'upcoming';

  // Transform stats for StatsList component
  const transformedStats = stats?.stats.map((stat, index) => ({
    id: `stat-${index}-${stat.name}`,
    label: stat.name,
    homeValue: stat.home_value,
    awayValue: stat.away_value,
    showProgress: stat.percentage || false,
  })) || [];

  // Transform lineup (with proper null checks)
  const homeLineup = lineup?.home_team_lineup ? {
    formation: lineup.home_team_lineup.formation,
    startingXI: lineup.home_team_lineup.starting_xi?.map((player) => ({
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.position,
      rating: player.rating,
    })) || [],
    substitutes: lineup.home_team_lineup.substitutes?.map((player) => ({
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.position,
    })) || [],
  } : undefined;

  const awayLineup = lineup?.away_team_lineup ? {
    formation: lineup.away_team_lineup.formation,
    startingXI: lineup.away_team_lineup.starting_xi?.map((player) => ({
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.position,
      rating: player.rating,
    })) || [],
    substitutes: lineup.away_team_lineup.substitutes?.map((player) => ({
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.position,
    })) || [],
  } : undefined;

  return (
    <MatchDetailScreen
      matchId={matchId}
      homeTeam={{
        id: match.home_team.id,
        name: match.home_team.name,
        logo: match.home_team.logo_url,
        score: match.home_score,
      }}
      awayTeam={{
        id: match.away_team.id,
        name: match.away_team.name,
        logo: match.away_team.logo_url,
        score: match.away_score,
      }}
      status={status}
      minute={match.minute}
      time={match.minute_text || 'TBD'}
      league={match.competition.name}
      leagueLogo={match.competition.logo_url}
      date={new Date(match.start_time).toLocaleString()}
      stadium={match.stadium}
      referee={match.referee}
      stats={transformedStats}
      events={[]} // Events data structure TBD - trend data available in separate tab
      predictions={[]} // Will be fetched separately
      homeLineup={homeLineup}
      awayLineup={awayLineup}
      onBack={onBack}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
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
    marginBottom: spacing.md,
  },
  retryButtonText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
  },
  backButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backButtonText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#4BC41E',
  },
});

export default MatchDetailScreenContainer;
