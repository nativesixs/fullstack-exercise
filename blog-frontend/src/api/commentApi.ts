import axios from 'axios';
import { config } from '../config';
import { Comment, CommentCreateData } from '../types/comment';
import { getApiKey, getAccessToken } from '../utils/tokenStorage';

/**
 * Post a new comment
 */
export const postComment = async (commentData: CommentCreateData): Promise<Comment> => {
  try {
    const apiKey = getApiKey();
    const accessToken = getAccessToken();

    if (!apiKey) {
      throw new Error('API key is required');
    }

    const response = await axios.post<Comment>(
      `${config.API_URL}/comments`,
      commentData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
          ...(accessToken ? { 'Authorization': accessToken } : {})
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

/**
 * Upvote a comment
 */
export const upvoteComment = async (commentId: string): Promise<Comment> => {
  try {
    const apiKey = getApiKey();
    const accessToken = getAccessToken();

    if (!apiKey) {
      throw new Error('API key is required');
    }

    const response = await axios.post<Comment>(
      `${config.API_URL}/comments/${commentId}/vote/up`,
      {},
      {
        headers: {
          'X-API-KEY': apiKey,
          ...(accessToken ? { 'Authorization': accessToken } : {})
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error upvoting comment:', error);
    throw error;
  }
};

/**
 * Downvote a comment
 */
export const downvoteComment = async (commentId: string): Promise<Comment> => {
  try {
    const apiKey = getApiKey();
    const accessToken = getAccessToken();

    if (!apiKey) {
      throw new Error('API key is required');
    }

    const response = await axios.post<Comment>(
      `${config.API_URL}/comments/${commentId}/vote/down`,
      {},
      {
        headers: {
          'X-API-KEY': apiKey,
          ...(accessToken ? { 'Authorization': accessToken } : {})
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error downvoting comment:', error);
    throw error;
  }
};

/**
 * Get comments for an article
 */
export const getComments = async (articleId: string): Promise<Comment[]> => {
  try {
    const apiKey = getApiKey();
    const accessToken = getAccessToken();

    if (!apiKey) {
      throw new Error('API key is required');
    }

    const response = await axios.get<Comment[]>(
      `${config.API_URL}/articles/${articleId}/comments`,
      {
        headers: {
          'X-API-KEY': apiKey,
          ...(accessToken ? { 'Authorization': accessToken } : {})
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Alias for backward compatibility
export const getCommentsForArticle = getComments;
