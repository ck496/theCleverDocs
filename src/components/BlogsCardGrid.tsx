import React from "react";
import {
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Stack,
  Badge,
  HStack,
  Avatar,
  useColorModeValue,
  Link as ChakraLink,
  VStack,
  Heading,
  Text,
  Box,
} from "@chakra-ui/react";
import RatingBadge from "@/components/RatingBadge";
import { Link as RouterLink } from "react-router-dom";
import { useBlogs } from "@/hooks/useBlogs";
import { Blog } from "@/data/blogs";

interface BlogsCardGridProps {
  docType: "community" | "official";
}

const BlogsCardGrid = ({ docType }: BlogsCardGridProps) => {
  const { blogs, loading } = useBlogs();

  // Debug logging
  console.log("BlogsCardGrid - blogs:", blogs);
  console.log("BlogsCardGrid - loading:", loading);
  console.log("BlogsCardGrid - docType:", docType);

  // Filter blogs based on docType
  const filteredBlogs = blogs.filter((blog) => blog.docType === docType);
  console.log("BlogsCardGrid - filteredBlogs:", filteredBlogs);

  const isOfficial = docType === "official";

  // Dynamic colors based on official/community mode
  const cardBg = useColorModeValue(
    isOfficial ? "gray.100" : "white",
    isOfficial ? "gray.700" : "gray.800",
  );
  const borderColor = useColorModeValue(
    isOfficial ? "gray.300" : "gray.200",
    isOfficial ? "gray.600" : "gray.700",
  );
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

  // Show loading state
  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        <Text>Loading blogs...</Text>
      </SimpleGrid>
    );
  }

  // Show empty state
  if (filteredBlogs.length === 0) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        <Text>No blogs found for {docType} type.</Text>
      </SimpleGrid>
    );
  }

  return (
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
                    <Badge colorScheme="orange" variant="solid" fontSize="xs">
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
                        color={useColorModeValue("orange.600", "orange.300")}
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
  );
};

export default BlogsCardGrid;
