/**
 * Design System Showcase
 * Test screen for Day 1 components
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Button } from '../../components/atoms/Button';
import { GlassCard } from '../../components/atoms/GlassCard';
import { NeonText, LiveIndicator, ScoreText } from '../../components/atoms/NeonText';
import { Input, SearchInput, PasswordInput } from '../../components/atoms/Input';
import { MatchCard } from '../../components/molecules/MatchCard';
import { PredictionCard } from '../../components/molecules/PredictionCard';
import { StatRow } from '../../components/molecules/StatRow';
import { LiveBadge } from '../../components/molecules/LiveBadge';
import { TeamHeader } from '../../components/molecules/TeamHeader';
import { MatchDetailHeader } from '../../components/organisms/MatchDetailHeader';
import { StatsList } from '../../components/organisms/StatsList';
import { PredictionsList } from '../../components/organisms/PredictionsList';
import { LiveMatchesFeed } from '../../components/organisms/LiveMatchesFeed';
import { MatchTimeline } from '../../components/organisms/MatchTimeline';
import { HomeScreen } from '../HomeScreen';
import { LiveMatchesScreen } from '../LiveMatchesScreen';
import { PredictionsScreen } from '../PredictionsScreen';
import { MatchDetailScreen } from '../MatchDetailScreen';
import { mockMatches, mockPredictions, mockStats, mockEvents, getLiveMatches, getTopPredictions } from '../../services/mockData';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../constants/tokens';

export const DesignSystemShowcase = () => {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [password, setPassword] = useState('');
  const [errorField, setErrorField] = useState('');

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        {/* Header */}
        <NeonText color="brand" glow="large" size="large" type="ui" weight="bold">
          GoalGPT Design System
        </NeonText>
        <NeonText color="white" glow="small" size="small" style={{ marginTop: 8 }}>
          Week 1 - Complete (Days 1-4)
        </NeonText>
      </View>

      {/* Buttons Section */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Buttons
        </NeonText>
        
        <Button variant="primary" fullWidth style={{ marginBottom: 12 }}>
          Primary Button
        </Button>
        
        <Button variant="secondary" fullWidth style={{ marginBottom: 12 }}>
          Secondary Button
        </Button>
        
        <Button variant="ghost" fullWidth style={{ marginBottom: 12 }}>
          Ghost Button
        </Button>
        
        <Button variant="vip" fullWidth style={{ marginBottom: 12 }}>
          VIP Button (Gold Gradient)
        </Button>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary" size="medium">Medium</Button>
          <Button variant="primary" size="large">Large</Button>
        </View>
      </View>

      {/* GlassCard Section */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Glass Cards
        </NeonText>
        
        <GlassCard intensity="subtle" style={{ marginBottom: 12 }}>
          <NeonText color="white" size="small">
            Subtle Glass Card - Hafif blur effect
          </NeonText>
        </GlassCard>
        
        <GlassCard intensity="default" style={{ marginBottom: 12 }}>
          <NeonText color="white" size="small">
            Default Glass Card - Orta blur effect
          </NeonText>
        </GlassCard>
        
        <GlassCard intensity="intense" style={{ marginBottom: 12 }}>
          <NeonText color="white" size="small">
            Intense Glass Card - Güçlü blur effect
          </NeonText>
        </GlassCard>
      </View>

      {/* NeonText Section */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Neon Text Colors
        </NeonText>
        
        <GlassCard intensity="default" padding={16}>
          <NeonText color="brand" glow="large" size="medium" style={{ marginBottom: 8 }}>
            Brand Green (#4BC41E)
          </NeonText>
          <NeonText color="live" glow="large" size="medium" style={{ marginBottom: 8 }}>
            Live Red (#FF3B30)
          </NeonText>
          <NeonText color="vip" glow="large" size="medium" style={{ marginBottom: 8 }}>
            VIP Gold (#FFD700)
          </NeonText>
          <NeonText color="win" glow="large" size="medium" style={{ marginBottom: 8 }}>
            Win Green (#34C759)
          </NeonText>
          <NeonText color="white" glow="large" size="medium">
            White (#FFFFFF)
          </NeonText>
        </GlassCard>
      </View>

      {/* Score Display */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Score Display (Data Type)
        </NeonText>
        
        <GlassCard intensity="intense" style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <View style={{ alignItems: 'center' }}>
              <NeonText color="white" size="small" style={{ marginBottom: 4 }}>
                Barcelona
              </NeonText>
              <ScoreText color="brand">3</ScoreText>
            </View>
            
            <NeonText color="white" glow="medium" size="large" type="data">
              -
            </NeonText>
            
            <View style={{ alignItems: 'center' }}>
              <NeonText color="white" size="small" style={{ marginBottom: 4 }}>
                Real Madrid
              </NeonText>
              <ScoreText color="brand">2</ScoreText>
            </View>
          </View>
          
          <View style={{ marginTop: 16 }}>
            <LiveIndicator />
          </View>
        </GlassCard>
      </View>

      {/* Input Section */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Input Fields
        </NeonText>
        
        <Input
          label="Username"
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
          style={{ marginBottom: 12 }}
        />

        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Search matches..."
        />

        <PasswordInput
          label="Password"
          value={password}
          onChangeText={setPassword}
        />

        <Input
          label="Error Example"
          placeholder="Required field"
          value={errorField}
          onChangeText={setErrorField}
          error="This field is required"
        />
      </View>

      {/* Animation Test */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Press Animations
        </NeonText>

        <NeonText color="white" size="small" style={{ marginBottom: 12 }}>
          Tüm butonlar press animasyonuna sahip (scale 0.95 spring)
        </NeonText>

        <Button variant="primary" fullWidth>
          Press Me! (Spring Animation)
        </Button>
      </View>

      {/* Match Cards */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Match Cards (NEW - Day 2)
        </NeonText>

        <NeonText color="white" size="small" style={{ marginBottom: 12 }}>
          Takım isimleri beyaz, logolar emoji placeholder (gerçekte API'den gelecek)
        </NeonText>

        {/* Live Match */}
        <View style={{ marginBottom: 12 }}>
          <MatchCard
            homeTeam={{ name: 'Barcelona', score: 2, logo: '🔵🔴' }}
            awayTeam={{ name: 'Real Madrid', score: 1, logo: '⚪' }}
            status="live"
            time="75'"
            minute={75}
            league="La Liga"
            onPress={() => console.log('Match pressed')}
          />
        </View>

        {/* Halftime Match */}
        <View style={{ marginBottom: 12 }}>
          <MatchCard
            homeTeam={{ name: 'Manchester United', score: 1, logo: '🔴' }}
            awayTeam={{ name: 'Liverpool', score: 1, logo: '🔴' }}
            status="halftime"
            time="HT"
            league="Premier League"
            onPress={() => console.log('Match pressed')}
          />
        </View>

        {/* Finished Match */}
        <View style={{ marginBottom: 12 }}>
          <MatchCard
            homeTeam={{ name: 'Bayern Munich', score: 3, logo: '🔴⚪' }}
            awayTeam={{ name: 'Dortmund', score: 2, logo: '🟡⚫' }}
            status="finished"
            time="FT"
            league="Bundesliga"
            onPress={() => console.log('Match pressed')}
          />
        </View>

        {/* Upcoming Match */}
        <View style={{ marginBottom: 12 }}>
          <MatchCard
            homeTeam={{ name: 'Juventus', logo: '⚫⚪' }}
            awayTeam={{ name: 'Inter Milan', logo: '🔵⚫' }}
            status="upcoming"
            time="19:00"
            league="Serie A"
            onPress={() => console.log('Match pressed')}
          />
        </View>
      </View>

      {/* Prediction Cards */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          AI Prediction Cards (NEW - Day 2)
        </NeonText>

        <NeonText color="white" size="small" style={{ marginBottom: 12 }}>
          Bot tahminleri - FREE/PREMIUM/VIP tier + WIN/LOSE/PENDING sonuçları
        </NeonText>

        {/* WIN Prediction */}
        <View style={{ marginBottom: 12 }}>
          <PredictionCard
            bot={{
              id: 10,
              name: 'Beaten Draw',
              stats: '+5C4.2',
            }}
            match={{
              country: 'BRAZIL',
              countryFlag: '🇧🇷',
              league: 'BRASIL COPA SP JUNIORES',
              homeTeam: { name: 'Sao Paulo Youth', logo: '🔴⚪⚫' },
              awayTeam: { name: 'Portuguesa', logo: '🔴🟢' },
              homeScore: 0,
              awayScore: 0,
              status: 'FT',
              time: '14:01 - 02:40',
            }}
            prediction={{
              type: 'IY 0.5 ÜST',
              minute: "10'",
              score: '0-0',
              result: 'lose',
            }}
            tier="free"
            isFavorite={false}
            onPress={() => console.log('Prediction pressed')}
            onFavoritePress={() => console.log('Favorite toggled')}
          />
        </View>

        {/* PENDING Prediction */}
        <View style={{ marginBottom: 12 }}>
          <PredictionCard
            bot={{
              id: 25,
              name: 'Goal Master',
              stats: '+12C8.5',
            }}
            match={{
              country: 'ENGLAND',
              countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
              league: 'Premier League',
              homeTeam: { name: 'Arsenal', logo: '🔴⚪' },
              awayTeam: { name: 'Chelsea', logo: '🔵' },
              status: 'VS',
              time: '20:00',
            }}
            prediction={{
              type: 'MS 1',
              minute: "45'",
              score: '1-0',
              result: 'pending',
            }}
            tier="premium"
            isFavorite={true}
            onPress={() => console.log('Prediction pressed')}
            onFavoritePress={() => console.log('Favorite toggled')}
          />
        </View>

        {/* WIN Prediction - VIP */}
        <View style={{ marginBottom: 12 }}>
          <PredictionCard
            bot={{
              id: 42,
              name: 'VIP Analytics',
              stats: '+25C15.2',
            }}
            match={{
              country: 'SPAIN',
              countryFlag: '🇪🇸',
              league: 'La Liga',
              homeTeam: { name: 'Real Madrid', logo: '⚪' },
              awayTeam: { name: 'Barcelona', logo: '🔵🔴' },
              homeScore: 2,
              awayScore: 1,
              status: 'FT',
              time: '21:00 - 23:00',
            }}
            prediction={{
              type: 'IY 2.5 ALT',
              minute: "90'",
              score: '1-1',
              result: 'win',
            }}
            tier="vip"
            isFavorite={true}
            onPress={() => console.log('Prediction pressed')}
            onFavoritePress={() => console.log('Favorite toggled')}
          />
        </View>
      </View>

      {/* Stat Rows */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Stat Rows (NEW - Day 2)
        </NeonText>

        <NeonText color="white" size="small" style={{ marginBottom: 12 }}>
          Maç istatistikleri - Progress bar ile görselleştirme
        </NeonText>

        <GlassCard intensity="default" padding={spacing.md}>
          <StatRow label="Possession" homeValue={58} awayValue={42} showProgress highlightHigher />
          <StatRow label="Shots" homeValue={15} awayValue={9} showProgress highlightHigher />
          <StatRow label="On Target" homeValue={7} awayValue={4} showProgress highlightHigher />
          <StatRow label="Corners" homeValue={6} awayValue={3} showProgress highlightHigher />
          <StatRow label="Fouls" homeValue={12} awayValue={18} showProgress highlightHigher />
          <StatRow label="Yellow Cards" homeValue={2} awayValue={4} showProgress={false} highlightHigher />
        </GlassCard>
      </View>

      {/* Live Badges */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Live Badges (NEW - Day 2)
        </NeonText>

        <GlassCard intensity="default" padding={spacing.md}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 8 }}>LIVE</Text>
              <LiveBadge status="live" minute={75} />
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 8 }}>HALFTIME</Text>
              <LiveBadge status="halftime" />
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 8 }}>FINISHED</Text>
              <LiveBadge status="finished" />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 8 }}>UPCOMING</Text>
              <LiveBadge status="upcoming" text="19:00" />
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 8 }}>POSTPONED</Text>
              <LiveBadge status="postponed" />
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 8 }}>CANCELLED</Text>
              <LiveBadge status="cancelled" />
            </View>
          </View>
        </GlassCard>
      </View>

      {/* Team Headers */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Team Headers (NEW - Day 2)
        </NeonText>

        <GlassCard intensity="default" padding={spacing.md}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 12 }}>Vertical - Large</Text>
            <TeamHeader
              name="Real Madrid"
              logo="⚪"
              countryFlag="🇪🇸"
              direction="vertical"
              size="large"
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 12 }}>Horizontal - Medium</Text>
            <TeamHeader
              name="Manchester United"
              logo="🔴"
              countryFlag="🏴󠁧󠁢󠁥󠁮󠁧󠁿"
              direction="horizontal"
              size="medium"
              align="left"
            />
          </View>

          <View>
            <Text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 12 }}>Small - No Flag</Text>
            <TeamHeader
              name="Barcelona"
              logo="🔵🔴"
              direction="horizontal"
              size="small"
              align="left"
            />
          </View>
        </GlassCard>
      </View>

      {/* ==================== DAY 3 - ORGANISMS ==================== */}

      {/* MatchDetailHeader Organism */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Match Detail Header (NEW - Day 3)
        </NeonText>

        <MatchDetailHeader
          homeTeam={{
            id: '1',
            name: 'Barcelona',
            logo: '🔵🔴',
            score: 3,
            countryFlag: '🇪🇸',
          }}
          awayTeam={{
            id: '2',
            name: 'Real Madrid',
            logo: '⚪',
            score: 2,
            countryFlag: '🇪🇸',
          }}
          status="live"
          minute={67}
          league="La Liga"
          leagueLogo="⚽"
          date="14 Jan 2026 - 21:00"
          stadium="Camp Nou"
          referee="Antonio Mateu Lahoz"
          onPress={() => console.log('Match header pressed')}
        />
      </View>

      {/* StatsList Organism */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Stats List (NEW - Day 3)
        </NeonText>

        <StatsList
          stats={[
            { id: '1', label: 'Possession', homeValue: 62, awayValue: 38, showProgress: true, highlightHigher: true },
            { id: '2', label: 'Shots', homeValue: 18, awayValue: 12, showProgress: true, highlightHigher: true },
            { id: '3', label: 'On Target', homeValue: 8, awayValue: 5, showProgress: true, highlightHigher: true },
            { id: '4', label: 'Corners', homeValue: 7, awayValue: 4, showProgress: true, highlightHigher: true },
            { id: '5', label: 'Fouls', homeValue: 9, awayValue: 14, showProgress: true, highlightHigher: true },
          ]}
          title="El Clasico Statistics"
        />
      </View>

      {/* PredictionsList Organism */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Predictions List (NEW - Day 3)
        </NeonText>

        <View style={{ height: 600 }}>
          <PredictionsList
            predictions={[
              {
                id: 'pred1',
                bot: { id: 10, name: 'Beaten Draw', stats: '+5C4.2' },
                match: {
                  country: 'BRAZIL',
                  countryFlag: '🇧🇷',
                  league: 'BRASIL COPA',
                  homeTeam: { name: 'Sao Paulo', logo: '🔴' },
                  awayTeam: { name: 'Portuguesa', logo: '🟢' },
                  homeScore: 0,
                  awayScore: 0,
                  status: 'FT',
                  time: '14:01 - 02:40',
                },
                prediction: {
                  type: 'IY 0.5 ÜST',
                  minute: "10'",
                  score: '0-0',
                  result: 'win',
                },
                tier: 'free',
                isFavorite: true,
              },
              {
                id: 'pred2',
                bot: { id: 25, name: 'Smart Striker', stats: '+8C6.1' },
                match: {
                  country: 'ENGLAND',
                  countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
                  league: 'PREMIER LEAGUE',
                  homeTeam: { name: 'Arsenal', logo: '🔴⚪' },
                  awayTeam: { name: 'Chelsea', logo: '🔵' },
                  homeScore: 2,
                  awayScore: 1,
                  status: 'LIVE',
                  time: '75',
                },
                prediction: {
                  type: '2.5 ALT',
                  minute: "20'",
                  score: '1-0',
                  result: 'pending',
                },
                tier: 'premium',
                isFavorite: false,
              },
            ]}
            title="Top AI Predictions"
            onPredictionPress={(id) => console.log('Prediction pressed:', id)}
            onFavoriteToggle={(id) => console.log('Favorite toggled:', id)}
          />
        </View>
      </View>

      {/* LiveMatchesFeed Organism */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Live Matches Feed (NEW - Day 3)
        </NeonText>

        <View style={{ height: 500 }}>
          <LiveMatchesFeed
            matches={[
              {
                id: 'match1',
                homeTeam: { name: 'Barcelona', logo: '🔵🔴', score: 2 },
                awayTeam: { name: 'Real Madrid', logo: '⚪', score: 1 },
                status: 'live',
                time: "75'",
                minute: 75,
                league: 'La Liga',
              },
              {
                id: 'match2',
                homeTeam: { name: 'Man United', logo: '🔴', score: 1 },
                awayTeam: { name: 'Liverpool', logo: '🔴', score: 1 },
                status: 'halftime',
                time: 'HT',
                league: 'Premier League',
              },
              {
                id: 'match3',
                homeTeam: { name: 'Bayern', logo: '🔴⚪', score: 3 },
                awayTeam: { name: 'Dortmund', logo: '🟡⚫', score: 2 },
                status: 'live',
                time: "82'",
                minute: 82,
                league: 'Bundesliga',
              },
            ]}
            groupByLeague={true}
            onMatchPress={(id) => console.log('Match pressed:', id)}
          />
        </View>
      </View>

      {/* MatchTimeline Organism */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Match Timeline (NEW - Day 3)
        </NeonText>

        <MatchTimeline
          events={[
            {
              id: 'evt1',
              type: 'kickoff',
              minute: 1,
              team: 'home',
              description: 'Match started',
            },
            {
              id: 'evt2',
              type: 'goal',
              minute: 12,
              team: 'home',
              playerName: 'Lionel Messi',
              description: 'Left foot shot from outside the box',
            },
            {
              id: 'evt3',
              type: 'yellow_card',
              minute: 23,
              team: 'away',
              playerName: 'Sergio Ramos',
            },
            {
              id: 'evt4',
              type: 'goal',
              minute: 35,
              team: 'away',
              playerName: 'Karim Benzema',
              description: 'Header from the center of the box',
            },
            {
              id: 'evt5',
              type: 'substitution',
              minute: 45,
              minuteExtra: 2,
              team: 'home',
              playerName: 'Pedri',
              playerOut: 'Gavi',
            },
            {
              id: 'evt6',
              type: 'halftime',
              minute: 45,
              minuteExtra: 3,
              team: 'home',
              description: 'First half ended',
            },
            {
              id: 'evt7',
              type: 'goal',
              minute: 58,
              team: 'home',
              playerName: 'Robert Lewandowski',
              description: 'Tap-in from close range',
            },
            {
              id: 'evt8',
              type: 'red_card',
              minute: 67,
              team: 'away',
              playerName: 'Sergio Ramos',
              description: 'Second yellow card',
            },
          ]}
          homeTeamName="Barcelona"
          awayTeamName="Real Madrid"
          title="Match Events"
        />
      </View>

      {/* ==================== DAY 4 - SCREENS ==================== */}

      {/* HomeScreen */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Home Screen (NEW - Day 4)
        </NeonText>

        <View style={{ height: 800, borderWidth: 2, borderColor: 'rgba(75, 196, 30, 0.3)', borderRadius: 16 }}>
          <HomeScreen
            liveMatches={getLiveMatches()}
            topPredictions={getTopPredictions(3)}
            onMatchPress={(id) => console.log('Match pressed:', id)}
            onPredictionPress={(id) => console.log('Prediction pressed:', id)}
            onSeeAllMatches={() => console.log('See all matches')}
            onSeeAllPredictions={() => console.log('See all predictions')}
          />
        </View>
      </View>

      {/* LiveMatchesScreen */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Live Matches Screen (NEW - Day 4)
        </NeonText>

        <View style={{ height: 700, borderWidth: 2, borderColor: 'rgba(75, 196, 30, 0.3)', borderRadius: 16 }}>
          <LiveMatchesScreen
            matches={mockMatches}
            onMatchPress={(id) => console.log('Match pressed:', id)}
            onFilterChange={(filter) => console.log('Filter changed:', filter)}
          />
        </View>
      </View>

      {/* PredictionsScreen */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Predictions Screen (NEW - Day 4)
        </NeonText>

        <View style={{ height: 700, borderWidth: 2, borderColor: 'rgba(75, 196, 30, 0.3)', borderRadius: 16 }}>
          <PredictionsScreen
            predictions={mockPredictions}
            onPredictionPress={(id) => console.log('Prediction pressed:', id)}
            onFavoriteToggle={(id) => console.log('Favorite toggled:', id)}
          />
        </View>
      </View>

      {/* MatchDetailScreen */}
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Match Detail Screen (NEW - Day 4)
        </NeonText>

        <View style={{ height: 800, borderWidth: 2, borderColor: 'rgba(75, 196, 30, 0.3)', borderRadius: 16 }}>
          <MatchDetailScreen
            matchId="match1"
            homeTeam={{
              id: '1',
              name: 'Barcelona',
              logo: '🔵🔴',
              score: 3,
              countryFlag: '🇪🇸',
            }}
            awayTeam={{
              id: '2',
              name: 'Real Madrid',
              logo: '⚪',
              score: 2,
              countryFlag: '🇪🇸',
            }}
            status="live"
            minute={67}
            time="67'"
            league="La Liga"
            leagueLogo="⚽"
            date="14 Jan 2026 - 21:00"
            stadium="Camp Nou"
            referee="Antonio Mateu Lahoz"
            stats={mockStats}
            events={mockEvents}
            predictions={mockPredictions}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.section, { paddingBottom: 40 }]}>
        <GlassCard intensity="subtle" padding={16}>
          <NeonText color="brand" glow="medium" size="small" weight="bold" style={{ marginBottom: 8 }}>
            ✅ Week 1 Complete (Days 1-4)
          </NeonText>
          <NeonText color="white" size="small">
            • Day 1: 5 Atoms (Button, GlassCard, NeonText, Input, Skeleton)
          </NeonText>
          <NeonText color="white" size="small">
            • Day 2: 5 Molecules (MatchCard, PredictionCard, StatRow, LiveBadge, TeamHeader)
          </NeonText>
          <NeonText color="white" size="small">
            • Day 3: 5 Organisms (MatchDetailHeader, StatsList, PredictionsList, LiveMatchesFeed, MatchTimeline)
          </NeonText>
          <NeonText color="white" size="small">
            • Day 4: 4 Screens (Home, LiveMatches, Predictions, MatchDetail)
          </NeonText>
          <NeonText color="white" size="small" style={{ marginTop: 8 }}>
            Total: 19 Components + ~5,000 lines of code 🚀
          </NeonText>
        </GlassCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
});

export default DesignSystemShowcase;
