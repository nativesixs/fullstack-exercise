import { Article, ArticleDetail } from './article';

export interface BaseState<T = any> {
  loading: boolean;
  error: string | null;
  data?: T;
}

export interface ArticlesState extends BaseState {
  articles: Article[];
  currentArticle: ArticleDetail | null;
}

export interface AuthState extends BaseState {
  isAuthenticated: boolean;
}

export interface ApiPagination {
  offset: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  pagination: ApiPagination;
  items: T[];
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}
