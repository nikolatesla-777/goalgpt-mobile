/**
 * BlogSlider Component
 * Horizontal scrolling list of blog posts
 */

import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BlogCard } from '../molecules/BlogCard';
import { NeonText } from '../atoms/NeonText';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../constants/tokens';
import { BlogPost, getBlogPosts } from '../../services/blog.service';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface BlogSliderProps {
    onPostPress: (post: BlogPost) => void;
}

export const BlogSlider: React.FC<BlogSliderProps> = ({ onPostPress }) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        }
    };

    if (isLoading || posts.length === 0) {
        return null; // Or return a skeleton loader
    }

    return (
        <View style={styles.container}>

            <FlatList
                data={posts}
                renderItem={({ item }) => (
                    <BlogCard post={item} onPress={onPostPress} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                decelerationRate="fast"
                snapToInterval={width * 0.8 + spacing.md}
                snapToAlignment="start"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    headerTitle: {
        fontSize: 20,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingRight: spacing.lg - spacing.md, // Adjust for last item margin
    },
    seeAllButton: {
        backgroundColor: 'rgba(75, 196, 30, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(75, 196, 30, 0.3)',
    },
});
