import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './slices/authSlice';
import articlesReducer from './slices/articlesEntitySlice';

// Create store with typed reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
  },
});

// Export store types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
