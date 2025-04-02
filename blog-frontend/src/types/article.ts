// Basic article data
export interface Article {
  articleId: string;
  title: string;
  perex: string;
  imageId?: string;
  createdAt: string;
  lastUpdatedAt?: string;
}

// Detailed article with content and comments
export interface ArticleDetail extends Article {
  content: string;
  comments?: Comment[];
}

// Data needed to create a new article
export interface ArticleCreateData {
  title: string;
  perex: string;
  content: string;
  imageId?: string;
}

// Data needed to update an existing article
export interface ArticleUpdateData {
  title?: string;
  perex?: string;
  content?: string;
  imageId?: string;
}

// API response format for article list
export interface ArticleListResponse {
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  items: Article[];
}

// Comment data
export interface Comment {
  commentId: string;
  articleId: string;
  author: string;
  content: string;
  postedAt: string;
  score: number;
}
