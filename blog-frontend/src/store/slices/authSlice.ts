import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, logout } from '../actions/authActions';
import { AuthState } from '../../types/state';
import { createAsyncHandlers } from '../../utils/reduxHelpers';
import { isTokenExpired, getAccessToken } from '../../utils/tokenStorage';
import { AppThunk } from '../store';

// Define initial state with proper typing
const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null
};

// Check if user is authenticated
export const checkAuthentication = (): AppThunk => (dispatch) => {
  const token = getAccessToken();
  
  if (token && !isTokenExpired()) {
    dispatch(setAuthState(true));
  } else {
    dispatch(setAuthState(false));
  }
};

// Create the slice with properly typed reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set authentication state
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    // Clear authentication error
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const loginHandlers = createAsyncHandlers<string, AuthState>();
    const logoutHandlers = createAsyncHandlers<void, AuthState>();
    
    builder
      // Login
      .addCase(login.pending, loginHandlers.pending)
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, loginHandlers.rejected)
      
      // Logout
      .addCase(logout.pending, logoutHandlers.pending)
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logout.rejected, logoutHandlers.rejected);
  },
});

export const { setAuthState, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
