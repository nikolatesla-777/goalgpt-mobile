import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Fire } from 'phosphor-react-native';
import { NeonText } from '../atoms/NeonText';
import { BankoCard } from '../molecules/BankoCard';
import { spacing, borderRadius } from '../../constants/tokens';

const MOCK_BANKO_DATA = [
    {
        id: 'b1',
        league: 'BRAZIL CAMPEONATO BAIANO',
        home: 'EC Bahia',
        away: 'Barcelona de Ilheus',
        prediction: 'MS 2.5 ÜST',
        confidence: 80,
        time: '02:49'
    },
    {
        id: 'b2',
        league: 'SAUDI PROFESSIONAL LEAGUE',
        home: 'Al-Ahli SFC',
        away: 'Al-Khaleej',
        prediction: 'IY 0.5 ÜST',
        confidence: 85,
        time: '18:00'
    },
    {
        id: 'b3',
        league: 'PREMIER LEAGUE',
        home: 'Arsenal',
        away: 'Crystal Palace',
        prediction: 'MS 1',
        confidence: 92,
        time: '15:30'
    }
];

export const BankoCouponsWidget: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View style={styles.iconBox}>
                        <Fire size={18} weight="fill" color="#f97316" />
                    </View>
                    <NeonText size="medium" weight="bold" color="white" style={{ letterSpacing: 0.5 }}>
                        Günün Bankoları
                    </NeonText>
                    <View style={styles.hotBadge}>
                        <NeonText size="small" weight="bold" style={[styles.hotText, { fontSize: 9, fontWeight: '900' }]}>HOT</NeonText>
                    </View>
                </View>
            </View>

            {/* List */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                decelerationRate="fast"
                snapToInterval={256} // Card width + margin
            >
                {MOCK_BANKO_DATA.map(item => (
                    <BankoCard
                        key={item.id}
                        leagueName={item.league}
                        homeTeam={item.home}
                        awayTeam={item.away}
                        prediction={item.prediction}
                        confidence={item.confidence}
                        time={item.time}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.xl,
    },
    header: {
        paddingHorizontal: spacing.lg, // Match Home Screen padding
        marginBottom: spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(249, 115, 22, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hotBadge: {
        backgroundColor: '#222',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: borderRadius.xs,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginLeft: 4,
    },
    hotText: {
        color: '#6b7280',
        textTransform: 'uppercase',
    },
    listContent: {
        paddingHorizontal: spacing.lg,
    },
});
