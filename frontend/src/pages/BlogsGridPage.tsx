import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  Center,
  useColorModeValue,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useBlogs } from "@/hooks/useBlogs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogsCardGrid from "@/components/BlogsCardGrid";

const BlogsGridPage = () => {
  const { loading } = useBlogs();
  const [showOfficial, setShowOfficial] = useState(false);

  // Dynamic colors based on official/community mode
  const bgColor = useColorModeValue(
    showOfficial ? "gray.50" : "white",
    showOfficial ? "gray.800" : "gray.900",
  );
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

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

  return (
    <Box bg={bgColor} minH="100vh">
      <Header />

      <Container maxW="container.xl" py={20} mt={16}>
        <Box textAlign="center" mb={12}>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            mb={4}
            color={headingColor}
          >
            {showOfficial ? "Official Documentation" : "Community Blog"}
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color={textColor}
            maxW="2xl"
            mx="auto"
            mb={8}
          >
            {showOfficial
              ? "Official technical documentation and guides from our expert teams"
              : "Insights, tips, and best practices for team onboarding and knowledge sharing"}
          </Text>

          {/* Toggle Switch */}
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="center"
            maxW="300px"
            mx="auto"
          >
            <FormLabel
              htmlFor="content-toggle"
              mb="0"
              mr={4}
              color={textColor}
              fontWeight="medium"
            >
              Community
            </FormLabel>
            <Switch
              id="content-toggle"
              size="lg"
              colorScheme={showOfficial ? "orange" : "blue"}
              isChecked={showOfficial}
              onChange={(e) => setShowOfficial(e.target.checked)}
            />
            <FormLabel
              htmlFor="content-toggle"
              mb="0"
              ml={4}
              color={textColor}
              fontWeight="medium"
            >
              Official
            </FormLabel>
          </FormControl>
        </Box>

        {/* Blog Cards Grid */}
        <BlogsCardGrid docType={showOfficial ? "official" : "community"} />
      </Container>

      <Footer />
    </Box>
  );
};

export default BlogsGridPage;
