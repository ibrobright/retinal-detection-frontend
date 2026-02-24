import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadedImage, UploadMetadata } from '@/types';

interface UploadState {
  files: Array<File & { preview?: string; id: string }>;
  uploadedImages: UploadedImage[];
  uploading: boolean;
  uploadProgress: number;
  currentFileIndex: number;
  errors: string[];
  metadata: UploadMetadata;
}

const initialState: UploadState = {
  files: [],
  uploadedImages: [],
  uploading: false,
  uploadProgress: 0,
  currentFileIndex: 0,
  errors: [],
  metadata: {
    consentGiven: false,
  },
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    addFiles: (state, action: PayloadAction<File[]>) => {
      const newFiles = action.payload.map((file) =>
        Object.assign(file, {
          id: Math.random().toString(36).substr(2, 9),
          preview: URL.createObjectURL(file),
        })
      );
      state.files = [...state.files, ...newFiles];
    },
    removeFile: (state, action: PayloadAction<string>) => {
      const file = state.files.find((f) => f.id === action.payload);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      state.files = state.files.filter((f) => f.id !== action.payload);
    },
    clearFiles: (state) => {
      state.files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      state.files = [];
    },
    setMetadata: (state, action: PayloadAction<Partial<UploadMetadata>>) => {
      state.metadata = { ...state.metadata, ...action.payload };
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.uploading = action.payload;
    },
    setUploadedImages: (state, action: PayloadAction<UploadedImage[]>) => {
      state.uploadedImages = action.payload;
    },
    addError: (state, action: PayloadAction<string>) => {
      state.errors.push(action.payload);
    },
    resetUpload: (state) => {
      state.uploading = false;
      state.uploadProgress = 0;
      state.currentFileIndex = 0;
      state.errors = [];
    },
  },
});

export const {
  addFiles,
  removeFile,
  clearFiles,
  setMetadata,
  setUploadProgress,
  setUploading,
  setUploadedImages,
  addError,
  resetUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;