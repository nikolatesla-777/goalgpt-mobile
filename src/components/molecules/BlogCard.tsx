/**
 * BlogCard Component
 * Premium card design for the blog slider
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NeonText } from '../atoms/NeonText';
import { Strategy } from 'phosphor-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, borderRadius } from '../../constants/tokens';
import { BlogPost } from '../../services/blog.service';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = 160;

interface BlogCardProps {
    post: BlogPost;
    onPress: (post: BlogPost) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onPress }) => {
    const { theme } = useTheme();

    const isMinimal = post.category === 'STRATEJI';

    if (isMinimal) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onPress(post)}
                style={[styles.container, styles.minimalContainer, { borderColor: theme.colors.border }]}
            >
                <View style={[styles.minimalContent, { backgroundColor: '#111' }]}>
                    <View style={styles.minimalBadgeRow}>
                        <View style={[styles.badge, { backgroundColor: '#4ade80' }]}>
                            <NeonText size="small" weight="bold" style={[styles.badgeText, { color: '#000000', fontSize: 10 }]}>
                                {post.category}
                            </NeonText>
                        </View>
                        <NeonText size="small" color="white" style={{ opacity: 0.5, fontSize: 10 }}>
                            {post.readTime}
                        </NeonText>
                    </View>

                    <NeonText
                        size="medium"
                        weight="bold"
                        color="white"
                        numberOfLines={3}
                        style={{ ...styles.title, fontSize: 20, lineHeight: 26 }}
                    >
                        {post.title}
                    </NeonText>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress(post)}
            style={[styles.container, { borderColor: theme.colors.border }]}
        >
            <ImageBackground
                source={{ uri: post.coverImage }}
                style={styles.imageBackground}
                imageStyle={styles.image}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <View style={styles.badgeContainer}>
                            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                                <NeonText size="small" weight="bold" color="white" style={styles.badgeText}>
                                    {post.category}
                                </NeonText>
                            </View>
                            <NeonText size="small" color="white" style={styles.readTime}>
                                {post.readTime}
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
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    image: {
        borderRadius: borderRadius.lg,
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: spacing.md,
    },
    content: {
        gap: spacing.xs,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        textTransform: 'uppercase',
    },
    readTime: {
        fontSize: 11,
        opacity: 0.8,
    },
    title: {
        fontSize: 18,
        lineHeight: 24,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    minimalContainer: {
        backgroundColor: '#121212',
        borderWidth: 1,
        overflow: 'hidden',
    },
    minimalContent: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    minimalBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
