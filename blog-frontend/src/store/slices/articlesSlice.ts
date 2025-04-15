import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, ArticleDetail } from '../../types/article';
import {
  fetchArticles,
  fetchArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../actions/articleActions';
import { ArticlesState } from '../../types/state';
import { createAsyncHandlers } from '../../utils/reduxHelpers';

const initialState: ArticlesState = {
  articles: [],
  currentArticle: null,
  loading: false,
  error: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearArticleError: (state) => {
      state.error = null;
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
  },
  extraReducers: (builder) => {
    const fetchArticlesHandlers = createAsyncHandlers<Article[], ArticlesState>('articles');
    const fetchArticleByIdHandlers = createAsyncHandlers<ArticleDetail, ArticlesState>(
      'currentArticle'
    );

    builder
      .addCase(fetchArticles.pending, fetchArticlesHandlers.pending)
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.articles = action.payload;
        state.loading = false;
      })
      .addCase(fetchArticles.rejected, fetchArticlesHandlers.rejected);

    builder
      .addCase(fetchArticleById.pending, fetchArticleByIdHandlers.pending)
      .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<ArticleDetail>) => {
        state.currentArticle = action.payload;
        state.loading = false;
      })
      .addCase(fetchArticleById.rejected, fetchArticleByIdHandlers.rejected);

    builder
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action: PayloadAction<ArticleDetail>) => {
        state.articles = [action.payload, ...state.articles];
        state.currentArticle = action.payload;
        state.loading = false;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create article';
      });

    builder
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action: PayloadAction<ArticleDetail>) => {
        state.articles = state.articles.map((article) =>
          article.articleId === action.payload.articleId ? action.payload : article
        );
        state.currentArticle = action.payload;
        state.loading = false;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update article';
      });

    builder
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action: PayloadAction<string>) => {
        state.articles = state.articles.filter((article) => article.articleId !== action.payload);
        if (state.currentArticle?.articleId === action.payload) {
          state.currentArticle = null;
        }
        state.loading = false;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete article';
      });
  },
});

export const { clearArticleError, clearCurrentArticle } = articlesSlice.actions;
export default articlesSlice.reducer;
