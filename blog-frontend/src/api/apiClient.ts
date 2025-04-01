import axios from 'axios';

const API_URL = 'https://fullstack.exercise.applifting.cz';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('apiKey');
    
    if (apiKey) {
      config.headers['X-API-KEY'] = apiKey;
    }
    
    const accessToken = localStorage.getItem('blog_access_token');
    
    if (accessToken) {
      config.headers['Authorization'] = accessToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
