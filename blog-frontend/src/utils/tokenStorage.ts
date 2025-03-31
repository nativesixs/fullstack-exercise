const API_KEY_STORAGE_KEY = 'blog_api_key';
const ACCESS_TOKEN_STORAGE_KEY = 'blog_access_token';

export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const removeApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
};

export const removeAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const clearTokens = (): void => {
  removeApiKey();
  removeAccessToken();
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};