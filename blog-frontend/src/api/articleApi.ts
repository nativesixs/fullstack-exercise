import apiClient from './apiClient';
import { Article, ArticleDetail } from '../types/article';

interface ArticleResponse {
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  items: Article[];
}

export const getArticles = async () => {
  const response = await apiClient.get<ArticleResponse>('/articles');
  return response.data.items;
};

export const getArticleById = async (id: string) => {
  const response = await apiClient.get<ArticleDetail>(`/articles/${id}`);
  return response.data;
};

export const createArticle = async (article: Partial<ArticleDetail>) => {
  const response = await apiClient.post<ArticleDetail>('/articles', article);
  return response.data;
};

export const updateArticle = async (id: string, article: Partial<ArticleDetail>) => {
  const response = await apiClient.patch<ArticleDetail>(`/articles/${id}`, article);
  return response.data;
};

export const deleteArticle = async (id: string) => {
  await apiClient.delete(`/articles/${id}`);
};
