/**
 * Common types for Redux state management
 */
import { Article, ArticleDetail } from './article';

// Base state interface with common properties
export interface BaseState<T = any> {
  loading: boolean;
  error: string | null;
  data?: T;
}

// Articles state
export interface ArticlesState extends BaseState {
  articles: Article[];
  currentArticle: ArticleDetail | null;
}

// Auth state
export interface AuthState extends BaseState {
  isAuthenticated: boolean;
}

// API response types
export interface ApiPagination {
  offset: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  pagination: ApiPagination;
  items: T[];
}

// Common API request params
export interface PaginationParams {
  offset?: number;
  limit?: number;
}
