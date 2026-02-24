import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config/env';
import { ApiError } from '@/types';

const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
});

// Request interceptor — attach JWT token & handle FormData content type
apiClient.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    // Delete Content-Type for FormData so the browser sets it with the
    // correct multipart boundary automatically
    if (reqConfig.data instanceof FormData) {
      delete reqConfig.headers['Content-Type'];
    }
    return reqConfig;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor — normalise errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Clear stored auth and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Only redirect if not already on login/register page
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }

    // The API returns errors as { detail: string | [...] }
    const detail = error.response?.data?.detail;
    let errorMessage = 'An error occurred';
    if (typeof detail === 'string') {
      errorMessage = detail;
    } else if (Array.isArray(detail) && detail.length > 0) {
      // FastAPI validation errors include loc (e.g. ["body", "password"])
      // Replace generic "String" / "Value" prefixes with the actual field name
      errorMessage = detail.map((d) => {
        const field = d.loc && d.loc.length > 1
          ? d.loc[d.loc.length - 1].replace(/_/g, ' ').replace(/^\w/, (c: string) => c.toUpperCase())
          : null;
        if (field) {
          // Replace leading generic type words with the field name
          return d.msg.replace(/^(String|Value|Input|List|Int|Float)\b/i, field);
        }
        return d.msg;
      }).join('; ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;