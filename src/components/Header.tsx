import React from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Link,
  Button,
  useColorModeValue,
  IconButton,
  useDisclosure,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const hoverColor = useColorModeValue("blue.500", "blue.300");

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Upload", href: "/upload" },
    { name: "Blogs", href: "/blogs" },
    { name: "Leaderboards", href: "/leaderboards" },
    { name: "About", href: "/about" },
  ];

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Heading
            as="h1"
            size="lg"
            color={useColorModeValue("blue.600", "blue.300")}
            fontWeight="bold"
          >
            CleverDocs
          </Heading>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                color={textColor}
                fontWeight="medium"
                _hover={{
                  color: hoverColor,
                  textDecoration: "none",
                }}
                transition="color 0.2s ease"
              >
                {item.name}
              </Link>
            ))}
          </HStack>

          {/* Desktop CTA Button */}
          <Button
            colorScheme="blue"
            size="md"
            display={{ base: "none", md: "inline-flex" }}
            _hover={{
              transform: "translateY(-1px)",
              boxShadow: "md",
            }}
            transition="all 0.2s ease"
          >
            Sign In
          </Button>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="ghost"
            size="md"
          />
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Heading
              size="md"
              color={useColorModeValue("blue.600", "blue.300")}
            >
              CleverDocs
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  color={textColor}
                  fontWeight="medium"
                  py={2}
                  px={4}
                  borderRadius="md"
                  _hover={{
                    bg: useColorModeValue("gray.100", "gray.700"),
                    color: hoverColor,
                    textDecoration: "none",
                  }}
                  transition="all 0.2s ease"
                  onClick={onClose}
                >
                  {item.name}
                </Link>
              ))}
              <Button colorScheme="blue" size="md" mt={4} onClick={onClose}>
                Sign In
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
