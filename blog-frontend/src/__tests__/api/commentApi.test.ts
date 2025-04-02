import * as tokenStorage from '../../utils/tokenStorage';
import axios from 'axios';
import { postComment, upvoteComment, downvoteComment } from '../../api/commentApi';

jest.mock('../../utils/tokenStorage');
jest.mock('axios');

jest.mock('../../config', () => ({
  config: {
    USE_MOCKS: false,
    API_URL: 'https://mocked-api.com'
  }
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;
const API_URL = 'https://mocked-api.com';

describe('Comment API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockedTokenStorage.getApiKey.mockReturnValue('test-api-key');
    mockedTokenStorage.getAccessToken.mockReturnValue('test-access-token');
  });

  describe('postComment', () => {
    it('should call axios with correct parameters', async () => {
      const commentData = {
        articleId: 'test-article-id',
        content: 'Test comment'
      };
      
      const expectedResponse = {
        ...commentData,
        commentId: 'new-comment-id',
        author: 'Test User',
        postedAt: '2023-01-01T12:00:00Z',
        score: 0
      };
      
      mockedAxios.post.mockResolvedValueOnce({ data: expectedResponse });
      
      const result = await postComment(commentData);
      
      expect(result).toEqual(expectedResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/comments`,
        commentData,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-KEY': 'test-api-key'
          })
        })
      );
    });
  });

  describe('upvoteComment', () => {
    it('should call axios with correct parameters', async () => {
      const commentId = 'test-comment-id';
      const expectedResponse = {
        commentId,
        articleId: 'test-article-id',
        author: 'Test User',
        content: 'Test comment',
        postedAt: '2023-01-01T12:00:00Z',
        score: 1
      };
      
      mockedAxios.post.mockResolvedValueOnce({ data: expectedResponse });
      
      const result = await upvoteComment(commentId);
      
      expect(result).toEqual(expectedResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/comments/${commentId}/vote/up`,
        {},
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-KEY': 'test-api-key'
          })
        })
      );
    });
  });

  describe('downvoteComment', () => {
    it('should call axios with correct parameters', async () => {
      const commentId = 'test-comment-id';
      const expectedResponse = {
        commentId,
        articleId: 'test-article-id',
        author: 'Test User',
        content: 'Test comment',
        postedAt: '2023-01-01T12:00:00Z',
        score: -1
      };
      
      mockedAxios.post.mockResolvedValueOnce({ data: expectedResponse });
      
      const result = await downvoteComment(commentId);
      
      expect(result).toEqual(expectedResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/comments/${commentId}/vote/down`,
        {},
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-KEY': 'test-api-key'
          })
        })
      );
    });
  });
});
