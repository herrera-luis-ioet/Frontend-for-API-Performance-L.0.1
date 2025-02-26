import axios from 'axios';
import {
  API_BASE_URL,
  REQUEST_TIMEOUT,
  DEFAULT_HEADERS,
  ERROR_MESSAGES,
  RETRY_CONFIG,
} from '../config/apiConfig';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or other storage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle retry logic
    if (
      error.response &&
      RETRY_CONFIG.retryStatusCodes.includes(error.response.status) &&
      (!originalRequest._retry || originalRequest._retry < RETRY_CONFIG.maxRetries)
    ) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.retryDelay));
      return axiosInstance(originalRequest);
    }

    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(new Error(ERROR_MESSAGES.UNAUTHORIZED));
        case 403:
          return Promise.reject(new Error(ERROR_MESSAGES.FORBIDDEN));
        case 404:
          return Promise.reject(new Error(ERROR_MESSAGES.NOT_FOUND));
        case 400:
          return Promise.reject(new Error(ERROR_MESSAGES.BAD_REQUEST));
        case 500:
          return Promise.reject(new Error(ERROR_MESSAGES.SERVER_ERROR));
        default:
          return Promise.reject(error);
      }
    } else if (error.request) {
      // Network error
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
    } else {
      // Request configuration error
      return Promise.reject(error);
    }
  }
);

// Generic API methods
export const apiService = {
  get: async (url, config = {}) => {
    try {
      const response = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;