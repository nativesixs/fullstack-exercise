import axios from 'axios';
import { getApiKey, getAccessToken } from '../utils/tokenStorage';

const API_URL = 'https://fullstack.exercise.applifting.cz';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const apiKey = getApiKey();
    
    if (apiKey) {
      config.headers['X-API-KEY'] = apiKey;
      console.log('Setting API Key header:', apiKey);
    } else {
      console.error('API Key is missing - requests will fail!');
    }
    
    const accessToken = getAccessToken();
    // TODO - cleanup
    if (accessToken) {
      config.headers['Authorization'] = accessToken;
      console.log('Setting Authorization header:', accessToken);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // token expiration
      if (error.response.status === 403 || 
         (error.response.status === 401 && error.response.data?.code === 'UNAUTHORIZED')) {
        console.error('Authentication error, redirecting to login...');

        localStorage.removeItem('blog_access_token');
        localStorage.removeItem('blog_token_expiry');
        
        if (window.location.pathname.includes('/admin')) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('API Error Request:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
