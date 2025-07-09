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
import { FiUsers, FiBook, FiLayers } from "react-icons/fi";

const ProblemsSolved = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("red.500", "red.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");

  const problems = [
    {
      title: "Onboarding Friction",
      text: "New engineers struggle to find consistent, up-to-date documentation and lose days context-switching among outdated wikis, internal threads, and scattered notes.",
      icon: FiUsers,
    },
    {
      title: "Knowledge Hoarding",
      text: "Senior contributors accumulate years of quick-jot notes but lack an efficient way to structure and publish their insights.",
      icon: FiBook,
    },
    {
      title: "Tutorial Overload",
      text: "Learners bounce among official docs, community tutorials, and repos without a clear path or level of depth.",
      icon: FiLayers,
    },
  ];

  return (
    <Box as="section" py={16} bg={bgColor} id="problems">
      <Container maxW="container.xl">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading as="h2" size="2xl" color={headingColor}>
            Problems We Solve
          </Heading>
          <Text fontSize="lg" maxW="2xl" color={textColor}>
            CleverDocs addresses the core challenges that slow down engineering
            teams and create knowledge silos in organizations.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {problems.map((problem, index) => (
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
                bg={useColorModeValue("red.50", "red.900")}
                color={iconColor}
              >
                <Icon as={problem.icon} w={8} h={8} />
              </Box>
              <Heading size="md" color={headingColor}>
                {problem.title}
              </Heading>
              <Text color={textColor}>{problem.text}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ProblemsSolved;
