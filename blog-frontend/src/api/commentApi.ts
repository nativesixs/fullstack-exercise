import axios from 'axios';
import { getApiKey, getAccessToken } from '../utils/tokenStorage';
import { Comment } from '../types/comment';
import { config } from '../config';
import { postComment as mockPostComment, upvoteComment as mockUpvoteComment, downvoteComment as mockDownvoteComment, getCommentsForArticle as mockGetCommentsForArticle } from './mockCommentApi';

const API_URL = config.API_URL;

interface CommentData {
  articleId: string;
  author: string;
  content: string;
}

// Use either real or mock implementation based on configuration
export const postComment = config.USE_MOCKS
  ? mockPostComment
  : async (commentData: CommentData): Promise<Comment> => {
      try {
        const apiKey = getApiKey();
        const accessToken = getAccessToken();
        
        if (!apiKey || !accessToken) {
          throw new Error('Missing authentication credentials');
        }
        
        console.log('Posting comment with data:', commentData);
        console.log('Using API Key:', apiKey);
        console.log('Using Access Token:', accessToken);
        
        // First try with original format
        console.log("Trying original format (Format 1)");
        try {
          const response1 = await axios.post<Comment>(
            `${API_URL}/comments`, 
            commentData,
            {
              headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
                'Authorization': accessToken
              }
            }
          );
          console.log('Comment post response (Format 1):', response1.data);
          return response1.data;
        } catch (error1: any) {
          console.log(`Format 1 failed with status: ${error1.response?.status}`);
          
          // Try with Bearer prefix
          console.log("Trying with Bearer prefix (Format 2)");
          try {
            const response2 = await axios.post<Comment>(
              `${API_URL}/comments`, 
              commentData,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-KEY': apiKey,
                  'Authorization': `Bearer ${accessToken}`
                }
              }
            );
            console.log('Comment post response (Format 2):', response2.data);
            return response2.data;
          } catch (error2: any) {
            console.log(`Format 2 failed with status: ${error2.response?.status}`);
            
            // Try with token_type from login as prefix (should be "bearer")
            console.log("Trying with lowercase bearer prefix (Format 3)");
            try {
              const response3 = await axios.post<Comment>(
                `${API_URL}/comments`, 
                commentData,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': apiKey,
                    'Authorization': `bearer ${accessToken}`
                  }
                }
              );
              console.log('Comment post response (Format 3):', response3.data);
              return response3.data;
            } catch (error3: any) {
              console.log(`Format 3 failed with status: ${error3.response?.status}`);
              
              // Rethrow the original error
              throw error1;
            }
          }
        }
      } catch (error: any) {
        console.error('Error posting comment:', error);
        
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data || '<empty string>');
          console.error('Error response headers:', error.response.headers);
        }
        
        throw error;
      }
    };

export const upvoteComment = config.USE_MOCKS
  ? mockUpvoteComment
  : async (commentId: string): Promise<Comment> => {
      try {
        const apiKey = getApiKey();
        const accessToken = getAccessToken();
        
        if (!apiKey || !accessToken) {
          throw new Error('Authentication required. Please log in to vote on comments.');
        }
        
        const response = await axios.post<Comment>(
          `${API_URL}/comments/${commentId}/vote/up`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': apiKey,
              'Authorization': accessToken
            }
          }
        );
        
        return response.data;
      } catch (error) {
        console.error('Error upvoting comment:', error);
        throw error;
      }
    };

export const downvoteComment = config.USE_MOCKS
  ? mockDownvoteComment
  : async (commentId: string): Promise<Comment> => {
      try {
        const apiKey = getApiKey();
        const accessToken = getAccessToken();
        
        if (!apiKey || !accessToken) {
          throw new Error('Authentication required. Please log in to vote on comments.');
        }
        
        const response = await axios.post<Comment>(
          `${API_URL}/comments/${commentId}/vote/down`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': apiKey,
              'Authorization': accessToken
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
 * Helper function to get comments for an article
 * Uses mock implementation when config.USE_MOCKS is true
 */
export const getCommentsForArticle = config.USE_MOCKS
  ? mockGetCommentsForArticle
  : (articleId: string): Comment[] => {
      return [];
    };
