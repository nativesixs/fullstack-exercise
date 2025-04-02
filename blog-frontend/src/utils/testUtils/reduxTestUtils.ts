import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

export const createMockStore = (initialState = {}) => {
  const middlewares = [thunk as any];
  const mockStore = configureStore(middlewares);
  return mockStore(initialState);
};

export const createAction = (type: string, payload?: any) => {
  return payload !== undefined ? { type, payload } : { type };
};

export const mockAsyncActions = (actionType: string) => {
  return {
    pending: createAction(`${actionType}/pending`),
    fulfilled: (payload: any) => createAction(`${actionType}/fulfilled`, payload),
    rejected: (payload: any) => createAction(`${actionType}/rejected`, payload)
  };
};
