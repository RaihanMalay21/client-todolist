// src/utils/constants.js

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800', badge: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', badge: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800', badge: 'bg-red-500' },
];

export const CATEGORY_COLORS = [
  { value: 'red', label: 'High', color: 'bg-red-500', textColor: 'text-red-600' },
  { value: 'yellow', label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  { value: 'green', label: 'low', color: 'bg-green-500', textColor: 'text-green-600' },
];

export const DATE_FORMAT = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  FULL: 'YYYY-MM-DD HH:mm:ss',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100],
};

export const TOAST_DURATION = 3000;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  MIN_LENGTH: (min) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max) => `Maximum ${max} characters allowed`,
  INVALID_EMAIL: 'Invalid email format',
  INVALID_DATE: 'Invalid date format',
};