import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { uploadService } from '@/api/services/uploadService';
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

export const uploadImages = createAsyncThunk(
  'upload/uploadImages',
  async ({ files, metadata }: { files: File[]; metadata: UploadMetadata }, { dispatch, rejectWithValue }) => {
    try {
      const uploadedImages: UploadedImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        dispatch(uploadProgress({ index: i, total: files.length }));
        
        const image = await uploadService.uploadImage(files[i], metadata, (percent) => {
          dispatch(setUploadProgress(percent));
        });
        
        uploadedImages.push(image);
      }
      
      return uploadedImages;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    addFiles: (state, action: PayloadAction<File[]>) => {
      const newFiles = action.payload.map(file => 
        Object.assign(file, {
          id: Math.random().toString(36).substr(2, 9),
          preview: URL.createObjectURL(file),
        })
      );
      state.files = [...state.files, ...newFiles];
    },
    removeFile: (state, action: PayloadAction<string>) => {
      const file = state.files.find(f => f.id === action.payload);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      state.files = state.files.filter(f => f.id !== action.payload);
    },
    clearFiles: (state) => {
      state.files.forEach(f => {
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
    uploadProgress: (state, action: PayloadAction<{ index: number; total: number }>) => {
      state.currentFileIndex = action.payload.index;
      state.uploadProgress = Math.round((action.payload.index / action.payload.total) * 100);
    },
    resetUpload: (state) => {
      state.uploading = false;
      state.uploadProgress = 0;
      state.currentFileIndex = 0;
      state.errors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.pending, (state) => {
        state.uploading = true;
        state.errors = [];
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadedImages = action.payload;
        state.files = [];
        state.uploadProgress = 100;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.uploading = false;
        if (action.payload) {
          state.errors.push(action.payload as string);
        }
      });
  },
});

export const {
  addFiles,
  removeFile,
  clearFiles,
  setMetadata,
  setUploadProgress,
  uploadProgress,
  resetUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;