const API_KEY_STORAGE_KEY = 'apiKey';
const ACCESS_TOKEN_STORAGE_KEY = 'blog_access_token';
const TOKEN_EXPIRY_KEY = 'blog_token_expiry';

export const getApiKey = (): string | null => {
  let apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!apiKey) {
    apiKey = localStorage.getItem('blog_api_key');
  }
  return apiKey;
};

export const setApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const removeApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem('blog_api_key');
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const expiryTimestamp = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiryTimestamp) {
    return null;
  }
  
  const now = new Date().getTime();
  const expiry = parseInt(expiryTimestamp, 10);
  
  if (now >= expiry) {
    removeAccessToken();
    return null;
  }
  
  return token;
};

export const setAccessToken = (token: string, expiresInSeconds: number): void => {
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
