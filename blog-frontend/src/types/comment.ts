/**
 * Comment types
 */

// Comment type
export interface Comment {
  commentId: string;
  articleId: string;
  author: string;
  content: string;
  postedAt: string;
  score: number;
}

// Comment creation payload
export interface CommentCreateData {
  articleId: string;
  author: string;
  content: string;
}

// Vote types for comments
export type VoteType = 'up' | 'down';
export type VoteValue = 1 | 0 | -1;
export type UserVotes = Record<string, VoteValue>;
