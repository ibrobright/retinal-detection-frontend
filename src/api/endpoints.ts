export const endpoints = {
  // Upload endpoints
  upload: '/api/upload',
  
  // Prediction endpoints
  predict: '/api/predict',
  predictById: (id: string) => `/api/predict/${id}`,
  predictByImage: (imageId: string) => `/api/predict/image/${imageId}`,
  
  // Results endpoints
  history: (userId: string) => `/api/results/history/${userId}`,
  statistics: (userId: string) => `/api/results/statistics/${userId}`,
  resultById: (id: string) => `/api/results/${id}`,
  
  // Admin endpoints
  adminStats: '/api/admin/statistics',
  models: '/api/admin/models',
} as const;