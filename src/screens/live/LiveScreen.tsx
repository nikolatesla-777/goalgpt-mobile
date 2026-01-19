/**
 * LivescoreScreen
 *
 * Replaces the old LiveMatchesScreen.
 * Implements the full Livescore functional layout from Web.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft, CaretRight, CalendarBlank, Circle, Star, ArrowClockwise, SoccerBall } from 'phosphor-react-native';
import { NeonText } from '../../components/atoms/NeonText';
import { ConnectionStatus } from '../../components/molecules/ConnectionStatus';
import { MobileMatchCard } from '../../components/organisms/MobileMatchCard';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, typography } from '../../constants/tokens';
import { getMatchesByDate, getLiveMatches } from '../../services/matches.service';
import type { MatchItem } from '../../components/organisms/LiveMatchesFeed';
import { useWebSocket } from '../../hooks/useWebSocket';

// Tabs Config
type TabKey = 'diary' | 'live' | 'favorites' | 'finished' | 'upcoming';
const TABS: { key: TabKey, label: string }[] = [
  { key: 'diary', label: 'Bülten' },
  { key: 'live', label: 'Canlı' },
  { key: 'favorites', label: 'Favorilerim' },
  { key: 'finished', label: 'Biten' },
  { key: 'upcoming', label: 'Başlamamış' },
];

export default function LivescoreScreen({ navigation }: any) {
  const { theme } = useTheme();

  // State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [activeTab, setActiveTab] = useState<TabKey>('diary');

  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]); // TODO: Persist

  // Helper: Format Date for Display
  const displayDate = useMemo(() => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [selectedDate]);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Data Fetching
  const fetchMatches = useCallback(async () => {
    try {
      setIsLoading(true);

      // If Live tab, fetch live specifically (optimized endpoint)
      // Otherwise fetch by date (diary)
      if (activeTab === 'live') {
        const liveData = await getLiveMatches();
        setMatches(liveData);
      } else {
        // Use the selected date
        const diaryData = await getMatchesByDate(selectedDate);
        setMatches(diaryData);
      }

    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, activeTab]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchMatches();
    setIsRefreshing(false);
  };

  // Date Navigation
  const navigateDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Websocket Integration
  const filteredMatches = useMemo(() => {
    if (activeTab === 'live') return matches; // Already live

    // Client-side filtering for other tabs based on status
    if (activeTab === 'favorites') return matches.filter(m => favorites.includes(m.id.toString()));
    if (activeTab === 'finished') return matches.filter(m => m.status === 'finished');
    if (activeTab === 'upcoming') return matches.filter(m => m.status === 'scheduled');

    return matches; // 'diary' shows all for that date
  }, [matches, activeTab, favorites]);

  const matchIds = useMemo(() => filteredMatches.map(m => m.id), [filteredMatches]);

  const { isConnected, isReconnecting, matchUpdates } = useWebSocket({
    matchIds: matchIds as string[], // Cast safe if service ensures string/number consistency
    autoConnect: true,
  });

  // Apply Live Updates
  const liveList = useMemo(() => {
    if (matchUpdates.size === 0) return filteredMatches;

    return filteredMatches.map(match => {
      const update = matchUpdates.get(match.id);
      if (!update) return match;

      return {
        ...match,
        homeTeam: { ...match.homeTeam, score: update.homeScore ?? match.homeTeam.score },
        awayTeam: { ...match.awayTeam, score: update.awayScore ?? match.awayTeam.score },
        status: update.status === 'live' ? 'live' :
          update.status === 'halftime' ? 'halftime' :
            update.status === 'finished' ? 'finished' : match.status,
        minute: update.minute ?? match.minute,
        // Update time display if minute is available
        time: update.minute ? `${update.minute}'` : match.time,
      };
    });
  }, [filteredMatches, matchUpdates]);


  // Handlers
  const toggleFavorite = (id: string | number) => {
    const sId = id.toString();
    setFavorites(prev =>
      prev.includes(sId) ? prev.filter(f => f !== sId) : [...prev, sId]
    );
  };

  // Counts for Tabs (Rough client-side calc if we have all matches for the day)
  // Note: Only accurate if we fetched 'diary' for today. 
  // If we are on 'live' tab (fetching only live), other counts are unknown. 
  // For now, simpler: show counts based on loaded data IF in diary mode.
  const getCount = (key: TabKey) => {
    if (key === 'diary') return matches.length;
    // This logic is flawed if we only fetch subset. 
    // Keeping simple: Don't show count if not calculated correctly, or calc from matches if matches is full list
    if (activeTab !== 'live' && activeTab !== 'favorites') {
      // We likely have full day list
      if (key === 'live') return matches.filter(m => m.status === 'live' || m.status === 'halftime').length;
      if (key === 'finished') return matches.filter(m => m.status === 'finished').length;
      if (key === 'upcoming') return matches.filter(m => m.status === 'scheduled').length;
    }
    return 0; // Hide or placeholder
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>

      {/* HEADER AREA */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.surface }]}>

        {/* Title Row */}
        <View style={styles.titleRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <SoccerBall size={28} color={theme.colors.text.primary} weight="fill" />
            <NeonText size="h3" weight="black" color="primary">Canlı Skor</NeonText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <ConnectionStatus isConnected={isConnected} isReconnecting={isReconnecting} />
            <TouchableOpacity onPress={onRefresh} disabled={isRefreshing} style={styles.iconBtn}>
              <ArrowClockwise size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Navigation */}
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={() => navigateDate(-1)} style={styles.dateNavBtn}>
            <CaretLeft size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <View style={[styles.dateDisplay, { backgroundColor: theme.colors.background }]}>
            <CalendarBlank size={16} color={theme.colors.text.secondary} />
            <NeonText size="small" weight="bold">{displayDate}</NeonText>
          </View>

          <TouchableOpacity onPress={() => navigateDate(1)} style={styles.dateNavBtn}>
            <CaretRight size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          {!isToday && (
            <TouchableOpacity onPress={goToToday} style={[styles.todayBtn, { backgroundColor: theme.colors.primary }]}>
              <NeonText size="caption" weight="bold" style={{ color: 'white' }}>Bugün</NeonText>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const count = getCount(tab.key);
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabItem,
                  isActive && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                {tab.key === 'live' && <Circle size={8} weight="fill" color={isActive ? 'white' : theme.colors.live} style={{ marginRight: 6 }} />}
                {tab.key === 'favorites' && <Star size={12} weight="fill" color={isActive ? 'white' : theme.colors.warning} style={{ marginRight: 6 }} />}

                <NeonText
                  size="small"
                  weight={isActive ? 'bold' : 'medium'}
                  color={isActive ? 'white' : 'secondary'}
                >
                  {tab.label}
                </NeonText>

                {count > 0 && (
                  <View style={[styles.badge, { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)' }]}>
                    <NeonText size="caption" style={{ fontSize: 10, color: isActive ? 'white' : theme.colors.text.tertiary }}>
                      {count}
                    </NeonText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* CONTENT LIST */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {liveList.length > 0 ? (
          liveList.map(match => (
            <MobileMatchCard
              key={match.id}
              match={match}
              isFavorite={favorites.includes(match.id.toString())}
              onToggleFavorite={() => toggleFavorite(match.id)}
              onPress={() => console.log('Nav to match', match.id)}
              showLeagueHeader={true} // Grouping logic can be added later, for now show for each or minimal
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Circle size={48} color={theme.colors.text.disabled} style={{ opacity: 0.5 }} />
            <NeonText size="medium" color="tertiary" style={{ marginTop: 16 }}>Maç bulunamadı</NeonText>
          </View>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: 8,
  },
  dateNavBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dateDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  todayBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tabsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent', // Default inactive
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
});
