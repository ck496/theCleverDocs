import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";

const Footer = () => {
  const bgColor = useColorModeValue("gray.800", "gray.900");
  const textColor = useColorModeValue("gray.300", "gray.400");

  return (
    <Box bg={bgColor} color="white" py={12}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <VStack align="start" spacing={4}>
            <Heading size="md" color="white">
              CleverDocs
            </Heading>
            <Text color={textColor} fontSize="sm">
              Streamline your team's onboarding and knowledge sharing with our
              powerful platform.
            </Text>
          </VStack>

          <VStack align="start" spacing={3}>
            <Heading size="sm" color="white">
              Product
            </Heading>
            <Link href="#" color={textColor} fontSize="sm">
              Features
            </Link>
            <Link href="#" color={textColor} fontSize="sm">
              Pricing
            </Link>
            <Link href="#" color={textColor} fontSize="sm">
              Integrations
            </Link>
          </VStack>

          <VStack align="start" spacing={3}>
            <Heading size="sm" color="white">
              Company
            </Heading>
            <Link href="#" color={textColor} fontSize="sm">
              About
            </Link>
            <Link href="#" color={textColor} fontSize="sm">
              Blog
            </Link>
            <Link href="#" color={textColor} fontSize="sm">
              Careers
            </Link>
          </VStack>

          <VStack align="start" spacing={3}>
            <Heading size="sm" color="white">
              Support
            </Heading>
            <Link href="#" color={textColor} fontSize="sm">
              Help Center
            </Link>
            <Link href="#" color={textColor} fontSize="sm">
              Contact
            </Link>
            <Link href="#" color={textColor} fontSize="sm">
              Privacy Policy
            </Link>
          </VStack>
        </SimpleGrid>

        <Box
          borderTop="1px"
          borderColor="gray.700"
          mt={8}
          pt={8}
          textAlign="center"
        >
          <Text color={textColor} fontSize="sm">
            © 2024 CleverDocs. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
