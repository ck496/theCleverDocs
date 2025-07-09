import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Avatar,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

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

export default TestimonialsSection;
