import apiClient from '@/api/client';
import { 
  MarkdownUploadRequest, 
  UploadResponse, 
  FileValidationResult, 
  FILE_CONSTRAINTS,
  UploadError 
} from '@/types/upload';

class UploadService {
  /**
   * Validate a markdown file for upload
   */
  validateMarkdownFile(file: File): FileValidationResult {
    // Check file extension
    if (!file.name.endsWith('.md')) {
      return {
        isValid: false,
        error: 'Please upload a .md file'
      };
    }

    // Check file size (1MB limit)
    if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
      const sizeMB = (FILE_CONSTRAINTS.MAX_SIZE / 1024 / 1024).toFixed(1);
      return {
        isValid: false,
        error: `File size must be less than ${sizeMB}MB`
      };
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        isValid: false,
        error: 'File cannot be empty'
      };
    }

    // TODO: Add content-based validation for production
    // - Check if file actually contains markdown content
    // - Validate file is not corrupted
    // - Check for malicious content

    return { isValid: true };
  }

  /**
   * Read file content as text
   */
  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          resolve(content);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Upload markdown file to backend
   */
  async uploadMarkdown(file: File): Promise<UploadResponse> {
    try {
      // Validate file first
      const validation = this.validateMarkdownFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Read file content
      const content = await this.readFileContent(file);

      // Prepare request data
      const requestData: MarkdownUploadRequest = {
        filename: file.name,
        content,
        metadata: {
          source: 'file_upload'
        }
      };

      // Make API request
      const response = await apiClient.post<UploadResponse>(
        '/api/upload/markdown',
        requestData
      );

      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw this.handleUploadError(error);
    }
  }

  /**
   * Handle upload errors and convert to user-friendly messages
   */
  private handleUploadError(error: any): UploadError {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.detail || error.response.data?.message || error.message;
      
      switch (status) {
        case 400:
          return {
            message: 'Invalid file format or content. Please check your file and try again.',
            code: 'VALIDATION_ERROR',
            details: message
          };
        case 413:
          return {
            message: 'File is too large. Please upload a file smaller than 1MB.',
            code: 'FILE_TOO_LARGE',
            details: message
          };
        case 422:
          return {
            message: 'File validation failed. Please ensure your file is a valid markdown file.',
            code: 'VALIDATION_ERROR',
            details: message
          };
        case 500:
          return {
            message: 'Server error occurred. Please try again later.',
            code: 'SERVER_ERROR',
            details: message
          };
        default:
          return {
            message: 'Upload failed. Please try again.',
            code: 'UPLOAD_ERROR',
            details: message
          };
      }
    } else if (error.request) {
      // Network error - no response received
      return {
        message: 'Network error. Please check your connection and try again.',
        code: 'NETWORK_ERROR',
        details: 'No response from server'
      };
    } else {
      // Other error (file reading, etc.)
      return {
        message: error.message || 'An unexpected error occurred. Please try again.',
        code: 'UNKNOWN_ERROR',
        details: error.message
      };
    }
  }

  /**
   * Check if backend is available
   */
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get('/');
      return response.status === 200;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService();
export default uploadService;