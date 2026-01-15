// src/api/news.api.ts
// GoalGPT Mobile App - News/Blog API

import apiClient, { ApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from '../constants/api';

// Types
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number; // in minutes
  views: number;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Get News List
export async function getNewsList(
  page: number = 1,
  limit: number = 20,
  category?: string
): Promise<{ articles: NewsArticle[]; total: number; hasMore: boolean }> {
  try {
    let url = `${API_ENDPOINTS.BLOG.LIST}?page=${page}&limit=${limit}`;

    if (category) {
      url += `&category=${category}`;
    }

    const response =
      await apiClient.get<
        ApiResponse<{ articles: NewsArticle[]; total: number; hasMore: boolean }>
      >(url);

    return (
      response.data.data || {
        articles: [],
        total: 0,
        hasMore: false,
      }
    );
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get News Article by Slug
export async function getNewsArticle(slug: string): Promise<NewsArticle> {
  try {
    const response = await apiClient.get<ApiResponse<NewsArticle>>(API_ENDPOINTS.BLOG.DETAIL(slug));

    return response.data.data!;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get News Categories
export async function getNewsCategories(): Promise<NewsCategory[]> {
  try {
    // This endpoint doesn't exist in API_ENDPOINTS yet
    // Will need to add it or use a query parameter
    const response = await apiClient.get<ApiResponse<NewsCategory[]>>(
      `${API_ENDPOINTS.BLOG.LIST}/categories`
    );

    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get Latest News (shortcut for getNewsList with defaults)
export async function getLatestNews(limit: number = 10): Promise<NewsArticle[]> {
  try {
    const result = await getNewsList(1, limit);
    return result.articles;
  } catch (error) {
    throw handleApiError(error);
  }
}
