import { useState, useCallback } from 'react';
import { predictionService } from '@/api/services/predictionService';
import { PredictionResponse } from '@/types';

interface UsePredictionResult {
  prediction: PredictionResponse | null;
  loading: boolean;
  error: string | null;
  progress: number;
  runPrediction: (file: File, generateGradcam?: boolean) => Promise<void>;
  clearPrediction: () => void;
}

export const usePrediction = (): UsePredictionResult => {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const runPrediction = useCallback(
    async (file: File, generateGradcam: boolean = true) => {
      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        const result = await predictionService.predict(
          file,
          generateGradcam,
          undefined,
          (percent) => setProgress(percent)
        );
        setPrediction(result);
      } catch (err: any) {
        setError(err.message || 'Prediction failed');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearPrediction = useCallback(() => {
    setPrediction(null);
    setError(null);
    setLoading(false);
    setProgress(0);
  }, []);

  return {
    prediction,
    loading,
    error,
    progress,
    runPrediction,
    clearPrediction,
  };
};