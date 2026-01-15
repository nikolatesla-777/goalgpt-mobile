/**
 * ProfileScreen (Profil)
 *
 * User profile with stats, settings, and account management
 * Master Plan compliant - Tab 5
 */

import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeonText } from '../components/atoms/NeonText';
import { GlassCard } from '../components/atoms/GlassCard';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, typography } from '../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  coverPhoto?: string;
  vipStatus: 'free' | 'vip';
  vipExpiry?: string;
  dayCounter: number;
  stats: {
    totalPredictions: number;
    winRate: number;
    currentStreak: number;
    level: number;
    xp: number;
    xpToNextLevel: number;
  };
  badges: string[];
  favoriteTeams: string[];
}

export interface ProfileScreenProps {
  /** User profile data */
  profile: UserProfile;

  /** On edit profile */
  onEditProfile?: () => void;

  /** On settings */
  onSettings?: () => void;

  /** On logout */
  onLogout?: () => void;

  /** On edit avatar */
  onEditAvatar?: () => void;

  /** On edit cover */
  onEditCover?: () => void;

  /** On navigate to section */
  onNavigate?: (section: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onEditProfile,
  onSettings,
  onLogout,
  onEditAvatar,
  onEditCover,
  onNavigate,
}) => {
  const { theme } = useTheme();

  // ============================================================================
  // RENDER PROFILE HEADER
  // ============================================================================

  const renderProfileHeader = () => {
    return (
      <View style={styles.profileHeader}>
        {/* Cover Photo */}
        <View style={styles.coverPhotoContainer}>
          {profile.coverPhoto ? (
            <Image source={{ uri: profile.coverPhoto }} style={styles.coverPhoto} />
          ) : (
            <View style={[styles.coverPhoto, styles.coverPhotoPlaceholder]}>
              <Text style={styles.coverPhotoIcon}>⚽</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editCoverButton} onPress={onEditCover}>
            <Text style={styles.editIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar & Info */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarIcon}>
                  {profile.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton} onPress={onEditAvatar}>
              <Text style={styles.editIconSmall}>✏️</Text>
            </TouchableOpacity>

            {/* VIP Badge */}
            {profile.vipStatus === 'vip' && (
              <View style={styles.vipBadge}>
                <Text style={styles.vipBadgeText}>👑 VIP</Text>
              </View>
            )}
          </View>

          {/* Name & Day Counter */}
          <View style={styles.profileInfo}>
            <NeonText color="white" glow="small" size="medium" weight="bold">
              {profile.name}
            </NeonText>
            <Text style={styles.email}>{profile.email}</Text>
            <View style={styles.dayCounter}>
              <Text style={styles.dayCounterText}>Day {profile.dayCounter}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onEditProfile}>
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onSettings}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
            <Text style={styles.actionIcon}>🚪</Text>
            <Text style={styles.actionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ============================================================================
  // RENDER STATS DASHBOARD
  // ============================================================================

  const renderStatsDashboard = () => {
    const { stats } = profile;
    const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;

    return (
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={styles.sectionTitle}>
          Your Stats
        </NeonText>

        {/* Level & XP */}
        <GlassCard intensity="default" padding={spacing.md} style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>Lv {stats.level}</Text>
            </View>
            <Text style={styles.xpText}>
              {stats.xp} / {stats.xpToNextLevel} XP
            </Text>
          </View>
          <View style={styles.xpBar}>
            <View style={[styles.xpProgress, { width: `${xpProgress}%` }]} />
          </View>
        </GlassCard>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <GlassCard intensity="subtle" padding={spacing.md} style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>{stats.totalPredictions}</Text>
            <Text style={styles.statLabel}>Predictions</Text>
          </GlassCard>

          <GlassCard intensity="subtle" padding={spacing.md} style={styles.statCard}>
            <Text style={styles.statIcon}>📈</Text>
            <Text style={styles.statValue}>{stats.winRate}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </GlassCard>

          <GlassCard intensity="subtle" padding={spacing.md} style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </GlassCard>

          <GlassCard intensity="subtle" padding={spacing.md} style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{stats.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </GlassCard>
        </View>
      </View>
    );
  };

  // ============================================================================
  // RENDER BADGES
  // ============================================================================

  const renderBadges = () => {
    if (profile.badges.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={styles.sectionTitle}>
          Badges & Achievements
        </NeonText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
          {profile.badges.map((badge, index) => (
            <GlassCard key={index} intensity="subtle" padding={spacing.md} style={styles.badgeCard}>
              <Text style={styles.badgeIcon}>{badge}</Text>
            </GlassCard>
          ))}
        </ScrollView>
      </View>
    );
  };

  // ============================================================================
  // RENDER FAVORITE TEAMS
  // ============================================================================

  const renderFavoriteTeams = () => {
    if (profile.favoriteTeams.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={styles.sectionTitle}>
          Favorite Teams
        </NeonText>

        <View style={styles.teamsGrid}>
          {profile.favoriteTeams.map((team, index) => (
            <GlassCard key={index} intensity="subtle" padding={spacing.sm} style={styles.teamCard}>
              <Text style={styles.teamIcon}>⚽</Text>
              <Text style={styles.teamName}>{team}</Text>
            </GlassCard>
          ))}
        </View>
      </View>
    );
  };

  // ============================================================================
  // RENDER SETTINGS MENU
  // ============================================================================

  const renderSettingsMenu = () => {
    const menuItems = [
      { icon: '👤', label: 'Account Settings', key: 'account' },
      { icon: '🔔', label: 'Notifications', key: 'notifications' },
      { icon: '🌍', label: 'Language', key: 'language' },
      { icon: '🎨', label: 'Theme', key: 'theme' },
      { icon: '🔒', label: 'Privacy', key: 'privacy' },
      { icon: '💬', label: 'Referrals', key: 'referrals' },
      { icon: 'ℹ️', label: 'About', key: 'about' },
    ];

    return (
      <View style={styles.section}>
        <NeonText color="brand" glow="medium" size="medium" weight="bold" style={styles.sectionTitle}>
          Settings
        </NeonText>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => onNavigate?.(item.key)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
        {/* Profile Header */}
        {renderProfileHeader()}

        {/* Stats Dashboard */}
        {renderStatsDashboard()}

        {/* Badges */}
        {renderBadges()}

        {/* Favorite Teams */}
        {renderFavoriteTeams()}

        {/* Settings Menu */}
        {renderSettingsMenu()}

        {/* Footer Spacing */}
        <View style={{ height: 40 }} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  profileHeader: {
    marginBottom: spacing.xl,
  },
  coverPhotoContainer: {
    height: 150,
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPhotoPlaceholder: {
    backgroundColor: 'rgba(23, 80, 61, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPhotoIcon: {
    fontSize: 48,
    opacity: 0.3,
  },
  editCoverButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -50,
    paddingHorizontal: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(75, 196, 30, 0.3)',
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(23, 80, 61, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 40,
    color: '#4BC41E',
    fontFamily: typography.fonts.ui.bold,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4BC41E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconSmall: {
    fontSize: 16,
  },
  vipBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  vipBadgeText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 12,
    color: '#000000',
  },
  profileInfo: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  email: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  dayCounter: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginTop: spacing.xs,
  },
  dayCounterText: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: typography.fontSize.button.small,
    color: '#4BC41E',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: 'rgba(23, 80, 61, 0.65)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.15)',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  levelCard: {
    marginBottom: spacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelBadge: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  levelNumber: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: typography.fontSize.button.medium,
    color: '#4BC41E',
  },
  xpText: {
    fontFamily: typography.fonts.mono.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  xpBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#4BC41E',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    fontSize: 32,
  },
  statValue: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 24,
    color: '#4BC41E',
  },
  statLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  badgesScroll: {
    flexDirection: 'row',
  },
  badgeCard: {
    marginRight: spacing.sm,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 40,
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  teamIcon: {
    fontSize: 20,
  },
  teamName: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 80, 61, 0.65)',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.15)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuArrow: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default ProfileScreen;
