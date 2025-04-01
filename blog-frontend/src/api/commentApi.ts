import apiClient from './apiClient';
import { Comment } from '../types/comment';

interface CommentData {
  articleId: string;
  author: string;
  content: string;
}

export const postComment = async (commentData: CommentData): Promise<Comment> => {
  const response = await apiClient.post<Comment>('/comments', commentData);
  return response.data;
};

export const upvoteComment = async (commentId: string): Promise<Comment> => {
  const response = await apiClient.post<Comment>(`/comments/${commentId}/vote/up`);
  return response.data;
};

export const downvoteComment = async (commentId: string): Promise<Comment> => {
  const response = await apiClient.post<Comment>(`/comments/${commentId}/vote/down`);
  return response.data;
};
