import { createSlice } from '@reduxjs/toolkit';
import {
  fetchArticles,
  fetchArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../actions/articleActions';
import { Article, ArticleDetail } from '../../types/article';

interface ArticleState {
  articles: Article[];
  currentArticle: ArticleDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: ArticleState = {
  articles: [],
  currentArticle: null,
  loading: false,
  error: null,
};

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articles = action.payload;
        state.loading = false;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.currentArticle = action.payload;
        state.loading = false;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.articles = [...state.articles, action.payload];
        state.loading = false;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.articles = state.articles.map((article) =>
          article.articleId === action.payload.articleId ? action.payload : article
        );

        if (state.currentArticle?.articleId === action.payload.articleId) {
          state.currentArticle = action.payload;
        }

        state.loading = false;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter((article) => article.articleId !== action.payload);
        if (state.currentArticle?.articleId === action.payload) {
          state.currentArticle = null;
        }
        state.loading = false;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default articleSlice.reducer;
