import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  useColorModeValue,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Leaderboard from "@/components/Leaderboard";

const LeaderboardPage = () => {
  const [showLearners, setShowLearners] = useState(false);

  // Dynamic colors based on contributors/learners mode
  const bgColor = useColorModeValue(
    showLearners ? "green.50" : "blue.50",
    showLearners ? "green.900" : "blue.900",
  );
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

  return (
    <Box bg={useColorModeValue("white", "gray.900")} minH="100vh">
      <Header />

      <Container maxW="container.xl" py={20} mt={16}>
        <Box textAlign="center" mb={12}>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            mb={4}
            color={headingColor}
          >
            {showLearners ? "Top Learners" : "Top Contributors"}
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color={textColor}
            maxW="2xl"
            mx="auto"
            mb={8}
          >
            {showLearners
              ? "Celebrating our most dedicated learners who continuously expand their knowledge and skills"
              : "Recognizing our top contributors who share their expertise and help build our knowledge base"}
          </Text>

          {/* Toggle Switch */}
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="center"
            maxW="300px"
            mx="auto"
          >
            <FormLabel
              htmlFor="leaderboard-toggle"
              mb="0"
              mr={4}
              color={textColor}
              fontWeight="medium"
            >
              Contributors
            </FormLabel>
            <Switch
              id="leaderboard-toggle"
              size="lg"
              colorScheme={showLearners ? "green" : "blue"}
              isChecked={showLearners}
              onChange={(e) => setShowLearners(e.target.checked)}
            />
            <FormLabel
              htmlFor="leaderboard-toggle"
              mb="0"
              ml={4}
              color={textColor}
              fontWeight="medium"
            >
              Learners
            </FormLabel>
          </FormControl>
        </Box>

        {/* Leaderboard Component */}
        <Box maxW="4xl" mx="auto">
          <Leaderboard
            leaderboardType={showLearners ? "learners" : "contributors"}
          />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default LeaderboardPage;
