import React, { useState, useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Alert,
  AlertIcon,
  Progress,
  useColorModeValue,
  Divider,
  Icon,
  Circle,
} from "@chakra-ui/react";
import { CheckIcon, RepeatIcon, AttachmentIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUpload } from "@/hooks/useUpload";

const UploadNotes = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Use the upload hook
  const {
    isUploading,
    progress,
    error,
    success,
    blogId,
    steps,
    currentStepMessage,
    progressPercentage,
    canRetry,
    uploadFile,
    retryUpload,
    validateFile,
    resetUpload
  } = useUpload();

  const bgColor = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

  // Handle file selection and validation
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError("");
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file immediately
    const validation = validateFile(file);
    if (!validation.isValid) {
      setFileError(validation.error || "Invalid file");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // Handle file upload
  const handleUpload = () => {
    if (!selectedFile) return;
    
    setFileError("");
    uploadFile(selectedFile);
  };

  // Handle retry
  const handleRetry = () => {
    if (!selectedFile) return;
    
    setFileError("");
    retryUpload(selectedFile);
  };

  // Reset everything
  const handleReset = () => {
    setSelectedFile(null);
    setFileError("");
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Render progress steps
  const renderProgressSteps = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="semibold" color={headingColor} textAlign="center">
        {currentStepMessage}
      </Text>
      
      <Progress
        value={progressPercentage}
        size="lg"
        colorScheme="blue"
        bg={useColorModeValue("gray.200", "gray.600")}
        borderRadius="md"
      />
      
      <Text fontSize="sm" color={textColor} textAlign="center">
        {progressPercentage}% Complete
      </Text>
      
      <VStack spacing={2} align="stretch" mt={4}>
        {steps.map((step, index) => (
          <HStack key={step.step} spacing={3}>
            <Circle
              size="24px"
              bg={
                step.status === 'completed' ? 'green.500' :
                step.status === 'active' ? 'blue.500' :
                step.status === 'error' ? 'red.500' :
                'gray.300'
              }
              color="white"
            >
              {step.status === 'completed' ? (
                <CheckIcon boxSize={3} />
              ) : step.status === 'error' ? (
                <Text fontSize="xs">!</Text>
              ) : (
                <Text fontSize="xs">{step.step}</Text>
              )}
            </Circle>
            <Text 
              fontSize="sm" 
              color={
                step.status === 'active' ? headingColor :
                step.status === 'completed' ? 'green.500' :
                step.status === 'error' ? 'red.500' :
                textColor
              }
            >
              {step.message}
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );

  const renderFileUpload = () => (
    <VStack spacing={8} align="stretch">
      <Box textAlign="center">
        <Heading as="h1" size="xl" mb={4} color={headingColor}>
          Upload Your Notes
        </Heading>
        <Text fontSize="lg" color={textColor}>
          Transform your markdown notes into well-written tech blogs
        </Text>
      </Box>

      {/* Coming Soon Message */}
      <Box
        bg={useColorModeValue("blue.50", "blue.900")}
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor={useColorModeValue("blue.200", "blue.600")}
      >
        <Text fontSize="lg" fontWeight="semibold" mb={3} color={headingColor}>
          🚀 More ways to create blogs coming soon!
        </Text>
        <VStack spacing={2} align="start">
          <Text fontSize="sm" color={textColor}>📝 Direct text input</Text>
          <Text fontSize="sm" color={textColor}>🔗 URL content import</Text>
          <Text fontSize="sm" color={textColor}>📄 PDF file upload</Text>
          <Text fontSize="sm" color={textColor}>📎 Multiple file support</Text>
        </VStack>
        <Text fontSize="sm" color={textColor} mt={3} fontStyle="italic">
          Stay tuned for these exciting features!
        </Text>
      </Box>

      {/* Current File Upload */}
      <Box
        bg={cardBg}
        p={8}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
      >
        <Text fontSize="lg" fontWeight="semibold" mb={6} color={headingColor}>
          Upload Markdown File (.md)
        </Text>

        <VStack spacing={4} align="stretch">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".md"
            onChange={handleFileChange}
            display="none"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="lg"
            leftIcon={<AttachmentIcon />}
            isDisabled={isUploading}
          >
            {selectedFile ? selectedFile.name : "Choose Markdown File"}
          </Button>
          
          {selectedFile && (
            <Text fontSize="sm" color="green.500" textAlign="center">
              ✓ {selectedFile.name} selected ({(selectedFile.size / 1024).toFixed(1)}KB)
            </Text>
          )}
          
          {/* Inline file error */}
          {fileError && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {fileError}
            </Text>
          )}
        </VStack>
      </Box>

      {/* API Error */}
      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error.message}
        </Alert>
      )}

      {/* Success Message */}
      {success && blogId && (
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <CheckIcon mr={2} />
          Blog generated successfully! Redirecting to view...
        </Alert>
      )}

      {/* Upload Button */}
      <Button
        colorScheme="blue"
        size="lg"
        onClick={handleUpload}
        isDisabled={!selectedFile || isUploading}
        isLoading={isUploading}
        loadingText="Processing..."
      >
        Generate Blog
      </Button>
      
      {/* Retry Button */}
      {canRetry && (
        <Button
          variant="outline"
          size="lg"
          onClick={handleRetry}
          leftIcon={<RepeatIcon />}
        >
          Retry Upload
        </Button>
      )}
      
      {/* Reset Button */}
      {(selectedFile || error || success) && (
        <Button
          variant="ghost"
          size="md"
          onClick={handleReset}
        >
          Start Over
        </Button>
      )}
    </VStack>
  );

  return (
    <Box bg={bgColor} minH="100vh">
      <Header />

      <Container maxW="container.lg" py={20} mt={16}>
        {isUploading ? renderProgressSteps() : renderFileUpload()}
      </Container>

      <Footer />
    </Box>
  );
};

export default UploadNotes;
