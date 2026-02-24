import apiClient from '../client';
import { endpoints } from '../endpoints';
import { ResultResponse, MyResultsResponse } from '@/types';

export const resultsService = {
  /**
   * GET /api/results/{prediction_id}
   * Retrieve a previously saved prediction result by ID.
   */
  getResult: async (predictionId: string): Promise<ResultResponse> => {
    const response = await apiClient.get<ResultResponse>(
      endpoints.resultById(predictionId)
    );
    return response.data;
  },

  /**
   * GET /api/my-results?skip=...&limit=...
   * Get the current authenticated user's prediction history.
   */
  getMyResults: async (
    skip: number = 0,
    limit: number = 20
  ): Promise<MyResultsResponse> => {
    const response = await apiClient.get<MyResultsResponse>(
      endpoints.myResults,
      { params: { skip, limit } }
    );
    return response.data;
  },
};