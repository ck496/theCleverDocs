import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  HStack,
  VStack,
  Avatar,
  Badge,
  Divider,
  Button,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import RatingBadge from "@/components/RatingBadge";
import BlogRater from "@/components/BlogRater";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useParams, Link as RouterLink } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useBlogs } from "@/hooks/useBlogs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExpertiseSlider, sliderValueToExpertise, expertiseToSliderValue } from "@/components/ExpertiseSlider";

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlogById, loading, updateBlogRating } = useBlogs();
  const blog = id ? getBlogById(id) : undefined;

  // Expertise level state management
  const [expertiseLevel, setExpertiseLevel] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');

  const isOfficial = blog?.docType === "official";

  const bgColor = useColorModeValue(
    isOfficial ? "gray.50" : "white",
    isOfficial ? "gray.800" : "gray.900",
  );
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue(
    isOfficial ? "gray.300" : "gray.200",
    isOfficial ? "gray.600" : "gray.700",
  );

  // Helper function to convert slider value to expertise level
  const handleExpertiseChange = (sliderValue: number) => {
    const level = sliderValueToExpertise(sliderValue);
    setExpertiseLevel(level);
  };

  // Memoized content for performance - MUST be before any conditional returns
  const currentContent = useMemo(() => {
    if (blog && typeof blog.content === 'object') {
      return blog.content[expertiseLevel] || 
             blog.content.intermediate || 
             blog.content.beginner || 
             '';
    }
    return '';
  }, [blog, expertiseLevel]);

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Header />
        <Center py={20} mt={16}>
          <Spinner size="xl" color="blue.500" />
        </Center>
        <Footer />
      </Box>
    );
  }

  // Early return if no blog found after loading
  if (!loading && !blog) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Header />
        <Container maxW="container.lg" py={20} mt={16}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            Blog post not found. The post you're looking for doesn't exist.
          </Alert>
          <Button
            as={RouterLink}
            to="/blogs"
            leftIcon={<ArrowBackIcon />}
            colorScheme="blue"
            mt={4}
          >
            Back to Blogs
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  // Don't render if still loading or no blog
  if (loading || !blog) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Header />
        <Center py={20} mt={16}>
          <Spinner size="xl" color="blue.500" />
        </Center>
        <Footer />
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Header />

      <Container maxW="container.lg" py={8} mt={16}>
        <Button
          as={RouterLink}
          to="/blogs"
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          mb={6}
          color={textColor}
          _hover={{ color: headingColor }}
        >
          Back to Blogs
        </Button>

        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <Box>
            <HStack
              justify="space-between"
              align="center"
              mb={4}
              flexWrap="wrap"
            >
              <HStack spacing={2} flexWrap="wrap">
                {blog.tags.map((tag) => (
                  <Badge
                    key={tag}
                    colorScheme="blue"
                    variant="subtle"
                    fontSize="sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </HStack>
              {blog.docType === "community" ? (
                <RatingBadge
                  rating={blog.avgRating}
                  totalRatings={blog.totalRatings}
                  size="md"
                />
              ) : (
                <Badge
                  colorScheme="orange"
                  variant="solid"
                  fontSize="md"
                  px={3}
                  py={1}
                >
                  Official Documentation
                </Badge>
              )}
            </HStack>

            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              lineHeight="1.2"
              mb={4}
              color={headingColor}
            >
              {blog.title}
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={textColor}
              mb={6}
              lineHeight="1.6"
            >
              {blog.excerpt}
            </Text>

            <HStack justify="space-between" align="center" mb={8}>
              {blog.docType === "community" ? (
                <HStack spacing={4}>
                  <Avatar
                    src={blog.author.avatar}
                    name={blog.author.name}
                    size="md"
                  />
                  <Box>
                    <Text fontWeight="medium" color={headingColor}>
                      {blog.author.name}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  </Box>
                </HStack>
              ) : (
                <VStack spacing={2} align="start">
                  <Text
                    fontWeight="bold"
                    color={useColorModeValue("orange.600", "orange.300")}
                    fontSize="lg"
                  >
                    {blog.teamInfo?.teamName}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Contact: {blog.teamInfo?.email}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Published:{" "}
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </VStack>
              )}

              <Text fontSize="sm" color={textColor}>
                {blog.readTime}
              </Text>
            </HStack>
          </Box>

          {/* Cover Image */}
          <Image
            src={blog.coverImage}
            alt={blog.title}
            borderRadius="lg"
            width="100%"
            height={{ base: "250px", md: "400px" }}
            objectFit="cover"
            border="1px"
            borderColor={borderColor}
          />

          <Divider />

          {/* Expertise Level Slider */}
          <Box mb={6} px={4}>
            <Text 
              fontSize="sm" 
              fontWeight="medium" 
              color={textColor} 
              mb={3}
              textAlign="center"
            >
              Content Level
            </Text>
            <ExpertiseSlider
              value={expertiseToSliderValue(expertiseLevel)}
              onChange={handleExpertiseChange}
            />
          </Box>

          {/* Content */}
          <Box>
            <MarkdownRenderer content={currentContent} />
          </Box>

          <Divider />

          {/* Rating Section - Only for Community blogs */}
          {blog.docType === "community" && (
            <>
              <Box display="flex" justifyContent="center" py={8}>
                <BlogRater
                  blogId={blog.id}
                  onRate={updateBlogRating}
                  currentRating={blog.avgRating}
                />
              </Box>
              <Divider />
            </>
          )}

          {/* Back to Blogs */}
          <Box textAlign="center" py={8}>
            <Button as={RouterLink} to="/blogs" colorScheme="blue" size="lg">
              View More Articles
            </Button>
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default BlogDetails;
