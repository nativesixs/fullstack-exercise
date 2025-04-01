const API_KEY_STORAGE_KEY = 'apiKey';
const ACCESS_TOKEN_STORAGE_KEY = 'blog_access_token';
const TOKEN_EXPIRY_KEY = 'blog_token_expiry';

export const getApiKey = (): string | null => {
  // Try to get from correct storage key first
  let apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!apiKey) {
    // Fall back to the old key if needed
    apiKey = localStorage.getItem('blog_api_key');
    if (apiKey) {
      // Migrate the key to the correct storage location
      console.log('Migrating API key from old storage location');
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    }
  }
  console.log('Getting API Key:', apiKey);
  return apiKey;
};

export const setApiKey = (apiKey: string): void => {
  console.log('Setting API Key:', apiKey);
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const removeApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem('blog_api_key'); // Also remove from old location
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const expiryTimestamp = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  console.log('Getting Access Token:', token);
  
  if (!token || !expiryTimestamp) {
    console.warn('Access token or expiry timestamp is missing');
    return null;
  }
  
  const now = new Date().getTime();
  const expiry = parseInt(expiryTimestamp, 10);
  
  // If token is expired, remove it and return null
  if (now >= expiry) {
    console.warn('Access token has expired');
    removeAccessToken();
    return null;
  }
  
  return token;
};

export const setAccessToken = (token: string, expiresInSeconds: number): void => {
  console.log('Setting Access Token:', token, 'expires in:', expiresInSeconds);
  const expiryTimestamp = new Date().getTime() + expiresInSeconds * 1000;
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTimestamp.toString());
};

export const removeAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

export const clearTokens = (): void => {
  removeApiKey();
  removeAccessToken();
};

export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};
