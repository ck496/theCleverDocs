import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBook, FiUsers, FiLayers, FiCheckCircle } from "react-icons/fi";

const FeaturesSection = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("blue.500", "blue.300");

  const features = [
    {
      title: "Rapid Blog Generation",
      text: "Transform raw notes into well-structured, accurate, and typo-free tech blogs in under five minutes.",
      icon: FiCheckCircle,
    },
    {
      title: "Dynamic Expertise Slider",
      text: "Offer on-demand Beginner, Intermediate, and Expert variants of each blog tailored to reader's skill level.",
      icon: FiLayers,
    },
    {
      title: "Custom Guide Builder",
      text: "Assemble topic-specific blogs into streamlined, use-case–tailored playbooks for your team.",
      icon: FiBook,
    },
    {
      title: "Community & Curation",
      text: "Support Official (admin-curated) and Community sections with ratings, comments, and leaderboards.",
      icon: FiUsers,
    },
  ];

  return (
    <Box as="section" py={16} bg={bgColor} id="features">
      <Container maxW="container.xl">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading as="h2" size="2xl">
            Features
          </Heading>
          <Text
            fontSize="lg"
            maxW="2xl"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Powerful AI-driven features that transform how teams create, share,
            and consume technical knowledge.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {features.map((feature, index) => (
            <Box
              key={index}
              bg={cardBg}
              p={8}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              shadow="md"
              transition="transform 0.3s ease, box-shadow 0.3s ease"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "lg",
              }}
            >
              <VStack spacing={6} align="start" height="100%">
                <Box
                  p={3}
                  borderRadius="md"
                  bg={useColorModeValue("blue.50", "blue.900")}
                  color={iconColor}
                >
                  <Icon as={feature.icon} w={8} h={8} />
                </Box>
                <Box>
                  <Heading
                    size="lg"
                    mb={3}
                    color={useColorModeValue("gray.800", "white")}
                  >
                    {feature.title}
                  </Heading>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.600", "gray.400")}
                    lineHeight="1.6"
                  >
                    {feature.text}
                  </Text>
                </Box>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
