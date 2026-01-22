/**
 * BlogListScreen
 * Displays all blog posts in a vertical list
 */

import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NeonText } from '../components/atoms/NeonText';
import { BlogListCard } from '../components/molecules/BlogListCard';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../constants/tokens';
import { BlogPost, getBlogPosts } from '../services/blog.service';

export const BlogListScreen: React.FC = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<any>();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const data = await getBlogPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error loading blog posts:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const onRefresh = () => {
        setIsRefreshing(true);
        loadPosts();
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <NeonText size="large" weight="black" color="white" style={styles.title}>
                        Blog & Haberler
                    </NeonText>
                    <View style={{ width: 40 }} /> {/* Spacer for centering */}
                </View>

                <FlatList
                    data={posts}
                    renderItem={({ item }) => (
                        <BlogListCard
                            post={item}
                            onPress={(post) => navigation.navigate('BlogDetail', { post })}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        marginBottom: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
        gap: spacing.sm,
    },
});
