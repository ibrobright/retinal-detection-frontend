import { useState, useEffect, useCallback } from 'react';
import { predictionService } from '@/api/services/predictionService';
import { PredictionResult } from '@/types';

interface UsePredictionResult {
  prediction: PredictionResult | null;
  loading: boolean;
  error: string | null;
  createPrediction: (imageId: string) => Promise<void>;
  clearPrediction: () => void;
}

export const usePrediction = (): UsePredictionResult => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPrediction = useCallback(async (imageId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await predictionService.pollPrediction(imageId);
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPrediction = useCallback(() => {
    setPrediction(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    prediction,
    loading,
    error,
    createPrediction,
    clearPrediction,
  };
};