import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth headers (future use)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token when available
    // const token = localStorage.getItem('auth-token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // Handle common HTTP errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = (error.response.data as any)?.detail || error.message;
      
      console.error(`❌ API Error ${status}:`, message);
      
      switch (status) {
        case 400:
          console.warn('Bad Request:', message);
          break;
        case 401:
          console.warn('Unauthorized - redirecting to login');
          // Handle auth redirect if needed
          break;
        case 403:
          console.warn('Forbidden:', message);
          break;
        case 404:
          console.warn('Not Found:', message);
          break;
        case 500:
          console.error('Server Error:', message);
          break;
        default:
          console.error('API Error:', message);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('❌ Network Error: No response from server');
      console.error('Check if backend is running at:', API_BASE_URL);
    } else {
      // Other error
      console.error('❌ Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;