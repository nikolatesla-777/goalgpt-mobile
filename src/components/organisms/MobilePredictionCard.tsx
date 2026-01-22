import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Robot, Trophy, WarningCircle, Clock, Star, Info, LockSimple, DiamondsFour } from 'phosphor-react-native';
import { NeonText } from '../atoms/NeonText';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, borderRadius, shadows, typography } from '../../constants/tokens';
import type { AIPrediction } from '../../services/predictions.service';

// Use a simplified type if AIPrediction isn't exported perfectly yet, 
// but try to match the prop structure
interface MobilePredictionCardProps {
    prediction: AIPrediction;
    isVip?: boolean;
    isLocked?: boolean;  // For FREE users without enough credits/subscription
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onPress?: () => void;
    onBotInfoPress?: () => void;
    onUnlockPress?: () => void;  // Callback when unlock button is pressed
    botWinRate?: string;
    creditBalance?: number;  // User's current credit balance
}

export const MobilePredictionCard: React.FC<MobilePredictionCardProps> = ({
    prediction,
    isVip = false,
    isLocked = false,
    isFavorite = false,
    onToggleFavorite,
    onPress,
    onBotInfoPress,
    onUnlockPress,
    botWinRate = '0.0',
    creditBalance = 0,
}) => {
    const { theme } = useTheme();
    const UNLOCK_COST = 50;

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
                <View style={[styles.statusBadge, { backgroundColor: theme.colors.live, shadowColor: theme.colors.live }]}>
                    <View style={[styles.pulseDot, { backgroundColor: 'white' }]} />
                    <NeonText size="small" weight="bold" color="white" style={[styles.badgeText, { fontWeight: '900' }]}>
                        LIVE {minute ? `${minute}'` : ''}
                    </NeonText>
                </View>
            );
        }
        // HT
        if (status === 3) {
            return (
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 1 }]}>
                    <NeonText size="small" weight="bold" style={[styles.badgeText, { color: '#fbbf24', fontWeight: '900' }]}>HT</NeonText>
                </View>
            );
        }
        // FT
        if (status === 8) {
            return (
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', borderWidth: 1 }]}>
                    <NeonText size="small" weight="bold" style={[styles.badgeText, { color: theme.colors.success, fontWeight: '900' }]}>FT</NeonText>
                </View>
            );
        }
        // Not Started or Unknown
        if (status === 1 || !status) {
            return (
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)', borderWidth: 1 }]}>
                    <NeonText size="small" weight="bold" style={[styles.badgeText, { color: '#60a5fa', fontWeight: '900' }]}>
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
                    borderColor: theme.colors.border, // Unified Dark Green
                }
            ]}
        >
            {/* Full Card Locked Overlay */}
            {isLocked && (
                <View style={styles.fullCardLockedOverlay}>
                    <View style={styles.fullCardLockedContent}>
                        <View style={styles.lockIconCircle}>
                            <LockSimple size={32} weight="fill" color="#f59e0b" />
                        </View>
                        <NeonText size="medium" weight="bold" style={{ color: '#fff', marginTop: spacing.sm }}>
                            VIP Tahmin
                        </NeonText>
                        <NeonText size="small" weight="regular" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: spacing.md, textAlign: 'center' }}>
                            Bu tahmini görmek için kilidi açın
                        </NeonText>
                        <TouchableOpacity
                            style={[
                                styles.fullUnlockButton,
                                creditBalance >= UNLOCK_COST
                                    ? { backgroundColor: '#22c55e' }
                                    : { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: '#f59e0b', borderWidth: 1 }
                            ]}
                            onPress={onUnlockPress}
                            activeOpacity={0.8}
                        >
                            <DiamondsFour size={18} weight="fill" color={creditBalance >= UNLOCK_COST ? '#fff' : '#f59e0b'} />
                            <NeonText size="medium" weight="bold" style={{
                                color: creditBalance >= UNLOCK_COST ? '#fff' : '#f59e0b',
                                marginLeft: spacing.xs,
                            }}>
                                {creditBalance >= UNLOCK_COST ? `${UNLOCK_COST} Kredi ile Aç` : `${UNLOCK_COST} Kredi Gerekli`}
                            </NeonText>
                        </TouchableOpacity>
                        {creditBalance < UNLOCK_COST && (
                            <NeonText size="small" weight="regular" style={{ color: 'rgba(255,255,255,0.5)', marginTop: spacing.xs }}>
                                Bakiye: {creditBalance} kredi
                            </NeonText>
                        )}
                    </View>
                </View>
            )}

            {/* 1. Header: Bot Info */}
            <View style={[styles.header, isLocked && styles.blurredContent]}>
                <View style={styles.botRow}>
                    <View style={[styles.botIconConfig, { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)' }]}>
                        <Robot size={18} weight="fill" color={theme.colors.success} />
                    </View>
                    <View style={styles.botInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <NeonText size="small" weight="bold" color="white">
                                {prediction.canonical_bot_name || 'AI Bot'}
                            </NeonText>
                            <TouchableOpacity onPress={onBotInfoPress} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <View style={{ padding: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                                    <Info size={14} weight="bold" color={theme.colors.success} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <NeonText size="small" weight="bold" style={{ color: theme.colors.text.tertiary, opacity: 0.8, fontSize: 10 }}>
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
                        <NeonText size="small" weight="bold" style={{ color: isVip ? '#f59e0b' : theme.colors.text.secondary, fontSize: 10, fontWeight: '900' }}>
                            {isVip ? 'VIP' : 'FREE'}
                        </NeonText>
                    </View>

                    {/* Star/Fav */}
                    <TouchableOpacity onPress={onToggleFavorite} style={[styles.favButton, isFavorite && { backgroundColor: theme.colors.warning }]}>
                        <Star size={14} weight={isFavorite ? 'fill' : 'bold'} color={isFavorite ? theme.colors.background : theme.colors.text.secondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }, isLocked && styles.blurredContent]} />

            {/* 2. League Info */}
            <View style={[styles.leagueRow, isLocked && styles.blurredContent]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {prediction.country_logo && (
                        <Image source={{ uri: prediction.country_logo }} style={styles.countryFlag} resizeMode="contain" />
                    )}
                    <NeonText size="small" weight="bold" style={{ color: theme.colors.text.secondary, textTransform: 'uppercase', flex: 1, letterSpacing: 1, fontSize: 10 }} numberOfLines={1}>
                        {prediction.country_name && <NeonText size="small" weight="bold" style={{ color: theme.colors.text.tertiary, fontSize: 10 }}>{prediction.country_name} . </NeonText>}
                        {prediction.league_name || 'UNKNOWN LEAGUE'}
                    </NeonText>
                </View>
                <NeonText size="small" weight="bold" style={{ color: theme.colors.text.tertiary, fontSize: 10 }}>
                    {dateTimeString}
                </NeonText>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }, isLocked && styles.blurredContent]} />

            {/* 3. Match Info (Teams & Score) */}
            <View style={[styles.matchRow, isLocked && styles.blurredContent]}>
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
                    <NeonText size="large" weight="bold" color="white" style={{ fontSize: 28, lineHeight: 32 }}>
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
            <View style={[styles.footer, { backgroundColor: '#181818', borderColor: theme.colors.border }, isLocked && styles.blurredContent]}>
                {/* Normal Footer Content */}
                <>
                    {/* Decoration Glows */}
                    {isWinner && <View style={[styles.glowOverlay, { backgroundColor: theme.colors.success }]} />}
                    {isLoser && <View style={[styles.glowOverlay, { backgroundColor: theme.colors.error }]} />}

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, zIndex: 1 }}>
                        <View style={[styles.predIconCircle, { backgroundColor: '#222', borderColor: theme.colors.border }]}>
                            <Robot size={16} weight="regular" color={theme.colors.text.tertiary} />
                        </View>
                        <View>
                            <NeonText size="small" weight="bold" style={{ color: theme.colors.text.tertiary, textTransform: 'uppercase', fontSize: 9 }}>
                                AI Tahmini
                            </NeonText>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <NeonText size="medium" weight="bold" color="white" style={{ fontWeight: '900' }}>
                                    {isLocked ? '???' : prediction.prediction}
                                </NeonText>
                                {!isLocked && (prediction.minute_at_prediction || prediction.score_at_prediction) && (
                                    <View style={styles.contextBadge}>
                                        <Clock size={10} weight="fill" color="#f87171" style={{ marginRight: 4 }} />
                                        <NeonText size="small" weight="bold" style={{ color: '#f87171', fontSize: 10 }}>
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
                                <NeonText size="small" weight="bold" style={{ color: theme.colors.text.secondary, textTransform: 'uppercase', fontSize: 10 }}>Bekliyor</NeonText>
                            </View>
                        )}
                        {isWinner && (
                            <View style={[styles.resultBadge, { backgroundColor: theme.colors.success, paddingHorizontal: 12, borderWidth: 0, shadowColor: theme.colors.success, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }]}>
                                <Trophy size={12} weight="fill" color="#000" style={{ marginRight: 4 }} />
                                <NeonText size="small" weight="bold" style={{ color: '#000', textTransform: 'uppercase', fontSize: 10, fontWeight: '900' }}>WIN</NeonText>
                            </View>
                        )}
                        {isLoser && (
                            <View style={[styles.resultBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
                                <WarningCircle size={12} weight="fill" color={theme.colors.error} style={{ marginRight: 4 }} />
                                <NeonText size="small" weight="bold" style={{ color: theme.colors.error, textTransform: 'uppercase', fontSize: 10, fontWeight: '900' }}>LOSE</NeonText>
                            </View>
                        )}
                    </View>
                </>
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
    liveBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(239, 68, 68, 0.2)',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ef4444',
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
        width: 20,
        height: 15,
        marginRight: 8,
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        paddingTop: spacing.lg, // Increased top padding to push teams down
        paddingBottom: spacing.md,
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
        paddingHorizontal: spacing.md,
        paddingVertical: 14, // Equal top/bottom spacing, slightly larger
        alignItems: 'center',
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
        borderWidth: 1,
        borderColor: 'rgba(248, 113, 113, 0.2)',
    },
    resultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    // Locked State Styles
    lockedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: borderRadius.lg,
    },
    lockedContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    lockedTextContainer: {
        flex: 1,
    },
    unlockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    // Full Card Locked Overlay Styles
    fullCardLockedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        borderRadius: borderRadius.xl,
    },
    fullCardLockedContent: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    lockIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 2,
        borderColor: 'rgba(245, 158, 11, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullUnlockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
    },
    blurredContent: {
        opacity: 0.15,
    },
});
