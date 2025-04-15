import { UseToastOptions } from '@chakra-ui/react';

export const TOAST_DURATION = 3000;

export const createSuccessToast = (title: string, description?: string): UseToastOptions => ({
  title,
  description,
  status: 'success',
  duration: TOAST_DURATION,
  isClosable: true,
  position: 'top-right',
});

export const createErrorToast = (title: string, description?: string): UseToastOptions => ({
  title,
  description: description || 'An error occurred',
  status: 'error',
  duration: TOAST_DURATION,
  isClosable: true,
  position: 'top-right',
});

export const createWarningToast = (title: string, description?: string): UseToastOptions => ({
  title,
  description,
  status: 'warning',
  duration: TOAST_DURATION,
  isClosable: true,
  position: 'top-right',
});

export const createInfoToast = (title: string, description?: string): UseToastOptions => ({
  title,
  description,
  status: 'info',
  duration: TOAST_DURATION,
  isClosable: true,
  position: 'top-right',
});
