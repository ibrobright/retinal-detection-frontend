// Disease keys as returned by the API
export type DiseaseKey =
  | 'diabetic_retinopathy'
  | 'glaucoma'
  | 'cataract'
  | 'amd';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type UserRole = 'patient' | 'ophthalmologist' | 'admin';

// --- Auth Types ---

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterResponse {
  user_id: string;
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  username: string;
  role: UserRole;
}

export interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
}

// --- Health ---

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  model_loaded: boolean;
  database_connected: boolean;
  device: string;
  diseases: string[];
}

// --- Prediction Types ---

export interface DiseaseResult {
  name: string;
  probability: number;
  detected: boolean;
  threshold_used: number;
  confidence: ConfidenceLevel;
}

export interface PredictionResponse {
  success: boolean;
  prediction_id: string;
  image_id: string;
  timestamp: string;
  filename: string;
  predictions: Record<DiseaseKey, DiseaseResult>;
  gradcam_urls: Record<string, string> | null;
  summary: {
    diseases_detected: number;
    detected_list: string[];
    status: string;
  };
}

// --- Results Types ---

export interface ResultResponse {
  prediction_id: string;
  image_id: string;
  predicted_diseases: Record<DiseaseKey, DiseaseResult>;
  confidence_scores: Record<DiseaseKey, ConfidenceLevel>;
  detected_diseases: string[];
  inference_time: number;
  timestamp: string;
  gradcam_images: Record<string, string> | null;
  status: string;
}

export interface MyResultsItem {
  prediction_id: string;
  image_id: string;
  predicted_diseases: Record<DiseaseKey, DiseaseResult>;
  detected_diseases: string[];
  confidence_scores: Record<DiseaseKey, ConfidenceLevel>;
  timestamp: string;
}

export interface MyResultsResponse {
  results: MyResultsItem[];
  total: number;
  skip: number;
  limit: number;
}

// --- Upload Types ---

export interface UploadedImage {
  image_id: string;
  filename: string;
  file_size: number;
  upload_date: string;
  message: string;
}

export interface BatchUploadResponse {
  successful: number;
  failed: number;
  results: UploadedImage[];
  failures: Array<{ filename: string; error: string }>;
}

export interface ImageMetadata {
  image_id: string;
  original_filename: string;
  file_size: number;
  upload_date: string;
  user_id: string | null;
}

// --- Admin Types ---

export interface AdminStats {
  total_images_uploaded: number;
  total_predictions: number;
  disease_detection_counts: Record<string, number>;
  active_model_version: string;
}

export interface ModelInfo {
  model_id: string;
  version: string;
  architecture: string;
  accuracy: number;
  auc_roc: number;
  training_date: string;
  is_active: boolean;
  description?: string | null;
}

// --- UI / Filter Types ---

export interface UploadMetadata {
  consentGiven: boolean;
}

export interface HistoryFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  diseases: DiseaseKey[];
  searchQuery: string;
}

export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}

// Disease display labels
export const DISEASE_LABELS: Record<DiseaseKey, string> = {
  diabetic_retinopathy: 'Diabetic Retinopathy',
  glaucoma: 'Glaucoma',
  cataract: 'Cataract',
  amd: 'Age-related Macular Degeneration',
};

export const DISEASE_KEYS: DiseaseKey[] = [
  'diabetic_retinopathy',
  'glaucoma',
  'cataract',
  'amd',
];