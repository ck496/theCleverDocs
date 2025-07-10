import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaTwitter } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";

const About = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Box bg={bgColor} minH="100vh">
      <Header />

      <Container maxW="container.xl" py={20} mt={16}>
        <VStack spacing={16} align="stretch">
          {/* About CleverDocs Section */}
          <Box textAlign="center">
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              mb={6}
              color={headingColor}
            >
              About CleverDocs
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={textColor}
              maxW="4xl"
              mx="auto"
              lineHeight="1.8"
            >
              CleverDocs is an AI-powered onboarding and knowledge-sharing
              platform that accelerates new-hire ramp-up and empowers engineers
              to formalize and distribute institutional knowledge as polished,
              multi-level tech blogs and custom guides.
            </Text>
          </Box>

          {/* Mission Statement */}
          <Box
            bg={useColorModeValue("blue.50", "blue.900")}
            p={12}
            borderRadius="xl"
            textAlign="center"
          >
            <Heading
              as="h2"
              size="xl"
              mb={6}
              color={useColorModeValue("blue.700", "blue.200")}
            >
              Our Mission
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={useColorModeValue("blue.600", "blue.300")}
              maxW="4xl"
              mx="auto"
              lineHeight="1.8"
            >
              To eliminate knowledge silos and onboarding friction by
              transforming how engineering teams capture, structure, and share
              their collective wisdom. We believe that every engineer's
              experience and insights should be easily accessible to help others
              learn and grow.
            </Text>
          </Box>

          {/* FAQ Section */}
          <FAQ />

          {/* Contact Us Section */}
          <Box
            bg={cardBg}
            p={12}
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
          >
            <Heading
              as="h2"
              size="xl"
              mb={8}
              textAlign="center"
              color={headingColor}
            >
              Contact Us
            </Heading>
            <Text
              fontSize="lg"
              color={textColor}
              textAlign="center"
              mb={8}
              maxW="2xl"
              mx="auto"
            >
              Have questions or want to learn more about CleverDocs? We'd love
              to hear from you!
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              <VStack spacing={3} align="center">
                <Box
                  p={4}
                  borderRadius="full"
                  bg={useColorModeValue("blue.50", "blue.900")}
                  color={accentColor}
                >
                  <FiMail size={24} />
                </Box>
                <Text fontWeight="semibold" color={headingColor}>
                  Email
                </Text>
                <Link
                  href="mailto:hello@cleverdocs.com"
                  color={accentColor}
                  _hover={{ textDecoration: "underline" }}
                >
                  hello@cleverdocs.com
                </Link>
              </VStack>

              <VStack spacing={3} align="center">
                <Box
                  p={4}
                  borderRadius="full"
                  bg={useColorModeValue("blue.50", "blue.900")}
                  color={accentColor}
                >
                  <FaTwitter size={24} />
                </Box>
                <Text fontWeight="semibold" color={headingColor}>
                  Twitter
                </Text>
                <Link
                  href="https://twitter.com/cleverdocs"
                  color={accentColor}
                  _hover={{ textDecoration: "underline" }}
                  isExternal
                >
                  @cleverdocs
                </Link>
              </VStack>

              <VStack spacing={3} align="center">
                <Box
                  p={4}
                  borderRadius="full"
                  bg={useColorModeValue("blue.50", "blue.900")}
                  color={accentColor}
                >
                  <FiPhone size={24} />
                </Box>
                <Text fontWeight="semibold" color={headingColor}>
                  Phone
                </Text>
                <Link
                  href="tel:+1-555-123-4567"
                  color={accentColor}
                  _hover={{ textDecoration: "underline" }}
                >
                  +1 (555) 123-4567
                </Link>
              </VStack>

              <VStack spacing={3} align="center">
                <Box
                  p={4}
                  borderRadius="full"
                  bg={useColorModeValue("blue.50", "blue.900")}
                  color={accentColor}
                >
                  <FiMapPin size={24} />
                </Box>
                <Text fontWeight="semibold" color={headingColor}>
                  Address
                </Text>
                <Text color={textColor} textAlign="center">
                  123 Innovation Drive
                  <br />
                  San Francisco, CA 94105
                </Text>
              </VStack>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default About;
