import React from "react";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
  Spinner,
  Center,
  useColorModeValue,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FiAward, FiStar, FiTarget } from "react-icons/fi";
import { useUserData } from "@/hooks/useUserData";

interface LeaderboardProps {
  leaderboardType: "contributors" | "learners";
}

const Leaderboard = ({ leaderboardType }: LeaderboardProps) => {
  const { getTopContributors, getTopLearners, loading } = useUserData();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Get leaderboard data based on type
  const leaderboardData =
    leaderboardType === "contributors"
      ? getTopContributors(10)
      : getTopLearners(10);

  const getScoreText = (user: any, index: number) => {
    const count =
      leaderboardType === "contributors"
        ? user.contributions.length
        : user.learned.length;
    const label =
      leaderboardType === "contributors" ? "contributions" : "learned";
    return `${count} ${label}`;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return { icon: FiTarget, color: "yellow.500" };
      case 1:
        return { icon: FiAward, color: "gray.400" };
      case 2:
        return { icon: FiStar, color: "orange.500" };
      default:
        return null;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return { colorScheme: "yellow", label: "1st" };
      case 1:
        return { colorScheme: "gray", label: "2nd" };
      case 2:
        return { colorScheme: "orange", label: "3rd" };
      default:
        return { colorScheme: "blue", label: `${index + 1}th` };
    }
  };

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <Center py={20}>
        <Text color={textColor} fontSize="lg">
          No {leaderboardType} data available.
        </Text>
      </Center>
    );
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
      boxShadow="lg"
    >
      <VStack spacing={0} align="stretch">
        {leaderboardData.map((user, index) => {
          const rankIcon = getRankIcon(index);
          const rankBadge = getRankBadge(index);
          const isTopThree = index < 3;

          return (
            <Box
              key={user.userId}
              p={6}
              borderBottom={index < leaderboardData.length - 1 ? "1px" : "none"}
              borderColor={borderColor}
              transition="all 0.2s ease"
              _hover={{
                bg: hoverBg,
                transform: "translateY(-1px)",
              }}
              bg={
                isTopThree
                  ? useColorModeValue("blue.50", "blue.900")
                  : "transparent"
              }
            >
              <Flex align="center" justify="space-between">
                <HStack spacing={4} flex="1">
                  {/* Rank */}
                  <Flex align="center" justify="center" minW="60px">
                    {rankIcon ? (
                      <Icon
                        as={rankIcon.icon}
                        w={8}
                        h={8}
                        color={rankIcon.color}
                      />
                    ) : (
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color={textColor}
                        minW="30px"
                        textAlign="center"
                      >
                        {index + 1}
                      </Text>
                    )}
                  </Flex>

                  {/* Avatar */}
                  <Avatar
                    src={user.iconImage}
                    name={user.name}
                    size={isTopThree ? "lg" : "md"}
                    border={isTopThree ? "3px solid" : "2px solid"}
                    borderColor={isTopThree ? "blue.300" : "gray.200"}
                  />

                  {/* User Info */}
                  <VStack spacing={1} align="start" flex="1">
                    <HStack spacing={3} align="center">
                      <Text
                        fontSize={isTopThree ? "lg" : "md"}
                        fontWeight={isTopThree ? "bold" : "semibold"}
                        color={headingColor}
                      >
                        {user.name}
                      </Text>
                      <Badge
                        colorScheme={rankBadge.colorScheme}
                        variant={isTopThree ? "solid" : "subtle"}
                        fontSize="xs"
                      >
                        {rankBadge.label}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color={textColor}>
                      {user.team}
                    </Text>
                    <Text fontSize="xs" color={textColor} opacity={0.8}>
                      {user.email}
                    </Text>
                  </VStack>
                </HStack>

                {/* Score */}
                <VStack spacing={1} align="end" minW="120px">
                  <Text
                    fontSize={isTopThree ? "xl" : "lg"}
                    fontWeight="bold"
                    color={useColorModeValue("blue.600", "blue.300")}
                  >
                    {leaderboardType === "contributors"
                      ? user.contributions.length
                      : user.learned.length}
                  </Text>
                  <Text fontSize="xs" color={textColor} textAlign="right">
                    {getScoreText(user, index)}
                  </Text>
                </VStack>
              </Flex>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Leaderboard;
