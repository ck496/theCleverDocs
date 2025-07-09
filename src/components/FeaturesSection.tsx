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
      title: "Interactive Onboarding",
      text: "Guide new team members through personalized onboarding journeys with interactive checklists and resources.",
      icon: FiUsers,
    },
    {
      title: "Knowledge Base",
      text: "Create and organize your team's documentation in a searchable, structured knowledge base.",
      icon: FiBook,
    },
    {
      title: "Process Templates",
      text: "Standardize workflows with customizable process templates that ensure consistency across your organization.",
      icon: FiLayers,
    },
    {
      title: "Progress Tracking",
      text: "Monitor team progress with visual dashboards showing completion rates and engagement metrics.",
      icon: FiCheckCircle,
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
            Everything you need to streamline onboarding and knowledge sharing
            in one powerful platform.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {features.map((feature, index) => (
            <VStack
              key={index}
              p={6}
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              shadow="md"
              spacing={4}
              align="start"
              transition="transform 0.3s ease, box-shadow 0.3s ease"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "lg",
              }}
            >
              <Box
                p={2}
                borderRadius="md"
                bg={useColorModeValue("blue.50", "blue.900")}
                color={iconColor}
              >
                <Icon as={feature.icon} w={8} h={8} />
              </Box>
              <Heading size="md">{feature.title}</Heading>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                {feature.text}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
