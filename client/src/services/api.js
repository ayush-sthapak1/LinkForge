import axios from 'axios';

/**
 * Axios API client instance
 * 
 * Purpose: Setup base URL configurations and interceptors for network requests.
 * 
 * TODO:
 * - Configure Bearer tokens inside request headers automatically if present in storage.
 * - Set up response interceptors to catch 401 Unauthorized status codes.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
