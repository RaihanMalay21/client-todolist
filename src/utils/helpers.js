export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const formats = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    full: { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    time: { hour: '2-digit', minute: '2-digit' },
  };

  return dateObj.toLocaleDateString('en-US', formats[format] || formats.short);
};

export const isDatePast = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj < today;
};

export const isDateToday = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

export const isDateTomorrow = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    dateObj.getDate() === tomorrow.getDate() &&
    dateObj.getMonth() === tomorrow.getMonth() &&
    dateObj.getFullYear() === tomorrow.getFullYear()
  );
};

export const getRelativeDate = (date) => {
  if (!date) return 'N/A';
  
  if (isDateToday(date)) return 'Today';
  if (isDateTomorrow(date)) return 'Tomorrow';
  
  const dateObj = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }
  
  return formatDate(date);
};

export const getPriorityConfig = (priority) => {
  const configs = {
    low: {
      color: 'bg-green-100 text-green-800',
      label: 'Low',
      badge: 'bg-green-500',
      textColor: 'text-green-600',
    },
    medium: {
      color: 'bg-yellow-100 text-yellow-800',
      label: 'Medium',
      badge: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    high: {
      color: 'bg-red-100 text-red-800',
      label: 'High',
      badge: 'bg-red-500',
      textColor: 'text-red-600',
    },
  };

  return configs[priority?.toLowerCase()] || configs.medium;
};

export const getCategoryColorConfig = (color) => {
  const configs = {
    red: {
      bg: 'bg-red-500',
      text: 'text-red-600',
      bgLight: 'bg-red-100',
      border: 'border-red-300',
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-600',
      bgLight: 'bg-orange-100',
      border: 'border-orange-300',
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600',
      bgLight: 'bg-yellow-100',
      border: 'border-yellow-300',
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      bgLight: 'bg-green-100',
      border: 'border-green-300',
    },
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      bgLight: 'bg-blue-100',
      border: 'border-blue-300',
    },
    indigo: {
      bg: 'bg-indigo-500',
      text: 'text-indigo-600',
      bgLight: 'bg-indigo-100',
      border: 'border-indigo-300',
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      bgLight: 'bg-purple-100',
      border: 'border-purple-300',
    },
    pink: {
      bg: 'bg-pink-500',
      text: 'text-pink-600',
      bgLight: 'bg-pink-100',
      border: 'border-pink-300',
    },
    gray: {
      bg: 'bg-gray-500',
      text: 'text-gray-600',
      bgLight: 'bg-gray-100',
      border: 'border-gray-300',
    },
  };

  return configs[color?.toLowerCase()] || configs.gray;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const timeAgo = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const seconds = Math.floor((new Date() - dateObj) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'just now';
};


export const sortByPriority = (todos) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return [...todos].sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

export const sortByDueDate = (todos) => {
  return [...todos].sort((a, b) => {
    return new Date(a.due_date) - new Date(b.due_date);
  });
};


export const filterByStatus = (todos, status) => {
  if (status === 'all') return todos;
  if (status === 'active') return todos.filter(todo => !todo.completed);
  if (status === 'completed') return todos.filter(todo => todo.completed);
  return todos;
};


export const getTodoStats = (todos) => {
  return {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => !t.completed && isDatePast(t.due_date)).length,
    dueToday: todos.filter(t => !t.completed && isDateToday(t.due_date)).length,
    highPriority: todos.filter(t => !t.completed && t.priority === 'high').length,
  };
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};


export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default {
  formatDate,
  isDatePast,
  isDateToday,
  isDateTomorrow,
  getRelativeDate,
  getPriorityConfig,
  getCategoryColorConfig,
  truncateText,
  capitalize,
  getInitials,
  timeAgo,
  sortByPriority,
  sortByDueDate,
  filterByStatus,
  getTodoStats,
  isValidEmail,
  debounce,
  deepClone,
  isEmpty,
  formatFileSize,
};