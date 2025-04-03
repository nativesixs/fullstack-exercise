export interface Article {
  articleId: string;
  title: string;
  perex: string;
  imageId?: string;
  createdAt: string;
  lastUpdatedAt?: string;
}

export interface ArticleDetail extends Article {
  content: string;
  comments?: Comment[];
}

export interface ArticleCreateData {
  title: string;
  perex: string;
  content: string;
  imageId?: string;
}

export interface ArticleUpdateData {
  title?: string;
  perex?: string;
  content?: string;
  imageId?: string;
}

export interface ArticleListResponse {
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  items: Article[];
}

export interface Comment {
  commentId: string;
  articleId: string;
  author: string;
  content: string;
  postedAt: string;
  score: number;
}
