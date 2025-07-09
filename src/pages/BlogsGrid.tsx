import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Stack,
  Badge,
  HStack,
  Avatar,
  Spinner,
  Center,
  useColorModeValue,
  Link as ChakraLink,
  Switch,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";
import RatingBadge from "@/components/RatingBadge";
import { Link as RouterLink } from "react-router-dom";
import { useBlogs } from "@/hooks/useBlogs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BlogsGrid = () => {
  const { blogs, loading } = useBlogs();
  const [showOfficial, setShowOfficial] = useState(false);

  // Filter blogs based on toggle
  const filteredBlogs = blogs.filter((blog) =>
    showOfficial ? blog.docType === "official" : blog.docType === "community",
  );

  // Dynamic colors based on official/community mode
  const bgColor = useColorModeValue(
    showOfficial ? "gray.50" : "white",
    showOfficial ? "gray.800" : "gray.900",
  );
  const cardBg = useColorModeValue(
    showOfficial ? "gray.100" : "white",
    showOfficial ? "gray.700" : "gray.800",
  );
  const borderColor = useColorModeValue(
    showOfficial ? "gray.300" : "gray.200",
    showOfficial ? "gray.600" : "gray.700",
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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {filteredBlogs.map((blog) => (
            <ChakraLink
              as={RouterLink}
              to={`/blog/${blog.id}`}
              key={blog.id}
              _hover={{ textDecoration: "none" }}
            >
              <Card
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                borderRadius="lg"
                overflow="hidden"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "xl",
                  borderColor: "blue.300",
                }}
                height="100%"
                cursor="pointer"
              >
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  height="200px"
                  width="100%"
                  objectFit="cover"
                />

                <CardBody p={6}>
                  <Stack spacing={4} height="100%">
                    <HStack justify="space-between" align="center">
                      <HStack spacing={2} flexWrap="wrap">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            colorScheme="blue"
                            variant="subtle"
                            fontSize="xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </HStack>
                      {blog.docType === "community" ? (
                        <RatingBadge
                          rating={blog.avgRating}
                          totalRatings={blog.totalRatings}
                          size="sm"
                        />
                      ) : (
                        <Badge
                          colorScheme="orange"
                          variant="solid"
                          fontSize="xs"
                        >
                          Official
                        </Badge>
                      )}
                    </HStack>

                    <Heading
                      size="md"
                      color={headingColor}
                      lineHeight="1.3"
                      noOfLines={2}
                    >
                      {blog.title}
                    </Heading>

                    <Text
                      color={textColor}
                      fontSize="sm"
                      lineHeight="1.5"
                      noOfLines={3}
                      flex="1"
                    >
                      {blog.excerpt}
                    </Text>

                    <HStack justify="space-between" align="center" pt={2}>
                      {blog.docType === "community" ? (
                        <HStack spacing={3}>
                          <Avatar
                            src={blog.author.avatar}
                            name={blog.author.name}
                            size="sm"
                          />
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color={headingColor}
                            >
                              {blog.author.name}
                            </Text>
                            <Text fontSize="xs" color={textColor}>
                              {new Date(blog.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </Text>
                          </Box>
                        </HStack>
                      ) : (
                        <VStack spacing={1} align="start">
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={useColorModeValue(
                              "orange.600",
                              "orange.300",
                            )}
                          >
                            {blog.teamInfo?.teamName}
                          </Text>
                          <Text fontSize="xs" color={textColor}>
                            {blog.teamInfo?.email}
                          </Text>
                        </VStack>
                      )}

                      <Text fontSize="xs" color={textColor}>
                        {blog.readTime}
                      </Text>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
            </ChakraLink>
          ))}
        </SimpleGrid>
      </Container>

      <Footer />
    </Box>
  );
};

export default BlogsGrid;
