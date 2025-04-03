import { createEntityAdapter, createSlice, PayloadAction, EntityState } from '@reduxjs/toolkit';
import { Article, ArticleDetail } from '../../types/article';
import {
  fetchArticles,
  fetchArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../actions/articleActions';
import { RootState } from '../store';

const articlesAdapter = createEntityAdapter<Article, string>({
  selectId: (article) => article.articleId,
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

export interface ArticlesState extends EntityState<Article, string> {
  loading: boolean;
  error: string | null;
  currentArticleId: string | null;
  currentArticle: ArticleDetail | null;
}

const initialState: ArticlesState = articlesAdapter.getInitialState({
  loading: false,
  error: null,
  currentArticleId: null,
  currentArticle: null,
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setCurrentArticle: (state, action: PayloadAction<ArticleDetail | null>) => {
      state.currentArticle = action.payload;
      state.currentArticleId = action.payload?.articleId || null;
    },
    clearArticleError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        articlesAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch articles';
      });

    builder
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<ArticleDetail>) => {
        state.currentArticle = action.payload;
        state.currentArticleId = action.payload.articleId;

        articlesAdapter.upsertOne(state, action.payload);

        state.loading = false;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch article';
      });

    builder
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action: PayloadAction<ArticleDetail>) => {
        articlesAdapter.addOne(state, action.payload);
        state.currentArticle = action.payload;
        state.currentArticleId = action.payload.articleId;
        state.loading = false;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to create article';
      });

    builder
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action: PayloadAction<ArticleDetail>) => {
        articlesAdapter.upsertOne(state, action.payload);

        if (state.currentArticleId === action.payload.articleId) {
          state.currentArticle = action.payload;
        }

        state.loading = false;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to update article';
      });

    builder
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action: PayloadAction<string>) => {
        articlesAdapter.removeOne(state, action.payload);

        if (state.currentArticleId === action.payload) {
          state.currentArticle = null;
          state.currentArticleId = null;
        }

        state.loading = false;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to delete article';
      });
  },
});

export const { setCurrentArticle, clearArticleError } = articlesSlice.actions;

export const {
  selectAll: selectAllArticles,
  selectById: selectArticleById,
  selectIds: selectArticleIds,
  selectEntities: selectArticleEntities,
  selectTotal: selectTotalArticles,
} = articlesAdapter.getSelectors<RootState>((state) => state.articles);

export default articlesSlice.reducer;
