import React from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { List, Star, Clock, Trophy, X, IconProps } from 'phosphor-react-native';
import { NeonText } from '../atoms/NeonText';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, borderRadius } from '../../constants/tokens';

export type FilterTabKey = 'all' | 'favorites' | 'active' | 'won' | 'lost';

interface FilterTabItem {
    key: FilterTabKey;
    label: string;
    icon: React.ComponentType<IconProps>;
    count: number;
}

interface FilterTabsProps {
    selectedTab: FilterTabKey;
    onSelectTab: (key: FilterTabKey) => void;
    counts: Record<FilterTabKey, number>;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ selectedTab, onSelectTab, counts }) => {
    const { theme } = useTheme();

    const tabs: FilterTabItem[] = [
        { key: 'all', label: 'Tümü', icon: List, count: counts.all },
        { key: 'favorites', label: 'Favorilerim', icon: Star, count: counts.favorites },
        { key: 'active', label: 'Aktif', icon: Clock, count: counts.active },
        { key: 'won', label: 'Kazandı', icon: Trophy, count: counts.won },
        { key: 'lost', label: 'Kaybetti', icon: X, count: counts.lost },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {tabs.map((tab) => {
                    const isSelected = selectedTab === tab.key;
                    const Icon = tab.icon;

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => onSelectTab(tab.key)}
                            style={[
                                styles.tab,
                                {
                                    backgroundColor: isSelected ? theme.colors.success : theme.colors.surface,
                                    borderColor: isSelected ? theme.colors.success : theme.colors.border,
                                },
                            ]}
                        >
                            <Icon
                                size={16}
                                weight={isSelected ? 'fill' : 'bold'}
                                color={isSelected ? theme.colors.background : theme.colors.text.secondary}
                            />
                            <NeonText
                                size="small"
                                weight="bold"
                                style={{
                                    color: isSelected ? theme.colors.background : theme.colors.text.secondary,
                                    marginLeft: spacing.xs,
                                }}
                            >
                                {tab.label} ({tab.count})
                            </NeonText>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
});
