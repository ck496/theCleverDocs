import React from 'react'
import {
  Box,
  Text,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { Slider } from '@/components/ui/slider'

interface ExpertiseSliderProps {
  value: number; // 0, 50, or 100
  onChange: (value: number) => void;
  className?: string;
}

// Helper functions
const sliderValueToExpertise = (value: number): 'beginner' | 'intermediate' | 'expert' => {
  if (value <= 25) return 'beginner';
  if (value <= 75) return 'intermediate';
  return 'expert';
};

const expertiseToSliderValue = (expertise: 'beginner' | 'intermediate' | 'expert'): number => {
  switch (expertise) {
    case 'beginner': return 0;
    case 'intermediate': return 50;
    case 'expert': return 100;
  }
};

export const ExpertiseSlider: React.FC<ExpertiseSliderProps> = ({ 
  value, 
  onChange, 
  className 
}) => {
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const currentLevel = sliderValueToExpertise(value);

  return (
    <Box className={className} px={2}>
      <HStack justify="space-between" mb={2}>
        <Text 
          fontSize="xs" 
          color={currentLevel === 'beginner' ? 'blue.500' : labelColor}
          fontWeight={currentLevel === 'beginner' ? 'bold' : 'normal'}
        >
          Beginner
        </Text>
        <Text 
          fontSize="xs" 
          color={currentLevel === 'intermediate' ? 'blue.500' : labelColor}
          fontWeight={currentLevel === 'intermediate' ? 'bold' : 'normal'}
        >
          Intermediate
        </Text>
        <Text 
          fontSize="xs" 
          color={currentLevel === 'expert' ? 'blue.500' : labelColor}
          fontWeight={currentLevel === 'expert' ? 'bold' : 'normal'}
        >
          Expert
        </Text>
      </HStack>
      
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={0}
        max={100}
        step={50}
        aria-label="Content expertise level"
        aria-describedby="expertise-description"
      />
      
      <Text 
        id="expertise-description" 
        fontSize="xs" 
        color={labelColor} 
        textAlign="center" 
        mt={1}
      >
        Current: {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
      </Text>
    </Box>
  )
}

export { sliderValueToExpertise, expertiseToSliderValue }