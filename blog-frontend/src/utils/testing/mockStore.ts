import configureStore from 'redux-mock-store';

/**
 * Creates a mock Redux store with the given initial state
 * This implementation avoids using thunk middleware to prevent 
 * "middleware is not a function" errors in tests
 * 
 * @param initialState The initial state for the store
 * @returns A configured mock store
 */
export const createMockStore = (initialState = {}) => {
  // Create a simple mock store without middleware
  const mockStore = configureStore([]);
  return mockStore(initialState);
};

export default createMockStore;
