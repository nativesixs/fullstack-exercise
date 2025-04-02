import { useState, useCallback } from 'react';
import { extractErrorMessage } from '../utils/errorUtils';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncReturn<T, P extends any[]> extends UseAsyncState<T> {
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook to handle async operations with loading and error states
 */
export function useAsync<T, P extends any[] = any[]>(
  asyncFunction: (...params: P) => Promise<T>
): UseAsyncReturn<T, P> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });
      
      try {
        const data = await asyncFunction(...params);
        setState({ data, loading: false, error: null });
        return data;
      } catch (e) {
        const error = extractErrorMessage(e);
        setState({ data: null, loading: false, error });
        return null;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
