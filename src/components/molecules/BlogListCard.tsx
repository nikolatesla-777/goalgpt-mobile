/**
 * BlogListCard Component
 * Premium vertical card design for the blog list screen
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { NeonText } from '../atoms/NeonText';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, borderRadius } from '../../constants/tokens';
import { BlogPost } from '../../services/blog.service';

const { width } = Dimensions.get('window');

interface BlogListCardProps {
    post: BlogPost;
    onPress: (post: BlogPost) => void;
}

export const BlogListCard: React.FC<BlogListCardProps> = ({ post, onPress }) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPress(post)}
            style={[styles.container, { backgroundColor: theme.colors.surface }]}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: post.coverImage }} style={styles.image} resizeMode="cover" />
                <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
                    <NeonText size="small" weight="bold" color="white" style={styles.categoryText}>
                        {post.category}
                    </NeonText>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.metaRow}>
                    <NeonText size="small" color="white" style={{ opacity: 0.6 }}>
                        {post.readTime} okuma • {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                    </NeonText>
                </View>

                <NeonText
                    size="medium"
                    weight="bold"
                    color="white"
                    numberOfLines={2}
                    style={styles.title}
                >
                    {post.title}
                </NeonText>

                <NeonText
                    size="small"
                    color="white"
                    numberOfLines={2}
                    style={styles.excerpt}
                >
                    {post.excerpt}
                </NeonText>

                <View style={styles.authorRow}>
                    <View style={styles.authorAvatar}>
                        <NeonText size="small">👤</NeonText>
                    </View>
                    <NeonText size="small" color="white" style={{ opacity: 0.8 }}>
                        {post.author.name}
                    </NeonText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        overflow: 'hidden',
        // Minimal border for definition on dark bg
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    imageContainer: {
        height: 180,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    categoryBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    categoryText: {
        fontSize: 10,
        textTransform: 'uppercase',
    },
    content: {
        padding: spacing.md,
    },
    metaRow: {
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: 18,
        lineHeight: 24,
        marginBottom: spacing.xs,
    },
    excerpt: {
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.5,
        marginBottom: spacing.md,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
});
