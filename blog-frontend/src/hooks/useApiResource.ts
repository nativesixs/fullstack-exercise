import { useState, useEffect } from 'react';
import { extractErrorMessage } from '../utils/errorUtils';

type ApiFunction<T, P> = (params: P) => Promise<T>;

interface UseApiResourceOptions {
  loadOnMount?: boolean;
  dependencies?: any[];
}

/**
 * Hook for handling API resource loading with loading/error states
 */
export function useApiResource<T, P = any>(
  apiFn: ApiFunction<T, P>,
  initialParams?: P,
  options: UseApiResourceOptions = {}
) {
  const { loadOnMount = true, dependencies = [] } = options;
  const [data, setData] = useState<T | null>(null);
  const [params, setParams] = useState<P | undefined>(initialParams);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const execute = async (executeParams?: P): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const paramsToUse = executeParams || params;
      if (!paramsToUse) {
        throw new Error('No parameters provided for API call');
      }
      
      const result = await apiFn(paramsToUse);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (loadOnMount && params) {
      execute();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadOnMount, ...dependencies]);
  
  return {
    data,
    isLoading,
    error,
    execute,
    setParams,
    setData
  };
}
