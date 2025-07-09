import React from "react";
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
} from "@chakra-ui/react";
import RatingBadge from "@/components/RatingBadge";
import { Link as RouterLink } from "react-router-dom";
import { useBlogs } from "@/hooks/useBlogs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BlogsGrid = () => {
  const { blogs, loading } = useBlogs();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

  if (loading) {
    return (
      <Box bg={useColorModeValue("white", "gray.900")} minH="100vh">
        <Header />
        <Center py={20} mt={16}>
          <Spinner size="xl" color="blue.500" />
        </Center>
        <Footer />
      </Box>
    );
  }

  return (
    <Box bg={useColorModeValue("white", "gray.900")} minH="100vh">
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
            Our Blog
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color={textColor}
            maxW="2xl"
            mx="auto"
          >
            Insights, tips, and best practices for team onboarding and knowledge
            sharing
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {blogs.map((blog) => (
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
                      <RatingBadge
                        rating={blog.avgRating}
                        totalRatings={blog.totalRatings}
                        size="sm"
                      />
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
