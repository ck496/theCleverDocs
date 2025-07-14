// TypeScript interfaces for upload functionality
// Based on backend models/upload.py

export interface UploadMetadata {
  source: 'file_upload' | 'text_input' | 'url'; // For future expansion
}

export interface MarkdownUploadRequest {
  filename: string;
  content: string;
  metadata: UploadMetadata;
}

export interface UploadResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    blog_id: string;
    title: string;
    processing_time_ms: number;
    expertise_levels: string[];
  };
}

export interface UploadStep {
  step: number;
  message: string;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'error';
}

export interface UploadError {
  message: string;
  code?: string;
  details?: string;
}

export interface UploadState {
  isUploading: boolean;
  currentStep: number;
  progress: number;
  error: UploadError | null;
  success: boolean;
  blogId: string | null;
  steps: UploadStep[];
}

// File validation types
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// Progress tracking constants
export const UPLOAD_STEPS: UploadStep[] = [
  { step: 1, message: "Validating file...", progress: 10, status: 'pending' },
  { step: 2, message: "Uploading to server...", progress: 30, status: 'pending' },
  { step: 3, message: "Generating blog content...", progress: 70, status: 'pending' },
  { step: 4, message: "Finalizing and saving...", progress: 90, status: 'pending' },
  { step: 5, message: "Complete! Redirecting...", progress: 100, status: 'pending' }
];

// Constants for file validation
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 1048576, // 1MB in bytes
  ALLOWED_EXTENSIONS: ['.md'],
  ALLOWED_MIME_TYPES: ['text/markdown', 'text/plain']
} as const;