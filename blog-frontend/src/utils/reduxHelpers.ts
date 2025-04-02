import { SerializedError, createAsyncThunk as createReduxAsyncThunk } from '@reduxjs/toolkit';
import { BaseState } from '../types/state';

/**
 * Utility to extract error message from various error formats
 */
export const extractErrorMessage = (
  error: SerializedError | string | Error | unknown
): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'An unknown error occurred';
};

/**
 * Create async thunk with standardized error handling
 */
export function createAsyncThunk<Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: (arg: ThunkArg) => Promise<Returned>
) {
  return createReduxAsyncThunk<Returned, ThunkArg, { rejectValue: string }>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        return await payloadCreator(arg);
      } catch (error: any) {
        // Handle Axios errors
        if (error.response) {
          return rejectWithValue(
            error.response.data?.message || 
            `Failed with status ${error.response.status}`
          );
        }
        
        // Handle other errors
        return rejectWithValue(
          error.message || `Failed in ${typePrefix}`
        );
      }
    }
  );
}

/**
 * Create standard handlers for async action states
 */
export const createAsyncHandlers = <T, S extends BaseState>(dataKey?: keyof S) => {
  return {
    pending: (state: S) => {
      state.loading = true;
      state.error = null;
    },
    fulfilled: (state: S, action: { payload: T }) => {
      state.loading = false;
      
      if (dataKey) {
        (state as any)[dataKey] = action.payload;
      } else if ('data' in state) {
        state.data = action.payload;
      }
    },
    rejected: (state: S, action: { payload?: string; error: SerializedError }) => {
      state.loading = false;
      state.error = action.payload || extractErrorMessage(action.error);
    },
  };
};
