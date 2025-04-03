import { AxiosError } from 'axios';

export enum ErrorType {
  NETWORK = 'NETWORK',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface TypedError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  statusCode?: number;
  data?: unknown;
}

export const extractErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }

  return 'An unknown error occurred';
};

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

export const getErrorDetails = (error: unknown): TypedError => {
  const defaultError: TypedError = {
    type: ErrorType.UNKNOWN,
    message: 'An unknown error occurred',
    originalError: error,
  };

  if (typeof error === 'string') {
    return {
      ...defaultError,
      message: error,
    };
  }

  if (error instanceof Error) {
    return {
      ...defaultError,
      message: error.message,
    };
  }

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
            message: 'Resource not found.',
            statusCode,
            data: axiosError.response.data,
            originalError: error,
          };
        case 422:
          return {
            type: ErrorType.VALIDATION,
            message: 'Validation failed. Please check your input.',
            statusCode,
            data: axiosError.response.data,
            originalError: error,
          };
        default:
          if (statusCode >= 500) {
            return {
              type: ErrorType.SERVER,
              message: 'Server error occurred. Please try again later.',
              statusCode,
              data: axiosError.response.data,
              originalError: error,
            };
          }
      }
    } else if (axiosError.request) {
      return {
        type: ErrorType.NETWORK,
        message: 'Network error. Please check your internet connection.',
        originalError: error,
      };
    }
  }

  return defaultError;
};
