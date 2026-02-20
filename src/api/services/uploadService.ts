import apiClient from '../client';
import { endpoints } from '../endpoints';
import { UploadedImage, UploadMetadata } from '@/types';

export const uploadService = {
  uploadImage: async (
    file: File,
    metadata?: UploadMetadata,
    onProgress?: (percent: number) => void
  ): Promise<UploadedImage> => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata?.patientId) {
      formData.append('patient_id', metadata.patientId);
    }
    if (metadata?.notes) {
      formData.append('notes', metadata.notes);
    }

    const response = await apiClient.post(endpoints.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  uploadBatch: async (
    files: File[],
    metadata?: UploadMetadata,
    onProgress?: (fileName: string, percent: number) => void
  ): Promise<UploadedImage[]> => {
    const uploadPromises = files.map((file) =>
      uploadService.uploadImage(file, metadata, (percent) => {
        onProgress?.(file.name, percent);
      })
    );

    return await Promise.all(uploadPromises);
  },
};