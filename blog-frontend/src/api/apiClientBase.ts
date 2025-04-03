import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getApiKey, getAccessToken } from '../utils/tokenStorage';
import { config } from '../config';

export const createApiClient = (baseConfig: AxiosRequestConfig = {}): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
    ...baseConfig
  });
  
  instance.interceptors.request.use(
    (config) => {
      const apiKey = getApiKey();
      const accessToken = getAccessToken();
      
      if (apiKey) {
        config.headers = config.headers || {};
        config.headers['X-API-KEY'] = apiKey;
      }
      
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = accessToken;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        const status = error.response.status;
        
        if (status === 401) {
          console.error('Authentication failed, please check your credentials or API key');
        } else if (status === 403) {
          console.error('You do not have permission to access this resource');
        } else if (status === 404) {
          console.error('Resource not found');
        } else if (status >= 500) {
          console.error('Server error occurred');
        }
      } else if (error.request) {
        console.error('No response received from server');
      } else {
        console.error('Error setting up the request:', error.message);
      }
      
      return Promise.reject(error);
    }
  );
  
  return instance;
};

export default createApiClient();
