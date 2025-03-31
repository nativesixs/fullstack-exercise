import { createAsyncThunk } from '@reduxjs/toolkit';
import * as articleApi from '../../api/articleApi';
import { Article, ArticleDetail } from '../../types/article';

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (_, { rejectWithValue }) => {
    try {
      const articles = await articleApi.getArticles();
      return articles;
    } catch (error) {
      return rejectWithValue('Failed to fetch articles');
    }
  }
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const article = await articleApi.getArticleById(id);
      return article;
    } catch (error) {
      return rejectWithValue('Failed to fetch article');
    }
  }
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (article: Partial<ArticleDetail>, { rejectWithValue }) => {
    try {
      const newArticle = await articleApi.createArticle(article);
      return newArticle;
    } catch (error) {
      return rejectWithValue('Failed to create article');
    }
  }
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ id, article }: { id: string; article: Partial<ArticleDetail> }, { rejectWithValue }) => {
    try {
      const updatedArticle = await articleApi.updateArticle(id, article);
      return updatedArticle;
    } catch (error) {
      return rejectWithValue('Failed to update article');
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (id: string, { rejectWithValue }) => {
    try {
      await articleApi.deleteArticle(id);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete article');
    }
  }
);