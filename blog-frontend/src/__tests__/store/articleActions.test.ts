import * as apiClient from '../../api/apiClient';
import configureStore from 'redux-mock-store';

jest.mock('../../api/apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
}));

const mockStore = configureStore([]);

describe('Article Actions', () => {
  let store: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({
      articles: {
        articles: [],
        currentArticle: null,
        loading: false,
        error: null
      }
    });
  });

  describe('fetchArticles', () => {
    it('should create the correct action types when fetching articles', async () => {
      const mockArticles = [
        { articleId: 'article-1', title: 'Test Article 1' },
        { articleId: 'article-2', title: 'Test Article 2' }
      ];
      
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ 
        data: { 
          items: mockArticles,
          pagination: { offset: 0, limit: 10, total: 2 }
        } 
      });
      
      store.dispatch({ type: 'articles/fetchArticles/pending' });
      store.dispatch({ 
        type: 'articles/fetchArticles/fulfilled',
        payload: mockArticles
      });
      
      const actions = store.getActions();
      expect(actions[0].type).toBe('articles/fetchArticles/pending');
      expect(actions[1].type).toBe('articles/fetchArticles/fulfilled');
      expect(actions[1].payload).toEqual(mockArticles);
    });

    it('should create the correct action types when there is an error', () => {
      const errorMessage = 'API error';
      
      store.dispatch({ type: 'articles/fetchArticles/pending' });
      store.dispatch({ 
        type: 'articles/fetchArticles/rejected',
        payload: errorMessage
      });
      
      const actions = store.getActions();
      expect(actions[0].type).toBe('articles/fetchArticles/pending');
      expect(actions[1].type).toBe('articles/fetchArticles/rejected');
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe('fetchArticleById', () => {
    it('should create the correct action types when fetching an article by ID', () => {
      const articleId = 'article-123';
      const mockArticle = { 
        articleId, 
        title: 'Test Article',
        content: 'Test content'
      };
      
      store.dispatch({ type: 'articles/fetchArticleById/pending' });
      store.dispatch({ 
        type: 'articles/fetchArticleById/fulfilled',
        payload: mockArticle
      });
      
      const actions = store.getActions();
      expect(actions[0].type).toBe('articles/fetchArticleById/pending');
      expect(actions[1].type).toBe('articles/fetchArticleById/fulfilled');
      expect(actions[1].payload).toEqual(mockArticle);
    });
  });

  describe('createArticle', () => {
    it('should create the correct action types when creating an article', () => {
      const newArticle = {
        title: 'New Article',
        perex: 'Test perex',
        content: 'Test content'
      };
      
      const createdArticle = {
        ...newArticle,
        articleId: 'new-article-123',
        createdAt: '2023-01-01T12:00:00Z'
      };
      
      store.dispatch({ type: 'articles/createArticle/pending' });
      store.dispatch({ 
        type: 'articles/createArticle/fulfilled',
        payload: createdArticle
      });
      
      const actions = store.getActions();
      expect(actions[0].type).toBe('articles/createArticle/pending');
      expect(actions[1].type).toBe('articles/createArticle/fulfilled');
      expect(actions[1].payload).toEqual(createdArticle);
    });
  });

  describe('updateArticle', () => {
    it('should create the correct action types when updating an article', () => {
      const articleId = 'article-123';
      
      const updatedArticle = {
        articleId,
        title: 'Updated Title',
        perex: 'Updated perex',
        content: 'Original content',
        lastUpdatedAt: '2023-01-02T12:00:00Z'
      };
      
      store.dispatch({ type: 'articles/updateArticle/pending' });
      store.dispatch({ 
        type: 'articles/updateArticle/fulfilled',
        payload: updatedArticle
      });
      
      const actions = store.getActions();
      expect(actions[0].type).toBe('articles/updateArticle/pending');
      expect(actions[1].type).toBe('articles/updateArticle/fulfilled');
      expect(actions[1].payload).toEqual(updatedArticle);
    });
  });

  describe('deleteArticle', () => {
    it('should create the correct action types when deleting an article', () => {
      const articleId = 'article-123';
      
      store.dispatch({ type: 'articles/deleteArticle/pending' });
      store.dispatch({ 
        type: 'articles/deleteArticle/fulfilled',
        payload: articleId
      });
      
      const actions = store.getActions();
      expect(actions[0].type).toBe('articles/deleteArticle/pending');
      expect(actions[1].type).toBe('articles/deleteArticle/fulfilled');
      expect(actions[1].payload).toBe(articleId);
    });
  });
});
