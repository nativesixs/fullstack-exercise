import { createEntityAdapter, createSlice, PayloadAction, EntityState } from '@reduxjs/toolkit';
import { Article, ArticleDetail } from '../../types/article';
import { fetchArticles, fetchArticleById, createArticle, updateArticle, deleteArticle } from '../actions/articleActions';
import { RootState } from '../store';

// Create entity adapter with proper key types
const articlesAdapter = createEntityAdapter<Article, string>({
  selectId: (article) => article.articleId,
  // Sort by creation date (newest first)
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
});

// Define state interface that extends EntityState
export interface ArticlesState extends EntityState<Article, string> {
  loading: boolean;
  error: string | null;
  currentArticleId: string | null;
  currentArticle: ArticleDetail | null;
}

// Initial state with loading and error flags
const initialState: ArticlesState = articlesAdapter.getInitialState({
  loading: false,
  error: null,
  currentArticleId: null,
  currentArticle: null
});

// Create slice
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
    }
  },
  extraReducers: (builder) => {
    // Fetch all articles
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
        state.error = action.payload as string || 'Failed to fetch articles';
      });

    // Fetch article by ID
    builder
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<ArticleDetail>) => {
        state.currentArticle = action.payload;
        state.currentArticleId = action.payload.articleId;
        
        // Also update the entity if it exists
        articlesAdapter.upsertOne(state, action.payload);
        
        state.loading = false;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch article';
      });

    // Create article
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
        state.error = action.payload as string || 'Failed to create article';
      });

    // Update article
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
        state.error = action.payload as string || 'Failed to update article';
      });

    // Delete article
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
        state.error = action.payload as string || 'Failed to delete article';
      });
  }
});

// Export actions
export const { setCurrentArticle, clearArticleError } = articlesSlice.actions;

// Export selectors directly, no need for intermediate selectArticlesState function
// The adapter's getSelectors will properly infer the types from our state
export const {
  selectAll: selectAllArticles,
  selectById: selectArticleById,
  selectIds: selectArticleIds,
  selectEntities: selectArticleEntities,
  selectTotal: selectTotalArticles
} = articlesAdapter.getSelectors<RootState>(state => state.articles);

// Export reducer
export default articlesSlice.reducer;
