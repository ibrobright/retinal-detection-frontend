import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { predictionService } from '@/api/services/predictionService';
import { PredictionResult, AnalysisStatus } from '@/types';

interface PredictionState {
  current: PredictionResult | null;
  loading: boolean;
  error: string | null;
  status: AnalysisStatus;
  pollingInterval: NodeJS.Timeout | null;
}

const initialState: PredictionState = {
  current: null,
  loading: false,
  error: null,
  status: 'pending',
  pollingInterval: null,
};

export const createPrediction = createAsyncThunk(
  'prediction/create',
  async (imageId: string, { rejectWithValue }) => {
    try {
      const result = await predictionService.pollPrediction(imageId);
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
      state.error = null;
      state.status = 'pending';
      if (state.pollingInterval) {
        clearInterval(state.pollingInterval);
        state.pollingInterval = null;
      }
    },
    setStatus: (state, action: PayloadAction<AnalysisStatus>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'processing';
      })
      .addCase(createPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.status = 'completed';
      })
      .addCase(createPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = 'failed';
      });
  },
});

export const { clearPrediction, setStatus } = predictionSlice.actions;
export default predictionSlice.reducer;