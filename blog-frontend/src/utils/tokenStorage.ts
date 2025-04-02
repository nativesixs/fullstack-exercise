import { config } from '../config';

// Get API key from storage
export const getApiKey = (): string | null => {
  return localStorage.getItem(config.API_KEY_STORAGE_KEY);
};

// Set API key in storage
export const setApiKey = (apiKey: string): void => {
  localStorage.setItem(config.API_KEY_STORAGE_KEY, apiKey);
};

// Remove API key from storage
export const removeApiKey = (): void => {
  localStorage.removeItem(config.API_KEY_STORAGE_KEY);
};

// Get access token from storage
export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(config.AUTH_TOKEN_KEY);
  // Only return the token if it's not expired
  if (token && !isTokenExpired()) {
    return token;
  }
  return null;
};

// Set access token in storage - now accepts both token and expiry
export const setAccessToken = (token: string, expirySeconds?: number): void => {
  localStorage.setItem(config.AUTH_TOKEN_KEY, token);
  
  if (expirySeconds) {
    const expiryTime = Date.now() + expirySeconds * 1000;
    localStorage.setItem(config.AUTH_TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
};

// Remove access token from storage
export const removeAccessToken = (): void => {
  localStorage.removeItem(config.AUTH_TOKEN_KEY);
  localStorage.removeItem(config.AUTH_TOKEN_EXPIRY_KEY);
};

// Get token expiry timestamp from storage
export const getTokenExpiry = (): number | null => {
  const expiry = localStorage.getItem(config.AUTH_TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
};

// Check if the token is expired
export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  
  // Check if current time is past the expiry time
  return Date.now() > expiry;
};

// Check if the user is authenticated (has valid token)
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token;
};
