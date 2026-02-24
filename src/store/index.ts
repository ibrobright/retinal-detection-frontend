import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import uploadReducer from './slices/uploadSlice';
import predictionReducer from './slices/predictionSlice';
import historyReducer from './slices/historySlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    upload: uploadReducer,
    prediction: predictionReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['upload/addFiles'],
        ignoredPaths: ['upload.files'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;