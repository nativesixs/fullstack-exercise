import axios, { InternalAxiosRequestConfig } from 'axios';
import { getApiKey, getAccessToken } from '../utils/tokenStorage';
import config from '../config';
import { store } from '../store/store';

const { API_URL } = config;

// Create an instance of axios with a base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth headers and loading state
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const apiKey = getApiKey();
    
    if (apiKey) {
      config.headers['X-API-KEY'] = apiKey;
    }
    
    const accessToken = getAccessToken();
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
