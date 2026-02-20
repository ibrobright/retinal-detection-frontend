export type DiseaseType = 
  | 'glaucoma' 
  | 'cataract' 
  | 'diabetic_retinopathy' 
  | 'macular_degeneration';

export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type RiskLevel = 'high' | 'medium' | 'low';
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Disease {
  probability: number;
  detected: boolean;
  confidence: ConfidenceLevel;
}

export interface DiseasesResult {
  glaucoma: Disease;
  cataract: Disease;
  diabetic_retinopathy: Disease;
  macular_degeneration: Disease;
}

export interface PredictionResult {
  prediction_id: string;
  image_id: string;
  diseases: DiseasesResult;
  grad_cam_url: string | null;
  inference_time: number;
  timestamp: string;
  model_version: string;
  status: AnalysisStatus;
}

export interface UploadedImage {
  image_id: string;
  filename: string;
  file_size: number;
  upload_date: string;
  message: string;
}

export interface HistoryResult extends PredictionResult {
  original_filename: string;
  detected_diseases: string[];
  patient_id?: string;
  notes?: string;
}

export interface Statistics {
  total_images: number;
  total_predictions: number;
  total_detected_diseases: number;
  disease_counts: Record<string, number>;
  average_diseases_per_image: number;
  monthly_scan_volume?: MonthlyVolume[];
}

export interface MonthlyVolume {
  month: string;
  totalScans: number;
  issuesDetected: number;
}

export interface UploadMetadata {
  patientId?: string;
  notes?: string;
  consentGiven: boolean;
}

export interface HistoryFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  diseases: DiseaseType[];
  riskLevels: RiskLevel[];
  searchQuery: string;
  status: AnalysisStatus[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}