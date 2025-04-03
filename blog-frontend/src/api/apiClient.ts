import { createApiClient } from './apiClientBase';

export const API_LOADING_EVENT = 'api-loading-state-change';
export interface ApiLoadingEvent extends CustomEvent {
  detail: {
    url: string;
    loading: boolean;
    method: string;
  };
}

export const dispatchLoadingEvent = (url: string, loading: boolean, method: string): void => {
  const event = new CustomEvent(API_LOADING_EVENT, {
    detail: { url, loading, method },
    bubbles: true,
  }) as ApiLoadingEvent;

  document.dispatchEvent(event);
};

const apiClient = createApiClient();

apiClient.interceptors.request.use((config) => {
  if (config.url) {
    dispatchLoadingEvent(config.url, true, config.method || 'get');
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.url) {
      dispatchLoadingEvent(response.config.url, false, response.config.method || 'get');
    }
    return response;
  },
  (error) => {
    if (error.config?.url) {
      dispatchLoadingEvent(error.config.url, false, error.config.method || 'get');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
