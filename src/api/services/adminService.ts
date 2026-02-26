import apiClient from '../client';
import { endpoints } from '../endpoints';
import { AdminStats, ModelInfo } from '@/types';

export interface AdminResultItem {
  prediction_id: string;
  image_id: string;
  user_id: string | null;
  predicted_diseases: Record<string, unknown>;
  detected_diseases: string[];
  confidence_scores: Record<string, string>;
  timestamp: string;
}

export interface AdminResultsResponse {
  results: AdminResultItem[];
  total: number;
  skip: number;
  limit: number;
}

export const adminService = {
  /** GET /api/admin/stats — platform-wide statistics */
  getStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<AdminStats>(endpoints.adminStats);
    return res.data;
  },

  /** GET /api/admin/model/info — active model details */
  getModelInfo: async (): Promise<ModelInfo> => {
    const res = await apiClient.get<ModelInfo>(endpoints.adminModelInfo);
    return res.data;
  },

  /** GET /api/admin/model/list — all models */
  getModelList: async (): Promise<ModelInfo[]> => {
    const res = await apiClient.get<ModelInfo[]>(endpoints.adminModelList);
    return res.data;
  },

  /** GET /api/admin/results — all prediction results across users */
  getResults: async (skip = 0, limit = 20): Promise<AdminResultsResponse> => {
    const res = await apiClient.get<AdminResultsResponse>(endpoints.adminResults, {
      params: { skip, limit },
    });
    return res.data;
  },

  /** GET /api/admin/model/thresholds — current detection thresholds */
  getThresholds: async (): Promise<Record<string, number>> => {
    const res = await apiClient.get<Record<string, number> | { thresholds: Record<string, number> }>(endpoints.adminModelThresholds);
    const data = res.data;
    // Backend may wrap thresholds in a { thresholds: {...} } envelope
    if (data && typeof data === 'object' && 'thresholds' in data && typeof data.thresholds === 'object') {
      return data.thresholds as Record<string, number>;
    }
    return data as Record<string, number>;
  },
};
