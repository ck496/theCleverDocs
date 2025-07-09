import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Avatar,
  Flex,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBook, FiUsers, FiLayers, FiCheckCircle } from "react-icons/fi";
import Header from "@/components/Header";

// Hero Section Component
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
              Get Started Free
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

// Features Section Component
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

// Testimonials Section Component
const TestimonialsSection = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headingColor = useColorModeValue("gray.800", "white");

  const testimonials = [
    {
      content:
        "CleverDocs transformed our onboarding process. New team members get up to speed in half the time it used to take.",
      name: "Sarah Johnson",
      role: "HR Director",
      company: "TechGrowth Inc.",
      avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      content:
        "The knowledge sharing features have eliminated information silos in our organization. Everyone can find what they need instantly.",
      name: "Michael Chen",
      role: "CTO",
      company: "Innovate Solutions",
      avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      content:
        "We've reduced support tickets by 40% since implementing CleverDocs. Our internal documentation is finally accessible and useful.",
      name: "Priya Patel",
      role: "Support Manager",
      company: "CloudServe",
      avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    },
  ];

  return (
    <Box py={16} bg={bgColor} id="testimonials">
      <Container maxW="container.xl">
        <Heading
          as="h2"
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          mb={10}
          textAlign="center"
          color={headingColor}
        >
          What Our Customers Say
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {testimonials.map((testimonial, index) => (
            <Box
              key={index}
              bg={cardBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
              height="100%"
              display="flex"
              flexDirection="column"
            >
              <Text fontSize="md" mb={4} flex="1" color={textColor}>
                "{testimonial.content}"
              </Text>
              <Flex align="center">
                <Avatar
                  src={testimonial.avatarSrc}
                  name={testimonial.name}
                  size="md"
                  mr={4}
                />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    {testimonial.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {testimonial.role}, {testimonial.company}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// Footer Component
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

// Main HomePage Component
const HomePage = () => {
  return (
    <Box bg={useColorModeValue("white", "gray.900")}>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </Box>
  );
};

export default HomePage;
