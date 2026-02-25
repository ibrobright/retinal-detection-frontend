export const config = {
  apiUrl: import.meta.env.API_URL || 'https://favourrr-retinal-disease-detection.hf.space',
  apiTimeout: parseInt(import.meta.env.API_TIMEOUT) || 30000,
  maxFileSize: parseInt(import.meta.env.MAX_FILE_SIZE) || 10485760,
  appName: import.meta.env.APP_NAME || 'RetinaAI',
  appVersion: import.meta.env.APP_VERSION || '1.0.0',
} as const;