import React from "react";
import { HStack, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

interface RatingBadgeProps {
  rating: number;
  totalRatings: number;
  size?: "sm" | "md" | "lg";
}

const RatingBadge = ({
  rating,
  totalRatings,
  size = "sm",
}: RatingBadgeProps) => {
  const textColor = useColorModeValue("gray.600", "gray.400");
  const starColor = "yellow.400";

  const sizeConfig = {
    sm: {
      starSize: 3,
      fontSize: "xs",
      spacing: 1,
    },
    md: {
      starSize: 4,
      fontSize: "sm",
      spacing: 2,
    },
    lg: {
      starSize: 5,
      fontSize: "md",
      spacing: 2,
    },
  };

  const config = sizeConfig[size];

  return (
    <HStack spacing={config.spacing}>
      <Icon
        as={StarIcon}
        w={config.starSize}
        h={config.starSize}
        color={starColor}
      />
      <Text fontSize={config.fontSize} color={textColor} fontWeight="medium">
        {rating.toFixed(1)} ({totalRatings})
      </Text>
    </HStack>
  );
};

export default RatingBadge;
