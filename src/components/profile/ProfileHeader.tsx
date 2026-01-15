/**
 * ProfileHeader Component
 * Displays user profile information with avatar and stats
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, borderRadius } from '../../constants/theme';
import { GlassCard } from '../atoms/GlassCard';
import { NeonText } from '../atoms/NeonText';

// ============================================================================
// TYPES
// ============================================================================

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  displayName?: string;
  joinDate: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'vip_elite';
  verified?: boolean;
}

export interface ProfileHeaderProps {
  profile: UserProfile;
  onEditPress?: () => void;
  onAvatarPress?: () => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getTierLabel = (tier: UserProfile['tier']): string => {
  const labels = {
    bronze: 'Bronz',
    silver: 'Gümüş',
    gold: 'Altın',
    platinum: 'Platin',
    diamond: 'Elmas',
    vip_elite: 'VIP Elite',
  };
  return labels[tier];
};

const getTierColor = (tier: UserProfile['tier'], theme: any): string => {
  switch (tier) {
    case 'bronze':
      return theme.levels.bronze.main;
    case 'silver':
      return theme.levels.silver.main;
    case 'gold':
      return theme.levels.gold.main;
    case 'platinum':
      return theme.levels.platinum.main;
    case 'diamond':
      return theme.levels.diamond.main;
    case 'vip_elite':
      return theme.levels.vip_elite.main;
    default:
      return theme.text.secondary;
  }
};

const formatJoinDate = (joinDate: string): string => {
  const date = new Date(joinDate);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
  });
};

// ============================================================================
// COMPONENT
// ============================================================================

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditPress,
  onAvatarPress,
}) => {
  const { theme } = useTheme();

  const xpProgress = (profile.xp / profile.xpToNextLevel) * 100;

  return (
    <GlassCard intensity="medium" style={styles.container}>
      {/* Edit Button */}
      {onEditPress && (
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: theme.primary[500] }]}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <NeonText size="sm" style={{ color: theme.text.inverse, fontWeight: '600' }}>
            Düzenle
          </NeonText>
        </TouchableOpacity>
      )}

      {/* Avatar Section */}
      <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.7} style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary[500] }]}>
              <NeonText size="3xl" style={{ color: theme.text.inverse, fontWeight: 'bold' }}>
                {profile.username.charAt(0).toUpperCase()}
              </NeonText>
            </View>
          )}

          {/* Level Badge */}
          <View style={[styles.levelBadge, { backgroundColor: theme.primary[500] }]}>
            <NeonText size="sm" style={{ color: theme.text.inverse, fontWeight: 'bold' }}>
              {profile.level}
            </NeonText>
          </View>
        </View>
      </TouchableOpacity>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.nameSection}>
          <NeonText size="xl" color="primary" style={{ fontWeight: 'bold' }}>
            {profile.displayName || profile.username}
          </NeonText>
          {profile.verified && (
            <View style={styles.verifiedBadge}>
              <NeonText size="md">✓</NeonText>
            </View>
          )}
        </View>

        <NeonText size="sm" style={{ color: theme.text.secondary }}>
          @{profile.username}
        </NeonText>

        {/* Tier Badge */}
        <View style={styles.tierSection}>
          <View
            style={[
              styles.tierBadge,
              {
                backgroundColor: getTierColor(profile.tier, theme) + '20',
                borderColor: getTierColor(profile.tier, theme),
              },
            ]}
          >
            <View
              style={[styles.tierDot, { backgroundColor: getTierColor(profile.tier, theme) }]}
            />
            <NeonText
              size="sm"
              style={{
                color: getTierColor(profile.tier, theme),
                fontWeight: '600',
              }}
            >
              {getTierLabel(profile.tier)}
            </NeonText>
          </View>
        </View>

        {/* Join Date */}
        <NeonText size="xs" style={{ color: theme.text.tertiary, marginTop: spacing[2] }}>
          {formatJoinDate(profile.joinDate)} tarihinden beri üye
        </NeonText>
      </View>

      {/* XP Progress */}
      <View style={styles.xpSection}>
        <View style={styles.xpHeader}>
          <NeonText size="sm" style={{ color: theme.text.secondary }}>
            Seviye {profile.level}
          </NeonText>
          <NeonText size="sm" color="primary" style={{ fontWeight: '600' }}>
            {profile.xp} / {profile.xpToNextLevel} XP
          </NeonText>
        </View>

        <View style={[styles.xpBar, { backgroundColor: theme.background.elevated }]}>
          <View
            style={[
              styles.xpFill,
              {
                width: `${xpProgress}%`,
                backgroundColor: theme.primary[500],
              },
            ]}
          />
        </View>

        <NeonText size="xs" style={{ color: theme.text.tertiary, textAlign: 'center' }}>
          Bir sonraki seviyeye {profile.xpToNextLevel - profile.xp} XP kaldı
        </NeonText>
      </View>
    </GlassCard>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    marginBottom: spacing[4],
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    zIndex: 1,
  },
  avatarSection: {
    marginBottom: spacing[4],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tierSection: {
    marginTop: spacing[2],
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  tierDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  xpSection: {
    width: '100%',
    gap: spacing[2],
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpBar: {
    height: 12,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default ProfileHeader;
