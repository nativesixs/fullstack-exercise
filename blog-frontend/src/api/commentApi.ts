import axios from 'axios';
import { config } from '../config';
import { Comment, CommentCreateData } from '../types/comment';
import { getApiKey, getAccessToken } from '../utils/tokenStorage';
import * as mockCommentApi from './mockCommentApi';

// This is not a hook, just a regular function
const shouldUseMocks = () => {
  console.log('USE_MOCKS config value:', config.USE_MOCKS);
  return config.USE_MOCKS === true;
};

export const postComment = async (commentData: CommentCreateData): Promise<Comment> => {
  // Use mock implementation if enabled
  if (shouldUseMocks()) {
    console.log('Using mock implementation for posting comment');
    try {
      const result = await mockCommentApi.postComment(commentData);
      console.log('Mock comment posted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in mock postComment:', error);
      throw error;
    }
  }

  try {
    const apiKey = getApiKey();
    const accessToken = getAccessToken();

    if (!apiKey) {
      throw new Error('API key is required');
    }

    console.log('Making real API call to post comment');
    const response = await axios.post<Comment>(`${config.API_URL}/comments`, commentData, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        ...(accessToken ? { Authorization: accessToken } : {}),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

export const upvoteComment = async (commentId: string): Promise<Comment> => {
  // Use mock implementation if enabled
  if (shouldUseMocks()) {
    console.log('Using mock implementation for upvoting comment');
    return mockCommentApi.upvoteComment(commentId);
  }

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
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
          ...(accessToken ? { Authorization: accessToken } : {}),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error upvoting comment:', error);
    throw error;
  }
};

export const downvoteComment = async (commentId: string): Promise<Comment> => {
  // Use mock implementation if enabled
  if (shouldUseMocks()) {
    console.log('Using mock implementation for downvoting comment');
    return mockCommentApi.downvoteComment(commentId);
  }

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
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
          ...(accessToken ? { Authorization: accessToken } : {}),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error downvoting comment:', error);
    throw error;
  }
};

export const getCommentsForArticle = async (articleId: string): Promise<Comment[]> => {
  // Use mock implementation if enabled
  if (shouldUseMocks()) {
    console.log('Using mock implementation for getting comments');
    return mockCommentApi.getCommentsForArticle(articleId);
  }

  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error('API key is required');
    }

    const response = await axios.get<Comment[]>(
      `${config.API_URL}/articles/${articleId}/comments`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};
