import React, { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

interface BlogRaterProps {
  blogId: string;
  onRate: (blogId: string, rating: number) => void;
  currentRating?: number;
}

const BlogRater = ({ blogId, onRate, currentRating = 0 }: BlogRaterProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  const handleStarClick = (rating: number) => {
    if (hasRated) return;

    setSelectedRating(rating);
  };

  const handleSubmitRating = () => {
    if (selectedRating === 0) {
      toast({
        title: "Please select a rating",
        description: "Choose a star rating before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onRate(blogId, selectedRating);
    setHasRated(true);

    toast({
      title: "Rating submitted!",
      description: `Thank you for rating this article ${selectedRating} star${selectedRating !== 1 ? "s" : ""}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const displayRating = hoveredRating || selectedRating;

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      maxW="md"
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
          Rate this article
        </Text>

        <Text fontSize="sm" color={textColor}>
          How helpful was this article? Your feedback helps other readers.
        </Text>

        <HStack spacing={1} justify="center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              as={StarIcon}
              w={8}
              h={8}
              color={star <= displayRating ? "yellow.400" : "gray.300"}
              cursor={hasRated ? "default" : "pointer"}
              transition="color 0.2s ease"
              onMouseEnter={() => !hasRated && setHoveredRating(star)}
              onMouseLeave={() => !hasRated && setHoveredRating(0)}
              onClick={() => handleStarClick(star)}
              _hover={{
                transform: hasRated ? "none" : "scale(1.1)",
              }}
            />
          ))}
        </HStack>

        {selectedRating > 0 && (
          <Text textAlign="center" color={textColor} fontSize="sm">
            You selected {selectedRating} star{selectedRating !== 1 ? "s" : ""}
          </Text>
        )}

        {!hasRated ? (
          <Button
            colorScheme="blue"
            onClick={handleSubmitRating}
            isDisabled={selectedRating === 0}
            size="md"
          >
            Submit Rating
          </Button>
        ) : (
          <Text
            textAlign="center"
            color="green.500"
            fontWeight="medium"
            fontSize="sm"
          >
            ✓ Thank you for your rating!
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default BlogRater;
