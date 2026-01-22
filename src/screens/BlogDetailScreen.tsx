/**
 * BlogDetailScreen
 * Full view of a blog post with rich content
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    useWindowDimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import { NeonText } from '../components/atoms/NeonText';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, borderRadius } from '../constants/tokens';
import { BlogPost, getBlogPostBySlug } from '../services/blog.service';

const { width } = Dimensions.get('window');

export const BlogDetailScreen: React.FC = () => {
    const { theme } = useTheme();
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { width: contentWidth } = useWindowDimensions();

    // Accept full post object OR just slug (for flexibility)
    const initialPost = route.params?.post as BlogPost;
    const slug = route.params?.slug as string;

    const [post, setPost] = useState<BlogPost | null>(initialPost || null);
    const [isLoading, setIsLoading] = useState(!initialPost);

    useEffect(() => {
        if (!initialPost && slug) {
            loadPost();
        }
    }, [slug]);

    const loadPost = async () => {
        setIsLoading(true);
        const data = await getBlogPostBySlug(slug);
        setPost(data);
        setIsLoading(false);
    };

    if (!post) {
        // Show loading skeleton or empty state
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <SafeAreaView>
                    <NeonText style={{ textAlign: 'center', marginTop: 100 }}>Loading...</NeonText>
                </SafeAreaView>
            </View>
        );
    }

    const tagsStyles = {
        p: {
            color: theme.colors.text.secondary,
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 16,
        },
        h2: {
            color: theme.colors.text.primary,
            fontSize: 22,
            fontWeight: 'bold',
            marginTop: 24,
            marginBottom: 12,
        },
        li: {
            color: theme.colors.text.secondary,
            fontSize: 16,
            marginBottom: 8,
        },
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header Image */}
                <View style={styles.headerImageContainer}>
                    <Image source={{ uri: post.coverImage }} style={styles.headerImage} resizeMode="cover" />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', theme.colors.background]}
                        style={styles.headerGradient}
                    />

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <View style={styles.backButtonCircle}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>
                    {/* Meta Info */}
                    <View style={styles.metaRow}>
                        <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
                            <NeonText size="small" weight="bold" color="white" style={styles.categoryText}>
                                {post.category}
                            </NeonText>
                        </View>
                        <NeonText size="small" color="white" style={{ opacity: 0.6 }}>
                            {post.readTime} okuma • {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                        </NeonText>
                    </View>

                    {/* Title */}
                    <NeonText size="large" weight="black" color="white" style={styles.title}>
                        {post.title}
                    </NeonText>

                    {/* Author */}
                    <View style={styles.authorRow}>
                        <View style={styles.authorAvatar}>
                            <NeonText size="large">👤</NeonText>
                        </View>
                        <View>
                            <NeonText size="medium" weight="bold" color="white">
                                {post.author.name}
                            </NeonText>
                            <NeonText size="small" color="white" style={{ opacity: 0.6 }}>
                                Yazar
                            </NeonText>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.htmlContent}>
                        <RenderHtml
                            contentWidth={contentWidth - spacing.lg * 2}
                            source={{ html: post.content || post.excerpt }} // Fallback for mock
                            tagsStyles={tagsStyles as any}
                        />
                        {/* If content is just excerpt in mock, show dummy text */}
                        {!post.content.includes('<p>') && (
                            <NeonText style={{ color: theme.colors.text.secondary, lineHeight: 24, fontSize: 16 }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                {'\n\n'}
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                            </NeonText>
                        )}
                    </View>

                    {/* Share Button (Mock) */}
                    <TouchableOpacity style={[styles.shareButton, { borderColor: theme.colors.border }]}>
                        <Ionicons name="share-social-outline" size={20} color="white" />
                        <NeonText size="medium" weight="bold" color="white">
                            Haberi Paylaş
                        </NeonText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerImageContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 150,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    backButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        paddingHorizontal: spacing.lg,
        marginTop: -40, // Overlap gradient
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.md,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    categoryText: {
        fontSize: 12,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 28,
        lineHeight: 34,
        marginBottom: spacing.lg,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    authorAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    htmlContent: {
        marginBottom: spacing.xl,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        gap: spacing.sm,
    },
});
