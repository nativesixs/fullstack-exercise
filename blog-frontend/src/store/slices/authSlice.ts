import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, logout } from '../actions/authActions';
import { AuthState } from '../../types/state';
import { createAsyncHandlers } from '../../utils/reduxHelpers';
import { isAuthenticated as checkStoredAuth } from '../../utils/tokenStorage';

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    checkAuthentication: (state) => {
      state.isAuthenticated = checkStoredAuth();
    },
  },
  extraReducers: (builder) => {
    const loginHandlers = createAsyncHandlers<string, AuthState>();
    const logoutHandlers = createAsyncHandlers<void, AuthState>();

    builder
      .addCase(login.pending, loginHandlers.pending)
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, loginHandlers.rejected);

    builder
      .addCase(logout.pending, logoutHandlers.pending)
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setAuthState, clearAuthError, checkAuthentication } = authSlice.actions;
export default authSlice.reducer;
