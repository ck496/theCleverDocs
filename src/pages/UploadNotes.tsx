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
  Textarea,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogs, Blog } from "@/data/blogs";

const UploadNotes = () => {
  const [step, setStep] = useState(1);
  const [inputType, setInputType] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedExcerpt, setEditedExcerpt] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

  const hasInput = () => {
    if (inputType === "text") return textInput.trim().length > 0;
    if (inputType === "url") return urlInput.trim().length > 0;
    if (inputType === "file") return fileInput !== null;
    return false;
  };

  const generateBlogFromInput = (input: string): Blog => {
    const blogId = (blogs.length + 1).toString();

    // Simple blog generation logic - in real app this would be AI-powered
    const lines = input.split("\n").filter((line) => line.trim());
    const title = lines[0] || "Untitled Blog Post";
    const content = input;
    const excerpt = lines.slice(1, 3).join(" ").substring(0, 150) + "...";

    return {
      id: blogId,
      title: title.replace(/^#+\s*/, ""), // Remove markdown headers
      excerpt,
      content,
      author: {
        name: "Anonymous User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      },
      publishedAt: new Date().toISOString().split("T")[0],
      readTime: `${Math.max(1, Math.ceil(content.split(" ").length / 200))} min read`,
      tags: ["User Generated", "Tech", "Blog"],
      coverImage:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
      avgRating: 0,
      totalRatings: 0,
    };
  };

  const handleNext = async () => {
    setLoading(true);
    setError("");

    try {
      let inputContent = "";

      if (inputType === "text") {
        inputContent = textInput;
      } else if (inputType === "url") {
        // Simulate URL processing
        inputContent = `# Content from URL: ${urlInput}\n\nThis is simulated content extracted from the provided URL. In a real implementation, this would fetch and process the actual URL content.`;
      } else if (inputType === "file" && fileInput) {
        // Simulate file processing
        const fileContent = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || "");
          reader.readAsText(fileInput);
        });
        inputContent = fileContent;
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newBlog = generateBlogFromInput(inputContent);

      // Add to blogs array (simulate saving)
      blogs.push(newBlog);

      setGeneratedBlog(newBlog);
      setEditedTitle(newBlog.title);
      setEditedExcerpt(newBlog.excerpt);
      setEditedContent(newBlog.content);
      setSuccess(`Blog ${newBlog.id} saved`);
      setStep(2);
    } catch (err) {
      setError("Failed to process your input. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedBlog) return;

    setLoading(true);
    setError("");

    try {
      // Update blog if edited
      if (isEditing) {
        const blogIndex = blogs.findIndex((b) => b.id === generatedBlog.id);
        if (blogIndex !== -1) {
          blogs[blogIndex] = {
            ...blogs[blogIndex],
            title: editedTitle,
            excerpt: editedExcerpt,
            content: editedContent,
          };
        }
      }

      // Simulate publishing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(`Blog ${generatedBlog.id} published`);

      // Navigate to the published blog
      setTimeout(() => {
        navigate(`/blog/${generatedBlog.id}`);
      }, 1000);
    } catch (err) {
      setError("Failed to publish blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [".txt", ".md", ".pdf"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (allowedTypes.includes(fileExtension)) {
        setFileInput(file);
        setError("");
      } else {
        setError("Please upload a .txt, .md, or .pdf file");
        setFileInput(null);
      }
    }
  };

  const renderStep1 = () => (
    <VStack spacing={8} align="stretch">
      <Box textAlign="center">
        <Heading as="h1" size="xl" mb={4} color={headingColor}>
          Upload Your Notes
        </Heading>
        <Text fontSize="lg" color={textColor}>
          Transform your simple notes into well-written tech blogs
        </Text>
      </Box>

      <Box
        bg={cardBg}
        p={8}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
      >
        <Text fontSize="lg" fontWeight="semibold" mb={6} color={headingColor}>
          Choose your input method:
        </Text>

        <RadioGroup value={inputType} onChange={setInputType}>
          <Stack spacing={6}>
            <Radio value="text" size="lg">
              <Text fontWeight="medium">Type notes directly</Text>
            </Radio>
            <Radio value="url" size="lg">
              <Text fontWeight="medium">Paste a URL</Text>
            </Radio>
            <Radio value="file" size="lg">
              <Text fontWeight="medium">Upload a file (.txt, .md, .pdf)</Text>
            </Radio>
          </Stack>
        </RadioGroup>

        <Divider my={6} />

        {inputType === "text" && (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium" color={headingColor}>
              Enter your notes:
            </Text>
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your notes here... You can use markdown formatting."
              minHeight="300px"
              resize="vertical"
            />
          </VStack>
        )}

        {inputType === "url" && (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium" color={headingColor}>
              Enter URL:
            </Text>
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/article"
              type="url"
            />
          </VStack>
        )}

        {inputType === "file" && (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium" color={headingColor}>
              Upload file:
            </Text>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf"
              onChange={handleFileChange}
              display="none"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="lg"
            >
              {fileInput ? fileInput.name : "Choose File"}
            </Button>
            {fileInput && (
              <Text fontSize="sm" color="green.500">
                ✓ {fileInput.name} selected
              </Text>
            )}
          </VStack>
        )}
      </Box>

      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {success && (
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <CheckIcon mr={2} />
          {success}
        </Alert>
      )}

      <Button
        colorScheme="blue"
        size="lg"
        onClick={handleNext}
        isDisabled={!hasInput() || loading}
        isLoading={loading}
        loadingText="Processing..."
      >
        Next
      </Button>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={8} align="stretch">
      <Box textAlign="center">
        <Heading as="h1" size="xl" mb={4} color={headingColor}>
          Preview & Edit
        </Heading>
        <Text fontSize="lg" color={textColor}>
          Review your generated blog and make any necessary edits
        </Text>
      </Box>

      {generatedBlog && (
        <Box
          bg={cardBg}
          p={8}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
        >
          <Flex justify="space-between" align="center" mb={6}>
            <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
              Generated Blog Preview
            </Text>
            <IconButton
              aria-label="Edit blog"
              icon={<EditIcon />}
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "solid" : "outline"}
              colorScheme="blue"
            />
          </Flex>

          {isEditing ? (
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="medium" mb={2} color={headingColor}>
                  Title:
                </Text>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Blog title"
                />
              </Box>
              <Box>
                <Text fontWeight="medium" mb={2} color={headingColor}>
                  Excerpt:
                </Text>
                <Textarea
                  value={editedExcerpt}
                  onChange={(e) => setEditedExcerpt(e.target.value)}
                  placeholder="Brief description"
                  rows={3}
                />
              </Box>
              <Box>
                <Text fontWeight="medium" mb={2} color={headingColor}>
                  Content:
                </Text>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Blog content"
                  minHeight="400px"
                  fontFamily="monospace"
                />
              </Box>
            </VStack>
          ) : (
            <Box
              maxHeight="500px"
              overflowY="auto"
              p={4}
              bg={useColorModeValue("white", "gray.700")}
              borderRadius="md"
              border="1px"
              borderColor={borderColor}
            >
              <Heading size="lg" mb={4} color={headingColor}>
                {editedTitle}
              </Heading>
              <Text fontSize="md" color={textColor} mb={4} fontStyle="italic">
                {editedExcerpt}
              </Text>
              <Divider mb={4} />
              <Text whiteSpace="pre-wrap" lineHeight="1.6" color={textColor}>
                {editedContent}
              </Text>
            </Box>
          )}
        </Box>
      )}

      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {success && (
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <CheckIcon mr={2} />
          {success}
        </Alert>
      )}

      <HStack spacing={4}>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(1)}
          isDisabled={loading}
          flex={1}
        >
          Back
        </Button>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handlePublish}
          isLoading={loading}
          loadingText="Publishing..."
          flex={1}
        >
          Publish
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <Box bg={bgColor} minH="100vh">
      <Header />

      <Container maxW="container.lg" py={20} mt={16}>
        {step === 1 ? renderStep1() : renderStep2()}
      </Container>

      <Footer />
    </Box>
  );
};

export default UploadNotes;
