import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

const HeroSection = () => {
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.700)",
  );

  return (
    <Box
      bgGradient={bgGradient}
      color="white"
      py={20}
      mt={16}
      textAlign="center"
    >
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            fontWeight="bold"
            lineHeight="shorter"
          >
            Streamline Your Team's
            <br />
            <Text as="span" color="yellow.300">
              Onboarding Journey
            </Text>
          </Heading>
          <Text fontSize={{ base: "lg", md: "xl" }} maxW="2xl" opacity={0.9}>
            CleverDocs transforms how teams share knowledge and onboard new
            members. Create interactive guides, track progress, and build a
            culture of continuous learning.
          </Text>
          <HStack spacing={4}>
            <Button
              size="lg"
              bg="white"
              color="blue.600"
              _hover={{
                bg: "gray.100",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.3s ease"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderColor="white"
              color="white"
              _hover={{
                bg: "whiteAlpha.200",
                transform: "translateY(-2px)",
              }}
              transition="all 0.3s ease"
            >
              Watch Demo
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default HeroSection;
