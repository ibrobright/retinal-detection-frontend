export const endpoints = {
  // Auth endpoints
  authRegister: '/api/auth/register',
  authLogin: '/api/auth/login',
  authMe: '/api/auth/me',

  // General endpoints
  root: '/',
  health: '/health',

  // Prediction endpoints
  predict: '/api/predict',

  // Results endpoints
  resultById: (predictionId: string) => `/api/results/${predictionId}`,
  myResults: '/api/my-results',

  // Upload endpoints
  upload: '/api/upload',
  uploadBatch: '/api/upload/batch',
  uploadById: (imageId: string) => `/api/upload/${imageId}`,

  // Admin endpoints
  adminModelInfo: '/api/admin/model/info',
  adminModelMetrics: '/api/admin/model/metrics',
  adminModelUpload: '/api/admin/model/upload',
  adminModelActivate: (modelId: string) => `/api/admin/model/activate/${modelId}`,
  adminModelList: '/api/admin/model/list',
  adminModelDelete: (modelId: string) => `/api/admin/model/${modelId}`,
  adminModelThresholds: '/api/admin/model/thresholds',
  adminStats: '/api/admin/stats',
  adminResults: '/api/admin/results',
} as const;