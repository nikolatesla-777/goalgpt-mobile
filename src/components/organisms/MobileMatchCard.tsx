import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Star, SoccerBall } from 'phosphor-react-native';
import { NeonText } from '../atoms/NeonText';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, borderRadius } from '../../constants/tokens';
import type { MatchItem } from '../organisms/LiveMatchesFeed'; // Using existing type for now

export interface MobileMatchCardProps {
    match: MatchItem;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onPress: () => void;
    showLeagueHeader?: boolean;
}

export const MobileMatchCard: React.FC<MobileMatchCardProps> = ({
    match,
    isFavorite,
    onToggleFavorite,
    onPress,
    showLeagueHeader = false,
}) => {
    const { theme } = useTheme();

    // Helper for Status Badge
    const getStatusBadge = () => {
        if (match.status === 'live') {
            return {
                text: `${match.minute}'`,
                color: theme.colors.live,
                bg: 'rgba(34, 197, 94, 0.1)',
                animate: true,
            };
        }
        if (match.status === 'halftime') {
            return {
                text: 'İY', // HT in Turkish
                color: theme.colors.warning,
                bg: 'rgba(245, 158, 11, 0.1)',
                animate: false,
            };
        }
        if (match.status === 'finished') {
            return {
                text: 'MS', // FT in Turkish
                color: theme.colors.text.secondary,
                bg: 'rgba(148, 163, 184, 0.1)',
                animate: false,
            };
        }
        return {
            text: match.time,
            color: theme.colors.text.tertiary,
            bg: 'transparent',
            animate: false,
        };
    };

    const statusBadge = getStatusBadge();

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Optional League Header */}
            {showLeagueHeader && (
                <View style={[styles.leagueHeader, { borderBottomColor: theme.colors.divider }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 }}>
                        {match.leagueLogo ? (
                            <Image source={{ uri: match.leagueLogo }} style={{ width: 16, height: 16 }} resizeMode="contain" />
                        ) : (
                            <SoccerBall size={14} color={theme.colors.text.tertiary} />
                        )}
                        <NeonText size="small" color="secondary" numberOfLines={1}>
                            {match.league}
                        </NeonText>
                    </View>
                </View>
            )}

            <View style={styles.cardBody}>
                {/* Favorite Button */}
                <TouchableOpacity
                    style={styles.favoriteBtn}
                    onPress={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                >
                    <Star
                        size={20}
                        color={isFavorite ? theme.colors.warning : theme.colors.text.disabled}
                        weight={isFavorite ? 'fill' : 'regular'}
                    />
                </TouchableOpacity>

                {/* Home Team */}
                <View style={styles.teamContainer}>
                    <NeonText
                        size="small"
                        weight="bold"
                        style={[styles.teamName, { textAlign: 'left' }]}
                        numberOfLines={2}
                    >
                        {match.homeTeam.name}
                    </NeonText>
                    {match.homeTeam.logo ? (
                        <Image source={{ uri: match.homeTeam.logo }} style={styles.teamLogo} resizeMode="contain" />
                    ) : (
                        <View style={[styles.teamLogoPlaceholder, { backgroundColor: theme.colors.background }]} />
                    )}
                </View>

                {/* Score / Time Center */}
                <View style={styles.scoreContainer}>
                    {match.status !== 'scheduled' ? (
                        <View style={styles.scoreRow}>
                            <NeonText size="display" weight="black" color={match.status === 'live' ? 'live' : 'primary'} glow={match.status === 'live' ? 'small' : undefined}>
                                {match.homeTeam.score}
                            </NeonText>
                            <NeonText size="medium" color="secondary">-</NeonText>
                            <NeonText size="display" weight="black" color={match.status === 'live' ? 'live' : 'primary'} glow={match.status === 'live' ? 'small' : undefined}>
                                {match.awayTeam.score}
                            </NeonText>
                        </View>
                    ) : (
                        <NeonText size="display" weight="bold" color="secondary">
                            VS
                        </NeonText>
                    )}

                    {/* Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                        <NeonText
                            size="caption"
                            weight="bold"
                            style={{ color: statusBadge.color }}
                        >
                            {statusBadge.text}
                        </NeonText>
                    </View>
                </View>

                {/* Away Team */}
                <View style={styles.teamContainer}>
                    {match.awayTeam.logo ? (
                        <Image source={{ uri: match.awayTeam.logo }} style={styles.teamLogo} resizeMode="contain" />
                    ) : (
                        <View style={[styles.teamLogoPlaceholder, { backgroundColor: theme.colors.background }]} />
                    )}
                    <NeonText
                        size="small"
                        weight="bold"
                        style={[styles.teamName, { textAlign: 'right' }]}
                        numberOfLines={2}
                    >
                        {match.awayTeam.name}
                    </NeonText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.sm,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    leagueHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderBottomWidth: 1,
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    favoriteBtn: {
        position: 'absolute',
        top: spacing.xs,
        right: spacing.xs,
        zIndex: 10,
        padding: 4,
    },
    teamContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        // Ensure home team is row (text-logo) and away is row (logo-text) logic handled by order in JSX
        // Actually for 'row' direction:
        // Home: Text -> Logo ? No, usually Home is Left, Away is Right.
        // Design: Home Name (Left) ... Score ... Away Name (Right) is standard list view
        // But common mobile card: [Logo] Name ... Score ... Name [Logo]
        // Let's stick to: Text (Left aligned) [Logo] ... Score ... [Logo] Text (Right aligned)
        // Wait, my JSX structure below styles for Home: Text then Logo. For Away: Logo then Text.
        // This creates [Text Logo] ... [Logo Text]. 
        justifyContent: 'flex-end', // Default for Home? No.
    },
    teamName: {
        flex: 1,
    },
    teamLogo: {
        width: 32,
        height: 32,
    },
    teamLogoPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80, // Fixed width for center
        gap: 4,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
});
