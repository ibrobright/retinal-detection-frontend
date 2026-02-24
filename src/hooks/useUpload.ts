import { useState, useCallback } from 'react';
import { uploadService } from '@/api/services/uploadService';
import { UploadedImage } from '@/types';
import toast from 'react-hot-toast';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadedImage | null> => {
      setUploading(true);
      setError(null);

      try {
        const result = await uploadService.uploadImage(
          file,
          undefined,
          (percent) => setProgress(percent)
        );

        toast.success('Image uploaded successfully');
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Upload failed';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
    reset,
  };
};