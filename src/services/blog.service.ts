/**
 * Blog Service
 * Handles fetching blog posts and details
 */

import apiClient, { handleApiError } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string; // HTML or Markdown
    coverImage: string;
    author: {
        name: string;
        avatar?: string;
    };
    publishedAt: string;
    readTime: string;
    category: string;
    tags?: string[];
}

export interface BlogListResponse {
    success: boolean;
    data: {
        posts: BlogPost[];
        total: number;
        page: number;
        limit: number;
    };
}

export interface BlogDetailResponse {
    success: boolean;
    data: {
        post: BlogPost;
        relatedPosts: BlogPost[];
    };
}

// Mock data to use until backend is fully verified or populated
const MOCK_POSTS: BlogPost[] = [
    {
        id: '1',
        slug: 'yapay-zeka-ile-bahis-kazanmanin-yollari',
        title: 'Yapay Zeka ile Kazanmanın 5 Yolu',
        excerpt: 'GoalGPT yapay zeka algoritmalarını kullanarak kazanma şansınızı nasıl artırabileceğinizi öğrenin.',
        content: '<p>Detaylı içerik burada olacak...</p>',
        coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        author: { name: 'GoalGPT Analiz Ekibi' },
        publishedAt: new Date().toISOString(),
        readTime: '4 dk',
        category: 'Strateji',
    },
    {
        id: '2',
        slug: 'premier-lig-analizleri-haftanin-maclari',
        title: 'Premier Lig: Haftanın Analizleri',
        excerpt: 'Bu hafta sonu oynanacak kritik Premier Lig maçlarının yapay zeka destekli detaylı analizleri.',
        content: '<p>Maç analizleri...</p>',
        coverImage: 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop',
        author: { name: 'Premier Uzmanı' },
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        readTime: '6 dk',
        category: 'Analiz',
    },
    {
        id: '3',
        slug: 'banko-kupon-nasil-hazirlanir',
        title: 'Banko Kupon Nasıl Hazırlanır?',
        excerpt: 'Riskleri minimize ederek, istikrarlı kazanç sağlayan banko kupon stratejileri.',
        content: '<p>Strateji detayları...</p>',
        coverImage: 'https://images.unsplash.com/photo-1634128221889-8296a244434b?q=80&w=2070&auto=format&fit=crop',
        author: { name: 'Bahis Gurusu' },
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        readTime: '3 dk',
        category: 'Eğitim',
    },
];

/**
 * Get blog posts lists
 */
export async function getBlogPosts(page = 1, limit = 5): Promise<BlogPost[]> {
    try {
        // Try to fetch from API first
        // const response = await apiClient.get<BlogListResponse>(`${API_ENDPOINTS.BLOG.LIST}?page=${page}&limit=${limit}`);
        // return response.data.data.posts;

        // Fallback to mock data for now to ensure UI works immediately
        return MOCK_POSTS;
    } catch (error) {
        console.error('Failed to fetch blog posts, using mock data', error);
        return MOCK_POSTS;
    }
}

/**
 * Get blog post details by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        // const response = await apiClient.get<BlogDetailResponse>(API_ENDPOINTS.BLOG.DETAIL(slug));
        // return response.data.data.post;

        const post = MOCK_POSTS.find(p => p.slug === slug);
        return post || null;
    } catch (error) {
        console.error('Failed to fetch blog detail', error);
        return null;
    }
}
