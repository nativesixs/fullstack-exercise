import articlesReducer, { clearArticleError, clearCurrentArticle } from '../../store/slices/articlesSlice';

describe('Articles Slice', () => {
  const initialState = {
    articles: [],
    currentArticle: null,
    loading: false,
    error: null
  };

  it('should handle initial state', () => {
    expect(articlesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearArticleError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error'
    };
    
    const action = clearArticleError();
    const state = articlesReducer(stateWithError, action);
    
    expect(state.error).toBeNull();
  });

  it('should handle clearCurrentArticle', () => {
    const stateWithArticle = {
      ...initialState,
      currentArticle: { articleId: '123', title: 'Test' }
    };
    
    const action = clearCurrentArticle();
    const state = articlesReducer(stateWithArticle, action);
    
    expect(state.currentArticle).toBeNull();
  });

  it('should handle fetchArticles/pending', () => {
    const action = { type: 'articles/fetchArticles/pending' };
    const state = articlesReducer(initialState, action);
    
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchArticles/fulfilled', () => {
    const mockArticles = [
      { articleId: '1', title: 'Article 1' },
      { articleId: '2', title: 'Article 2' }
    ];
    
    const action = { 
      type: 'articles/fetchArticles/fulfilled',
      payload: mockArticles
    };
    
    const state = articlesReducer(initialState, action);
    
    expect(state.articles).toEqual(mockArticles);
    expect(state.loading).toBe(false);
  });

  it('should handle fetchArticles/rejected', () => {
    const action = { 
      type: 'articles/fetchArticles/rejected',
      payload: 'Failed to fetch articles'
    };
    
    const state = articlesReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch articles');
  });

  it('should handle fetchArticleById/fulfilled', () => {
    const mockArticle = { articleId: '1', title: 'Article 1', content: 'Content' };
    
    const action = { 
      type: 'articles/fetchArticleById/fulfilled',
      payload: mockArticle
    };
    
    const state = articlesReducer(initialState, action);
    
    expect(state.currentArticle).toEqual(mockArticle);
    expect(state.loading).toBe(false);
  });

  it('should handle createArticle/fulfilled', () => {
    const initialArticles = [{ articleId: '1', title: 'Original Article' }];
    const stateWithArticles = {
      ...initialState,
      articles: initialArticles
    };
    
    const newArticle = { articleId: '2', title: 'New Article' };
    
    const action = { 
      type: 'articles/createArticle/fulfilled',
      payload: newArticle
    };
    
    const state = articlesReducer(stateWithArticles, action);
    
    expect(state.articles).toContainEqual(newArticle);
    expect(state.currentArticle).toEqual(newArticle);
    expect(state.loading).toBe(false);
  });

  it('should handle deleteArticle/fulfilled', () => {
    const articles = [
      { articleId: '1', title: 'Article 1' },
      { articleId: '2', title: 'Article 2' }
    ];
    
    const stateWithArticles = {
      ...initialState,
      articles,
      currentArticle: articles[0]
    };
    
    const action = { 
      type: 'articles/deleteArticle/fulfilled',
      payload: '1'
    };
    
    const state = articlesReducer(stateWithArticles, action);
    
    expect(state.articles).toHaveLength(1);
    expect(state.articles[0].articleId).toBe('2');
    expect(state.loading).toBe(false);
  });
});
