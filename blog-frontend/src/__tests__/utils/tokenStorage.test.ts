import { 
  getApiKey, 
  setApiKey, 
  getAccessToken, 
  setAccessToken, 
  removeAccessToken,
  isTokenExpired
} from '../../utils/tokenStorage';

// Mock the config for tests
jest.mock('../../config', () => ({
  config: {
    API_KEY_STORAGE_KEY: 'apiKey',
    AUTH_TOKEN_KEY: 'blog_access_token',
    AUTH_TOKEN_EXPIRY_KEY: 'blog_token_expiry'
  }
}));

describe('Token Storage Utils', () => {
  let mockStorage: { [key: string]: string } = {};
  let originalDateNow: () => number;
  
  beforeEach(() => {
    mockStorage = {};
    
    // Mock localStorage methods
    jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => mockStorage[key] || null);
    jest.spyOn(window.localStorage, 'setItem').mockImplementation((key, value) => { mockStorage[key] = value.toString(); });
    jest.spyOn(window.localStorage, 'removeItem').mockImplementation((key) => { delete mockStorage[key]; });
    
    // Save original Date.now function
    originalDateNow = Date.now;
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original Date.now
    Date.now = originalDateNow;
    jest.restoreAllMocks();
  });

  describe('API Key', () => {
    it('should get API key from localStorage', () => {
      mockStorage['apiKey'] = 'test-api-key';
      
      const result = getApiKey();
      
      expect(result).toBe('test-api-key');
      expect(localStorage.getItem).toHaveBeenCalledWith('apiKey');
    });

    it('should set API key in localStorage', () => {
      setApiKey('test-api-key');
      
      expect(localStorage.setItem).toHaveBeenCalledWith('apiKey', 'test-api-key');
      expect(mockStorage['apiKey']).toBe('test-api-key');
    });
  });

  describe('Access Token', () => {
    it('should get access token from localStorage', () => {
      // Mock Date.now to return a fixed time
      const currentTime = 1000000;
      Date.now = jest.fn(() => currentTime);
      
      const futureTime = currentTime + 3600000; // 1 hour in future
      mockStorage['blog_access_token'] = 'test-token';
      mockStorage['blog_token_expiry'] = String(futureTime);
      
      const result = getAccessToken();
      
      expect(result).toBe('test-token');
      expect(localStorage.getItem).toHaveBeenCalledWith('blog_access_token');
    });

    it('should return null if token is expired', () => {
      // Mock Date.now to return a fixed time
      const currentTime = 5000000;
      Date.now = jest.fn(() => currentTime);
      
      const pastTime = currentTime - 3600000; // 1 hour in past
      mockStorage['blog_access_token'] = 'test-token';
      mockStorage['blog_token_expiry'] = String(pastTime);
      
      const result = getAccessToken();
      
      expect(result).toBeNull();
    });

    it('should set access token with expiry in localStorage', () => {
      // Mock Date.now to return a fixed time
      const currentTime = 1000000;
      Date.now = jest.fn(() => currentTime);
      
      setAccessToken('test-token', 3600);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('blog_access_token', 'test-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('blog_token_expiry', String(currentTime + 3600 * 1000));
      expect(mockStorage['blog_access_token']).toBe('test-token');
    });

    it('should remove access token and expiry from localStorage', () => {
      mockStorage['blog_access_token'] = 'test-token';
      mockStorage['blog_token_expiry'] = '123456789';
      
      removeAccessToken();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('blog_access_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('blog_token_expiry');
      expect(mockStorage['blog_access_token']).toBeUndefined();
      expect(mockStorage['blog_token_expiry']).toBeUndefined();
    });
  });
});
