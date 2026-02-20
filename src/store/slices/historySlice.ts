import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resultsService } from '@/api/services/resultsService';
import { HistoryResult, Statistics, HistoryFilters } from '@/types';

interface HistoryState {
  results: HistoryResult[];
  statistics: Statistics | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: HistoryFilters;
}

const initialState: HistoryState = {
  results: [],
  statistics: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {
    dateFrom: null,
    dateTo: null,
    diseases: [],
    riskLevels: [],
    searchQuery: '',
    status: [],
  },
};

export const fetchHistory = createAsyncThunk(
  'history/fetch',
  async ({ userId, page, pageSize, filters }: { userId: string; page: number; pageSize: number; filters: Partial<HistoryFilters> }, { rejectWithValue }) => {
    try {
      const response = await resultsService.getHistory(userId, { page, pageSize, ...filters });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStatistics = createAsyncThunk(
  'history/fetchStatistics',
  async (userId: string, { rejectWithValue }) => {
    try {
      const stats = await resultsService.getStatistics(userId);
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<HistoryFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1;
    },
    clearHistory: (state) => {
      state.results = [];
      state.statistics = null;
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.pagination.total = action.payload.total;
        state.pagination.totalPages = Math.ceil(action.payload.total / state.pagination.pageSize);
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setPage, setPageSize, clearHistory } = historySlice.actions;
export default historySlice.reducer;