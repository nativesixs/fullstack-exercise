import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './slices/authSlice';
import articlesReducer from './slices/articlesEntitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
