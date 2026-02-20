export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760,
  appName: import.meta.env.VITE_APP_NAME || 'RetinaAI',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;