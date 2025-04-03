import { useState, useCallback } from 'react';

type ValidationFunction<T> = (values: T) => Partial<Record<keyof T, string>>;

/**
 * Generic hook for form handling with validation
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate: ValidationFunction<T>,
  onSubmit: (values: T) => void | Promise<void>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name as keyof T]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const fieldErrors = validate({
        ...values,
      });

      if (fieldErrors[name as keyof T]) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name as keyof T],
        }));
      }
    },
    [validate, values]
  );

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      const validationErrors = validate(values);
      setErrors(validationErrors);

      const hasErrors = Object.keys(validationErrors).length > 0;
      if (hasErrors) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, validate, values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    reset,
  };
}
