/**
 * HomeSkeleton Component
 * 
 * Full-page loading skeleton for HomeScreen.
 * Shows shimmer placeholders for all major sections.
 * 
 * @module components/skeletons/HomeSkeleton
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton, SkeletonPredictionCard } from '../atoms/Skeleton';
import { spacing } from '../../constants/tokens';

// ============================================================================
// COMPONENT
// ============================================================================

export const HomeSkeleton: React.FC = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header Skeleton */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Skeleton width={56} height={56} borderRadius={14} />
                        <View style={styles.headerTitles}>
                            <Skeleton width={100} height={20} />
                            <Skeleton width={80} height={14} style={{ marginTop: 6 }} />
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <Skeleton width={40} height={40} borderRadius={20} />
                        <Skeleton width={40} height={40} borderRadius={20} />
                        <Skeleton width={48} height={40} borderRadius={20} />
                    </View>
                </View>

                {/* Blog Slider Skeleton */}
                <View style={styles.blogSlider}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {[1, 2, 3].map((i) => (
                            <View key={i} style={styles.blogCard}>
                                <Skeleton width={200} height={120} borderRadius={12} />
                                <Skeleton width={180} height={16} style={{ marginTop: 8 }} />
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Stats Board Skeleton */}
                <View style={styles.statsBoard}>
                    <Skeleton width="100%" height={120} borderRadius={16} />
                </View>

                {/* Filter Tabs Skeleton */}
                <View style={styles.filterTabs}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} width={60} height={32} borderRadius={16} />
                    ))}
                </View>

                {/* Prediction Cards Skeleton */}
                <View style={styles.predictions}>
                    {[1, 2, 3].map((i) => (
                        <SkeletonPredictionCard key={i} />
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    scroll: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitles: {
        gap: 6,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    blogSlider: {
        paddingLeft: spacing.lg,
        marginBottom: spacing.lg,
    },
    blogCard: {
        marginRight: spacing.md,
    },
    statsBoard: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    filterTabs: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    predictions: {
        paddingHorizontal: spacing.lg,
    },
});

export default HomeSkeleton;
