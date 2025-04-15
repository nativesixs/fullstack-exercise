import authReducer from '../../store/slices/authSlice';

describe('Auth Slice', () => {
  const initialState = {
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  it('should handle login/pending', () => {
    const action = { type: 'auth/login/pending' };
    const state = authReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle login/fulfilled', () => {
    const action = { type: 'auth/login/fulfilled', payload: 'token' };
    const state = authReducer(initialState, action);

    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle login/rejected', () => {
    const action = {
      type: 'auth/login/rejected',
      payload: 'Authentication failed',
    };
    const state = authReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Authentication failed');
  });

  it('should handle logout/fulfilled', () => {
    const authenticatedState = {
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const action = { type: 'auth/logout/fulfilled' };
    const state = authReducer(authenticatedState, action);

    expect(state.isAuthenticated).toBe(false);
  });
});
