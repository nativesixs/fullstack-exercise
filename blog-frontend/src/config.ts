// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

export const config = {
  // API configuration
  API_URL: 'https://fullstack.exercise.applifting.cz',
  USE_MOCKS: true,

  // Pagination defaults
  ITEMS_PER_PAGE: 5,
  ADMIN_ITEMS_PER_PAGE: 10,

  // Authentication storage keys
  AUTH_TOKEN_KEY: 'blog_access_token',
  AUTH_TOKEN_EXPIRY_KEY: 'blog_token_expiry',
  API_KEY_STORAGE_KEY: 'apiKey',

  // Editor configuration
  EDITOR_OPTIONS: {
    spellChecker: false,
    placeholder: 'Write your article content here...',
    status: false,
  },

  // Feature flags
  ENABLE_WEBSOCKETS: true,

  // Logging
  LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || (isDevelopment ? 'debug' : 'error'),

  // Dev flags
  IS_DEVELOPMENT: isDevelopment,
  IS_TEST: isTest,
};

export default config;
