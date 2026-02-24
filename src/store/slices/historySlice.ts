import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resultsService } from '@/api/services/resultsService';
import { MyResultsItem, MyResultsResponse } from '@/types';

interface HistoryState {
  results: MyResultsItem[];
  loading: boolean;
  error: string | null;
  total: number;
  skip: number;
  limit: number;
}

const initialState: HistoryState = {
  results: [],
  loading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 20,
};

export const fetchHistory = createAsyncThunk(
  'history/fetch',
  async (
    { skip, limit }: { skip: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await resultsService.getMyResults(skip, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setSkip: (state, action: PayloadAction<number>) => {
      state.skip = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.skip = 0;
    },
    clearHistory: (state) => {
      state.results = [];
      state.total = 0;
      state.skip = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHistory.fulfilled,
        (state, action: PayloadAction<MyResultsResponse>) => {
          state.loading = false;
          state.results = action.payload.results;
          state.total = action.payload.total;
          state.skip = action.payload.skip;
          state.limit = action.payload.limit;
        }
      )
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSkip, setLimit, clearHistory } = historySlice.actions;
export default historySlice.reducer;