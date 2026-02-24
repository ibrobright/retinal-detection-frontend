import apiClient from '../client';
import { endpoints } from '../endpoints';
import { UploadedImage, BatchUploadResponse, ImageMetadata } from '@/types';

export const uploadService = {
  /**
   * POST /api/upload — Upload a single retinal image (without prediction).
   */
  uploadImage: async (
    file: File,
    userId?: string,
    onProgress?: (percent: number) => void
  ): Promise<UploadedImage> => {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('user_id', userId);
    }

    const response = await apiClient.post<UploadedImage>(
      endpoints.upload,
      formData,
      {
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

  /**
   * POST /api/upload/batch — Upload multiple retinal images at once.
   */
  uploadBatch: async (
    files: File[],
    userId?: string
  ): Promise<BatchUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (userId) {
      formData.append('user_id', userId);
    }

    const response = await apiClient.post<BatchUploadResponse>(
      endpoints.uploadBatch,
      formData,
    );
    return response.data;
  },

  /**
   * GET /api/upload/{image_id} — Get metadata about a previously uploaded image.
   */
  getImageMetadata: async (imageId: string): Promise<ImageMetadata> => {
    const response = await apiClient.get<ImageMetadata>(
      endpoints.uploadById(imageId)
    );
    return response.data;
  },

  /**
   * DELETE /api/upload/{image_id} — Delete an uploaded image.
   */
  deleteImage: async (imageId: string): Promise<{ message: string; image_id: string }> => {
    const response = await apiClient.delete(endpoints.uploadById(imageId));
    return response.data;
  },
};