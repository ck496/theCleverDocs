import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Badge,
  Divider,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiBook,
  FiUsers,
  FiLayers,
  FiCheckCircle,
  FiTarget,
  FiZap,
  FiSettings,
  FiCloud,
  FiDatabase,
  FiShield,
} from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  const problems = [
    {
      title: "Onboarding Friction",
      description:
        "New engineers struggle to find consistent, up-to-date documentation and lose days context-switching among outdated wikis, internal threads, and scattered notes.",
      icon: FiUsers,
    },
    {
      title: "Knowledge Hoarding",
      description:
        "Senior contributors accumulate years of quick-jot notes but lack an efficient way to structure and publish their insights.",
      icon: FiBook,
    },
    {
      title: "Tutorial Overload",
      description:
        "Learners bounce among official docs, community tutorials, and repos without a clear path or level of depth.",
      icon: FiLayers,
    },
  ];

  const objectives = [
    {
      title: "Rapid Blog Generation",
      description:
        "Transform raw notes into well-structured, accurate, and typo-free tech blogs in under five minutes.",
      icon: FiZap,
    },
    {
      title: "Dynamic Expertise Slider",
      description:
        "Offer on-demand Beginner, Intermediate, and Expert variants of each blog.",
      icon: FiSettings,
    },
    {
      title: "Custom Guide Builder",
      description:
        "Assemble topic-specific blogs into streamlined, use-case–tailored playbooks.",
      icon: FiTarget,
    },
    {
      title: "Community & Curation",
      description:
        "Support Official (admin-curated) and Community sections with ratings, comments, and leaderboards.",
      icon: FiUsers,
    },
  ];

  const keyFeatures = [
    {
      title: "Note → Blog Conversion",
      description:
        "Transform years of cluttered, quickly jotted notes into well-documented, in-depth tech blogs with examples.",
      features: [
        "File upload, text paste, or URL link input",
        "Automated chunking and embedding via AWS Bedrock",
        "Secrets detection and redaction",
        "Grammar and spell checks",
        "Human-in-the-loop review queue",
      ],
    },
    {
      title: "Custom Content for Each Reader's Level",
      description:
        "Every tech blog's content can be dynamically adapted for different levels of expertise.",
      features: [
        "Beginner: High-level explanations, analogies, inline definitions",
        "Intermediate: Clear code examples, configuration details",
        "Expert: Deep dives on optimizations, edge cases, advanced patterns",
      ],
    },
    {
      title: "Custom Guide Builder",
      description:
        "AI combines multiple blogs into easy-to-follow, step-by-step custom guides.",
      features: [
        "Vector and full-text search with Amazon OpenSearch",
        "Metadata-driven source ranking",
        "Wizard UI with tech-stack selections",
        "Conversational chatbot for scope refinement",
      ],
    },
    {
      title: "Community and Official Sections",
      description:
        "Dual-track content management with community contributions and official curation.",
      features: [
        "Community: Open uploads, upvotes, downvotes, comments",
        "Official: Admin-only publishing, audit logs, gated review",
        "Gamified leaderboards with points and badges",
      ],
    },
  ];

  const techStack = [
    {
      category: "Frontend",
      tech: "React, Vite, TypeScript, Chakra UI",
      icon: FiLayers,
    },
    {
      category: "Backend",
      tech: "Python FastAPI, AWS Step Functions",
      icon: FiCloud,
    },
    {
      category: "Storage",
      tech: "S3, DynamoDB, OpenSearch Serverless",
      icon: FiDatabase,
    },
    {
      category: "AI Services",
      tech: "AWS Bedrock, Amazon Comprehend, Macie",
      icon: FiZap,
    },
    {
      category: "Auth & Security",
      tech: "AWS Cognito, IAM roles, VPC endpoints",
      icon: FiShield,
    },
    { category: "CI/CD", tech: "GitHub Actions, Terraform", icon: FiSettings },
  ];

  return (
    <Box bg={bgColor} minH="100vh">
      <Header />

      <Container maxW="container.xl" py={20} mt={16}>
        <VStack spacing={16} align="stretch">
          {/* Hero Section */}
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

          {/* Problem Statement */}
          <Box>
            <Heading
              as="h2"
              size="xl"
              mb={8}
              textAlign="center"
              color={headingColor}
            >
              The Problems We Solve
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {problems.map((problem, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={6}
                  height="100%"
                >
                  <CardBody p={0}>
                    <VStack spacing={4} align="start" height="100%">
                      <Box
                        p={3}
                        borderRadius="md"
                        bg={useColorModeValue("red.50", "red.900")}
                        color={useColorModeValue("red.500", "red.300")}
                      >
                        <Icon as={problem.icon} w={6} h={6} />
                      </Box>
                      <Heading size="md" color={headingColor}>
                        {problem.title}
                      </Heading>
                      <Text color={textColor} flex="1">
                        {problem.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Objectives */}
          <Box>
            <Heading
              as="h2"
              size="xl"
              mb={8}
              textAlign="center"
              color={headingColor}
            >
              Our Objectives
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {objectives.map((objective, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={6}
                >
                  <CardBody p={0}>
                    <HStack spacing={4} align="start">
                      <Box
                        p={3}
                        borderRadius="md"
                        bg={useColorModeValue("blue.50", "blue.900")}
                        color={accentColor}
                        flexShrink={0}
                      >
                        <Icon as={objective.icon} w={6} h={6} />
                      </Box>
                      <VStack spacing={2} align="start" flex="1">
                        <Heading size="md" color={headingColor}>
                          {objective.title}
                        </Heading>
                        <Text color={textColor}>{objective.description}</Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Key Features */}
          <Box>
            <Heading
              as="h2"
              size="xl"
              mb={8}
              textAlign="center"
              color={headingColor}
            >
              Key Features
            </Heading>
            <VStack spacing={8} align="stretch">
              {keyFeatures.map((feature, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={8}
                >
                  <CardBody p={0}>
                    <VStack spacing={6} align="start">
                      <Box>
                        <Heading size="lg" mb={3} color={headingColor}>
                          {feature.title}
                        </Heading>
                        <Text fontSize="lg" color={textColor} mb={4}>
                          {feature.description}
                        </Text>
                      </Box>
                      <List spacing={2}>
                        {feature.features.map((item, itemIndex) => (
                          <ListItem key={itemIndex}>
                            <ListIcon as={FiCheckCircle} color={accentColor} />
                            <Text as="span" color={textColor}>
                              {item}
                            </Text>
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
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
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default About;
