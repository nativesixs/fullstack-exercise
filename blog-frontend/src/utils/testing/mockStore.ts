import configureStore from 'redux-mock-store';

export const createMockStore = (initialState = {}) => {
  const mockStore = configureStore([]);
  return mockStore(initialState);
};

export default createMockStore;
