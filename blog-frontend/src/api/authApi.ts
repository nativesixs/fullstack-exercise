import apiClient from './apiClient';

interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export const login = async (username: string, password: string) => {
  const response = await apiClient.post<LoginResponse>('/login', { username, password });
  return response.data;
};