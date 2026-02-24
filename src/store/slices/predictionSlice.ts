import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { predictionService } from '@/api/services/predictionService';
import { resultsService } from '@/api/services/resultsService';
import { PredictionResponse, ResultResponse, AnalysisStatus } from '@/types';

interface PredictionState {
  current: PredictionResponse | null;
  savedResult: ResultResponse | null;
  loading: boolean;
  error: string | null;
  status: AnalysisStatus;
  uploadProgress: number;
}

const initialState: PredictionState = {
  current: null,
  savedResult: null,
  loading: false,
  error: null,
  status: 'pending',
  uploadProgress: 0,
};

/**
 * Upload a file and run prediction in one step via POST /api/predict.
 */
export const runPrediction = createAsyncThunk(
  'prediction/run',
  async (
    { file, generateGradcam, threshold }: { file: File; generateGradcam?: boolean; threshold?: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const result = await predictionService.predict(
        file,
        generateGradcam ?? true,
        threshold,
        (percent) => {
          dispatch(setUploadProgress(percent));
        }
      );
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * GET /api/results/{prediction_id}
 * Load a saved result by its ID (e.g. from history page).
 */
export const fetchResultById = createAsyncThunk(
  'prediction/fetchResult',
  async (predictionId: string, { rejectWithValue }) => {
    try {
      const result = await resultsService.getResult(predictionId);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const predictionSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    clearPrediction: (state) => {
      state.current = null;
      state.savedResult = null;
      state.error = null;
      state.status = 'pending';
      state.uploadProgress = 0;
    },
    setStatus: (state, action: PayloadAction<AnalysisStatus>) => {
      state.status = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'processing';
        state.uploadProgress = 0;
      })
      .addCase(runPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.status = 'completed';
        state.uploadProgress = 100;
      })
      .addCase(runPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = 'failed';
        state.uploadProgress = 0;
      })
      // Fetch saved result by ID
      .addCase(fetchResultById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.savedResult = null;
      })
      .addCase(fetchResultById.fulfilled, (state, action) => {
        state.loading = false;
        state.savedResult = action.payload;
        state.status = 'completed';
      })
      .addCase(fetchResultById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPrediction, setStatus, setUploadProgress } = predictionSlice.actions;
export default predictionSlice.reducer;