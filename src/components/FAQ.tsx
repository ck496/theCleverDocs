import React from "react";
import {
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
} from "@chakra-ui/react";

const FAQ = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

  const faqs = [
    {
      question: "What is CleverDocs?",
      answer:
        "CleverDocs is an AI-powered onboarding and knowledge-sharing platform that helps engineering teams transform raw notes into polished technical blogs and create custom guides tailored to different expertise levels.",
    },
    {
      question: "How does the AI blog generation work?",
      answer:
        "Simply upload your notes, paste text, or provide a URL. Our AI processes the content, checks for grammar and typos, detects and redacts sensitive information, then generates a well-structured technical blog with proper formatting and examples.",
    },
    {
      question: "What are the different expertise levels?",
      answer:
        "CleverDocs offers three expertise levels: Beginner (high-level explanations with analogies), Intermediate (clear code examples and configurations), and Expert (deep dives into optimizations and advanced patterns).",
    },
    {
      question: "Can I customize the generated content?",
      answer:
        "Yes! All generated blogs go through a human-in-the-loop review process where you can edit, refine, and customize the content before publishing to ensure it meets your standards.",
    },
    {
      question:
        "What's the difference between Community and Official sections?",
      answer:
        "Community sections allow open uploads with community ratings and comments, while Official sections are admin-curated with gated review processes and audit logs for enterprise-grade documentation.",
    },
    {
      question: "How does the Custom Guide Builder work?",
      answer:
        "The Guide Builder uses AI to combine multiple relevant blogs into step-by-step guides. It searches through your knowledge base using vector and full-text search, then creates personalized guides based on your tech stack and requirements.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use AWS security services including Macie for sensitive data detection, VPC endpoints for secure communication, and IAM roles for access control. All data is encrypted in transit and at rest.",
    },
    {
      question: "Can I integrate CleverDocs with my existing tools?",
      answer:
        "Yes, CleverDocs is built with integration in mind. We support various input methods and can be integrated into your existing CI/CD pipelines and documentation workflows.",
    },
  ];

  return (
    <Box>
      <Heading as="h2" size="xl" mb={8} textAlign="center" color={headingColor}>
        Frequently Asked Questions
      </Heading>

      <Accordion allowToggle>
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            mb={4}
            bg={bgColor}
          >
            <AccordionButton
              p={6}
              _hover={{
                bg: useColorModeValue("gray.50", "gray.700"),
              }}
            >
              <Box flex="1" textAlign="left">
                <Heading size="md" color={headingColor} fontWeight="semibold">
                  {faq.question}
                </Heading>
              </Box>
              <AccordionIcon color={headingColor} />
            </AccordionButton>
            <AccordionPanel p={6} pt={0}>
              <Box color={textColor} fontSize="md" lineHeight="1.6">
                {faq.answer}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default FAQ;
