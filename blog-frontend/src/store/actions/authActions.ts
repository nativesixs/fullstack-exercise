import apiClient from '../../api/apiClient';
import { setAccessToken, removeAccessToken } from '../../utils/tokenStorage';
import { createAsyncThunk } from '../../utils/reduxHelpers';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

export const login = createAsyncThunk<string, LoginCredentials>(
  'auth/login',
  async (credentials) => {
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    const { accessToken, expiresIn } = response.data;
    setAccessToken(accessToken, expiresIn);
    return accessToken;
  }
);

export const logout = createAsyncThunk<void, void>('auth/logout', async () => {
  removeAccessToken();
});
