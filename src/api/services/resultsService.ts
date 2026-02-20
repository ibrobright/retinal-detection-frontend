import apiClient from '../client';
import { endpoints } from '../endpoints';
import { HistoryResult, Statistics, HistoryFilters } from '@/types';

export const resultsService = {
  getHistory: async (
    userId: string,
    filters: Partial<HistoryFilters> & { page: number; pageSize: number }
  ): Promise<{ results: HistoryResult[]; total: number }> => {
    const params: any = {
      page: filters.page,
      page_size: filters.pageSize,
    };

    if (filters.dateFrom) {
      params.date_from = filters.dateFrom.toISOString();
    }
    if (filters.dateTo) {
      params.date_to = filters.dateTo.toISOString();
    }
    if (filters.diseases?.length) {
      params.diseases = filters.diseases.join(',');
    }
    if (filters.searchQuery) {
      params.search = filters.searchQuery;
    }

    const response = await apiClient.get(endpoints.history(userId), { params });
    return response.data;
  },

  getStatistics: async (userId: string): Promise<Statistics> => {
    const response = await apiClient.get(endpoints.statistics(userId));
    return response.data;
  },

  getResultById: async (resultId: string): Promise<HistoryResult> => {
    const response = await apiClient.get(endpoints.resultById(resultId));
    return response.data;
  },

  exportResults: async (
    userId: string,
    format: 'csv' | 'pdf',
    filters?: Partial<HistoryFilters>
  ): Promise<Blob> => {
    const response = await apiClient.get(`/api/results/export/${userId}`, {
      params: { format, ...filters },
      responseType: 'blob',
    });
    return response.data;
  },
};