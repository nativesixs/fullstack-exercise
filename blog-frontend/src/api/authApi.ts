import { AxiosRequestConfig } from 'axios';
import apiClient from './apiClient';
import { getApiKey } from '../utils/tokenStorage';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export const login = async (credentials: LoginCredentials): Promise<AccessTokenResponse> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API key is missing');
  }
  
  try {
    const response = await apiClient.post<AccessTokenResponse>('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getAuthHeaders = (): AxiosRequestConfig['headers'] => {
  const apiKey = getApiKey();
  return {
    'Content-Type': 'application/json',
    ...(apiKey && { 'X-API-KEY': apiKey }),
  };
};
