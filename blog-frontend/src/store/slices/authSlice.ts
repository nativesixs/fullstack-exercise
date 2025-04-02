import { createSlice } from '@reduxjs/toolkit';
import { login, logout } from '../actions/authActions';
import { getAccessToken } from '../../utils/tokenStorage';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!getAccessToken(),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    checkAuthentication: (state) => {
      state.isAuthenticated = !!getAccessToken();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
      });
  }
});

export const { clearError, checkAuthentication } = authSlice.actions;
export default authSlice.reducer;
