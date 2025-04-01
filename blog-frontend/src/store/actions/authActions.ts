import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../api/authApi';
import { setAccessToken } from '../../utils/tokenStorage';

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(username, password);
      setAccessToken(response.access_token, response.expires_in);
      return response.access_token;
    } catch (error) {
      return rejectWithValue('Invalid credentials');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    authApi.logout();
    return null;
  }
);
