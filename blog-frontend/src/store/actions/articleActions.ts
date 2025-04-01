import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { Article, ArticleDetail } from '../../types/article';

interface ArticleResponse {
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  items: Article[];
}

interface FetchArticlesParams {
  offset?: number;
  limit?: number;
}

// fetch all articles with pagination
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (params: FetchArticlesParams = {}, { rejectWithValue }) => {
    try {
      const { offset = 0, limit = 100 } = params;
      const response = await apiClient.get<ArticleResponse>('/articles', {
        params: { offset, limit }
      });
      return response.data.items || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch articles');
    }
  }
);

// fetch article by ID
export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (articleId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ArticleDetail>(`/articles/${articleId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch article');
    }
  }
);

// create article
export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData: Partial<ArticleDetail>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ArticleDetail>('/articles', articleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create article');
    }
  }
);

// update article
export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async (
    { articleId, articleData }: { articleId: string; articleData: Partial<ArticleDetail> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch<ArticleDetail>(
        `/articles/${articleId}`,
        articleData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update article');
    }
  }
);

// delete article
export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (articleId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/articles/${articleId}`);
      return articleId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete article');
    }
  }
);
