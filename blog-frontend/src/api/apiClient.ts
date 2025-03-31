import axios from 'axios';

const BASE_URL = 'https://fullstack.exercise.applifting.cz';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('blog_api_key');
    const token = localStorage.getItem('blog_access_token');
    
    if (apiKey && config.headers) {
      config.headers['X-API-KEY'] = apiKey;
    }
    
    if (token && config.headers) {
      config.headers['Authorization'] = token;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
