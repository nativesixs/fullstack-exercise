import { isRequired, validateForm } from './validationUtils';

export interface ArticleFormData {
  title: string;
  perex: string;
  content: string;
}

export interface ArticleFormErrors {
  title: string;
  perex: string;
  content: string;
}

export const validateArticleForm = (
  data: ArticleFormData
): { isValid: boolean; errors: ArticleFormErrors } => {
  return validateForm<ArticleFormData>(data, {
    title: (value) => isRequired(value, 'Title is required'),
    perex: (value) => isRequired(value, 'Perex is required'),
    content: (value) => isRequired(value, 'Content is required'),
  }) as { isValid: boolean; errors: ArticleFormErrors };
};

export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginFormErrors {
  username: string;
  password: string;
}

export const validateLoginForm = (
  data: LoginFormData
): { isValid: boolean; errors: LoginFormErrors } => {
  return validateForm<LoginFormData>(data, {
    username: (value) => isRequired(value, 'Username is required'),
    password: (value) => isRequired(value, 'Password is required'),
  }) as { isValid: boolean; errors: LoginFormErrors };
};

export interface CommentFormData {
  content: string;
  author?: string;
}

export interface CommentFormErrors {
  content: string;
  author?: string;
}

export const validateCommentForm = (
  data: CommentFormData
): { isValid: boolean; errors: CommentFormErrors } => {
  return validateForm<CommentFormData>(data, {
    content: (value) => isRequired(value, 'Comment text is required'),
    author: (value) => (value !== undefined && !value.trim() ? 'Author name is required' : null),
  }) as { isValid: boolean; errors: CommentFormErrors };
};
