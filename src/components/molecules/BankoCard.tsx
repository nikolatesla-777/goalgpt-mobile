import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock } from 'phosphor-react-native';
import { NeonText } from '../atoms/NeonText';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, borderRadius } from '../../constants/tokens';

interface BankoCardProps {
    leagueName: string;
    homeTeam: string;
    awayTeam: string;
    prediction: string;
    confidence: number;
    time: string;
    onPress?: () => void;
}

export const BankoCard: React.FC<BankoCardProps> = ({
    leagueName,
    homeTeam,
    awayTeam,
    prediction,
    confidence,
    time,
    onPress
}) => {
    const { theme } = useTheme();

    // Circular Progress Calculation (Simple SVG approximation or just styled view)
    // For MVP/Speed without extra deps, we'll use a styled view border hack or just text

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[styles.card, { borderColor: theme.colors.border }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <NeonText size="small" weight="bold" color="white" style={[styles.leagueName, { fontSize: 10 }]} numberOfLines={1}>
                    {leagueName}
                </NeonText>
                <View style={styles.timeBadge}>
                    <Clock size={12} color="#9ca3af" weight="bold" />
                    <NeonText size="small" weight="bold" style={[styles.timeText, { fontSize: 10 }]}>{time}</NeonText>
                </View>
            </View>

            {/* Teams */}
            <View style={styles.teamsContainer}>
                <View style={styles.teamRow}>
                    <View style={styles.teamDot} />
                    <NeonText size="small" weight="bold" color="white" numberOfLines={1}>
                        {homeTeam}
                    </NeonText>
                </View>
                <View style={styles.teamRow}>
                    <View style={styles.teamDot} />
                    <NeonText size="small" weight="bold" color="white" numberOfLines={1}>
                        {awayTeam}
                    </NeonText>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View>
                    <NeonText size="small" weight="bold" style={[styles.label, { fontSize: 10 }]}>TAHMIN</NeonText>
                    <NeonText size="large" weight="bold" style={[styles.prediction, { fontWeight: '900' }]}>{prediction}</NeonText>
                </View>

                {/* Circular Indicator Placeholder */}
                <View style={styles.confidenceBadge}>
                    <View style={styles.confidenceInner}>
                        <NeonText size="small" weight="bold" color="white" style={{ fontSize: 10, fontWeight: '900' }}>{confidence}%</NeonText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 240,
        backgroundColor: '#121212', // Match PredictionCard bg
        borderRadius: borderRadius.xl, // Match PredictionCard radius
        padding: spacing.md,
        marginRight: spacing.md,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    leagueName: {
        flex: 1,
        opacity: 0.7,
        textTransform: 'uppercase',
        marginRight: spacing.sm,
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
        gap: 4,
    },
    timeText: {
        color: '#9ca3af',
    },
    teamsContainer: {
        gap: 6,
        marginBottom: spacing.lg,
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    teamDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#222',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    label: {
        color: '#6b7280',
        marginBottom: 2,
    },
    prediction: {
        color: '#4ade80', // detailed brand green
    },
    confidenceBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#4ade80',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confidenceInner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
    },
});
