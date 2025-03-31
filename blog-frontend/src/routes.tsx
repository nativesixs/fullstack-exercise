import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import AdminArticleList from './pages/AdminArticleList';
import AdminArticleDetail from './pages/AdminArticleDetail';
import NewArticle from './pages/NewArticle';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('blog_access_token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ArticleList />} />
      <Route path="/articles/:articleId" element={<ArticleDetail />} />
      <Route path="/login" element={<Login />} />
      
      {/* protected routes */}
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
    </Routes>
  );
};

export default AppRoutes;
