import axios from 'axios';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../../api/articleApi';
import * as tokenStorage from '../../utils/tokenStorage';

jest.mock('axios');
jest.mock('../../utils/tokenStorage');

jest.mock('../../config', () => ({
  config: {
    USE_MOCKS: false,
    API_URL: 'https://mocked-api.com',
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;

describe('Article API', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedTokenStorage.getApiKey.mockReturnValue('test-api-key');
    mockedTokenStorage.getAccessToken.mockReturnValue('test-access-token');
  });

  describe('getArticles', () => {
    it('should fetch articles with correct parameters', async () => {
      const mockArticlesResponse = {
        pagination: {
          offset: 0,
          limit: 10,
          total: 2,
        },
        items: [
          {
            articleId: 'article-1',
            title: 'Test Article 1',
            perex: 'Test perex 1',
            createdAt: '2023-01-01T12:00:00.000Z',
          },
          {
            articleId: 'article-2',
            title: 'Test Article 2',
            perex: 'Test perex 2',
            createdAt: '2023-01-02T12:00:00.000Z',
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockArticlesResponse });

      const result = await getArticles();

      expect(result).toEqual(mockArticlesResponse.items);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith('/articles');
    });
  });

  describe('getArticleById', () => {
    it('should fetch a single article by ID', async () => {
      const articleId = 'article-123';
      const mockArticle = {
        articleId,
        title: 'Test Article',
        perex: 'Test perex',
        content: 'Test content',
        createdAt: '2023-01-01T12:00:00.000Z',
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockArticle });

      const result = await getArticleById(articleId);

      expect(result).toEqual(mockArticle);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(`/articles/${articleId}`);
    });
  });

  describe('createArticle', () => {
    it('should create an article with access token', async () => {
      const articleData = {
        title: 'New Article',
        perex: 'New perex',
        content: 'New content',
      };

      const mockCreatedArticle = {
        ...articleData,
        articleId: 'new-article-123',
        createdAt: '2023-01-03T12:00:00.000Z',
        lastUpdatedAt: '2023-01-03T12:00:00.000Z',
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockCreatedArticle });

      const result = await createArticle(articleData);

      expect(result).toEqual(mockCreatedArticle);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith('/articles', articleData);
    });
  });

  describe('updateArticle', () => {
    it('should update an article with correct parameters', async () => {
      const articleId = 'article-123';
      const updateData = {
        title: 'Updated Article',
        perex: 'Updated perex',
      };

      const mockUpdatedArticle = {
        articleId,
        title: 'Updated Article',
        perex: 'Updated perex',
        content: 'Original content',
        createdAt: '2023-01-01T12:00:00.000Z',
        lastUpdatedAt: '2023-01-04T12:00:00.000Z',
      };

      mockedAxios.patch.mockResolvedValueOnce({ data: mockUpdatedArticle });

      const result = await updateArticle(articleId, updateData);

      expect(result).toEqual(mockUpdatedArticle);
      expect(mockedAxios.patch).toHaveBeenCalledTimes(1);
      expect(mockedAxios.patch).toHaveBeenCalledWith(`/articles/${articleId}`, updateData);
    });
  });

  describe('deleteArticle', () => {
    it('should delete an article by ID', async () => {
      const articleId = 'article-123';
      mockedAxios.delete.mockResolvedValueOnce({});

      await deleteArticle(articleId);

      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/articles/${articleId}`);
    });
  });
});
