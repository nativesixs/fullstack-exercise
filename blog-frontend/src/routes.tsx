import React, { ReactElement } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';

import AdminArticleList from './pages/AdminArticleList';
import AdminArticleDetail from './pages/AdminArticleDetail';
import NewArticle from './pages/NewArticle';

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<ArticleList />} />
      <Route path="/articles/:articleId" element={<ArticleDetail />} />
      <Route path="/login" element={<Login />} />

      {/* Protected admin routes */}
      <Route
        path="/admin/articles"
        element={
          <ProtectedRoute>
            <AdminArticleList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/articles/:articleId"
        element={
          <ProtectedRoute>
            <AdminArticleDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/new-article"
        element={
          <ProtectedRoute>
            <NewArticle />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
