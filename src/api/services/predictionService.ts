import apiClient from '../client';
import { endpoints } from '../endpoints';
import { PredictionResponse } from '@/types';

export const predictionService = {
  /**
   * POST /api/predict — upload a retinal image and get predictions.
   * Sends multipart/form-data with `file`, optional `threshold`,
   * and optional `generate_gradcam`.
   */
  predict: async (
    file: File,
    generateGradcam: boolean = true,
    threshold?: number,
    onProgress?: (percent: number) => void
  ): Promise<PredictionResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    // threshold and generate_gradcam are query params (not Form fields) in the backend
    const params: Record<string, string> = {
      generate_gradcam: String(generateGradcam),
    };
    if (threshold !== undefined) {
      params.threshold = String(threshold);
    }

    const response = await apiClient.post<PredictionResponse>(
      endpoints.predict,
      formData,
      {
        params,
        // Grad-CAM generation can take longer than the default timeout
        timeout: 120_000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percent);
          }
        },
      }
    );
    return response.data;
  },
};