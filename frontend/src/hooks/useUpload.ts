import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadService } from '@/services/uploadService';
import { 
  UploadState, 
  UploadStep, 
  UploadError,
  UPLOAD_STEPS 
} from '@/types/upload';

// Initial state
const initialState: UploadState = {
  isUploading: false,
  currentStep: 0,
  progress: 0,
  error: null,
  success: false,
  blogId: null,
  steps: UPLOAD_STEPS.map(step => ({ ...step })) // Deep copy
};

export const useUpload = () => {
  const [state, setState] = useState<UploadState>(initialState);
  const navigate = useNavigate();

  // Update progress step
  const updateStep = useCallback((stepNumber: number, status: UploadStep['status']) => {
    setState(prev => ({
      ...prev,
      currentStep: stepNumber,
      progress: prev.steps[stepNumber - 1]?.progress || 0,
      steps: prev.steps.map((step, index) => 
        index === stepNumber - 1 
          ? { ...step, status }
          : step
      )
    }));
  }, []);

  // Reset upload state
  const resetUpload = useCallback(() => {
    setState(initialState);
  }, []);

  // Handle upload errors
  const handleError = useCallback((error: UploadError) => {
    setState(prev => ({
      ...prev,
      isUploading: false,
      error,
      steps: prev.steps.map((step, index) => 
        index === prev.currentStep - 1 
          ? { ...step, status: 'error' }
          : step
      )
    }));
  }, []);

  // Simulate progress with realistic timing
  const simulateProgress = useCallback(async (stepNumber: number) => {
    updateStep(stepNumber, 'active');
    
    // Different delays for different steps
    const delays = {
      1: 500,   // File validation - quick
      2: 1000,  // Upload - moderate
      3: 3000,  // AI processing - longer
      4: 1000,  // Saving - moderate
      5: 500    // Complete - quick
    };
    
    await new Promise(resolve => setTimeout(resolve, delays[stepNumber as keyof typeof delays] || 1000));
    updateStep(stepNumber, 'completed');
  }, [updateStep]);

  // Main upload function
  const uploadFile = useCallback(async (file: File) => {
    try {
      // Reset state and start upload
      setState(prev => ({
        ...initialState,
        isUploading: true,
        steps: UPLOAD_STEPS.map(step => ({ ...step }))
      }));

      // Step 1: Validate file
      await simulateProgress(1);
      const validation = uploadService.validateMarkdownFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Step 2: Upload to server
      await simulateProgress(2);
      
      // Step 3: Generate blog content (API call happens here)
      updateStep(3, 'active');
      const response = await uploadService.uploadMarkdown(file);
      
      if (response.status !== 'success') {
        throw new Error(response.message || 'Upload failed');
      }

      updateStep(3, 'completed');

      // Step 4: Finalize and save
      await simulateProgress(4);

      // Step 5: Complete
      updateStep(5, 'completed');

      // Update state with success
      setState(prev => ({
        ...prev,
        isUploading: false,
        success: true,
        blogId: response.data.blog_id,
        progress: 100
      }));

      // Navigate to blog after short delay
      setTimeout(() => {
        navigate(`/blog/${response.data.blog_id}`);
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      
      const uploadError: UploadError = error instanceof Error 
        ? { message: error.message }
        : { message: 'An unexpected error occurred' };
      
      handleError(uploadError);
    }
  }, [simulateProgress, updateStep, handleError, navigate]);

  // Retry upload
  const retryUpload = useCallback((file: File) => {
    resetUpload();
    uploadFile(file);
  }, [resetUpload, uploadFile]);

  // Validate file (for immediate feedback)
  const validateFile = useCallback((file: File) => {
    return uploadService.validateMarkdownFile(file);
  }, []);

  // Check backend health
  const checkBackendHealth = useCallback(async () => {
    try {
      return await uploadService.checkBackendHealth();
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    uploadFile,
    retryUpload,
    resetUpload,
    validateFile,
    checkBackendHealth,
    
    // Computed values
    isProcessing: state.isUploading,
    canRetry: !state.isUploading && state.error !== null,
    currentStepMessage: state.steps[state.currentStep - 1]?.message || '',
    progressPercentage: Math.round(state.progress)
  };
};