/**
 * Comments Service
 *
 * Handles match comments and community features
 */

import apiClient, { handleApiError } from '../api/client';
import { API_ENDPOINTS } from '../constants/api';

// ============================================================================
// TYPES
// ============================================================================

export interface Comment {
  id: number;
  user_id: number;
  username: string;
  user_avatar?: string;
  match_id: number;
  content: string;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateCommentPayload {
  match_id: number;
  content: string;
}

export interface UpdateCommentPayload {
  content: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get comments for a match
 */
export async function getMatchComments(
  matchId: string | number,
  limit: number = 50,
  offset: number = 0
): Promise<{ comments: Comment[]; total: number }> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.COMMENTS.FOR_MATCH(String(matchId)), {
      params: { limit, offset },
    });
    return response.data.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to fetch comments:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Create a new comment
 */
export async function createComment(payload: CreateCommentPayload): Promise<Comment> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.COMMENTS.CREATE, payload);
    return response.data.data.comment;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to create comment:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Update a comment
 */
export async function updateComment(
  commentId: number,
  payload: UpdateCommentPayload
): Promise<Comment> {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.COMMENTS.UPDATE(String(commentId)),
      payload
    );
    return response.data.data.comment;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to update comment:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: number): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.COMMENTS.DELETE(String(commentId)));
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to delete comment:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Like a comment
 */
export async function likeComment(commentId: number): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.COMMENTS.LIKE(String(commentId)));
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to like comment:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Unlike a comment
 */
export async function unlikeComment(commentId: number): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.COMMENTS.UNLIKE(String(commentId)));
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to unlike comment:', apiError.message);
    throw new Error(apiError.message);
  }
}

/**
 * Report a comment
 */
export async function reportComment(
  commentId: number,
  reason: string
): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.COMMENTS.REPORT(String(commentId)), {
      reason,
    });
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error);
    console.error('Failed to report comment:', apiError.message);
    throw new Error(apiError.message);
  }
}
