import { Comment } from './comment';

export interface Article {
  articleId: string;
  title: string;
  perex: string;
  imageId?: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface ArticleDetail extends Article {
  content: string;
  comments: Comment[];
}
