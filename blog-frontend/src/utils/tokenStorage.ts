/**
 * Token storage utilities for authentication and API key
 */

// Constants for localStorage keys
import { config } from '../config';

// Get access token from localStorage
export const getAccessToken = (): string | null => {
  return localStorage.getItem(config.AUTH_TOKEN_KEY);
};

// Get expiry date of access token
export const getTokenExpiry = (): number | null => {
  const expiry = localStorage.getItem(config.AUTH_TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
};

// Check if the token is expired
export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  return Date.now() > expiry;
};

// Set access token in localStorage with expiry
export const setAccessToken = (token: string, expiresIn: number): void => {
  if (!token) {
    console.error("Attempted to store undefined token");
    return;
  }
  
  localStorage.setItem(config.AUTH_TOKEN_KEY, token);
  const expiryTime = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds
  localStorage.setItem(config.AUTH_TOKEN_EXPIRY_KEY, expiryTime.toString());
};

// Remove access token from localStorage
export const removeAccessToken = (): void => {
  localStorage.removeItem(config.AUTH_TOKEN_KEY);
  localStorage.removeItem(config.AUTH_TOKEN_EXPIRY_KEY);
};

// API Key storage
export const getApiKey = (): string | null => {
  return localStorage.getItem(config.API_KEY_STORAGE_KEY);
};

export const setApiKey = (apiKey: string): void => {
  localStorage.setItem(config.API_KEY_STORAGE_KEY, apiKey);
};

export const removeApiKey = (): void => {
  localStorage.removeItem(config.API_KEY_STORAGE_KEY);
};
