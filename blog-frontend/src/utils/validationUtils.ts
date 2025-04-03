/**
 * Validates that a value is not empty
 */
export const isRequired = (value: string, message = 'This field is required'): string | null => {
  return value && value.trim() ? null : message;
};

/**
 * Validates minimum length
 */
export const minLength = (value: string, min: number, message?: string): string | null => {
  if (!value) return null; // Skip if empty (use isRequired for that)
  return value.length >= min ? null : message || `Must be at least ${min} characters`;
};

/**
 * Validates maximum length
 */
export const maxLength = (value: string, max: number, message?: string): string | null => {
  if (!value) return null; // Skip if empty
  return value.length <= max ? null : message || `Must not exceed ${max} characters`;
};

/**
 * Validates email format
 */
export const isEmail = (value: string, message = 'Invalid email format'): string | null => {
  if (!value) return null; // Skip if empty
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value) ? null : message;
};

/**
 * Validates URL format
 */
export const isUrl = (value: string, message = 'Invalid URL format'): string | null => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch (e) {
    return message;
  }
};

export const combineValidators = (...validators: ((value: string) => string | null)[]) => {
  return (value: string): string | null => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
};

/**
 * Utility for form validation using validation schema
 */
export const validateForm = <T extends Record<string, any>>(
  values: T,
  schema: {
    [K in keyof T]?: (value: T[K]) => string | null;
  }
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;
  
  for (const field in schema) {
    const validator = schema[field];
    if (validator) {
      const error = validator(values[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }
  }
  
  return { isValid, errors };
};
