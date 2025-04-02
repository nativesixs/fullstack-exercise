/**
 * Shared form validation utilities
 */

// Article form validation
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

export const validateArticleForm = (data: ArticleFormData): { isValid: boolean; errors: ArticleFormErrors } => {
  const errors: ArticleFormErrors = {
    title: '',
    perex: '',
    content: '',
  };
  
  let isValid = true;
  
  if (!data.title.trim()) {
    errors.title = 'Title is required';
    isValid = false;
  }
  
  if (!data.perex.trim()) {
    errors.perex = 'Perex is required';
    isValid = false;
  }
  
  if (!data.content.trim()) {
    errors.content = 'Content is required';
    isValid = false;
  }
  
  return { isValid, errors };
};

// Login form validation
export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginFormErrors {
  username: string;
  password: string;
}

export const validateLoginForm = (data: LoginFormData): { isValid: boolean; errors: LoginFormErrors } => {
  const errors: LoginFormErrors = {
    username: '',
    password: '',
  };
  
  let isValid = true;
  
  if (!data.username.trim()) {
    errors.username = 'Username is required';
    isValid = false;
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
    isValid = false;
  }
  
  return { isValid, errors };
};

// Comment form validation
export interface CommentFormData {
  content: string;
  author?: string;
}

export interface CommentFormErrors {
  content: string;
  author?: string;
}

export const validateCommentForm = (data: CommentFormData): { isValid: boolean; errors: CommentFormErrors } => {
  const errors: CommentFormErrors = {
    content: '',
    author: '',
  };
  
  let isValid = true;
  
  if (!data.content.trim()) {
    errors.content = 'Comment text is required';
    isValid = false;
  }
  
  if (data.author !== undefined && !data.author.trim()) {
    errors.author = 'Author name is required';
    isValid = false;
  }
  
  return { isValid, errors };
};
