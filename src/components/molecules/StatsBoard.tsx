import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Target, Trophy, ChartLineUp } from 'phosphor-react-native';
import { NeonText } from '../atoms/NeonText';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, borderRadius, shadows } from '../../constants/tokens';

export type DateFilter = 'today' | 'yesterday' | 'month';

interface StatsBoardProps {
    totalPredictions: number;
    totalWins: number;
    winRate: string;
    selectedDateFilter: DateFilter;
    onSelectDateFilter: (filter: DateFilter) => void;
}

export const StatsBoard: React.FC<StatsBoardProps> = ({
    totalPredictions,
    totalWins,
    winRate,
    selectedDateFilter,
    onSelectDateFilter,
}) => {
    const { theme } = useTheme();

    const getDateLabel = (filter: DateFilter) => {
        switch (filter) {
            case 'today': return 'Bugün';
            case 'yesterday': return 'Dün';
            case 'month': return 'Bu Ay';
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Row: Title + Date Toggles */}
            <View style={styles.headerRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={styles.iconBox}>
                        <ChartLineUp size={18} color="#4ade80" weight="fill" />
                    </View>
                    <NeonText size="medium" weight="bold" color="white" glow="small">
                        Win Rate
                    </NeonText>
                </View>

                <View style={[styles.toggleContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                    {(['today', 'yesterday', 'month'] as const).map((filter) => {
                        const isActive = selectedDateFilter === filter;
                        return (
                            <TouchableOpacity
                                key={filter}
                                onPress={() => onSelectDateFilter(filter)}
                                style={[
                                    styles.toggleButton,
                                    isActive && { backgroundColor: theme.colors.success },
                                ]}
                            >
                                <NeonText
                                    size="small"
                                    weight="bold"
                                    style={{
                                        color: isActive ? theme.colors.background : theme.colors.text.secondary,
                                        fontSize: 10,
                                    }}
                                >
                                    {getDateLabel(filter)}
                                </NeonText>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.grid}>
                {/* Total Matches */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.colors.success, shadowColor: theme.colors.success }]}>
                        <Target size={16} weight="bold" color={theme.colors.background} />
                    </View>
                    <NeonText size="large" weight="bold" color="white">
                        {totalPredictions}
                    </NeonText>
                    <NeonText size="small" weight="bold" style={{ color: theme.colors.text.tertiary, fontSize: 10, textTransform: 'uppercase' }}>
                        Toplam Maç
                    </NeonText>
                </View>

                {/* Won Matches */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    {/* Glow Effect */}
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.success, opacity: 0.05 }]} />

                    <View style={[styles.iconCircle, { backgroundColor: '#111', borderColor: theme.colors.success, borderWidth: 1 }]}>
                        <Trophy size={16} weight="fill" color={theme.colors.success} />
                    </View>
                    <NeonText size="large" weight="bold" style={{ color: theme.colors.success }}>
                        {totalWins}
                    </NeonText>
                    <NeonText size="small" weight="bold" style={{ color: theme.colors.success, fontSize: 10, textTransform: 'uppercase', opacity: 0.7 }}>
                        Kazanan
                    </NeonText>
                </View>

                {/* Win Rate */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                        <ChartLineUp size={16} weight="bold" color="#3b82f6" />
                    </View>
                    <NeonText size="large" weight="bold" color="white">
                        %{winRate}
                    </NeonText>
                    <NeonText size="small" weight="bold" style={{ color: theme.colors.text.tertiary, fontSize: 10, textTransform: 'uppercase' }}>
                        Başarı
                    </NeonText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    toggleContainer: {
        flexDirection: 'row',
        borderRadius: borderRadius.round,
        padding: 2,
        borderWidth: 1,
    },
    toggleButton: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.round,
    },
    grid: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    card: {
        flex: 1,
        height: 100,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
        overflow: 'hidden',
        position: 'relative',
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.round,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(74, 222, 128, 0.1)', // #4ade80 with opacity
        borderWidth: 1,
        borderColor: 'rgba(74, 222, 128, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
