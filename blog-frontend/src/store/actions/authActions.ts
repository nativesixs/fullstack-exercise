import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { setAccessToken, removeAccessToken } from '../../utils/tokenStorage';
import { LoginCredentials } from '../../types/auth';

interface LoginResponse {
  access_token: string;  // Note: snake_case from API
  expires_in: number;    // Note: snake_case from API
  token_type: string;    // Note: snake_case from API
}

export const login = createAsyncThunk<string, LoginCredentials>(
  'auth/login',
  async (credentials) => {
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    
    // Correctly extract snake_case properties from API response
    const { access_token, expires_in } = response.data;
    
    // Store the token correctly
    setAccessToken(access_token, expires_in);
    
    return access_token;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  removeAccessToken();
  return true;
});
