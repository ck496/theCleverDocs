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
import grainBanner from "/public/images/grainBanner.webp";

const HeroSection = () => {
  return (
    <Box
      backgroundImage={`url(${grainBanner})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      color="white"
      py={{ base: 12, md: 16 }}
      mt={16}
      minH="auto"
      position="relative"
    >
      {/* Dark overlay for better text contrast */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.400"
        zIndex={1}
      />
      <Container maxW="container.xl" position="relative" zIndex={2}>
        <VStack spacing={8} align="flex-start" textAlign="left" maxW="2xl">
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            fontWeight="bold"
            lineHeight="shorter"
            color="white"
            textShadow="2px 2px 4px rgba(0,0,0,0.8)"
          >
            Streamline Your Team's
            <br />
            <Text
              as="span"
              color={useColorModeValue("blue.600", "blue.300")}
              textShadow="2px 2px 4px rgba(0,0,0,0.8)"
            >
              Onboarding Journey
            </Text>
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            maxW="2xl"
            color="gray.100"
            textShadow="1px 1px 2px rgba(0,0,0,0.8)"
            lineHeight="1.6"
          >
            CleverDocs transforms how teams share knowledge and onboard new
            members. Create interactive guides, track progress, and build a
            culture of continuous learning.
          </Text>
          <HStack spacing={4}>
            <Button
              size="lg"
              bg={useColorModeValue("blue.600", "blue.300")}
              color="white"
              _hover={{
                bg: useColorModeValue("blue.500", "blue.400"),
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
              }}
              _active={{
                bg: useColorModeValue("blue.700", "blue.500"),
                transform: "translateY(0)",
              }}
              transition="all 0.3s ease"
              fontWeight="semibold"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderColor="white"
              borderWidth="2px"
              color="white"
              bg="blackAlpha.300"
              _hover={{
                bg: "whiteAlpha.200",
                borderColor: useColorModeValue("blue.600", "blue.300"),
                color: useColorModeValue("blue.600", "blue.300"),
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(255, 255, 255, 0.2)",
              }}
              _active={{
                bg: "whiteAlpha.300",
                transform: "translateY(0)",
              }}
              transition="all 0.3s ease"
              fontWeight="semibold"
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
