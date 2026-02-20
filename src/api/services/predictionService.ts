import apiClient from '../client';
import { endpoints } from '../endpoints';
import { PredictionResult } from '@/types';

export const predictionService = {
  createPrediction: async (
    imageId: string,
    generateGradCAM: boolean = true
  ): Promise<PredictionResult> => {
    const response = await apiClient.post(endpoints.predict, {
      image_id: imageId,
      generate_gradcam: generateGradCAM,
    });
    return response.data;
  },

  getPrediction: async (predictionId: string): Promise<PredictionResult> => {
    const response = await apiClient.get(endpoints.predictById(predictionId));
    return response.data;
  },

  pollPrediction: async (
    imageId: string,
    maxAttempts: number = 30,
    interval: number = 1000
  ): Promise<PredictionResult> => {
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await apiClient.post(endpoints.predict, {
          image_id: imageId,
          generate_gradcam: true,
        });

        if (response.data.status === 'completed') {
          return response.data;
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, interval));
      } catch (error) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }

    throw new Error('Prediction timeout - analysis took too long');
  },

  batchPredict: async (imageIds: string[]): Promise<PredictionResult[]> => {
    const response = await apiClient.post('/api/predict/batch', {
      image_ids: imageIds,
      generate_gradcam: false,
    });
    return response.data;
  },
};