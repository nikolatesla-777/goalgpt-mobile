import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Robot, Trophy, WarningCircle, Clock, Star, Info } from 'phosphor-react-native';
import { NeonText } from '../atoms/NeonText';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, borderRadius, shadows, typography } from '../../constants/tokens';
import type { AIPrediction } from '../../services/predictions.service';

// Use a simplified type if AIPrediction isn't exported perfectly yet, 
// but try to match the prop structure
interface MobilePredictionCardProps {
    prediction: AIPrediction;
    isVip?: boolean;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onPress?: () => void;
    botWinRate?: string;
}

export const MobilePredictionCard: React.FC<MobilePredictionCardProps> = ({
    prediction,
    isVip = false,
    isFavorite = false,
    onToggleFavorite,
    onPress,
    botWinRate = '0.0',
}) => {
    const { theme } = useTheme();

    const isWinner = prediction.result === 'won';
    const isLoser = prediction.result === 'lost';
    const isPending = !prediction.result || prediction.result === 'pending';

    // Format Date (DD.MM - HH:mm)
    const dateTimeString = useMemo(() => {
        const date = new Date(prediction.created_at);
        return `${date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })} - ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
    }, [prediction.created_at]);

    // Display Score Logic
    const displayScore = useMemo(() => {
        if (prediction.home_score_display != null && prediction.away_score_display != null) {
            return `${prediction.home_score_display} - ${prediction.away_score_display}`;
        }
        if ((isWinner || isLoser) && prediction.final_score) return prediction.final_score;
        if (prediction.score_at_prediction) return prediction.score_at_prediction;
        return '0-0'; // Default start
    }, [prediction, isWinner, isLoser]);

    // Status Badge Logic
    const renderStatusBadge = () => {
        const status = prediction.live_match_status;
        const minute = prediction.live_match_minute;

        // LIVE (2 = 1H, 4 = 2H)
        if (status === 2 || status === 4) {
            return (
                <View style([styles.statusBadge, { backgroundColor: theme.colors.live, shadowColor: theme.colors.live }]) >
          <View style={[styles.pulseDot, { backgroundColor: 'white' }]} />
          <NeonText size="tiny" weight="black" color="white" style={styles.badgeText}>
            LIVE {minute ? `${minute}'` : ''}
          </NeonText>
        </View >
      );
    }
// HT
if (status === 3) {
    return (
        <View style={[styles.statusBadge, { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 1 }]}>
            <NeonText size="tiny" weight="black" style={[styles.badgeText, { color: '#fbbf24' }]}>HT</NeonText>
        </View>
    );
}
// FT
if (status === 8) {
    return (
        <View style={[styles.statusBadge, { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', borderWidth: 1 }]}>
            <NeonText size="tiny" weight="black" style={[styles.badgeText, { color: theme.colors.success }]}>FT</NeonText>
        </View>
    );
}
// Not Started or Unknown
if (status === 1 || !status) {
    return (
        <View style={[styles.statusBadge, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)', borderWidth: 1 }]}>
            <NeonText size="tiny" weight="black" style={[styles.badgeText, { color: '#60a5fa' }]}>
                {minute ? `${minute}'` : 'vs'}
            </NeonText>
        </View>
    );
}
return null;
  };

return (
    <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
            styles.card,
            {
                backgroundColor: '#121212', // Slightly lighter than bg
                borderColor: theme.colors.border,
            }
        ]}
    >
        {/* 1. Header: Bot Info */}
        <View style={styles.header}>
            <View style={styles.botRow}>
                <View style={[styles.botIconConfig, { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)' }]}>
                    <Robot size={18} weight="fill" color={theme.colors.success} />
                </View>
                <View style={styles.botInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <NeonText size="small" weight="bold" color="white">
                            {prediction.canonical_bot_name || 'AI Bot'}
                        </NeonText>
                        <Info size={14} weight="bold" color={theme.colors.text.tertiary} />
                    </View>
                    <NeonText size="tiny" weight="medium" style={{ color: theme.colors.text.tertiary, opacity: 0.8 }}>
                        Başarı %{botWinRate}
                    </NeonText>
                </View>
            </View>

            <View style={styles.headerActions}>
                {/* VIP Badge */}
                <View style={[
                    styles.typeBadge,
                    isVip ? { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.2)' }
                        : { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                    { borderWidth: 1 }
                ]}>
                    <NeonText size="tiny" weight="black" style={{ color: isVip ? '#f59e0b' : theme.colors.text.secondary }}>
                        {isVip ? 'VIP' : 'FREE'}
                    </NeonText>
                </View>

                {/* Star/Fav */}
                <TouchableOpacity onPress={onToggleFavorite} style={[styles.favButton, isFavorite && { backgroundColor: theme.colors.warning }]}>
                    <Star size={14} weight={isFavorite ? 'fill' : 'bold'} color={isFavorite ? theme.colors.background : theme.colors.text.secondary} />
                </TouchableOpacity>
            </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* 2. League Info */}
        <View style={styles.leagueRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {prediction.country_logo && (
                    <Image source={{ uri: prediction.country_logo }} style={styles.countryFlag} resizeMode="contain" />
                )}
                <NeonText size="tiny" weight="bold" style={{ color: theme.colors.text.secondary, textTransform: 'uppercase', flex: 1 }} numberOfLines={1}>
                    {prediction.league_name || 'Unknown League'}
                </NeonText>
            </View>
            <NeonText size="tiny" weight="bold" style={{ color: theme.colors.text.tertiary }}>
                {dateTimeString}
            </NeonText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* 3. Match Info (Teams & Score) */}
        <View style={styles.matchRow}>
            {/* Home */}
            <View style={styles.teamCol}>
                {prediction.home_team_logo ? (
                    <Image source={{ uri: prediction.home_team_logo }} style={styles.teamLogo} resizeMode="contain" />
                ) : (
                    <View style={styles.placeholderLogo} />
                )}
                <NeonText size="small" weight="bold" color="white" style={styles.teamName} numberOfLines={2}>
                    {prediction.home_team_name}
                </NeonText>
            </View>

            {/* Score Board */}
            <View style={styles.scoreCol}>
                <NeonText size="display" weight="black" color="white" style={{ fontSize: 28, lineHeight: 32 }}>
                    {displayScore}
                </NeonText>
                {renderStatusBadge()}
            </View>

            {/* Away */}
            <View style={styles.teamCol}>
                {prediction.away_team_logo ? (
                    <Image source={{ uri: prediction.away_team_logo }} style={styles.teamLogo} resizeMode="contain" />
                ) : (
                    <View style={styles.placeholderLogo} />
                )}
                <NeonText size="small" weight="bold" color="white" style={styles.teamName} numberOfLines={2}>
                    {prediction.away_team_name}
                </NeonText>
            </View>
        </View>

        {/* 4. Footer: Prediction & Result */}
        <View style={[styles.footer, { backgroundColor: '#181818', borderColor: theme.colors.border }]}>
            {/* Decoration Glows */}
            {isWinner && <View style={[styles.glowOverlay, { backgroundColor: theme.colors.success }]} />}
            {isLoser && <View style={[styles.glowOverlay, { backgroundColor: theme.colors.error }]} />}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, zIndex: 1 }}>
                <View style={[styles.predIconCircle, { backgroundColor: '#222', borderColor: theme.colors.border }]}>
                    <Robot size={16} weight="regular" color={theme.colors.text.tertiary} />
                </View>
                <View>
                    <NeonText size="tiny" weight="bold" style={{ color: theme.colors.text.tertiary, textTransform: 'uppercase', fontSize: 9 }}>
                        AI Tahmini
                    </NeonText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <NeonText size="medium" weight="black" color="white">
                            {prediction.prediction}
                        </NeonText>
                        {(prediction.minute_at_prediction || prediction.score_at_prediction) && (
                            <View style={styles.contextBadge}>
                                <Clock size={10} weight="fill" color="#f87171" style={{ marginRight: 2 }} />
                                <NeonText size="tiny" weight="bold" style={{ color: '#f87171', fontSize: 9 }}>
                                    {prediction.minute_at_prediction}' | {prediction.score_at_prediction || '0-0'}
                                </NeonText>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Result Badge */}
            <View style={{ marginLeft: 'auto', zIndex: 1 }}>
                {isPending && (
                    <View style={[styles.resultBadge, { backgroundColor: '#222', borderColor: theme.colors.border }]}>
                        <NeonText size="tiny" weight="bold" style={{ color: theme.colors.text.secondary, textTransform: 'uppercase' }}>Bekliyor</NeonText>
                    </View>
                )}
                {isWinner && (
                    <View style={[styles.resultBadge, { backgroundColor: theme.colors.success, paddingHorizontal: 12, borderWidth: 0, shadowColor: theme.colors.success, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }]}>
                        <Trophy size={12} weight="fill" color="#000" style={{ marginRight: 4 }} />
                        <NeonText size="tiny" weight="black" style={{ color: '#000', textTransform: 'uppercase' }}>WIN</NeonText>
                    </View>
                )}
                {isLoser && (
                    <View style={[styles.resultBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
                        <WarningCircle size={12} weight="fill" color={theme.colors.error} style={{ marginRight: 4 }} />
                        <NeonText size="tiny" weight="black" style={{ color: theme.colors.error, textTransform: 'uppercase' }}>LOSE</NeonText>
                    </View>
                )}
            </View>
        </View>
    </TouchableOpacity>
);
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        marginBottom: spacing.md,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        paddingBottom: spacing.sm,
    },
    botRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    botIconConfig: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    botInfo: {
        justifyContent: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    typeBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    favButton: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        marginHorizontal: spacing.md,
    },
    leagueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    countryFlag: {
        width: 16,
        height: 12,
        marginRight: 6,
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        paddingTop: spacing.sm,
    },
    teamCol: {
        flex: 1,
        alignItems: 'center',
        gap: spacing.xs,
    },
    teamLogo: {
        width: 40,
        height: 40,
    },
    placeholderLogo: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.round,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    teamName: {
        textAlign: 'center',
        fontSize: 11,
        height: 32, // Fixed height for 2 lines
    },
    scoreCol: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        gap: spacing.xs,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: borderRadius.round,
        marginRight: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: borderRadius.md,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.md,
        paddingVertical: spacing.sm,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    glowOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
    },
    predIconCircle: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.round,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    contextBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: borderRadius.xs,
    },
    resultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
});
