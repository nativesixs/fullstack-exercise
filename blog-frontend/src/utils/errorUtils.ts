import { AxiosError } from 'axios';

/**
 * Common error types
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Error with type information
 */
export interface TypedError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  statusCode?: number;
  data?: unknown;
}

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  const typedError = getErrorDetails(error);
  return typedError.message;
};

/**
 * Get detailed information about an error
 */
export const getErrorDetails = (error: unknown): TypedError => {
  // Default error
  const defaultError: TypedError = {
    type: ErrorType.UNKNOWN,
    message: 'An unknown error occurred',
    originalError: error,
  };
  
  // Handle string errors
  if (typeof error === 'string') {
    return {
      ...defaultError,
      message: error,
    };
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      ...defaultError,
      message: error.message,
    };
  }
  
  // Handle Axios errors
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      const statusCode = axiosError.response.status;
      
      switch (statusCode) {
        case 401:
          return {
            type: ErrorType.UNAUTHORIZED,
            message: 'Authentication required. Please log in.',
            statusCode,
            data: axiosError.response.data,
            originalError: error,
          };
        case 403:
          return {
            type: ErrorType.FORBIDDEN,
            message: 'You do not have permission to perform this action.',
            statusCode,
            data: axiosError.response.data,
            originalError: error,
          };
        case 404:
          return {
            type: ErrorType.NOT_FOUND,
            message: 'The requested resource was not found.',
            statusCode,
            data: axiosError.response.data,
            originalError: error,
          };
        case 400:
          return {
            type: ErrorType.VALIDATION,
            message: 'The request contains invalid data.',
            statusCode,
            data: axiosError.response.data,
            originalError: error,
          };
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: ErrorType.SERVER,
            message: 'Server error. Please try again later.',
            statusCode,
            data: axiosError.response.data,
            originalError: error,
          };
        default:
          return {
            ...defaultError,
            message: `Error code ${statusCode}`,
            statusCode,
            data: axiosError.response.data,
          };
      }
    }
    
    if (axiosError.request) {
      return {
        type: ErrorType.NETWORK,
        message: 'Network error. Please check your connection.',
        originalError: error,
      };
    }
  }
  
  return defaultError;
};

/**
 * Check if an error is of a specific type
 */
export const isErrorType = (error: unknown, type: ErrorType): boolean => {
  const errorDetails = getErrorDetails(error);
  return errorDetails.type === type;
};
