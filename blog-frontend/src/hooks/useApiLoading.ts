import { useState, useEffect } from 'react';

interface LoadingStateEvent extends Event {
  detail: {
    url: string;
    loading: boolean;
    method: string;
  };
}

/**
 * A custom hook to track loading states for specific API endpoints
 * @param url The URL pattern to match (can be a partial URL)
 * @param method Optional HTTP method to match (GET, POST, etc.)
 * @returns Boolean indicating if the API call is in progress
 */
// NOTE - i did not write this, stolen from SO
export const useApiLoading = (url: string, method?: string): boolean => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const handleLoadingChange = (event: Event) => {
      const customEvent = event as LoadingStateEvent;
      const { url: eventUrl, loading, method: eventMethod } = customEvent.detail;
      
      if (eventUrl.includes(url)) {
        if (!method || eventMethod.toLowerCase() === method.toLowerCase()) {
          setIsLoading(loading);
        }
      }
    };
    
    window.addEventListener('api-loading-state-change', handleLoadingChange);
    
    return () => {
      window.removeEventListener('api-loading-state-change', handleLoadingChange);
    };
  }, [url, method]);
  
  return isLoading;
};

export default useApiLoading;
