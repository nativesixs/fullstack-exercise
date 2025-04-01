import apiClient from './apiClient';
import { setAccessToken, removeAccessToken } from '../utils/tokenStorage';

interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('Attempting login with username:', username);
    
    const response = await apiClient.post<LoginResponse>('/login', { 
      username, 
      password 
    });
    
    console.log('Login response:', response.data);
    
    setAccessToken(response.data.access_token, response.data.expires_in);
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = (): void => {
  removeAccessToken();
};

export const checkAuth = (): boolean => {
  const token = localStorage.getItem('blog_access_token');
  const expiryTimestamp = localStorage.getItem('blog_token_expiry');
  
  if (!token || !expiryTimestamp) {
    return false;
  }
  
  const now = new Date().getTime();
  const expiry = parseInt(expiryTimestamp, 10);
  
  return now < expiry;
};
