import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService, AdminResultItem, AdminResultsResponse } from '@/api/services/adminService';
import { AdminStats, ModelInfo } from '@/types';

interface AdminState {
  stats: AdminStats | null;
  modelInfo: ModelInfo | null;
  models: ModelInfo[];
  thresholds: Record<string, number> | null;
  results: AdminResultItem[];
  resultsTotal: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  modelInfo: null,
  models: [],
  thresholds: null,
  results: [],
  resultsTotal: 0,
  loading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getStats();
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }
);

export const fetchModelInfo = createAsyncThunk(
  'admin/fetchModelInfo',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getModelInfo();
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch model info');
    }
  }
);

export const fetchModelList = createAsyncThunk(
  'admin/fetchModelList',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getModelList();
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch models');
    }
  }
);

export const fetchAdminResults = createAsyncThunk(
  'admin/fetchResults',
  async ({ skip, limit }: { skip: number; limit: number }, { rejectWithValue }) => {
    try {
      return await adminService.getResults(skip, limit);
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch results');
    }
  }
);

export const fetchThresholds = createAsyncThunk(
  'admin/fetchThresholds',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getThresholds();
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch thresholds');
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdmin: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchAdminStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(fetchAdminStats.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      // Model info
      .addCase(fetchModelInfo.fulfilled, (state, action) => { state.modelInfo = action.payload; })
      // Model list
      .addCase(fetchModelList.fulfilled, (state, action) => { state.models = action.payload; })
      // Thresholds
      .addCase(fetchThresholds.fulfilled, (state, action) => { state.thresholds = action.payload; })
      // Results
      .addCase(fetchAdminResults.fulfilled, (state, action) => {
        const data = action.payload as AdminResultsResponse;
        state.results = data.results;
        state.resultsTotal = data.total;
      });
  },
});

export const { clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
