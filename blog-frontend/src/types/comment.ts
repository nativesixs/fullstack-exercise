export interface Comment {
  commentId: string;
  articleId: string;
  author: string;
  content: string;
  postedAt: string;
  score: number;
}

export interface CommentCreateData {
  articleId: string;
  content: string;
  author?: string;
}

export type VoteType = 'up' | 'down';
export type VoteValue = -1 | 0 | 1;
export type UserVotes = Record<string, VoteValue>;
