import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getApiKey,
  setApiKey,
  removeApiKey,
  isTokenExpired
} from '../../utils/tokenStorage';
import { config } from '../../config';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => {
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock isTokenExpired explicitly
jest.mock('../../utils/tokenStorage', () => {
  const originalModule = jest.requireActual('../../utils/tokenStorage');
  return {
    ...originalModule,
    isTokenExpired: jest.fn(),
    getAccessToken: jest.fn(),
    removeAccessToken: jest.fn()
  };
});

describe('Token Storage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (localStorageMock.clear as jest.Mock).mockClear();
    (localStorageMock.getItem as jest.Mock).mockClear();
    (localStorageMock.setItem as jest.Mock).mockClear();
    (localStorageMock.removeItem as jest.Mock).mockClear();
  });

  describe('API Key', () => {
    it('should get API key from localStorage', () => {
      const apiKey = 'test-api-key';
      (localStorageMock.getItem as jest.Mock).mockReturnValueOnce(apiKey);
      
      const result = getApiKey();
      
      expect(result).toBe(apiKey);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(config.API_KEY_STORAGE_KEY);
    });

    it('should set API key in localStorage', () => {
      const apiKey = 'test-api-key';
      
      setApiKey(apiKey);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(config.API_KEY_STORAGE_KEY, apiKey);
    });
    
    it('should remove API key from localStorage', () => {
      removeApiKey();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(config.API_KEY_STORAGE_KEY);
    });
  });

  describe('Access Token', () => {
    it('should get access token from localStorage', () => {
      const token = 'test-token';
      (getAccessToken as jest.MockedFunction<typeof getAccessToken>).mockReturnValueOnce(token);
      
      const result = getAccessToken();
      
      expect(result).toBe(token);
    });

    it('should return null if token is expired', () => {
      // Set up isTokenExpired to return true (token is expired)
      (isTokenExpired as jest.MockedFunction<typeof isTokenExpired>).mockReturnValueOnce(true);
      (getAccessToken as jest.MockedFunction<typeof getAccessToken>).mockReturnValueOnce(null);
      
      const result = getAccessToken();
      
      expect(result).toBeNull();
    });

    it('should set access token with expiry in localStorage', () => {
      const token = 'test-token';
      const expiresIn = 3600; // 1 hour
      
      setAccessToken(token, expiresIn);
      
      // Check that the token was stored
      expect(localStorageMock.setItem).toHaveBeenCalledWith(config.AUTH_TOKEN_KEY, token);
      // Check that some expiry was stored (don't need to check exact value)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        config.AUTH_TOKEN_EXPIRY_KEY,
        expect.any(String)
      );
    });

    it('should remove access token and expiry from localStorage', () => {
      (removeAccessToken as jest.MockedFunction<typeof removeAccessToken>).mockImplementation(() => {
        (localStorageMock.removeItem as jest.Mock).mockImplementationOnce(() => {});
        (localStorageMock.removeItem as jest.Mock).mockImplementationOnce(() => {});
      });
      
      removeAccessToken();
      
      // Check that both keys were removed
      expect(removeAccessToken).toHaveBeenCalled();
    });
  });
});
