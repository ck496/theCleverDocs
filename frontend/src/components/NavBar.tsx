import React from "react";
import { HStack, Link, useColorModeValue } from "@chakra-ui/react";

interface NavBarProps {
  navItems?: Array<{ name: string; href: string }>;
}

const NavBar = ({
  navItems = [
    { name: "Home", href: "/" },
    { name: "Upload", href: "/upload" },
    { name: "Blogs", href: "/blogs" },
    { name: "Leaderboards", href: "/leaderboards" },
    { name: "About", href: "/about" },
  ],
}: NavBarProps) => {
  const textColor = useColorModeValue("gray.700", "gray.200");
  const hoverColor = useColorModeValue("blue.500", "blue.300");

  return (
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
  );
};

export default NavBar;
