import { config } from '../config';

export const getApiKey = (): string | null => {
  return localStorage.getItem(config.API_KEY_STORAGE_KEY);
};

export const setApiKey = (apiKey: string): void => {
  localStorage.setItem(config.API_KEY_STORAGE_KEY, apiKey);
};

export const removeApiKey = (): void => {
  localStorage.removeItem(config.API_KEY_STORAGE_KEY);
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(config.AUTH_TOKEN_KEY);
  if (token && !isTokenExpired()) {
    return token;
  }
  return null;
};

export const setAccessToken = (token: string, expirySeconds?: number): void => {
  localStorage.setItem(config.AUTH_TOKEN_KEY, token);

  if (expirySeconds) {
    const expiryTime = Date.now() + expirySeconds * 1000;
    localStorage.setItem(config.AUTH_TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
};

export const removeAccessToken = (): void => {
  localStorage.removeItem(config.AUTH_TOKEN_KEY);
  localStorage.removeItem(config.AUTH_TOKEN_EXPIRY_KEY);
};

export const getTokenExpiry = (): number | null => {
  const expiry = localStorage.getItem(config.AUTH_TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
};

export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  return Date.now() > expiry;
};

export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token;
};
