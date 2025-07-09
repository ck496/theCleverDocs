import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

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
