import { Article, ArticleDetail, ArticleListResponse, ArticleCreateData, ArticleUpdateData } from '../../types/article';
import apiClient from '../../api/apiClient';
import { createAsyncThunk } from '../../utils/reduxHelpers';
import { PaginationParams } from '../../types/state';

// Fetch all articles
export const fetchArticles = createAsyncThunk<Article[], PaginationParams>(
  'articles/fetchArticles',
  async (params = {}) => {
    const { offset = 0, limit = 100 } = params;
    const response = await apiClient.get<ArticleListResponse>('/articles', {
      params: { offset, limit }
    });
    return response.data.items || [];
  }
);

// Fetch article by ID
export const fetchArticleById = createAsyncThunk<ArticleDetail, string>(
  'articles/fetchArticleById',
  async (articleId) => {
    const response = await apiClient.get<ArticleDetail>(`/articles/${articleId}`);
    return response.data;
  }
);

// Create new article
export const createArticle = createAsyncThunk<ArticleDetail, ArticleCreateData>(
  'articles/createArticle',
  async (articleData) => {
    const response = await apiClient.post<ArticleDetail>('/articles', articleData);
    return response.data;
  }
);

// Update existing article
export const updateArticle = createAsyncThunk<
  ArticleDetail, 
  { articleId: string; articleData: ArticleUpdateData }
>(
  'articles/updateArticle',
  async ({ articleId, articleData }) => {
    const response = await apiClient.patch<ArticleDetail>(
      `/articles/${articleId}`,
      articleData
    );
    return response.data;
  }
);

// Delete article
export const deleteArticle = createAsyncThunk<string, string>(
  'articles/deleteArticle',
  async (articleId) => {
    await apiClient.delete(`/articles/${articleId}`);
    return articleId;
  }
);
